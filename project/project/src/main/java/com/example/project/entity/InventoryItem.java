package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@EntityListeners(AuditingEntityListener.class)
public class InventoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @Column(name = "warehouse_location")
    private String warehouseLocation;
    
    @Column(name = "bin_location")
    private String binLocation;
    
    @NotNull
    @Min(0)
    @Column(name = "quantity_on_hand")
    private Integer quantityOnHand;
    
    @Min(0)
    @Column(name = "quantity_reserved")
    private Integer quantityReserved = 0;
    
    @Min(0)
    @Column(name = "quantity_available")
    private Integer quantityAvailable;
    
    @Column(name = "reorder_point")
    private Integer reorderPoint;
    
    @Column(name = "reorder_quantity")
    private Integer reorderQuantity;
    
    @Column(name = "max_stock_level")
    private Integer maxStockLevel;
    
    @Column(name = "min_stock_level")
    private Integer minStockLevel;
    
    // AI Forecasting fields
    @Column(name = "demand_forecast_7_days")
    private Integer demandForecast7Days;
    
    @Column(name = "demand_forecast_30_days")
    private Integer demandForecast30Days;
    
    @Column(name = "demand_forecast_90_days")
    private Integer demandForecast90Days;
    
    @Column(name = "predicted_stockout_date")
    private LocalDateTime predictedStockoutDate;
    
    @Column(name = "recommended_reorder_quantity")
    private Integer recommendedReorderQuantity;
    
    @Column(name = "seasonal_factor")
    private Double seasonalFactor;
    
    @Column(name = "trend_factor")
    private Double trendFactor;
    
    @Column(name = "forecast_accuracy")
    private Double forecastAccuracy;
    
    @Column(name = "last_forecast_update")
    private LocalDateTime lastForecastUpdate;
    
    @Column(name = "ai_insights", columnDefinition = "TEXT")
    private String aiInsights;
    
    // Status and alerts
    @Column(name = "is_low_stock")
    private boolean isLowStock = false;
    
    @Column(name = "is_out_of_stock")
    private boolean isOutOfStock = false;
    
    @Column(name = "is_overstocked")
    private boolean isOverstocked = false;
    
    @Column(name = "alert_sent")
    private boolean alertSent = false;
    
    @Column(name = "last_alert_date")
    private LocalDateTime lastAlertDate;
    
    @Column(name = "last_movement_date")
    private LocalDateTime lastMovementDate;
    
    @Column(name = "last_restock_date")
    private LocalDateTime lastRestockDate;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public InventoryItem() {}
    
    public InventoryItem(Product product, String warehouseLocation, Integer quantityOnHand) {
        this.product = product;
        this.warehouseLocation = warehouseLocation;
        this.quantityOnHand = quantityOnHand;
        this.quantityAvailable = quantityOnHand;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public String getWarehouseLocation() {
        return warehouseLocation;
    }
    
    public void setWarehouseLocation(String warehouseLocation) {
        this.warehouseLocation = warehouseLocation;
    }
    
    public String getBinLocation() {
        return binLocation;
    }
    
    public void setBinLocation(String binLocation) {
        this.binLocation = binLocation;
    }
    
    public Integer getQuantityOnHand() {
        return quantityOnHand;
    }
    
    public void setQuantityOnHand(Integer quantityOnHand) {
        this.quantityOnHand = quantityOnHand;
        updateQuantityAvailable();
        updateStockStatus();
    }
    
    public Integer getQuantityReserved() {
        return quantityReserved;
    }
    
    public void setQuantityReserved(Integer quantityReserved) {
        this.quantityReserved = quantityReserved;
        updateQuantityAvailable();
        updateStockStatus();
    }
    
    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }
    
    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }
    
    public Integer getReorderPoint() {
        return reorderPoint;
    }
    
    public void setReorderPoint(Integer reorderPoint) {
        this.reorderPoint = reorderPoint;
    }
    
    public Integer getReorderQuantity() {
        return reorderQuantity;
    }
    
    public void setReorderQuantity(Integer reorderQuantity) {
        this.reorderQuantity = reorderQuantity;
    }
    
    public Integer getMaxStockLevel() {
        return maxStockLevel;
    }
    
    public void setMaxStockLevel(Integer maxStockLevel) {
        this.maxStockLevel = maxStockLevel;
    }
    
    public Integer getMinStockLevel() {
        return minStockLevel;
    }
    
    public void setMinStockLevel(Integer minStockLevel) {
        this.minStockLevel = minStockLevel;
    }
    
    public Integer getDemandForecast7Days() {
        return demandForecast7Days;
    }
    
    public void setDemandForecast7Days(Integer demandForecast7Days) {
        this.demandForecast7Days = demandForecast7Days;
    }
    
    public Integer getDemandForecast30Days() {
        return demandForecast30Days;
    }
    
    public void setDemandForecast30Days(Integer demandForecast30Days) {
        this.demandForecast30Days = demandForecast30Days;
    }
    
    public Integer getDemandForecast90Days() {
        return demandForecast90Days;
    }
    
    public void setDemandForecast90Days(Integer demandForecast90Days) {
        this.demandForecast90Days = demandForecast90Days;
    }
    
    public LocalDateTime getPredictedStockoutDate() {
        return predictedStockoutDate;
    }
    
    public void setPredictedStockoutDate(LocalDateTime predictedStockoutDate) {
        this.predictedStockoutDate = predictedStockoutDate;
    }
    
    public Integer getRecommendedReorderQuantity() {
        return recommendedReorderQuantity;
    }
    
    public void setRecommendedReorderQuantity(Integer recommendedReorderQuantity) {
        this.recommendedReorderQuantity = recommendedReorderQuantity;
    }
    
    public Double getSeasonalFactor() {
        return seasonalFactor;
    }
    
    public void setSeasonalFactor(Double seasonalFactor) {
        this.seasonalFactor = seasonalFactor;
    }
    
    public Double getTrendFactor() {
        return trendFactor;
    }
    
    public void setTrendFactor(Double trendFactor) {
        this.trendFactor = trendFactor;
    }
    
    public Double getForecastAccuracy() {
        return forecastAccuracy;
    }
    
    public void setForecastAccuracy(Double forecastAccuracy) {
        this.forecastAccuracy = forecastAccuracy;
    }
    
    public LocalDateTime getLastForecastUpdate() {
        return lastForecastUpdate;
    }
    
    public void setLastForecastUpdate(LocalDateTime lastForecastUpdate) {
        this.lastForecastUpdate = lastForecastUpdate;
    }
    
    public String getAiInsights() {
        return aiInsights;
    }
    
    public void setAiInsights(String aiInsights) {
        this.aiInsights = aiInsights;
    }
    
    public boolean isLowStock() {
        return isLowStock;
    }
    
    public void setLowStock(boolean lowStock) {
        isLowStock = lowStock;
    }
    
    public boolean isOutOfStock() {
        return isOutOfStock;
    }
    
    public void setOutOfStock(boolean outOfStock) {
        isOutOfStock = outOfStock;
    }
    
    public boolean isOverstocked() {
        return isOverstocked;
    }
    
    public void setOverstocked(boolean overstocked) {
        isOverstocked = overstocked;
    }
    
    public boolean isAlertSent() {
        return alertSent;
    }
    
    public void setAlertSent(boolean alertSent) {
        this.alertSent = alertSent;
    }
    
    public LocalDateTime getLastAlertDate() {
        return lastAlertDate;
    }
    
    public void setLastAlertDate(LocalDateTime lastAlertDate) {
        this.lastAlertDate = lastAlertDate;
    }
    
    public LocalDateTime getLastMovementDate() {
        return lastMovementDate;
    }
    
    public void setLastMovementDate(LocalDateTime lastMovementDate) {
        this.lastMovementDate = lastMovementDate;
    }
    
    public LocalDateTime getLastRestockDate() {
        return lastRestockDate;
    }
    
    public void setLastRestockDate(LocalDateTime lastRestockDate) {
        this.lastRestockDate = lastRestockDate;
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
    
    // Helper methods
    private void updateQuantityAvailable() {
        this.quantityAvailable = this.quantityOnHand - this.quantityReserved;
    }
    
    private void updateStockStatus() {
        this.isOutOfStock = this.quantityAvailable <= 0;
        this.isLowStock = this.minStockLevel != null && this.quantityAvailable <= this.minStockLevel;
        this.isOverstocked = this.maxStockLevel != null && this.quantityOnHand > this.maxStockLevel;
    }
    
    public void addStock(Integer quantity) {
        this.quantityOnHand += quantity;
        this.lastRestockDate = LocalDateTime.now();
        updateQuantityAvailable();
        updateStockStatus();
    }
    
    public void removeStock(Integer quantity) {
        this.quantityOnHand = Math.max(0, this.quantityOnHand - quantity);
        this.lastMovementDate = LocalDateTime.now();
        updateQuantityAvailable();
        updateStockStatus();
    }
    
    public void reserveStock(Integer quantity) {
        this.quantityReserved += quantity;
        updateQuantityAvailable();
        updateStockStatus();
    }
    
    public void releaseReservedStock(Integer quantity) {
        this.quantityReserved = Math.max(0, this.quantityReserved - quantity);
        updateQuantityAvailable();
        updateStockStatus();
    }
    
    public boolean needsReorder() {
        return this.reorderPoint != null && this.quantityAvailable <= this.reorderPoint;
    }
    
    public void sendAlert() {
        this.alertSent = true;
        this.lastAlertDate = LocalDateTime.now();
    }
    
    public void updateForecast(Integer forecast7Days, Integer forecast30Days, Integer forecast90Days) {
        this.demandForecast7Days = forecast7Days;
        this.demandForecast30Days = forecast30Days;
        this.demandForecast90Days = forecast90Days;
        this.lastForecastUpdate = LocalDateTime.now();
    }
} 