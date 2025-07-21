package com.example.project.controller;

import com.example.project.service.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    /**
     * Get all provinces
     */
    @GetMapping("/provinces")
    public ResponseEntity<List<ShippingService.Province>> getProvinces() {
        try {
            List<ShippingService.Province> provinces = shippingService.getProvinces();
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Search provinces by name
     */
    @GetMapping("/provinces/search")
    public ResponseEntity<List<ShippingService.Province>> searchProvinces(@RequestParam String q) {
        try {
            List<ShippingService.Province> provinces = shippingService.searchProvinces(q);
            return ResponseEntity.ok(provinces);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get communes by province ID
     */
    @GetMapping("/provinces/{provinceCode}/communes")
    public ResponseEntity<List<Map<String, Object>>> getCommunesByProvince(@PathVariable String provinceCode) {
        try {
            List<Map<String, Object>> communes = shippingService.getCommunesByProvince(provinceCode);
            return ResponseEntity.ok(communes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Search communes by name within a province
     */
    @GetMapping("/provinces/{provinceCode}/communes/search")
    public ResponseEntity<List<Map<String, Object>>> searchCommunes(
            @PathVariable String provinceCode, 
            @RequestParam String q) {
        try {
            List<Map<String, Object>> communes = shippingService.searchCommunes(provinceCode, q);
            return ResponseEntity.ok(communes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Calculate shipping fee
     */
    @PostMapping("/calculate-fee")
    public ResponseEntity<Map<String, Object>> calculateShippingFee(@RequestBody Map<String, Object> request) {
        try {
            String fromProvince = (String) request.get("fromProvince");
            String fromCommune = (String) request.get("fromCommune");
            String toProvince = (String) request.get("toProvince");
            String toCommune = (String) request.get("toCommune");
            Integer insuranceValue = (Integer) request.get("insuranceValue");
            Integer weight = (Integer) request.get("weight");

            if (fromProvince == null || fromCommune == null || toProvince == null || toCommune == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing required fields: fromProvince, fromCommune, toProvince, toCommune"
                ));
            }

            BigDecimal shippingFee = shippingService.calculateShippingFeeByProvinceCommune(
                fromProvince, fromCommune, toProvince, toCommune, insuranceValue, weight
            );

            return ResponseEntity.ok(Map.of(
                "shippingFee", shippingFee,
                "currency", "VND"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to calculate shipping fee",
                "details", e.getMessage()
            ));
        }
    }

    /**
     * Get default shipping fee
     */
    @GetMapping("/default-fee")
    public ResponseEntity<Map<String, Object>> getDefaultShippingFee() {
        try {
            BigDecimal defaultFee = shippingService.getDefaultShippingFee();
            return ResponseEntity.ok(Map.of(
                "shippingFee", defaultFee,
                "currency", "VND"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to get default shipping fee"
            ));
        }
    }

    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "OK",
            "service", "ShippingController",
            "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
} 