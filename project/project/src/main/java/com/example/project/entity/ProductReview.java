package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_reviews")
@EntityListeners(AuditingEntityListener.class)
public class ProductReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    @NotNull
    @Min(1)
    @Max(5)
    @Column(name = "rating")
    private Integer rating;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "verified_purchase")
    private boolean verifiedPurchase = false;
    
    @Column(name = "is_approved")
    private boolean isApproved = false;
    
    @Column(name = "helpful_votes")
    private Integer helpfulVotes = 0;
    
    @Column(name = "total_votes")
    private Integer totalVotes = 0;
    
    // AI Analysis fields
    @Column(name = "sentiment_score")
    private Double sentimentScore;
    
    @Column(name = "sentiment_label")
    private String sentimentLabel;
    
    @Column(name = "ai_summary", columnDefinition = "TEXT")
    private String aiSummary;
    
    @Column(name = "extracted_aspects", columnDefinition = "TEXT")
    private String extractedAspects; // JSON string
    
    @Column(name = "spam_score")
    private Double spamScore;
    
    @Column(name = "is_spam")
    private boolean isSpam = false;
    
    @Column(name = "language_detected")
    private String languageDetected;
    
    @Column(name = "moderation_score")
    private Double moderationScore;
    
    @Column(name = "needs_moderation")
    private boolean needsModeration = false;
    
    @Column(name = "approved_by")
    private String approvedBy;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public ProductReview() {}
    
    public ProductReview(Product product, User user, Integer rating, String title, String content) {
        this.product = product;
        this.user = user;
        this.rating = rating;
        this.title = title;
        this.content = content;
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
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
    }
    
    public Integer getRating() {
        return rating;
    }
    
    public void setRating(Integer rating) {
        this.rating = rating;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public boolean isVerifiedPurchase() {
        return verifiedPurchase;
    }
    
    public void setVerifiedPurchase(boolean verifiedPurchase) {
        this.verifiedPurchase = verifiedPurchase;
    }
    
    public boolean isApproved() {
        return isApproved;
    }
    
    public void setApproved(boolean approved) {
        isApproved = approved;
    }
    
    public Integer getHelpfulVotes() {
        return helpfulVotes;
    }
    
    public void setHelpfulVotes(Integer helpfulVotes) {
        this.helpfulVotes = helpfulVotes;
    }
    
    public Integer getTotalVotes() {
        return totalVotes;
    }
    
    public void setTotalVotes(Integer totalVotes) {
        this.totalVotes = totalVotes;
    }
    
    public Double getSentimentScore() {
        return sentimentScore;
    }
    
    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }
    
    public String getSentimentLabel() {
        return sentimentLabel;
    }
    
    public void setSentimentLabel(String sentimentLabel) {
        this.sentimentLabel = sentimentLabel;
    }
    
    public String getAiSummary() {
        return aiSummary;
    }
    
    public void setAiSummary(String aiSummary) {
        this.aiSummary = aiSummary;
    }
    
    public String getExtractedAspects() {
        return extractedAspects;
    }
    
    public void setExtractedAspects(String extractedAspects) {
        this.extractedAspects = extractedAspects;
    }
    
    public Double getSpamScore() {
        return spamScore;
    }
    
    public void setSpamScore(Double spamScore) {
        this.spamScore = spamScore;
    }
    
    public boolean isSpam() {
        return isSpam;
    }
    
    public void setSpam(boolean spam) {
        isSpam = spam;
    }
    
    public String getLanguageDetected() {
        return languageDetected;
    }
    
    public void setLanguageDetected(String languageDetected) {
        this.languageDetected = languageDetected;
    }
    
    public Double getModerationScore() {
        return moderationScore;
    }
    
    public void setModerationScore(Double moderationScore) {
        this.moderationScore = moderationScore;
    }
    
    public boolean isNeedsModeration() {
        return needsModeration;
    }
    
    public void setNeedsModeration(boolean needsModeration) {
        this.needsModeration = needsModeration;
    }
    
    public String getApprovedBy() {
        return approvedBy;
    }
    
    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }
    
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
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
    public void addHelpfulVote() {
        this.helpfulVotes++;
        this.totalVotes++;
    }
    
    public void addNotHelpfulVote() {
        this.totalVotes++;
    }
    
    public double getHelpfulnessRatio() {
        if (totalVotes == 0) return 0.0;
        return (double) helpfulVotes / totalVotes;
    }
    
    public boolean isPositiveReview() {
        return rating >= 4;
    }
    
    public boolean isNegativeReview() {
        return rating <= 2;
    }
    
    public void approve(String approvedBy) {
        this.isApproved = true;
        this.approvedBy = approvedBy;
        this.approvedAt = LocalDateTime.now();
    }
    
    public boolean isPositiveSentiment() {
        return sentimentScore != null && sentimentScore > 0.5;
    }
    
    public boolean isNegativeSentiment() {
        return sentimentScore != null && sentimentScore < -0.5;
    }
} 