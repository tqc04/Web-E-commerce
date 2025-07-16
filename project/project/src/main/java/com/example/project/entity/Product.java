package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 3, max = 200)
    private String name;
    
    @NotBlank
    @Size(min = 10, max = 2000)
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "ai_generated_description", columnDefinition = "TEXT")
    private String aiGeneratedDescription;
    
    @NotBlank
    @Size(min = 3, max = 50)
    @Column(unique = true)
    private String sku;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "compare_at_price", precision = 10, scale = 2)
    private BigDecimal compareAtPrice;
    
    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @Column(name = "low_stock_threshold")
    private Integer lowStockThreshold = 10;
    
    @Column(name = "weight")
    private Double weight;
    
    @Column(name = "dimensions")
    private String dimensions;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
    
    @Column(name = "is_digital")
    private Boolean isDigital = false;
    
    @Column(name = "requires_shipping")
    private Boolean requiresShipping = true;
    
    @Column(name = "seo_title")
    private String seoTitle;
    
    @Column(name = "seo_description")
    private String seoDescription;
    
    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // Comma-separated tags
    
    @Column(name = "ai_tags", columnDefinition = "TEXT")
    private String aiTags; // AI-generated tags
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @Column(name = "purchase_count")
    private Long purchaseCount = 0L;
    
    @Column(name = "average_rating")
    private Double averageRating = 0.0;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @Column(name = "recommendation_score")
    private Double recommendationScore = 0.0;
    
    @Column(name = "ai_embedding", columnDefinition = "TEXT")
    private String aiEmbedding; // JSON string for vector embeddings
    
    @Column(name = "image_url")
    private String imageUrl;
    
    // Category relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Brand relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;
    
    // Product images
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProductImage> images = new ArrayList<>();
    
    // Product variants
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProductVariant> variants = new ArrayList<>();
    
    // Product reviews
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ProductReview> reviews = new ArrayList<>();
    
    // Inventory items
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<InventoryItem> inventory = new ArrayList<>();
    
    // Order items
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Product() {}

    public Product(String name, String description, String sku, BigDecimal price) {
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.price = price;
        this.stockQuantity = 0;
        this.lowStockThreshold = 10;
        this.isActive = true;
        this.isFeatured = false;
        this.isDigital = false;
        this.requiresShipping = true;
        this.viewCount = 0L;
        this.purchaseCount = 0L;
        this.averageRating = 0.0;
        this.reviewCount = 0;
        this.recommendationScore = 0.0;
        this.images = new ArrayList<>();
        this.variants = new ArrayList<>();
        this.reviews = new ArrayList<>();
        this.inventory = new ArrayList<>();
        this.orderItems = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAiGeneratedDescription() { return aiGeneratedDescription; }
    public void setAiGeneratedDescription(String aiGeneratedDescription) { this.aiGeneratedDescription = aiGeneratedDescription; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getCompareAtPrice() { return compareAtPrice; }
    public void setCompareAtPrice(BigDecimal compareAtPrice) { this.compareAtPrice = compareAtPrice; }

    public BigDecimal getCostPrice() { return costPrice; }
    public void setCostPrice(BigDecimal costPrice) { this.costPrice = costPrice; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public Integer getLowStockThreshold() { return lowStockThreshold; }
    public void setLowStockThreshold(Integer lowStockThreshold) { this.lowStockThreshold = lowStockThreshold; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public String getDimensions() { return dimensions; }
    public void setDimensions(String dimensions) { this.dimensions = dimensions; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsDigital() { return isDigital; }
    public void setIsDigital(Boolean isDigital) { this.isDigital = isDigital; }

    public Boolean getRequiresShipping() { return requiresShipping; }
    public void setRequiresShipping(Boolean requiresShipping) { this.requiresShipping = requiresShipping; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getAiTags() { return aiTags; }
    public void setAiTags(String aiTags) { this.aiTags = aiTags; }

    public Long getViewCount() { return viewCount; }
    public void setViewCount(Long viewCount) { this.viewCount = viewCount; }

    public Long getPurchaseCount() { return purchaseCount; }
    public void setPurchaseCount(Long purchaseCount) { this.purchaseCount = purchaseCount; }

    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Double getRecommendationScore() { return recommendationScore; }
    public void setRecommendationScore(Double recommendationScore) { this.recommendationScore = recommendationScore; }

    public String getAiEmbedding() { return aiEmbedding; }
    public void setAiEmbedding(String aiEmbedding) { this.aiEmbedding = aiEmbedding; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }

    public List<ProductImage> getImages() { return images; }
    public void setImages(List<ProductImage> images) { this.images = images; }

    public List<ProductVariant> getVariants() { return variants; }
    public void setVariants(List<ProductVariant> variants) { this.variants = variants; }

    public List<ProductReview> getReviews() { return reviews; }
    public void setReviews(List<ProductReview> reviews) { this.reviews = reviews; }

    public List<InventoryItem> getInventory() { return inventory; }
    public void setInventory(List<InventoryItem> inventory) { this.inventory = inventory; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Boolean compatibility methods
    public Boolean isActive() { return this.isActive; }
    public Boolean isFeatured() { return this.isFeatured; }
    public Boolean isDigital() { return this.isDigital; }
    public Boolean isInStock() { return this.stockQuantity != null && this.stockQuantity > 0; }

    // Utility methods
    public List<String> getTagsAsList() {
        if (tags == null || tags.isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(tags.split(","));
    }

    public void setTagsFromList(List<String> tagList) {
        this.tags = tagList != null ? String.join(",", tagList) : null;
    }

    public List<String> getAiTagsAsList() {
        if (aiTags == null || aiTags.isEmpty()) {
            return new ArrayList<>();
        }
        return List.of(aiTags.split(","));
    }

    public void setAiTagsFromList(List<String> tagList) {
        this.aiTags = tagList != null ? String.join(",", tagList) : null;
    }

    public void incrementViewCount() {
        this.viewCount = (this.viewCount == null) ? 1 : this.viewCount + 1;
    }

    public void incrementPurchaseCount() {
        this.purchaseCount = (this.purchaseCount == null) ? 1 : this.purchaseCount + 1;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product)) return false;
        Product product = (Product) o;
        return id != null && id.equals(product.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
} 