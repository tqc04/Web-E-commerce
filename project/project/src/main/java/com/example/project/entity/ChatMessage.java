package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@EntityListeners(AuditingEntityListener.class)
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_session_id")
    private ChatSession chatSession;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "message_type")
    private MessageType messageType;
    
    @NotNull
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "tokens_used")
    private Integer tokensUsed;
    
    @Column(name = "processing_time_ms")
    private Long processingTimeMs;
    
    @Column(name = "ai_model")
    private String aiModel;
    
    @Column(name = "confidence_score")
    private Double confidenceScore;
    
    @Column(name = "intent")
    private String intent;
    
    @Column(name = "entities", columnDefinition = "TEXT")
    private String entities; // JSON string
    
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata; // JSON string
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public ChatMessage() {}
    
    public ChatMessage(ChatSession chatSession, MessageType messageType, String content) {
        this.chatSession = chatSession;
        this.messageType = messageType;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ChatSession getChatSession() {
        return chatSession;
    }
    
    public void setChatSession(ChatSession chatSession) {
        this.chatSession = chatSession;
    }
    
    public MessageType getMessageType() {
        return messageType;
    }
    
    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Integer getTokensUsed() {
        return tokensUsed;
    }
    
    public void setTokensUsed(Integer tokensUsed) {
        this.tokensUsed = tokensUsed;
    }
    
    public Long getProcessingTimeMs() {
        return processingTimeMs;
    }
    
    public void setProcessingTimeMs(Long processingTimeMs) {
        this.processingTimeMs = processingTimeMs;
    }
    
    public String getAiModel() {
        return aiModel;
    }
    
    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }
    
    public Double getConfidenceScore() {
        return confidenceScore;
    }
    
    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
    
    public String getIntent() {
        return intent;
    }
    
    public void setIntent(String intent) {
        this.intent = intent;
    }
    
    public String getEntities() {
        return entities;
    }
    
    public void setEntities(String entities) {
        this.entities = entities;
    }
    
    public String getMetadata() {
        return metadata;
    }
    
    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public boolean isUserMessage() {
        return messageType == MessageType.USER;
    }
    
    public boolean isAssistantMessage() {
        return messageType == MessageType.ASSISTANT;
    }
    
    public boolean isSystemMessage() {
        return messageType == MessageType.SYSTEM;
    }
}

 