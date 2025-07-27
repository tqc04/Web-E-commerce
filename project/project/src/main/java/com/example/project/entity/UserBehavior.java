package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Entity
@Table(name = "user_behaviors")
@EntityListeners(AuditingEntityListener.class)
public class UserBehavior {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "behavior_type")
    private BehaviorType behaviorType;
    
    @Column(name = "session_id")
    private String sessionId;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "duration_seconds")
    private Long durationSeconds;
    
    @Column(name = "page_url")
    private String pageUrl;
    
    @Column(name = "referrer_url")
    private String referrerUrl;
    
    @ElementCollection
    @MapKeyColumn(name = "attribute_name")
    @Column(name = "attribute_value")
    @CollectionTable(name = "user_behavior_attributes", joinColumns = @JoinColumn(name = "behavior_id"))
    private Map<String, String> attributes = new HashMap<>();
    
    @Column(name = "embedding_vector", columnDefinition = "JSON")
    private String embeddingVector;
    
    @Column(name = "processed_for_ai")
    private boolean processedForAI = false;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public UserBehavior() {}
    
    public UserBehavior(User user, BehaviorType behaviorType, String sessionId) {
        this.user = user;
        this.behaviorType = behaviorType;
        this.sessionId = sessionId;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Product getProduct() {
        return product;
    }
    
    public void setProduct(Product product) {
        this.product = product;
    }
    
    public BehaviorType getBehaviorType() {
        return behaviorType;
    }
    
    public void setBehaviorType(BehaviorType behaviorType) {
        this.behaviorType = behaviorType;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public Long getDurationSeconds() {
        return durationSeconds;
    }
    
    public void setDurationSeconds(Long durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
    
    public String getPageUrl() {
        return pageUrl;
    }
    
    public void setPageUrl(String pageUrl) {
        this.pageUrl = pageUrl;
    }
    
    public String getReferrerUrl() {
        return referrerUrl;
    }
    
    public void setReferrerUrl(String referrerUrl) {
        this.referrerUrl = referrerUrl;
    }
    
    public Map<String, String> getAttributes() {
        return attributes;
    }
    
    public void setAttributes(Map<String, String> attributes) {
        this.attributes = attributes;
    }
    
    public String getEmbeddingVector() {
        return embeddingVector;
    }
    
    public void setEmbeddingVector(String embeddingVector) {
        this.embeddingVector = embeddingVector;
    }
    
    public boolean isProcessedForAI() {
        return processedForAI;
    }
    
    public void setProcessedForAI(boolean processedForAI) {
        this.processedForAI = processedForAI;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public void addAttribute(String key, String value) {
        this.attributes.put(key, value);
    }
    
    public String getAttribute(String key) {
        return this.attributes.get(key);
    }
    
    public void removeAttribute(String key) {
        this.attributes.remove(key);
    }
} 