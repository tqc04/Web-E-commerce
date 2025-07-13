package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "order_status_history")
@EntityListeners(AuditingEntityListener.class)
public class OrderStatusHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "from_status")
    private OrderStatus fromStatus;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "to_status")
    private OrderStatus toStatus;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "changed_by")
    private String changedBy;
    
    @Column(name = "system_generated")
    private boolean systemGenerated = false;
    
    @Column(name = "notification_sent")
    private boolean notificationSent = false;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public OrderStatusHistory() {}
    
    public OrderStatusHistory(Order order, OrderStatus fromStatus, OrderStatus toStatus, String changedBy) {
        this.order = order;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedBy = changedBy;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Order getOrder() {
        return order;
    }
    
    public void setOrder(Order order) {
        this.order = order;
    }
    
    public OrderStatus getFromStatus() {
        return fromStatus;
    }
    
    public void setFromStatus(OrderStatus fromStatus) {
        this.fromStatus = fromStatus;
    }
    
    public OrderStatus getToStatus() {
        return toStatus;
    }
    
    public void setToStatus(OrderStatus toStatus) {
        this.toStatus = toStatus;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getChangedBy() {
        return changedBy;
    }
    
    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }
    
    public boolean isSystemGenerated() {
        return systemGenerated;
    }
    
    public void setSystemGenerated(boolean systemGenerated) {
        this.systemGenerated = systemGenerated;
    }
    
    public boolean isNotificationSent() {
        return notificationSent;
    }
    
    public void setNotificationSent(boolean notificationSent) {
        this.notificationSent = notificationSent;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public boolean isStatusUpgrade() {
        return toStatus.ordinal() > fromStatus.ordinal();
    }
    
    public boolean isStatusDowngrade() {
        return toStatus.ordinal() < fromStatus.ordinal();
    }
    
    public void markNotificationSent() {
        this.notificationSent = true;
    }
} 