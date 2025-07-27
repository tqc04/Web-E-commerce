package com.example.project.service;

import com.example.project.entity.*;

import com.example.project.repository.OrderRepository;
import com.example.project.repository.OrderStatusHistoryRepository;
import com.example.project.repository.UserRepository;
import com.example.project.repository.ProductRepository;
import com.example.project.repository.InventoryItemRepository;
import com.example.project.entity.InventoryItem;
import com.example.project.entity.Warehouse;
import com.example.project.repository.WarehouseRepository;
import com.example.project.service.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderStatusHistoryRepository statusHistoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;
    
    @Autowired
    private InventoryItemRepository inventoryItemRepository;
    
    @Autowired
    private WarehouseRepository warehouseRepository;
    
    @Autowired
    private ShippingService shippingService;
    
    @Autowired
    private AIService aiService;
    
    /**
     * Create new order with inventory reservation
     */
    @Transactional
    public Order createOrder(Long userId, List<OrderItemRequest> items, String shippingAddress, 
                        String billingAddress, String paymentMethod, BigDecimal shippingFee, 
                        String note, String ipAddress, String userAgent) {
        
        // Generate order number
        String orderNumber = generateOrderNumber();
        
        // Validate and reserve inventory for all items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        for (OrderItemRequest itemRequest : items) {
            // Check if product exists and is active
            Optional<Product> productOpt = productRepository.findById(itemRequest.productId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Product not found: " + itemRequest.productId());
            }
            
            Product product = productOpt.get();
            if (!product.getIsActive()) {
                throw new RuntimeException("Product is not active: " + itemRequest.productId());
            }
            
            // Reserve inventory
            boolean reserved = inventoryService.reserveInventory(
                itemRequest.productId(), 
                itemRequest.quantity(), 
                orderNumber
            );
            
            if (!reserved) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            // Calculate item total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity()));
            totalAmount = totalAmount.add(itemTotal);
            
            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.quantity());
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);
        }
        
        // Add shipping fee
        totalAmount = totalAmount.add(shippingFee);
        
        // Get user
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        User user = userOpt.get();
        
        // Create order
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setShippingAmount(shippingFee);
        order.setNotes(note);
        
        // Set order reference in items
        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Create initial status history
        OrderStatusHistory statusHistory = new OrderStatusHistory(
            savedOrder, 
            OrderStatus.PENDING, 
            OrderStatus.PENDING, 
            "system"
        );
        statusHistory.setNotes("Order created");
        statusHistoryRepository.save(statusHistory);
        
        // Perform basic fraud analysis (simplified)
        if (savedOrder.getTotalAmount().compareTo(BigDecimal.valueOf(1000000)) > 0) {
            flagOrderForReview(savedOrder, "High value order");
        }
        
        return savedOrder;
    }
    
    /**
     * Admin approve order
     */
    public void approveOrder(Long orderId, String adminUser, String notes, String ipAddress, String userAgent) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Order cannot be approved in current status: " + order.getStatus());
        }
        
        updateOrderStatus(orderId, OrderStatus.APPROVED, notes != null ? notes : "Order approved by admin", adminUser, ipAddress, userAgent);
        
        // Auto-progress to CONFIRMED after approval
        updateOrderStatus(orderId, OrderStatus.CONFIRMED, "Payment confirmed", "System", ipAddress, userAgent);
    }
    
    /**
     * Reject order
     */
    public void rejectOrder(Long orderId, String adminUser, String reason, String ipAddress, String userAgent) {
        updateOrderStatus(orderId, OrderStatus.CANCELLED, reason, adminUser, ipAddress, userAgent);
    }
    
    /**
     * Update order status with proper tracking
     */
    public void updateOrderStatus(Long orderId, OrderStatus newStatus, String reason, String changedBy, String ipAddress, String userAgent) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOpt.get();
        OrderStatus oldStatus = order.getStatus();
        
        if (oldStatus == newStatus) {
            return; // No change needed
        }
        
        // Validate status transitions
        if (!isValidStatusTransition(oldStatus, newStatus)) {
            throw new IllegalStateException("Invalid status transition from " + oldStatus + " to " + newStatus);
        }
        
        order.setStatus(newStatus);
        
        // Set specific timestamps for certain statuses
        LocalDateTime now = LocalDateTime.now();
        switch (newStatus) {
            case CANCELLED:
                order.setCancelledDate(now);
                if (reason != null) {
                    order.setCancellationReason(reason);
                }
                break;
            case DELIVERED:
                order.setDeliveredDate(now);
                break;
            case SHIPPED:
                // Could set shipped date here if we had that field
                break;
        }
        
        orderRepository.save(order);
        
        // Create status history
        createStatusHistory(order, oldStatus, newStatus, changedBy, reason, ipAddress, userAgent, false);
        
        // Send notifications (could be implemented)
        // notificationService.sendOrderStatusUpdate(order, oldStatus, newStatus);
    }
    
    /**
     * Create status history record
     */
    private void createStatusHistory(Order order, OrderStatus fromStatus, OrderStatus toStatus, 
                                   String changedBy, String notes, String ipAddress, String userAgent, boolean systemGenerated) {
        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setChangedBy(changedBy);
        history.setNotes(notes);
        history.setIpAddress(ipAddress);
        history.setUserAgent(userAgent);
        history.setSystemGenerated(systemGenerated);
        
        statusHistoryRepository.save(history);
    }
    
    /**
     * Validate status transitions
     */
    private boolean isValidStatusTransition(OrderStatus from, OrderStatus to) {
        // Define valid transitions
        Map<OrderStatus, Set<OrderStatus>> validTransitions = Map.of(
            OrderStatus.PENDING, Set.of(OrderStatus.PENDING_APPROVAL, OrderStatus.CANCELLED),
            OrderStatus.PENDING_APPROVAL, Set.of(OrderStatus.APPROVED, OrderStatus.CANCELLED),
            OrderStatus.APPROVED, Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED),
            OrderStatus.PROCESSING, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
            OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED),
            OrderStatus.DELIVERED, Set.of(OrderStatus.COMPLETED),
            OrderStatus.COMPLETED, Set.of(OrderStatus.REFUNDED),
            OrderStatus.CANCELLED, Set.of(), // No transitions from cancelled
            OrderStatus.REFUNDED, Set.of()   // No transitions from refunded
        );
        
        return validTransitions.getOrDefault(from, Set.of()).contains(to);
    }
    
    /**
     * Cancel order and release inventory
     */
    @Transactional
    public void cancelOrder(Long orderId, String reason, String cancelledBy, String ipAddress, String userAgent) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Check if order can be cancelled
        if (!canCancelOrder(order)) {
            throw new RuntimeException("Order cannot be cancelled in current status: " + order.getStatus());
        }
        
        // Release reserved inventory
        for (OrderItem item : order.getOrderItems()) {
            inventoryService.releaseInventory(
                item.getProduct().getId(),
                item.getQuantity(),
                order.getOrderNumber()
            );
        }
        
        // Update order status
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        // Create status history (simplified)
        OrderStatusHistory statusHistory = new OrderStatusHistory(
            order, 
            order.getStatus(), 
            OrderStatus.CANCELLED, 
            cancelledBy
        );
        statusHistory.setNotes("Order cancelled: " + reason);
        statusHistory.setIpAddress(ipAddress);
        statusHistory.setUserAgent(userAgent);
        orderStatusHistoryRepository.save(statusHistory);
    }
    
    /**
     * Confirm order and finalize inventory
     */
    @Transactional
    public void confirmOrder(Long orderId, String confirmedBy) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Confirm inventory reservation
        for (OrderItem item : order.getOrderItems()) {
            inventoryService.confirmInventoryReservation(
                item.getProduct().getId(),
                item.getQuantity(),
                order.getOrderNumber()
            );
        }
        
        // Update order status
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        
        // Create status history (simplified)
        OrderStatusHistory statusHistory = new OrderStatusHistory(
            order, 
            order.getStatus(), 
            OrderStatus.CONFIRMED, 
            confirmedBy
        );
        statusHistory.setNotes("Order confirmed");
        orderStatusHistoryRepository.save(statusHistory);
    }
    
    /**
     * Check if order can be cancelled
     */
    public boolean canCancelOrder(Order order) {
        return order.getStatus() == OrderStatus.PENDING || 
               order.getStatus() == OrderStatus.PENDING_APPROVAL ||
               order.getStatus() == OrderStatus.APPROVED ||
               order.getStatus() == OrderStatus.CONFIRMED ||
               order.getStatus() == OrderStatus.PROCESSING;
    }
    
    /**
     * Get orders requiring admin approval
     */
    public Page<Order> getOrdersForApproval(Pageable pageable) {
        return orderRepository.findByStatus(OrderStatus.PENDING_APPROVAL, pageable);
    }
    
    /**
     * Get order status history
     */
    public List<OrderStatusHistory> getOrderHistory(Long orderId) {
        return statusHistoryRepository.findByOrderIdOrderByCreatedAtDesc(orderId);
    }
    
    /**
     * AI-powered fraud detection analysis
     */
    private FraudAnalysis analyzeOrderForFraud(Order order, User user, String ipAddress, String userAgent) {
        try {
            // Collect order data for analysis
            String orderData = buildOrderAnalysisData(order, user, ipAddress, userAgent);
            
            String prompt = "Analyze this e-commerce order for potential fraud indicators:\n\n" +
                orderData + "\n\n" +
                "Consider these fraud indicators:\n" +
                "- Order value vs user history\n" +
                "- Shipping/billing address mismatch\n" +
                "- Unusual purchase patterns\n" +
                "- High-value orders from new users\n" +
                "- Multiple high-value items\n" +
                "- Suspicious timing patterns\n\n" +
                "Provide analysis in JSON format:\n" +
                "{\n" +
                "  \"fraudScore\": 0.0-1.0,\n" +
                "  \"riskLevel\": \"LOW/MEDIUM/HIGH/CRITICAL\",\n" +
                "  \"indicators\": [\"indicator1\", \"indicator2\"],\n" +
                "  \"analysis\": \"Brief explanation\",\n" +
                "  \"recommendation\": \"APPROVE/REVIEW/DECLINE\"\n" +
                "}";
            
            Map<String, Object> variables = Map.of("orderData", orderData);
            String response = aiService.generateText(prompt, variables);
            
            // Parse AI response (simplified - in real app would use proper JSON parsing)
            return parseFraudAnalysis(response, order);
            
        } catch (Exception e) {
            logger.error("AI fraud detection failed: " + e.getMessage());
            
            // Fallback to rule-based analysis
            return performRuleBasedFraudAnalysis(order, user);
        }
    }
    
    /**
     * Build order data string for AI analysis
     */
    private String buildOrderAnalysisData(Order order, User user, String ipAddress, String userAgent) {
        StringBuilder data = new StringBuilder();
        
        data.append("Order Details:\n");
        data.append("- Order Value: $").append(order.getTotalAmount()).append("\n");
        data.append("- Items Count: ").append(order.getOrderItems().size()).append("\n");
        data.append("- Payment Method: ").append(order.getPaymentMethod()).append("\n");
        
        data.append("\nUser Profile:\n");
        data.append("- User ID: ").append(user.getId()).append("\n");
        data.append("- Account Age: ").append(user.getCreatedAt()).append("\n");
        data.append("- Previous Orders: ").append("N/A").append("\n"); // Avoid lazy loading
        data.append("- Email Verified: ").append(user.isEmailVerified()).append("\n");
        
        data.append("\nAddress Information:\n");
        data.append("- Shipping Address: ").append(order.getShippingAddress()).append("\n");
        data.append("- Billing Address: ").append(order.getBillingAddress()).append("\n");
        data.append("- Address Match: ").append(order.getShippingAddress().equals(order.getBillingAddress())).append("\n");
        
        data.append("\nTechnical Details:\n");
        data.append("- IP Address: ").append(ipAddress).append("\n");
        data.append("- User Agent: ").append(userAgent).append("\n");
        
        data.append("\nOrder Items:\n");
        for (OrderItem item : order.getOrderItems()) {
            data.append("- ").append(item.getProduct().getName())
                .append(" (").append(item.getQuantity()).append("x $").append(item.getPrice()).append(")\n");
        }
        
        return data.toString();
    }
    
    /**
     * Parse AI fraud analysis response
     */
    private FraudAnalysis parseFraudAnalysis(String response, Order order) {
        // TODO: Implement proper JSON parsing
        // For now, return a default analysis
        
        double fraudScore = 0.3; // Default low risk
        RiskLevel riskLevel = RiskLevel.LOW;
        boolean flaggedForReview = false;
        
        // Simple rule-based fallback
        if (order.getTotalAmount().compareTo(BigDecimal.valueOf(1000)) > 0) {
            fraudScore = 0.6;
            riskLevel = RiskLevel.MEDIUM;
        }
        
        if (order.getTotalAmount().compareTo(BigDecimal.valueOf(5000)) > 0) {
            fraudScore = 0.8;
            riskLevel = RiskLevel.HIGH;
            flaggedForReview = true;
        }
        
        return new FraudAnalysis(
                fraudScore,
                riskLevel,
                "AI analysis: Order value and user profile assessed",
                flaggedForReview,
                List.of("order_value", "user_profile")
        );
    }
    
    /**
     * Rule-based fraud analysis fallback
     */
    private FraudAnalysis performRuleBasedFraudAnalysis(Order order, User user) {
        double fraudScore = 0.0;
        List<String> indicators = new ArrayList<>();
        
        // Check order value
        if (order.getTotalAmount().compareTo(BigDecimal.valueOf(1000)) > 0) {
            fraudScore += 0.3;
            indicators.add("high_order_value");
        }
        
        // Check new user with expensive order (simplified check)
        if (order.getTotalAmount().compareTo(BigDecimal.valueOf(500)) > 0) {
            fraudScore += 0.2;
            indicators.add("expensive_order");
        }
        
        // Check address mismatch
        if (!order.getShippingAddress().equals(order.getBillingAddress())) {
            fraudScore += 0.2;
            indicators.add("address_mismatch");
        }
        
        // Check unverified email
        if (!user.isEmailVerified()) {
            fraudScore += 0.1;
            indicators.add("unverified_email");
        }
        
        // Determine risk level
        RiskLevel riskLevel = RiskLevel.LOW;
        if (fraudScore >= 0.7) {
            riskLevel = RiskLevel.HIGH;
        } else if (fraudScore >= 0.4) {
            riskLevel = RiskLevel.MEDIUM;
        }
        
        boolean flaggedForReview = fraudScore >= 0.6;
        
        return new FraudAnalysis(
                Math.min(fraudScore, 1.0),
                riskLevel,
                "Rule-based analysis: " + indicators.size() + " risk indicators detected",
                flaggedForReview,
                indicators
        );
    }
    
    /**
     * Update order status with AI insights
     */
    public OrderInsights getOrderInsights(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        try {
            String orderAnalysis = buildOrderAnalysisData(order, order.getUser(), "", "");
            
            String prompt = "Analyze this order and provide business insights:\n\n" +
                orderAnalysis + "\n\n" +
                "Provide insights about:\n" +
                "1. Customer behavior patterns\n" +
                "2. Product preferences\n" +
                "3. Potential upselling opportunities\n" +
                "4. Risk assessment\n\n" +
                "Return structured analysis.";
            
            Map<String, Object> variables = Map.of("orderAnalysis", orderAnalysis);
            String response = aiService.generateText(prompt, variables);
            
            return new OrderInsights(
                    order.getId(),
                    "Customer shows preference for products",
                    List.of("Consider similar products", "Bundle recommendations available"),
                    order.getRiskLevel().toString(),
                    response
            );
            
        } catch (Exception e) {
            return new OrderInsights(
                    order.getId(),
                    "Standard order",
                    List.of("No specific insights available"),
                    "UNKNOWN",
                    "Analysis failed"
            );
        }
    }
    
    /**
     * Flag order for manual review
     */
    private void flagOrderForReview(Order order, String reason) {
        order.setFlaggedForReview(true);
        order.setNotes("FLAGGED FOR REVIEW: " + reason);
        orderRepository.save(order);
        
        // TODO: Send notification to admin/review team
        logger.info("Order " + order.getOrderNumber() + " flagged for review: " + reason);
    }
    
    /**
     * Generate order number
     */
    private String generateOrderNumber() {
        return "ORD-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }
    
    /**
     * Get order by ID
     */
    public Optional<Order> findById(Long orderId) {
        return orderRepository.findById(orderId);
    }
    
    /**
     * Get user orders
     */
    public Page<Order> getUserOrders(Long userId, Pageable pageable) {
        return orderRepository.findByUserId(userId, pageable);
    }
    
    /**
     * Get orders by status
     */
    public Page<Order> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }
    
    /**
     * Get flagged orders for review
     */
    public List<Order> getFlaggedOrders() {
        return orderRepository.findByIsFlaggedForReviewTrue();
    }
    
    /**
     * Get all orders with pagination
     */
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    
    /**
     * Count orders by status
     */
    public long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }
    
    /**
     * Count flagged orders
     */
    public long countFlaggedOrders() {
        return orderRepository.countFlaggedOrders();
    }
    
    /**
     * Count all orders
     */
    public long countAllOrders() {
        return orderRepository.count();
    }
    
    // Inner classes
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        
        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
        
        public Long productId() { return productId; }
        public Integer quantity() { return quantity; }
    }
    
    public static class FraudAnalysis {
        private final double fraudScore;
        private final RiskLevel riskLevel;
        private final String analysis;
        private final boolean flaggedForReview;
        private final List<String> indicators;
        
        public FraudAnalysis(double fraudScore, RiskLevel riskLevel, String analysis, 
                           boolean flaggedForReview, List<String> indicators) {
            this.fraudScore = fraudScore;
            this.riskLevel = riskLevel;
            this.analysis = analysis;
            this.flaggedForReview = flaggedForReview;
            this.indicators = indicators;
        }
        
        public double getFraudScore() { return fraudScore; }
        public RiskLevel getRiskLevel() { return riskLevel; }
        public String getAnalysis() { return analysis; }
        public boolean isFlaggedForReview() { return flaggedForReview; }
        public List<String> getIndicators() { return indicators; }
    }
    
    public static class OrderInsights {
        private final Long orderId;
        private final String behaviorPattern;
        private final List<String> recommendations;
        private final String riskAssessment;
        private final String fullAnalysis;
        
        public OrderInsights(Long orderId, String behaviorPattern, List<String> recommendations, 
                           String riskAssessment, String fullAnalysis) {
            this.orderId = orderId;
            this.behaviorPattern = behaviorPattern;
            this.recommendations = recommendations;
            this.riskAssessment = riskAssessment;
            this.fullAnalysis = fullAnalysis;
        }
        
        public Long getOrderId() { return orderId; }
        public String getBehaviorPattern() { return behaviorPattern; }
        public List<String> getRecommendations() { return recommendations; }
        public String getRiskAssessment() { return riskAssessment; }
        public String getFullAnalysis() { return fullAnalysis; }
    }
    
    public static class OrderNotFoundException extends RuntimeException {
        public OrderNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException(String message) {
            super(message);
        }
    }
} 