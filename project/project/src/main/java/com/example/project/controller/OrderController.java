package com.example.project.controller;

import com.example.project.dto.OrderDTO;
import com.example.project.entity.Order;
import com.example.project.entity.OrderStatus;
import com.example.project.entity.OrderStatusHistory;
import com.example.project.service.OrderService;
import com.example.project.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private CartService cartService;

    /**
     * Get all orders (with pagination)
     */
    @GetMapping
    public ResponseEntity<Page<OrderDTO>> getAllOrders(Pageable pageable) {
        try {
            Page<Order> orders = orderService.getAllOrders(pageable);
            Page<OrderDTO> orderDTOs = orders.map(OrderDTO::from);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get order by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        try {
            Optional<Order> orderOpt = orderService.findById(id);
            if (orderOpt.isPresent()) {
                OrderDTO orderDTO = OrderDTO.from(orderOpt.get());
                return ResponseEntity.ok(orderDTO);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get user orders
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderDTO>> getOrdersByUser(@PathVariable Long userId, Pageable pageable) {
        try {
            Page<Order> orders = orderService.getUserOrders(userId, pageable);
            Page<OrderDTO> orderDTOs = orders.map(OrderDTO::from);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Create new order
     */
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody Map<String, Object> orderRequest, HttpServletRequest request) {
        try {
            Long userId = Long.valueOf(orderRequest.get("userId").toString());
            String shippingAddress = (String) orderRequest.get("shippingAddress");
            String billingAddress = (String) orderRequest.get("billingAddress");
            String paymentMethod = (String) orderRequest.get("paymentMethod");
            String note = (String) orderRequest.get("note");
            BigDecimal shippingFee = orderRequest.get("shippingFee") != null
                ? new BigDecimal(orderRequest.get("shippingFee").toString())
                : BigDecimal.ZERO;

            // Get IP address and user agent
            String ipAddress = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");

            // Parse order items
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderRequest.get("items");
            List<OrderService.OrderItemRequest> items = itemsData.stream()
                .map(item -> new OrderService.OrderItemRequest(
                    Long.valueOf(item.get("productId").toString()),
                    Integer.valueOf(item.get("quantity").toString())
                ))
                .collect(Collectors.toList());

            // Gọi service, truyền shippingFee và note
            Order createdOrder = orderService.createOrder(userId, items, shippingAddress, billingAddress, paymentMethod, shippingFee, note, ipAddress, userAgent);
            OrderDTO orderDTO = OrderDTO.from(createdOrder);

            // Clear cart after successful order
            cartService.clearCartAfterOrder(userId, request.getSession());

            return ResponseEntity.ok(orderDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cancel order
     */
    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, String>> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> cancelRequest,
            HttpServletRequest request) {
        try {
            String reason = cancelRequest.getOrDefault("reason", "Customer cancellation");
            String cancelledBy = cancelRequest.getOrDefault("cancelledBy", "customer");
            String ipAddress = request.getRemoteAddr();
            String userAgent = request.getHeader("User-Agent");

            orderService.cancelOrder(orderId, reason, cancelledBy, ipAddress, userAgent);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Order cancelled successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Check if order can be cancelled
     */
    @GetMapping("/{orderId}/can-cancel")
    public ResponseEntity<Map<String, Boolean>> canCancelOrder(@PathVariable Long orderId) {
        try {
            Optional<Order> orderOpt = orderService.findById(orderId);
            if (orderOpt.isPresent()) {
                boolean canCancel = orderService.canCancelOrder(orderOpt.get());
                return ResponseEntity.ok(Map.of("canCancel", canCancel));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("canCancel", false));
        }
    }

    /**
     * Get order status history
     */
    @GetMapping("/{orderId}/history")
    public ResponseEntity<List<OrderStatusHistory>> getOrderHistory(@PathVariable Long orderId) {
        try {
            List<OrderStatusHistory> history = orderService.getOrderHistory(orderId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get orders by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<OrderDTO>> getOrdersByStatus(@PathVariable OrderStatus status, Pageable pageable) {
        try {
            Page<Order> orders = orderService.getOrdersByStatus(status, pageable);
            Page<OrderDTO> orderDTOs = orders.map(OrderDTO::from);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get order status info
     */
    @GetMapping("/status-info")
    public ResponseEntity<Map<String, Object>> getOrderStatusInfo() {
        Map<String, Object> statusInfo = Map.of(
            "statuses", OrderStatus.values(),
            "descriptions", Map.of(
                "PENDING", "Order just created, waiting for processing",
                "PENDING_APPROVAL", "Waiting for admin approval",
                "APPROVED", "Approved by admin",
                "CONFIRMED", "Payment confirmed",
                "PROCESSING", "Order being processed/packed",
                "SHIPPED", "Order shipped to customer",
                "DELIVERED", "Order delivered successfully",
                "COMPLETED", "Order completed by customer confirmation",
                "CANCELLED", "Order cancelled",
                "REFUNDED", "Order refunded"
            )
        );
        return ResponseEntity.ok(statusInfo);
    }

    /**
     * Get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            return xForwardedForHeader.split(",")[0];
        }
    }
} 