package com.example.project.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.Map;

public class UserBehaviorEvent {
    
    @JsonProperty("userId")
    private Long userId;
    
    @JsonProperty("eventType")
    private String eventType;
    
    @JsonProperty("eventData")
    private Map<String, Object> eventData;
    
    @JsonProperty("timestamp")
    private LocalDateTime timestamp;
    
    @JsonProperty("sessionId")
    private String sessionId;
    
    @JsonProperty("ipAddress")
    private String ipAddress;
    
    @JsonProperty("userAgent")
    private String userAgent;
    
    @JsonProperty("deviceType")
    private String deviceType;
    
    @JsonProperty("source")
    private String source;
    
    // Constructors
    public UserBehaviorEvent() {
        this.timestamp = LocalDateTime.now();
    }
    
    public UserBehaviorEvent(Long userId, String eventType, Map<String, Object> eventData) {
        this.userId = userId;
        this.eventType = eventType;
        this.eventData = eventData;
        this.timestamp = LocalDateTime.now();
    }
    
    public UserBehaviorEvent(Long userId, String eventType, Map<String, Object> eventData, 
                           String sessionId, String ipAddress, String userAgent, String deviceType, String source) {
        this.userId = userId;
        this.eventType = eventType;
        this.eventData = eventData;
        this.sessionId = sessionId;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.deviceType = deviceType;
        this.source = source;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    
    public Map<String, Object> getEventData() { return eventData; }
    public void setEventData(Map<String, Object> eventData) { this.eventData = eventData; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    
    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    @Override
    public String toString() {
        return "UserBehaviorEvent{" +
                "userId=" + userId +
                ", eventType='" + eventType + '\'' +
                ", eventData=" + eventData +
                ", timestamp=" + timestamp +
                ", sessionId='" + sessionId + '\'' +
                ", ipAddress='" + ipAddress + '\'' +
                ", userAgent='" + userAgent + '\'' +
                ", deviceType='" + deviceType + '\'' +
                ", source='" + source + '\'' +
                '}';
    }
} 