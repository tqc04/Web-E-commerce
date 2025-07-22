package com.example.project.dto;

import com.example.project.entity.ChatMessage;
import java.time.LocalDateTime;

public class ChatMessageDTO {
    private Long id;
    private String content;
    private String messageType;
    private String aiModel;
    private Double confidenceScore;
    private String intent;
    private String entities;
    private String metadata;
    private LocalDateTime createdAt;

    public static ChatMessageDTO from(ChatMessage msg) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.id = msg.getId();
        dto.content = msg.getContent();
        dto.messageType = msg.getMessageType() != null ? msg.getMessageType().name() : null;
        dto.aiModel = msg.getAiModel();
        dto.confidenceScore = msg.getConfidenceScore();
        dto.intent = msg.getIntent();
        dto.entities = msg.getEntities();
        dto.metadata = msg.getMetadata();
        dto.createdAt = msg.getCreatedAt();
        return dto;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }
    public String getEntities() { return entities; }
    public void setEntities(String entities) { this.entities = entities; }
    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
} 