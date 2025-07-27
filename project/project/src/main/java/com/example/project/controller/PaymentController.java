package com.example.project.controller;

import com.example.project.entity.Payment;
import com.example.project.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Phân tích rủi ro gian lận thanh toán
     */
    @PostMapping("/fraud-analysis")
    public ResponseEntity<Map<String, Object>> analyzeFraudRisk(@RequestBody Payment payment) {
        try {
            Map<String, Object> analysis = paymentService.analyzeFraudRisk(payment);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phân tích hành vi thanh toán người dùng
     */
    @GetMapping("/user-behavior/{userId}")
    public ResponseEntity<Map<String, Object>> analyzeUserBehavior(@PathVariable Long userId) {
        try {
            Map<String, Object> behavior = paymentService.analyzeUserPaymentBehavior(userId);
            return ResponseEntity.ok(behavior);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phát hiện giao dịch bất thường
     */
    @PostMapping("/anomaly-detection")
    public ResponseEntity<List<Map<String, Object>>> detectAnomalies(@RequestBody List<Long> paymentIds) {
        try {
            List<Map<String, Object>> anomalies = paymentService.detectPaymentAnomalies(paymentIds);
            return ResponseEntity.ok(anomalies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xác minh thanh toán thông minh
     */
    @PostMapping("/verification")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Payment payment) {
        try {
            Map<String, Object> verification = paymentService.verifyPayment(payment);
            return ResponseEntity.ok(verification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Giám sát thanh toán theo thời gian thực
     */
    @GetMapping("/monitoring/{userId}")
    public ResponseEntity<Map<String, Object>> monitorPayments(@PathVariable Long userId, @RequestParam(defaultValue = "7") int days) {
        try {
            Map<String, Object> monitoring = paymentService.monitorPaymentPatterns(userId, days);
            return ResponseEntity.ok(monitoring);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phân tích mạng lưới gian lận
     */
    @PostMapping("/network-analysis")
    public ResponseEntity<Map<String, Object>> analyzeFraudNetwork(@RequestBody List<Long> suspiciousPaymentIds) {
        try {
            Map<String, Object> networkAnalysis = paymentService.analyzeFraudNetwork(suspiciousPaymentIds);
            return ResponseEntity.ok(networkAnalysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo báo cáo phân tích thanh toán
     */
    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> generatePaymentReport(@RequestBody List<Long> paymentIds) {
        try {
            Map<String, Object> report = paymentService.generatePaymentReport(paymentIds);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 