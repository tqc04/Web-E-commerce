package com.example.project.service;

import com.example.project.entity.Payment;
import com.example.project.entity.PaymentStatus;
import com.example.project.entity.PaymentMethod;
import com.example.project.entity.RiskLevel;
import com.example.project.entity.User;
import com.example.project.entity.Order;
import com.example.project.service.ai.AIService;
import com.example.project.service.ai.VectorStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private AIService aiService;

    @Autowired
    private VectorStoreService vectorStoreService;

    /**
     * Phân tích rủi ro gian lận thanh toán bằng AI
     */
    public Map<String, Object> analyzeFraudRisk(Payment payment) {
        try {
            // Tạo prompt cho AI phân tích fraud
            String prompt = String.format("""
                Analyze payment fraud risk for the following transaction:
                
                Payment Details:
                - Amount: %.2f
                - Payment Method: %s
                - Transaction Time: %s
                - User Location: %s
                - Device Info: %s
                
                Analyze patterns for:
                - Unusual transaction amounts
                - Suspicious timing patterns
                - Geographic inconsistencies
                - Device fingerprint anomalies
                - Payment method risks
                
                Provide risk assessment:
                Risk Level: [HIGH/MEDIUM/LOW]
                Risk Score: [0-100]
                Risk Factors: [list of concerns]
                Recommended Actions: [specific actions]
                Confidence Level: [percentage]
                """, 
                payment.getAmount(), 
                payment.getPaymentMethod(),
                payment.getTransactionDate(),
                payment.getUserLocation(),
                payment.getDeviceInfo());

            String aiAnalysis = aiService.generateText(prompt);
            
            Map<String, Object> riskAnalysis = new HashMap<>();
            riskAnalysis.put("paymentId", payment.getId());
            riskAnalysis.put("aiAnalysis", aiAnalysis);
            riskAnalysis.put("analysisDate", LocalDateTime.now());
            
            // Simulate risk scoring (trong thực tế sẽ dùng ML model)
            Random random = new Random();
            int riskScore = calculateRiskScore(payment);
            
            riskAnalysis.put("riskScore", riskScore);
            riskAnalysis.put("riskLevel", determineRiskLevel(riskScore));
            riskAnalysis.put("confidence", 0.7 + random.nextDouble() * 0.3);
            
            // Phân tích các yếu tố rủi ro
            List<String> riskFactors = identifyRiskFactors(payment);
            riskAnalysis.put("riskFactors", riskFactors);
            
            // Khuyến nghị hành động
            List<String> recommendations = generateRecommendations(riskScore, riskFactors);
            riskAnalysis.put("recommendations", recommendations);
            
            return riskAnalysis;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in fraud risk analysis: " + e.getMessage());
        }
    }

    /**
     * Phân tích hành vi thanh toán của người dùng
     */
    public Map<String, Object> analyzeUserPaymentBehavior(Long userId) {
        try {
            String prompt = String.format("""
                Analyze payment behavior patterns for user ID %d:
                
                Analyze:
                - Payment frequency and timing
                - Amount patterns and preferences
                - Payment method usage
                - Geographic patterns
                - Device usage patterns
                - Seasonal behavior
                
                Provide behavioral analysis:
                Behavior Profile: [description]
                Normal Patterns: [list]
                Anomaly Indicators: [list]
                Risk Factors: [concerns]
                Trust Score: [0-100]
                """, userId);

            String aiAnalysis = aiService.generateText(prompt);
            
            Map<String, Object> behaviorAnalysis = new HashMap<>();
            behaviorAnalysis.put("userId", userId);
            behaviorAnalysis.put("analysisDate", LocalDateTime.now());
            behaviorAnalysis.put("aiAnalysis", aiAnalysis);
            
            // Simulate behavior metrics
            Random random = new Random();
            behaviorAnalysis.put("trustScore", 60 + random.nextInt(40));
            behaviorAnalysis.put("averageTransactionAmount", 100 + random.nextDouble() * 1000);
            behaviorAnalysis.put("transactionFrequency", 1 + random.nextInt(10));
            behaviorAnalysis.put("preferredPaymentMethod", getRandomPaymentMethod());
            
            // Phân tích pattern
            List<Map<String, Object>> patterns = new ArrayList<>();
            String[] patternTypes = {"TIMING", "AMOUNT", "LOCATION", "DEVICE", "METHOD"};
            
            for (String patternType : patternTypes) {
                Map<String, Object> pattern = new HashMap<>();
                pattern.put("type", patternType);
                pattern.put("consistency", random.nextDouble());
                pattern.put("riskLevel", getRandomRiskLevel());
                patterns.add(pattern);
            }
            
            behaviorAnalysis.put("patterns", patterns);
            
            return behaviorAnalysis;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in behavior analysis: " + e.getMessage());
        }
    }

    /**
     * Phát hiện giao dịch bất thường
     */
    public List<Map<String, Object>> detectPaymentAnomalies(List<Long> paymentIds) {
        try {
            String prompt = """
                Detect payment anomalies and suspicious transactions:
                
                Look for:
                - Unusual transaction amounts
                - Rapid successive transactions
                - Geographic inconsistencies
                - Payment method anomalies
                - Time-based suspicious patterns
                
                For each anomaly, provide:
                Anomaly Type: [specific type]
                Severity: [HIGH/MEDIUM/LOW]
                Description: [detailed explanation]
                Evidence: [supporting data]
                Recommended Action: [what to do]
                """;

            String aiAnalysis = aiService.generateText(prompt);
            
            List<Map<String, Object>> anomalies = new ArrayList<>();
            Random random = new Random();
            
            for (Long paymentId : paymentIds) {
                if (random.nextDouble() < 0.2) { // 20% chance of anomaly
                    Map<String, Object> anomaly = new HashMap<>();
                    anomaly.put("paymentId", paymentId);
                    anomaly.put("type", getRandomAnomalyType());
                    anomaly.put("severity", getRandomSeverity());
                    anomaly.put("detectedAt", LocalDateTime.now());
                    anomaly.put("aiAnalysis", aiAnalysis);
                    anomaly.put("confidence", 0.6 + random.nextDouble() * 0.4);
                    anomaly.put("evidence", generateEvidence());
                    anomalies.add(anomaly);
                }
            }
            
            return anomalies;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in anomaly detection: " + e.getMessage());
        }
    }

    /**
     * Xác minh thanh toán thông minh
     */
    public Map<String, Object> verifyPayment(Payment payment) {
        try {
            // Phân tích rủi ro
            Map<String, Object> riskAnalysis = analyzeFraudRisk(payment);
            
            String prompt = String.format("""
                Verify payment legitimacy:
                
                Payment Information:
                - Risk Score: %d
                - Risk Level: %s
                - Amount: %.2f
                - Method: %s
                
                Verification checks:
                - Identity verification
                - Payment method validation
                - Transaction pattern analysis
                - Device fingerprint check
                - Geographic verification
                
                Provide verification result:
                Status: [APPROVED/DECLINED/REQUIRES_REVIEW]
                Verification Score: [0-100]
                Failed Checks: [list]
                Additional Requirements: [list]
                """, 
                (Integer) riskAnalysis.get("riskScore"),
                (String) riskAnalysis.get("riskLevel"),
                payment.getAmount(),
                payment.getPaymentMethod());

            String aiVerification = aiService.generateText(prompt);
            
            Map<String, Object> verification = new HashMap<>();
            verification.put("paymentId", payment.getId());
            verification.put("verificationDate", LocalDateTime.now());
            verification.put("aiVerification", aiVerification);
            verification.put("riskAnalysis", riskAnalysis);
            
            // Xác định trạng thái verification
            int riskScore = (Integer) riskAnalysis.get("riskScore");
            String verificationStatus = determineVerificationStatus(riskScore);
            verification.put("status", verificationStatus);
            
            Random random = new Random();
            verification.put("verificationScore", 70 + random.nextInt(30));
            
            // Các kiểm tra cụ thể
            Map<String, Boolean> checks = new HashMap<>();
            checks.put("identityVerified", random.nextBoolean());
            checks.put("paymentMethodValid", random.nextBoolean());
            checks.put("deviceTrusted", random.nextBoolean());
            checks.put("locationValid", random.nextBoolean());
            verification.put("checks", checks);
            
            return verification;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in payment verification: " + e.getMessage());
        }
    }

    /**
     * Giám sát thanh toán theo thời gian thực
     */
    public Map<String, Object> monitorPaymentPatterns(Long userId, int monitoringDays) {
        try {
            String prompt = String.format("""
                Monitor payment patterns for user ID %d over %d days:
                
                Monitor for:
                - Velocity changes
                - Amount patterns
                - Geographic movements
                - Device changes
                - Payment method shifts
                
                Real-time monitoring results:
                Pattern Changes: [list]
                Alert Triggers: [list]
                Risk Trend: [increasing/stable/decreasing]
                Monitoring Score: [0-100]
                """, userId, monitoringDays);

            String aiMonitoring = aiService.generateText(prompt);
            
            Map<String, Object> monitoring = new HashMap<>();
            monitoring.put("userId", userId);
            monitoring.put("monitoringDays", monitoringDays);
            monitoring.put("monitoringStart", LocalDateTime.now());
            monitoring.put("aiMonitoring", aiMonitoring);
            
            // Simulate monitoring data
            Random random = new Random();
            monitoring.put("monitoringScore", 60 + random.nextInt(40));
            monitoring.put("riskTrend", getRandomTrend());
            
            // Tạo alerts
            List<Map<String, Object>> alerts = new ArrayList<>();
            if (random.nextDouble() < 0.3) { // 30% chance of alert
                Map<String, Object> alert = new HashMap<>();
                alert.put("type", "VELOCITY_CHANGE");
                alert.put("severity", "MEDIUM");
                alert.put("timestamp", LocalDateTime.now());
                alert.put("description", "Unusual payment velocity detected");
                alerts.add(alert);
            }
            
            monitoring.put("alerts", alerts);
            
            return monitoring;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in payment monitoring: " + e.getMessage());
        }
    }

    /**
     * Phân tích mạng lưới gian lận
     */
    public Map<String, Object> analyzeFraudNetwork(List<Long> suspiciousPaymentIds) {
        try {
            String prompt = String.format("""
                Analyze potential fraud network from %d suspicious payments:
                
                Network analysis:
                - Common patterns across payments
                - Shared identifiers (IP, device, cards)
                - Temporal clustering
                - Geographic clustering
                - Amount patterns
                
                Provide network analysis:
                Network Strength: [0-100]
                Common Attributes: [list]
                Risk Connections: [list]
                Network Type: [organized/opportunistic/individual]
                Recommended Actions: [list]
                """, suspiciousPaymentIds.size());

            String aiNetworkAnalysis = aiService.generateText(prompt);
            
            Map<String, Object> networkAnalysis = new HashMap<>();
            networkAnalysis.put("suspiciousPaymentIds", suspiciousPaymentIds);
            networkAnalysis.put("analysisDate", LocalDateTime.now());
            networkAnalysis.put("aiNetworkAnalysis", aiNetworkAnalysis);
            
            // Simulate network analysis
            Random random = new Random();
            networkAnalysis.put("networkStrength", random.nextInt(100));
            networkAnalysis.put("networkType", getRandomNetworkType());
            
            // Phân tích connections
            List<Map<String, Object>> connections = new ArrayList<>();
            for (int i = 0; i < Math.min(5, suspiciousPaymentIds.size()); i++) {
                Map<String, Object> connection = new HashMap<>();
                connection.put("attribute", getRandomAttribute());
                connection.put("strength", random.nextDouble());
                connection.put("paymentCount", 2 + random.nextInt(8));
                connections.add(connection);
            }
            
            networkAnalysis.put("connections", connections);
            
            return networkAnalysis;
            
        } catch (Exception e) {
            throw new RuntimeException("Error in fraud network analysis: " + e.getMessage());
        }
    }

    // Helper methods
    private int calculateRiskScore(Payment payment) {
        Random random = new Random();
        int baseScore = 20;
        
        // Simulate risk factors
        if (payment.getAmount().compareTo(BigDecimal.valueOf(1000)) > 0) baseScore += 20;
        if (payment.getPaymentMethod() == PaymentMethod.CREDIT_CARD) baseScore += 10;
        
        return Math.min(100, baseScore + random.nextInt(30));
    }

    private RiskLevel determineRiskLevel(int riskScore) {
        if (riskScore >= 70) return RiskLevel.HIGH;
        if (riskScore >= 40) return RiskLevel.MEDIUM;
        return RiskLevel.LOW;
    }

    private List<String> identifyRiskFactors(Payment payment) {
        List<String> factors = new ArrayList<>();
        Random random = new Random();
        
        if (random.nextBoolean()) factors.add("UNUSUAL_AMOUNT");
        if (random.nextBoolean()) factors.add("NEW_PAYMENT_METHOD");
        if (random.nextBoolean()) factors.add("GEOGRAPHIC_MISMATCH");
        if (random.nextBoolean()) factors.add("DEVICE_ANOMALY");
        
        return factors;
    }

    private List<String> generateRecommendations(int riskScore, List<String> riskFactors) {
        List<String> recommendations = new ArrayList<>();
        
        if (riskScore >= 70) {
            recommendations.add("DECLINE_TRANSACTION");
            recommendations.add("MANUAL_REVIEW");
        } else if (riskScore >= 40) {
            recommendations.add("ADDITIONAL_VERIFICATION");
            recommendations.add("MONITOR_CLOSELY");
        } else {
            recommendations.add("APPROVE_TRANSACTION");
        }
        
        return recommendations;
    }

    private String determineVerificationStatus(int riskScore) {
        if (riskScore >= 70) return "DECLINED";
        if (riskScore >= 40) return "REQUIRES_REVIEW";
        return "APPROVED";
    }

    private String getRandomPaymentMethod() {
        String[] methods = {"CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CRYPTO"};
        return methods[new Random().nextInt(methods.length)];
    }

    private String getRandomRiskLevel() {
        String[] levels = {"HIGH", "MEDIUM", "LOW"};
        return levels[new Random().nextInt(levels.length)];
    }

    private String getRandomAnomalyType() {
        String[] types = {"AMOUNT_SPIKE", "VELOCITY_ANOMALY", "LOCATION_JUMP", "DEVICE_CHANGE", "METHOD_ANOMALY"};
        return types[new Random().nextInt(types.length)];
    }

    private String getRandomSeverity() {
        String[] severities = {"HIGH", "MEDIUM", "LOW"};
        return severities[new Random().nextInt(severities.length)];
    }

    private String getRandomTrend() {
        String[] trends = {"INCREASING", "STABLE", "DECREASING"};
        return trends[new Random().nextInt(trends.length)];
    }

    private String getRandomNetworkType() {
        String[] types = {"ORGANIZED", "OPPORTUNISTIC", "INDIVIDUAL"};
        return types[new Random().nextInt(types.length)];
    }

    private String getRandomAttribute() {
        String[] attributes = {"IP_ADDRESS", "DEVICE_ID", "CARD_NUMBER", "EMAIL", "PHONE"};
        return attributes[new Random().nextInt(attributes.length)];
    }

    private List<String> generateEvidence() {
        List<String> evidence = new ArrayList<>();
        Random random = new Random();
        
        if (random.nextBoolean()) evidence.add("Multiple rapid transactions");
        if (random.nextBoolean()) evidence.add("Unusual geographic location");
        if (random.nextBoolean()) evidence.add("New device fingerprint");
        if (random.nextBoolean()) evidence.add("Payment method inconsistency");
        
        return evidence;
    }

    /**
     * Tạo báo cáo phân tích thanh toán
     */
    public Map<String, Object> generatePaymentReport(List<Long> paymentIds) {
        try {
            Map<String, Object> report = new HashMap<>();
            report.put("reportDate", LocalDateTime.now());
            report.put("paymentCount", paymentIds.size());
            
            // Phân tích tổng thể
            List<Map<String, Object>> anomalies = detectPaymentAnomalies(paymentIds);
            report.put("anomalies", anomalies);
            
            // Phân tích mạng lưới
            List<Long> suspiciousIds = anomalies.stream()
                .map(a -> (Long) a.get("paymentId"))
                .collect(Collectors.toList());
            
            if (!suspiciousIds.isEmpty()) {
                Map<String, Object> networkAnalysis = analyzeFraudNetwork(suspiciousIds);
                report.put("networkAnalysis", networkAnalysis);
            }
            
            // Tạo AI summary
            String summaryPrompt = String.format("""
                Generate payment security report summary:
                - %d payments analyzed
                - %d anomalies detected
                - Network analysis included
                
                Executive Summary:
                Risk Assessment: [overall risk level]
                Key Findings: [main discoveries]
                Action Items: [priority actions]
                Financial Impact: [potential losses prevented]
                """, paymentIds.size(), anomalies.size());

            String aiSummary = aiService.generateText(summaryPrompt);
            report.put("executiveSummary", aiSummary);
            
            return report;
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating payment report: " + e.getMessage());
        }
    }
} 