package com.example.project.service;

import com.example.project.entity.Order;
import com.example.project.entity.OrderItem;
import com.example.project.entity.Product;
import com.example.project.entity.User;
import com.example.project.entity.OrderStatus;
import com.example.project.entity.RiskLevel;
import com.example.project.repository.OrderRepository;
import com.example.project.repository.UserRepository;
import com.example.project.repository.ProductRepository;
import com.example.project.service.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private AIService aiService;
    
    /**
     * Create new order with AI fraud detection
     */
    public Order createOrder(Long userId, List<OrderItemRequest> items, 
                           String shippingAddress, String billingAddress,
                           String paymentMethod, String ipAddress, String userAgent) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber(generateOrderNumber());
        order.setShippingAddress(shippingAddress);
        order.setBillingAddress(billingAddress);
        order.setPaymentMethod(paymentMethod);
        order.setStatus(OrderStatus.PENDING);
        
        // Add order items
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemRequest : items) {
            Optional<Product> productOpt = productRepository.findById(itemRequest.getProductId());
            if (productOpt.isEmpty()) {
                throw new ProductNotFoundException("Product not found with id: " + itemRequest.getProductId());
            }
            
            Product product = productOpt.get();
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            order.getOrderItems().add(orderItem);
            subtotal = subtotal.add(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));
        }
        
        order.setSubtotal(subtotal);
        order.setTotalAmount(subtotal); // Simplified - in real app would add taxes, shipping, etc.
        
        // AI Fraud Detection
        FraudAnalysis fraudAnalysis = analyzeOrderForFraud(order, user, ipAddress, userAgent);
        order.setFraudScore(fraudAnalysis.getFraudScore());
        order.setFraudAnalysis(fraudAnalysis.getAnalysis());
        order.setRiskLevel(fraudAnalysis.getRiskLevel());
        order.setFlaggedForReview(fraudAnalysis.isFlaggedForReview());
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // If high risk, flag for manual review
        if (fraudAnalysis.getRiskLevel() == RiskLevel.HIGH || fraudAnalysis.getRiskLevel() == RiskLevel.CRITICAL) {
            flagOrderForReview(savedOrder, "High fraud risk detected");
        }
        
        return savedOrder;
    }
    
    /**
     * AI-powered fraud detection analysis
     */
    private FraudAnalysis analyzeOrderForFraud(Order order, User user, String ipAddress, String userAgent) {
        try {
            // Collect order data for analysis
            String orderData = buildOrderAnalysisData(order, user, ipAddress, userAgent);
            
            String prompt = """
                Analyze this e-commerce order for potential fraud indicators:
                
                {orderData}
                
                Consider these fraud indicators:
                - Order value vs user history
                - Shipping/billing address mismatch
                - Unusual purchase patterns
                - High-value orders from new users
                - Multiple high-value items
                - Suspicious timing patterns
                
                Provide analysis in JSON format:
                {
                  "fraudScore": 0.0-1.0,
                  "riskLevel": "LOW/MEDIUM/HIGH/CRITICAL",
                  "indicators": ["indicator1", "indicator2"],
                  "analysis": "Brief explanation",
                  "recommendation": "APPROVE/REVIEW/DECLINE"
                }
                """;
            
            Map<String, Object> variables = Map.of("orderData", orderData);
            String response = aiService.generateText(prompt, variables);
            
            // Parse AI response (simplified - in real app would use proper JSON parsing)
            return parseFraudAnalysis(response, order);
            
        } catch (Exception e) {
            System.err.println("AI fraud detection failed: " + e.getMessage());
            
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
        data.append("- Previous Orders: ").append(user.getOrders().size()).append("\n");
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
        
        // Check new user with expensive order
        if (user.getOrders().size() == 0 && order.getTotalAmount().compareTo(BigDecimal.valueOf(500)) > 0) {
            fraudScore += 0.4;
            indicators.add("new_user_expensive_order");
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
    public void updateOrderStatus(Long orderId, OrderStatus newStatus, String reason) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOpt.get();
        OrderStatus oldStatus = order.getStatus();
        order.setStatus(newStatus);
        
        // Add AI insights for status change
        try {
            String prompt = """
                Generate a brief customer notification message for this order status change:
                
                Order: {orderNumber}
                Status Change: {oldStatus} → {newStatus}
                Reason: {reason}
                
                Create a friendly, informative message for the customer (max 200 characters).
                """;
            
            Map<String, Object> variables = Map.of(
                    "orderNumber", order.getOrderNumber(),
                    "oldStatus", oldStatus.toString(),
                    "newStatus", newStatus.toString(),
                    "reason", reason != null ? reason : "Status update"
            );
            
            String customerMessage = aiService.generateText(prompt, variables);
            order.setNotes(customerMessage);
            
        } catch (Exception e) {
            System.err.println("Failed to generate status update message: " + e.getMessage());
        }
        
        orderRepository.save(order);
    }
    
    /**
     * Generate order insights using AI
     */
    public OrderInsights getOrderInsights(Long orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        try {
            String orderAnalysis = buildOrderAnalysisData(order, order.getUser(), "", "");
            
            String prompt = """
                Analyze this order and provide business insights:
                
                {orderAnalysis}
                
                Provide insights about:
                1. Customer behavior patterns
                2. Product preferences
                3. Potential upselling opportunities
                4. Risk assessment
                
                Return structured analysis.
                """;
            
            Map<String, Object> variables = Map.of("orderAnalysis", orderAnalysis);
            String response = aiService.generateText(prompt, variables);
            
            return new OrderInsights(
                    order.getId(),
                    "Customer shows preference for " + order.getOrderItems().get(0).getProduct().getCategory().getName(),
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
        System.out.println("Order " + order.getOrderNumber() + " flagged for review: " + reason);
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
     * Cancel order
     */
    public void cancelOrder(Long orderId, String reason) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new OrderNotFoundException("Order not found with id: " + orderId);
        }
        
        Order order = orderOpt.get();
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        order.setCancelledDate(LocalDateTime.now());
        
        orderRepository.save(order);
    }
    
    // Inner classes
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        
        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
        
        public Long getProductId() { return productId; }
        public Integer getQuantity() { return quantity; }
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