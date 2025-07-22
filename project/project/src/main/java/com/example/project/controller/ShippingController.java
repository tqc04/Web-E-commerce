package com.example.project.controller;

import com.example.project.service.ShippingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    @Autowired
    private ShippingService shippingService;

    @Value("${ghn.api.token}")
    private String ghnToken;

    private static final String GHN_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api/master-data";

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

    @PostMapping("/calculate-fee-v2")
    public ResponseEntity<?> calculateFeeV2(@RequestBody Map<String, Object> payload) {
        try {
            // FE truyền đúng DistrictID/WardCode GHN
            Integer fromDistrictId = null;
            Integer toDistrictId = null;
            String fromWardCode = null;
            String toWardCode = null;
            double weight = 1000;
            if (payload.get("fromDistrictId") != null) fromDistrictId = Integer.parseInt(payload.get("fromDistrictId").toString());
            if (payload.get("toDistrictId") != null) toDistrictId = Integer.parseInt(payload.get("toDistrictId").toString());
            if (payload.get("fromWardCode") != null) fromWardCode = payload.get("fromWardCode").toString();
            if (payload.get("toWardCode") != null) toWardCode = payload.get("toWardCode").toString();
            if (payload.get("weight") != null) weight = Double.parseDouble(payload.get("weight").toString());

            if (fromDistrictId == null || toDistrictId == null || fromWardCode == null || toWardCode == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "fromDistrictId, toDistrictId, fromWardCode, toWardCode là bắt buộc"));
            }

            ShippingService.ShippingResult result = shippingService.calculateGhnShippingFee(
                    fromDistrictId, fromWardCode, toDistrictId, toWardCode, weight
            );

            return ResponseEntity.ok(Map.of(
                    "fee", result.fee,
                    "leadtime", result.leadtime
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ghn/provinces")
    public ResponseEntity<?> getGhnProvinces() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", ghnToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();
            String url = GHN_BASE_URL + "/province";
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            // Parse JSON string thành object trước khi trả về
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> json = mapper.readValue(response.getBody(), Map.class);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ghn/districts")
    public ResponseEntity<?> getGhnDistricts(@RequestParam("province_id") Integer provinceId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", ghnToken);
            headers.set("Content-Type", "application/json");
            RestTemplate restTemplate = new RestTemplate();
            String url = GHN_BASE_URL + "/district";
            String body = "{\"province_id\": " + provinceId + "}";
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            // Parse JSON string thành object trước khi trả về
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> json = mapper.readValue(response.getBody(), Map.class);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ghn/wards")
    public ResponseEntity<?> getGhnWards(@RequestParam("district_id") Integer districtId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Token", ghnToken);
            headers.set("Content-Type", "application/json");
            RestTemplate restTemplate = new RestTemplate();
            String url = GHN_BASE_URL + "/ward";
            String body = "{\"district_id\": " + districtId + "}";
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            // Parse JSON string thành object trước khi trả về
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> json = mapper.readValue(response.getBody(), Map.class);
            return ResponseEntity.ok(json);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
} 