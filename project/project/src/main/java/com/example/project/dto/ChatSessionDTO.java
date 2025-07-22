package com.example.project.dto;

import com.example.project.entity.ChatSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ChatSessionDTO {
    private Long id;
    private String sessionId;
    private String status;
    private String title;
    private String aiModel;
    private Double temperature;
    private Integer maxTokens;
    private Integer totalTokensUsed;
    private Double totalCost;
    private String context;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ChatMessageDTO> messages;

    public static ChatSessionDTO from(ChatSession session) {
        ChatSessionDTO dto = new ChatSessionDTO();
        dto.id = session.getId();
        dto.sessionId = session.getSessionId();
        dto.status = session.getStatus() != null ? session.getStatus().name() : null;
        dto.title = session.getTitle();
        dto.aiModel = session.getAiModel();
        dto.temperature = session.getTemperature();
        dto.maxTokens = session.getMaxTokens();
        dto.totalTokensUsed = session.getTotalTokensUsed();
        dto.totalCost = session.getTotalCost();
        dto.context = session.getContext();
        dto.createdAt = session.getCreatedAt();
        dto.updatedAt = session.getUpdatedAt();
        dto.messages = session.getMessages() != null ? session.getMessages().stream().map(ChatMessageDTO::from).collect(Collectors.toList()) : null;
        return dto;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAiModel() { return aiModel; }
    public void setAiModel(String aiModel) { this.aiModel = aiModel; }
    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }
    public Integer getMaxTokens() { return maxTokens; }
    public void setMaxTokens(Integer maxTokens) { this.maxTokens = maxTokens; }
    public Integer getTotalTokensUsed() { return totalTokensUsed; }
    public void setTotalTokensUsed(Integer totalTokensUsed) { this.totalTokensUsed = totalTokensUsed; }
    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<ChatMessageDTO> getMessages() { return messages; }
    public void setMessages(List<ChatMessageDTO> messages) { this.messages = messages; }
} 