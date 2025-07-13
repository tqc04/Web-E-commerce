package com.example.project.controller;

import com.example.project.entity.Order;
import com.example.project.entity.OrderStatus;
import com.example.project.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Lấy thông tin đơn hàng
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        try {
            Optional<Order> order = orderService.findById(id);
            return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lấy danh sách đơn hàng theo user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Order>> getOrdersByUser(@PathVariable Long userId, Pageable pageable) {
        try {
            Page<Order> orders = orderService.getUserOrders(userId, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo đơn hàng mới
     */
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> orderRequest, HttpServletRequest request) {
        try {
            Long userId = Long.valueOf(orderRequest.get("userId").toString());
            String shippingAddress = (String) orderRequest.get("shippingAddress");
            String billingAddress = (String) orderRequest.get("billingAddress");
            String paymentMethod = (String) orderRequest.get("paymentMethod");
            
            // Get IP address and user agent
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            
            // Parse order items
            List<Map<String, Object>> itemsData = (List<Map<String, Object>>) orderRequest.get("items");
            List<OrderService.OrderItemRequest> items = itemsData.stream()
                .map(item -> new OrderService.OrderItemRequest(
                    Long.valueOf(item.get("productId").toString()),
                    Integer.valueOf(item.get("quantity").toString())
                ))
                .collect(Collectors.toList());
            
            Order createdOrder = orderService.createOrder(userId, items, shippingAddress, billingAddress, paymentMethod, ipAddress, userAgent);
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> statusRequest) {
        try {
            String statusStr = statusRequest.get("status");
            String reason = statusRequest.get("reason");
            OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
            
            orderService.updateOrderStatus(id, status, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Hủy đơn hàng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long id, @RequestBody Map<String, String> cancelRequest) {
        try {
            String reason = cancelRequest.get("reason");
            orderService.cancelOrder(id, reason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy thông tin chi tiết đơn hàng
     */
    @GetMapping("/{id}/insights")
    public ResponseEntity<OrderService.OrderInsights> getOrderInsights(@PathVariable Long id) {
        try {
            OrderService.OrderInsights insights = orderService.getOrderInsights(id);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy đơn hàng theo trạng thái
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Order>> getOrdersByStatus(@PathVariable String status, Pageable pageable) {
        try {
            OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
            Page<Order> orders = orderService.getOrdersByStatus(orderStatus, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy đơn hàng bị flag để review
     */
    @GetMapping("/flagged")
    public ResponseEntity<List<Order>> getFlaggedOrders() {
        try {
            List<Order> flaggedOrders = orderService.getFlaggedOrders();
            return ResponseEntity.ok(flaggedOrders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Helper method to get client IP address
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 