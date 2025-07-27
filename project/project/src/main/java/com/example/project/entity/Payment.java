package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@EntityListeners(AuditingEntityListener.class)
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    @Column(name = "payment_reference", unique = true)
    private String paymentReference;
    
    @Column(name = "external_transaction_id")
    private String externalTransactionId;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @NotNull
    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "currency")
    private String currency = "VND";
    
    @Column(name = "gateway_response", columnDefinition = "TEXT")
    private String gatewayResponse;
    
    @Column(name = "failure_reason")
    private String failureReason;
    
    // AI Fraud Detection fields
    @Column(name = "fraud_score")
    private Double fraudScore;
    
    @Column(name = "fraud_analysis", columnDefinition = "TEXT")
    private String fraudAnalysis;
    
    @Column(name = "risk_factors", columnDefinition = "TEXT")
    private String riskFactors; // JSON string
    
    @Column(name = "is_flagged")
    private boolean isFlagged = false;
    
    @Column(name = "risk_level")
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel = RiskLevel.LOW;
    
    @Column(name = "verification_required")
    private boolean verificationRequired = false;
    
    @Column(name = "ai_decision", columnDefinition = "TEXT")
    private String aiDecision;
    
    // Payment details
    @Column(name = "card_last_four")
    private String cardLastFour;
    
    @Column(name = "card_brand")
    private String cardBrand;
    
    @Column(name = "card_country")
    private String cardCountry;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "user_agent")
    private String userAgent;
    
    @Column(name = "device_fingerprint")
    private String deviceFingerprint;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @Column(name = "refunded_at")
    private LocalDateTime refundedAt;
    
    @Column(name = "refunded_amount", precision = 10, scale = 2)
    private BigDecimal refundedAmount;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Payment() {}
    
    public Payment(Order order, String paymentReference, PaymentMethod paymentMethod, BigDecimal amount) {
        this.order = order;
        this.paymentReference = paymentReference;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
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
    
    public String getPaymentReference() {
        return paymentReference;
    }
    
    public void setPaymentReference(String paymentReference) {
        this.paymentReference = paymentReference;
    }
    
    public String getExternalTransactionId() {
        return externalTransactionId;
    }
    
    public void setExternalTransactionId(String externalTransactionId) {
        this.externalTransactionId = externalTransactionId;
    }
    
    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }
    
    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }
    
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getGatewayResponse() {
        return gatewayResponse;
    }
    
    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }
    
    public String getFailureReason() {
        return failureReason;
    }
    
    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
    
    public Double getFraudScore() {
        return fraudScore;
    }
    
    public void setFraudScore(Double fraudScore) {
        this.fraudScore = fraudScore;
    }
    
    public String getFraudAnalysis() {
        return fraudAnalysis;
    }
    
    public void setFraudAnalysis(String fraudAnalysis) {
        this.fraudAnalysis = fraudAnalysis;
    }
    
    public String getRiskFactors() {
        return riskFactors;
    }
    
    public void setRiskFactors(String riskFactors) {
        this.riskFactors = riskFactors;
    }
    
    public boolean isFlagged() {
        return isFlagged;
    }
    
    public void setFlagged(boolean flagged) {
        isFlagged = flagged;
    }
    
    public RiskLevel getRiskLevel() {
        return riskLevel;
    }
    
    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }
    
    public boolean isVerificationRequired() {
        return verificationRequired;
    }
    
    public void setVerificationRequired(boolean verificationRequired) {
        this.verificationRequired = verificationRequired;
    }
    
    public String getAiDecision() {
        return aiDecision;
    }
    
    public void setAiDecision(String aiDecision) {
        this.aiDecision = aiDecision;
    }
    
    public String getCardLastFour() {
        return cardLastFour;
    }
    
    public void setCardLastFour(String cardLastFour) {
        this.cardLastFour = cardLastFour;
    }
    
    public String getCardBrand() {
        return cardBrand;
    }
    
    public void setCardBrand(String cardBrand) {
        this.cardBrand = cardBrand;
    }
    
    public String getCardCountry() {
        return cardCountry;
    }
    
    public void setCardCountry(String cardCountry) {
        this.cardCountry = cardCountry;
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
    
    public String getDeviceFingerprint() {
        return deviceFingerprint;
    }
    
    public void setDeviceFingerprint(String deviceFingerprint) {
        this.deviceFingerprint = deviceFingerprint;
    }
    
    public LocalDateTime getProcessedAt() {
        return processedAt;
    }
    
    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }
    
    public LocalDateTime getRefundedAt() {
        return refundedAt;
    }
    
    public void setRefundedAt(LocalDateTime refundedAt) {
        this.refundedAt = refundedAt;
    }
    
    public BigDecimal getRefundedAmount() {
        return refundedAmount;
    }
    
    public void setRefundedAmount(BigDecimal refundedAmount) {
        this.refundedAmount = refundedAmount;
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
    
    // Additional methods for PaymentService compatibility
    public LocalDateTime getTransactionDate() {
        return this.createdAt;
    }
    
    public String getUserLocation() {
        return this.cardCountry; // Using card country as user location
    }
    
    public String getDeviceInfo() {
        return this.userAgent; // Using user agent as device info
    }
    
    // Helper methods
    public boolean isSuccessful() {
        return paymentStatus == PaymentStatus.COMPLETED;
    }
    
    public boolean isFailed() {
        return paymentStatus == PaymentStatus.FAILED;
    }
    
    public boolean isPending() {
        return paymentStatus == PaymentStatus.PENDING;
    }
    
    public boolean isRefunded() {
        return paymentStatus == PaymentStatus.REFUNDED;
    }
    
    public boolean isHighRisk() {
        return riskLevel == RiskLevel.HIGH || riskLevel == RiskLevel.CRITICAL;
    }
    
    public void markAsProcessed() {
        this.paymentStatus = PaymentStatus.COMPLETED;
        this.processedAt = LocalDateTime.now();
    }
    
    public void markAsFailed(String reason) {
        this.paymentStatus = PaymentStatus.FAILED;
        this.failureReason = reason;
    }
    
    public void refund(BigDecimal amount) {
        this.paymentStatus = PaymentStatus.REFUNDED;
        this.refundedAmount = amount;
        this.refundedAt = LocalDateTime.now();
    }
} 