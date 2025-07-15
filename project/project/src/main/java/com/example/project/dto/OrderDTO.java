package com.example.project.dto;

import com.example.project.entity.Order;
import com.example.project.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDTO {
    private Long id;
    private String orderNumber;
    private OrderStatus status;
    private BigDecimal totalAmount;
    private BigDecimal shippingAmount; // Changed from shippingFee
    private BigDecimal discountAmount;
    private String shippingAddress;
    private String billingAddress;
    private String notes; // Changed from customerNotes
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredDate; // Changed from deliveredAt
    private Long userId;
    private String userFullName;
    private List<OrderItemDTO> orderItems;

    // Static factory method to convert from Order entity
    public static OrderDTO from(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.getId();
        dto.orderNumber = order.getOrderNumber();
        dto.status = order.getStatus();
        dto.totalAmount = order.getTotalAmount();
        dto.shippingAmount = order.getShippingAmount(); // Correct field name
        dto.discountAmount = order.getDiscountAmount();
        dto.shippingAddress = order.getShippingAddress();
        dto.billingAddress = order.getBillingAddress();
        dto.notes = order.getNotes(); // Correct field name
        dto.createdAt = order.getCreatedAt();
        dto.updatedAt = order.getUpdatedAt();
        dto.deliveredDate = order.getDeliveredDate(); // Correct field name

        // Safely access lazy-loaded relationships
        try {
            if (order.getUser() != null) {
                dto.userId = order.getUser().getId();
                dto.userFullName = order.getUser().getFirstName() + " " + order.getUser().getLastName();
            }
        } catch (Exception e) {
            dto.userId = null;
            dto.userFullName = "Unknown User";
        }

        try {
            if (order.getOrderItems() != null) {
                dto.orderItems = order.getOrderItems().stream()
                        .map(OrderItemDTO::from)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            dto.orderItems = List.of();
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getOrderNumber() { 
        return orderNumber; 
    }
    
    public void setOrderNumber(String orderNumber) { 
        this.orderNumber = orderNumber; 
    }

    public OrderStatus getStatus() { 
        return status; 
    }
    
    public void setStatus(OrderStatus status) { 
        this.status = status; 
    }

    public BigDecimal getTotalAmount() { 
        return totalAmount; 
    }
    
    public void setTotalAmount(BigDecimal totalAmount) { 
        this.totalAmount = totalAmount; 
    }

    public BigDecimal getShippingAmount() { 
        return shippingAmount; 
    }
    
    public void setShippingAmount(BigDecimal shippingAmount) { 
        this.shippingAmount = shippingAmount; 
    }

    public BigDecimal getDiscountAmount() { 
        return discountAmount; 
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) { 
        this.discountAmount = discountAmount; 
    }

    public String getShippingAddress() { 
        return shippingAddress; 
    }
    
    public void setShippingAddress(String shippingAddress) { 
        this.shippingAddress = shippingAddress; 
    }

    public String getBillingAddress() { 
        return billingAddress; 
    }
    
    public void setBillingAddress(String billingAddress) { 
        this.billingAddress = billingAddress; 
    }

    public String getNotes() { 
        return notes; 
    }
    
    public void setNotes(String notes) { 
        this.notes = notes; 
    }

    public LocalDateTime getCreatedAt() { 
        return createdAt; 
    }
    
    public void setCreatedAt(LocalDateTime createdAt) { 
        this.createdAt = createdAt; 
    }

    public LocalDateTime getUpdatedAt() { 
        return updatedAt; 
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) { 
        this.updatedAt = updatedAt; 
    }

    public LocalDateTime getDeliveredDate() { 
        return deliveredDate; 
    }
    
    public void setDeliveredDate(LocalDateTime deliveredDate) { 
        this.deliveredDate = deliveredDate; 
    }

    public Long getUserId() { 
        return userId; 
    }
    
    public void setUserId(Long userId) { 
        this.userId = userId; 
    }

    public String getUserFullName() { 
        return userFullName; 
    }
    
    public void setUserFullName(String userFullName) { 
        this.userFullName = userFullName; 
    }

    public List<OrderItemDTO> getOrderItems() { 
        return orderItems; 
    }
    
    public void setOrderItems(List<OrderItemDTO> orderItems) { 
        this.orderItems = orderItems; 
    }

    // Inner class for OrderItem DTO
    public static class OrderItemDTO {
        private Long id;
        private Integer quantity;
        private BigDecimal price; // Changed from unitPrice
        private BigDecimal totalPrice;
        private String productName;
        private String productSku;

        public static OrderItemDTO from(com.example.project.entity.OrderItem orderItem) {
            OrderItemDTO dto = new OrderItemDTO();
            dto.id = orderItem.getId();
            dto.quantity = orderItem.getQuantity();
            dto.price = orderItem.getPrice(); // Correct field name
            dto.totalPrice = orderItem.getTotalPrice();

            try {
                if (orderItem.getProduct() != null) {
                    dto.productName = orderItem.getProduct().getName();
                    dto.productSku = orderItem.getProduct().getSku();
                }
            } catch (Exception e) {
                dto.productName = "Unknown Product";
                dto.productSku = "N/A";
            }

            return dto;
        }

        // Getters and Setters for OrderItemDTO
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public BigDecimal getTotalPrice() { return totalPrice; }
        public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }
        public String getProductSku() { return productSku; }
        public void setProductSku(String productSku) { this.productSku = productSku; }
    }
} 