package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "chat_sessions")
@EntityListeners(AuditingEntityListener.class)
public class ChatSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(name = "session_id", unique = true)
    private String sessionId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "session_status")
    private ChatSessionStatus status = ChatSessionStatus.ACTIVE;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "context", columnDefinition = "TEXT")
    private String context;
    
    @Column(name = "ai_model")
    private String aiModel = "gemini-pro";
    
    @Column(name = "temperature")
    private Double temperature = 0.7;
    
    @Column(name = "max_tokens")
    private Integer maxTokens = 1000;
    
    @Column(name = "total_tokens_used")
    private Integer totalTokensUsed = 0;
    
    @Column(name = "total_cost")
    private Double totalCost = 0.0;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "ended_at")
    private LocalDateTime endedAt;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "chatSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChatMessage> messages = new ArrayList<>();
    
    // Constructors
    public ChatSession() {}
    
    public ChatSession(User user, String sessionId) {
        this.user = user;
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
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public ChatSessionStatus getStatus() {
        return status;
    }
    
    public void setStatus(ChatSessionStatus status) {
        this.status = status;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContext() {
        return context;
    }
    
    public void setContext(String context) {
        this.context = context;
    }
    
    public String getAiModel() {
        return aiModel;
    }
    
    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    
    public Integer getMaxTokens() {
        return maxTokens;
    }
    
    public void setMaxTokens(Integer maxTokens) {
        this.maxTokens = maxTokens;
    }
    
    public Integer getTotalTokensUsed() {
        return totalTokensUsed;
    }
    
    public void setTotalTokensUsed(Integer totalTokensUsed) {
        this.totalTokensUsed = totalTokensUsed;
    }
    
    public Double getTotalCost() {
        return totalCost;
    }
    
    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
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
    
    public LocalDateTime getEndedAt() {
        return endedAt;
    }
    
    public void setEndedAt(LocalDateTime endedAt) {
        this.endedAt = endedAt;
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
    
    public List<ChatMessage> getMessages() {
        return messages;
    }
    
    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
    
    // Helper methods
    public void addMessage(ChatMessage message) {
        messages.add(message);
        message.setChatSession(this);
    }
    
    public void endSession() {
        this.status = ChatSessionStatus.ENDED;
        this.endedAt = LocalDateTime.now();
    }
    
    public boolean isActive() {
        return status == ChatSessionStatus.ACTIVE;
    }
    
    public int getMessageCount() {
        return messages.size();
    }
    
    public void addTokensUsed(int tokens) {
        this.totalTokensUsed += tokens;
    }
    
    public void addCost(double cost) {
        this.totalCost += cost;
    }
}

 