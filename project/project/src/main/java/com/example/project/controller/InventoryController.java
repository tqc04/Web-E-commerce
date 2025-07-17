package com.example.project.controller;

import com.example.project.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * Dự báo nhu cầu sản phẩm
     */
    @GetMapping("/forecast/{productId}")
    public ResponseEntity<Map<String, Object>> forecastDemand(@PathVariable Long productId, @RequestParam(defaultValue = "30") int days) {
        try {
            Map<String, Object> forecast = inventoryService.forecastDemand(productId, days);
            return ResponseEntity.ok(forecast);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phân tích tồn kho
     */
    @GetMapping("/analysis/{productId}")
    public ResponseEntity<Map<String, Object>> analyzeInventory(@PathVariable Long productId) {
        try {
            Map<String, Object> analysis = inventoryService.analyzeInventory(productId);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tối ưu hóa tồn kho đa sản phẩm
     */
    @PostMapping("/optimize")
    public ResponseEntity<Map<String, Object>> optimizeInventory(@RequestBody List<Long> productIds) {
        try {
            Map<String, Object> optimization = inventoryService.optimizeInventoryPortfolio(productIds);
            return ResponseEntity.ok(optimization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phát hiện bất thường trong tồn kho
     */
    @PostMapping("/anomalies")
    public ResponseEntity<List<Map<String, Object>>> detectAnomalies(@RequestBody List<Long> productIds) {
        try {
            List<Map<String, Object>> anomalies = inventoryService.detectAnomalies(productIds);
            return ResponseEntity.ok(anomalies);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tính toán điểm đặt hàng lại thông minh
     */
    @GetMapping("/reorder-point/{productId}")
    public ResponseEntity<Map<String, Object>> calculateReorderPoint(@PathVariable Long productId) {
        try {
            Map<String, Object> reorderPoint = inventoryService.calculateSmartReorderPoint(productId);
            return ResponseEntity.ok(reorderPoint);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Dự báo xu hướng tồn kho
     */
    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> predictTrends(@RequestParam(defaultValue = "3") int months) {
        try {
            Map<String, Object> trends = inventoryService.predictInventoryTrends(months);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo báo cáo tồn kho thông minh
     */
    @PostMapping("/report")
    public ResponseEntity<Map<String, Object>> generateReport(@RequestBody List<Long> productIds) {
        try {
            Map<String, Object> report = inventoryService.generateInventoryReport(productIds);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 