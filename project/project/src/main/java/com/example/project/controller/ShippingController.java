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
    public ResponseEntity<List<ShippingService.Ward>> getCommunesByProvince(@PathVariable String provinceCode) {
        try {
            List<ShippingService.Ward> communes = shippingService.getCommunesByProvince(provinceCode);
            return ResponseEntity.ok(communes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Search communes by name within a province
     */
    @GetMapping("/provinces/{provinceCode}/communes/search")
    public ResponseEntity<List<ShippingService.Ward>> searchCommunes(
            @PathVariable String provinceCode, 
            @RequestParam String q) {
        try {
            List<ShippingService.Ward> communes = shippingService.searchCommunes(provinceCode, q);
            return ResponseEntity.ok(communes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get wards by district ID
     */
    @GetMapping("/wards/{districtId}")
    public ResponseEntity<List<ShippingService.Ward>> getWards(@PathVariable Integer districtId) {
        try {
            List<ShippingService.Ward> wards = shippingService.getWards(districtId);
            return ResponseEntity.ok(wards);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Search wards by name within a district
     */
    @GetMapping("/wards/{districtId}/search")
    public ResponseEntity<List<ShippingService.Ward>> searchWards(
            @PathVariable Integer districtId, 
            @RequestParam String q) {
        try {
            List<ShippingService.Ward> wards = shippingService.searchWards(districtId, q);
            return ResponseEntity.ok(wards);
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
            Integer toDistrictId = (Integer) request.get("toDistrictId");
            String toWardCode = (String) request.get("toWardCode");
            Integer insuranceValue = (Integer) request.get("insuranceValue");
            Integer weight = (Integer) request.get("weight");

            if (toDistrictId == null || toWardCode == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing required fields: toDistrictId, toWardCode"
                ));
            }

            BigDecimal shippingFee = shippingService.calculateShippingFee(
                toDistrictId, toWardCode, insuranceValue, weight
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