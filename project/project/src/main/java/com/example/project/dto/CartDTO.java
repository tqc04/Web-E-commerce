package com.example.project.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CartDTO {
    private Long userId;
    private String sessionId; // For guest users
    private List<CartItemDTO> items;
    private Integer totalItems;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal shippingAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private String promoCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public CartDTO() {
        this.items = new ArrayList<>();
        this.totalItems = 0;
        this.subtotal = BigDecimal.ZERO;
        this.taxAmount = BigDecimal.ZERO;
        this.shippingAmount = BigDecimal.ZERO;
        this.discountAmount = BigDecimal.ZERO;
        this.totalAmount = BigDecimal.ZERO;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public CartDTO(Long userId) {
        this();
        this.userId = userId;
    }

    public CartDTO(String sessionId) {
        this();
        this.sessionId = sessionId;
    }

    // Helper methods
    public void calculateTotals() {
        // Calculate subtotal
        this.subtotal = items.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculate total items
        this.totalItems = items.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        // Calculate shipping (free shipping over $50)
        this.shippingAmount = subtotal.compareTo(BigDecimal.valueOf(50)) >= 0 
                ? BigDecimal.ZERO 
                : BigDecimal.valueOf(9.99);

        // Calculate tax (8%)
        BigDecimal taxableAmount = subtotal.subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);
        this.taxAmount = taxableAmount.multiply(BigDecimal.valueOf(0.08));

        // Calculate total
        this.totalAmount = subtotal
                .add(taxAmount)
                .add(shippingAmount)
                .subtract(discountAmount != null ? discountAmount : BigDecimal.ZERO);

        this.updatedAt = LocalDateTime.now();
    }

    public void addItem(CartItemDTO item) {
        // Check if item already exists
        CartItemDTO existingItem = items.stream()
                .filter(i -> i.getProductId().equals(item.getProductId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // Update quantity
            existingItem.setQuantity(existingItem.getQuantity() + item.getQuantity());
        } else {
            // Add new item
            items.add(item);
        }
        calculateTotals();
    }

    public void removeItem(Long productId) {
        items.removeIf(item -> item.getProductId().equals(productId));
        calculateTotals();
    }

    public void updateItemQuantity(Long productId, Integer newQuantity) {
        System.out.println("CartDTO.updateItemQuantity - productId: " + productId + ", newQuantity: " + newQuantity);
        System.out.println("Current items count: " + items.size());
        
        if (newQuantity == null || newQuantity <= 0) {
            System.out.println("Removing item due to invalid quantity");
            removeItem(productId);
            return;
        }

        CartItemDTO item = items.stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElse(null);
                
        if (item != null) {
            System.out.println("Found item, updating quantity from " + item.getQuantity() + " to " + newQuantity);
            item.setQuantity(newQuantity);
            item.calculateSubtotal();
            calculateTotals();
        } else {
            System.out.println("Item not found for productId: " + productId);
        }
    }

    public void clearCart() {
        items.clear();
        calculateTotals();
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public CartItemDTO getItem(Long productId) {
        return items.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .orElse(null);
    }

    public void applyPromoCode(String promoCode, BigDecimal discountPercentage) {
        this.promoCode = promoCode;
        this.discountAmount = subtotal.multiply(discountPercentage.divide(BigDecimal.valueOf(100)));
        calculateTotals();
    }

    public void removePromoCode() {
        this.promoCode = null;
        this.discountAmount = BigDecimal.ZERO;
        calculateTotals();
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
        calculateTotals();
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
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

    @Override
    public String toString() {
        return "CartDTO{" +
                "userId=" + userId +
                ", sessionId='" + sessionId + '\'' +
                ", totalItems=" + totalItems +
                ", subtotal=" + subtotal +
                ", totalAmount=" + totalAmount +
                ", itemsCount=" + (items != null ? items.size() : 0) +
                '}';
    }
} 