package com.example.project.controller;

import com.example.project.dto.OrderDTO;
import com.example.project.entity.Order;
import com.example.project.entity.OrderStatus;
import com.example.project.entity.OrderStatusHistory;
import com.example.project.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private OrderService orderService;

    /**
     * Get orders requiring approval
     */
    @GetMapping("/orders/pending-approval")
    public ResponseEntity<Page<OrderDTO>> getOrdersForApproval(Pageable pageable) {
        try {
            Page<Order> orders = orderService.getOrdersForApproval(pageable);
            Page<OrderDTO> orderDTOs = orders.map(OrderDTO::from);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get all orders with filtering
     */
    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDTO>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            Pageable pageable) {
        try {
            Page<Order> orders;
            if (status != null) {
                orders = orderService.getOrdersByStatus(status, pageable);
            } else {
                orders = orderService.getAllOrders(pageable);
            }
            Page<OrderDTO> orderDTOs = orders.map(OrderDTO::from);
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Approve order
     */
    @PostMapping("/orders/{orderId}/approve")
    public ResponseEntity<Map<String, String>> approveOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            String adminUser = request.getOrDefault("adminUser", "admin");
            String notes = request.get("notes");
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            orderService.approveOrder(orderId, adminUser, notes, ipAddress, userAgent);
            
            return ResponseEntity.ok(Map.of(
                "status", "success", 
                "message", "Order approved successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error", 
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Reject order
     */
    @PostMapping("/orders/{orderId}/reject")
    public ResponseEntity<Map<String, String>> rejectOrder(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            String adminUser = request.getOrDefault("adminUser", "admin");
            String reason = request.getOrDefault("reason", "Order rejected by admin");
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            orderService.rejectOrder(orderId, adminUser, reason, ipAddress, userAgent);
            
            return ResponseEntity.ok(Map.of(
                "status", "success", 
                "message", "Order rejected successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error", 
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Update order status
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Map<String, String>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            String statusStr = request.get("status");
            String reason = request.get("reason");
            String adminUser = request.getOrDefault("adminUser", "admin");
            String ipAddress = getClientIpAddress(httpRequest);
            String userAgent = httpRequest.getHeader("User-Agent");

            OrderStatus newStatus = OrderStatus.valueOf(statusStr);
            orderService.updateOrderStatus(orderId, newStatus, reason, adminUser, ipAddress, userAgent);
            
            return ResponseEntity.ok(Map.of(
                "status", "success", 
                "message", "Order status updated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error", 
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Get order status history
     */
    @GetMapping("/orders/{orderId}/history")
    public ResponseEntity<List<OrderStatusHistory>> getOrderHistory(@PathVariable Long orderId) {
        try {
            List<OrderStatusHistory> history = orderService.getOrderHistory(orderId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get flagged orders for review
     */
    @GetMapping("/orders/flagged")
    public ResponseEntity<List<OrderDTO>> getFlaggedOrders() {
        try {
            List<Order> flaggedOrders = orderService.getFlaggedOrders();
            List<OrderDTO> orderDTOs = flaggedOrders.stream()
                    .map(OrderDTO::from)
                    .toList();
            return ResponseEntity.ok(orderDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = Map.of(
                "pendingApproval", orderService.countOrdersByStatus(OrderStatus.PENDING_APPROVAL),
                "flaggedOrders", orderService.countFlaggedOrders(),
                "totalOrders", orderService.countAllOrders(),
                "completedOrders", orderService.countOrdersByStatus(OrderStatus.COMPLETED),
                "cancelledOrders", orderService.countOrdersByStatus(OrderStatus.CANCELLED)
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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