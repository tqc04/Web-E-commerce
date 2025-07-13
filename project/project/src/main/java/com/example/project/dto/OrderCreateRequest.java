package com.example.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public class OrderCreateRequest {
    
    @NotNull(message = "User ID is required")
    @JsonProperty("userId")
    private Long userId;
    
    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "At least one item is required")
    @JsonProperty("items")
    private List<OrderItemRequest> items;
    
    @NotBlank(message = "Shipping address is required")
    @JsonProperty("shippingAddress")
    private String shippingAddress;
    
    @NotBlank(message = "Billing address is required")
    @JsonProperty("billingAddress")
    private String billingAddress;
    
    @NotBlank(message = "Payment method is required")
    @JsonProperty("paymentMethod")
    private String paymentMethod;
    
    // Constructors
    public OrderCreateRequest() {}
    
    public OrderCreateRequest(Long userId, List<OrderItemRequest> items, String shippingAddress, String billingAddress, String paymentMethod) {
        this.userId = userId;
        this.items = items;
        this.shippingAddress = shippingAddress;
        this.billingAddress = billingAddress;
        this.paymentMethod = paymentMethod;
    }
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }
    
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public String getBillingAddress() { return billingAddress; }
    public void setBillingAddress(String billingAddress) { this.billingAddress = billingAddress; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    // Inner class for Order Item
    public static class OrderItemRequest {
        
        @NotNull(message = "Product ID is required")
        @JsonProperty("productId")
        private Long productId;
        
        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be positive")
        @JsonProperty("quantity")
        private Integer quantity;
        
        // Constructors
        public OrderItemRequest() {}
        
        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
        
        // Getters and Setters
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        @Override
        public String toString() {
            return "OrderItemRequest{" +
                    "productId=" + productId +
                    ", quantity=" + quantity +
                    '}';
        }
    }
    
    @Override
    public String toString() {
        return "OrderCreateRequest{" +
                "userId=" + userId +
                ", items=" + items +
                ", shippingAddress='" + shippingAddress + '\'' +
                ", billingAddress='" + billingAddress + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                '}';
    }
} 