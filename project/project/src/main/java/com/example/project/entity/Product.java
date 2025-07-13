package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
    @Size(min = 5, max = 100)
    @Column(unique = true)
    private String sku;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(name = "discount_percentage")
    private Integer discountPercentage;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Column(name = "is_featured")
    private boolean isFeatured = false;
    
    @Column(name = "is_digital")
    private boolean isDigital = false;
    
    // SEO fields
    @Column(name = "meta_title")
    private String metaTitle;
    
    @Column(name = "meta_description")
    private String metaDescription;
    
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "tag")
    private Set<String> tags = new HashSet<>();
    
    // AI-related fields
    @ElementCollection
    @CollectionTable(name = "product_ai_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "ai_tag")
    private Set<String> aiTags = new HashSet<>();
    
    @Column(name = "ai_content_score")
    private Double aiContentScore;
    
    @Column(name = "recommendation_score")
    private Double recommendationScore;
    
    @Column(name = "embedding_vector", columnDefinition = "JSON")
    private String embeddingVector;
    
    // Ratings and reviews
    @Column(name = "average_rating")
    private Double averageRating = 0.0;
    
    @Column(name = "review_count")
    private Integer reviewCount = 0;
    
    @Column(name = "view_count")
    private Long viewCount = 0L;
    
    @Column(name = "purchase_count")
    private Long purchaseCount = 0L;
    
    // Dimensions and weight
    @Column(name = "weight_kg")
    private Double weightKg;
    
    @Column(name = "length_cm")
    private Double lengthCm;
    
    @Column(name = "width_cm")
    private Double widthCm;
    
    @Column(name = "height_cm")
    private Double heightCm;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductReview> reviews = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InventoryItem> inventory = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    // Constructors
    public Product() {}
    
    public Product(String name, String description, String sku, BigDecimal price, Category category, Brand brand) {
        this.name = name;
        this.description = description;
        this.sku = sku;
        this.price = price;
        this.category = category;
        this.brand = brand;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getAiGeneratedDescription() {
        return aiGeneratedDescription;
    }
    
    public void setAiGeneratedDescription(String aiGeneratedDescription) {
        this.aiGeneratedDescription = aiGeneratedDescription;
    }
    
    public String getSku() {
        return sku;
    }
    
    public void setSku(String sku) {
        this.sku = sku;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }
    
    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }
    
    public Integer getDiscountPercentage() {
        return discountPercentage;
    }
    
    public void setDiscountPercentage(Integer discountPercentage) {
        this.discountPercentage = discountPercentage;
    }
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public Brand getBrand() {
        return brand;
    }
    
    public void setBrand(Brand brand) {
        this.brand = brand;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public boolean isFeatured() {
        return isFeatured;
    }
    
    public void setFeatured(boolean featured) {
        isFeatured = featured;
    }
    
    public boolean isDigital() {
        return isDigital;
    }
    
    public void setDigital(boolean digital) {
        isDigital = digital;
    }
    
    public String getMetaTitle() {
        return metaTitle;
    }
    
    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }
    
    public String getMetaDescription() {
        return metaDescription;
    }
    
    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }
    
    public Set<String> getTags() {
        return tags;
    }
    
    public void setTags(Set<String> tags) {
        this.tags = tags;
    }
    
    public Set<String> getAiTags() {
        return aiTags;
    }
    
    public void setAiTags(Set<String> aiTags) {
        this.aiTags = aiTags;
    }
    
    public Double getAiContentScore() {
        return aiContentScore;
    }
    
    public void setAiContentScore(Double aiContentScore) {
        this.aiContentScore = aiContentScore;
    }
    
    public Double getRecommendationScore() {
        return recommendationScore;
    }
    
    public void setRecommendationScore(Double recommendationScore) {
        this.recommendationScore = recommendationScore;
    }
    
    public String getEmbeddingVector() {
        return embeddingVector;
    }
    
    public void setEmbeddingVector(String embeddingVector) {
        this.embeddingVector = embeddingVector;
    }
    
    public Double getAverageRating() {
        return averageRating;
    }
    
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
    
    public Integer getReviewCount() {
        return reviewCount;
    }
    
    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }
    
    public Long getViewCount() {
        return viewCount;
    }
    
    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }
    
    public Long getPurchaseCount() {
        return purchaseCount;
    }
    
    public void setPurchaseCount(Long purchaseCount) {
        this.purchaseCount = purchaseCount;
    }
    
    public Double getWeightKg() {
        return weightKg;
    }
    
    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }
    
    public Double getLengthCm() {
        return lengthCm;
    }
    
    public void setLengthCm(Double lengthCm) {
        this.lengthCm = lengthCm;
    }
    
    public Double getWidthCm() {
        return widthCm;
    }
    
    public void setWidthCm(Double widthCm) {
        this.widthCm = widthCm;
    }
    
    public Double getHeightCm() {
        return heightCm;
    }
    
    public void setHeightCm(Double heightCm) {
        this.heightCm = heightCm;
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
    
    public List<ProductImage> getImages() {
        return images;
    }
    
    public void setImages(List<ProductImage> images) {
        this.images = images;
    }
    
    public List<ProductVariant> getVariants() {
        return variants;
    }
    
    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
    }
    
    public List<ProductReview> getReviews() {
        return reviews;
    }
    
    public void setReviews(List<ProductReview> reviews) {
        this.reviews = reviews;
    }
    
    public List<InventoryItem> getInventory() {
        return inventory;
    }
    
    public void setInventory(List<InventoryItem> inventory) {
        this.inventory = inventory;
    }
    
    public List<OrderItem> getOrderItems() {
        return orderItems;
    }
    
    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
    
    // Helper methods
    public void addTag(String tag) {
        this.tags.add(tag);
    }
    
    public void removeTag(String tag) {
        this.tags.remove(tag);
    }
    
    public void addAiTag(String aiTag) {
        this.aiTags.add(aiTag);
    }
    
    public void removeAiTag(String aiTag) {
        this.aiTags.remove(aiTag);
    }
    
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    public void incrementPurchaseCount() {
        this.purchaseCount++;
    }
    
    public BigDecimal getDiscountedPrice() {
        if (discountPercentage != null && discountPercentage > 0) {
            BigDecimal discount = price.multiply(BigDecimal.valueOf(discountPercentage))
                                       .divide(BigDecimal.valueOf(100));
            return price.subtract(discount);
        }
        return price;
    }
    
    public boolean isOnSale() {
        return discountPercentage != null && discountPercentage > 0;
    }
    
    public String getPrimaryImageUrl() {
        return images.isEmpty() ? null : images.get(0).getImageUrl();
    }
} 