package com.example.project.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ShippingService {

    @Value("${ghn.api.token:}")
    private String ghnToken;

    @Value("${ghn.api.base-url:https://dev-online.giaohangnhanh.vn}")
    private String ghnBaseUrl;
    
    // Vietnam Address API - Official Government API
    private final String VIETNAM_ADDRESS_API_BASE = "https://production.cas.so/address-kit";
    private final String VIETNAM_GOV_API_BASE = "https://production.cas.so/address-kit";
    
    // Use a fixed date that has data in the API
    private String getCurrentEffectiveDate() {
        // Use a date that has data in the API
        return "2025-07-01";
    }
    
    // Get current date for effectiveDate parameter
    private String getCurrentDate() {
        return java.time.LocalDate.now().toString();
    }

    private final RestTemplate restTemplate = new RestTemplate();

    // Vietnam Government Address API DTOs
    public static class Province {
        @JsonProperty("code")
        private String code;
        @JsonProperty("name")
        private String name;
        @JsonProperty("englishName")
        private String englishName;
        @JsonProperty("administrativeLevel")
        private String administrativeLevel;
        @JsonProperty("decree")
        private String decree;

        // Getters and setters
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEnglishName() { return englishName; }
        public void setEnglishName(String englishName) { this.englishName = englishName; }
        public String getAdministrativeLevel() { return administrativeLevel; }
        public void setAdministrativeLevel(String administrativeLevel) { this.administrativeLevel = administrativeLevel; }
        public String getDecree() { return decree; }
        public void setDecree(String decree) { this.decree = decree; }

        // For backward compatibility with frontend
        public Integer getProvinceID() {
            try {
                return Integer.parseInt(this.code);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        public String getProvinceName() { return this.name; }
    }

    public static class District {
        @JsonProperty("id")
        private Integer districtID;
        @JsonProperty("name")
        private String districtName;
        @JsonProperty("province_id")
        private Integer provinceID;
        @JsonProperty("code")
        private String code;
        @JsonProperty("administrative_unit_id")
        private Integer administrativeUnitId;
        @JsonProperty("administrative_region_id")
        private Integer administrativeRegionId;

        // Getters and setters
        public Integer getDistrictID() { return districtID; }
        public void setDistrictID(Integer districtID) { this.districtID = districtID; }
        public String getDistrictName() { return districtName; }
        public void setDistrictName(String districtName) { this.districtName = districtName; }
        public Integer getProvinceID() { return provinceID; }
        public void setProvinceID(Integer provinceID) { this.provinceID = provinceID; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public Integer getAdministrativeUnitId() { return administrativeUnitId; }
        public void setAdministrativeUnitId(Integer administrativeUnitId) { this.administrativeUnitId = administrativeUnitId; }
        public Integer getAdministrativeRegionId() { return administrativeRegionId; }
        public void setAdministrativeRegionId(Integer administrativeRegionId) { this.administrativeRegionId = administrativeRegionId; }
    }

    public static class Ward {
        @JsonProperty("id")
        private String wardCode;
        @JsonProperty("name")
        private String wardName;
        @JsonProperty("district_id")
        private Integer districtID;
        @JsonProperty("code")
        private String code;
        @JsonProperty("administrative_unit_id")
        private Integer administrativeUnitId;
        @JsonProperty("administrative_region_id")
        private Integer administrativeRegionId;

        // Getters and setters
        public String getWardCode() { return wardCode; }
        public void setWardCode(String wardCode) { this.wardCode = wardCode; }
        public String getWardName() { return wardName; }
        public void setWardName(String wardName) { this.wardName = wardName; }
        public Integer getDistrictID() { return districtID; }
        public void setDistrictID(Integer districtID) { this.districtID = districtID; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public Integer getAdministrativeUnitId() { return administrativeUnitId; }
        public void setAdministrativeUnitId(Integer administrativeUnitId) { this.administrativeUnitId = administrativeUnitId; }
        public Integer getAdministrativeRegionId() { return administrativeRegionId; }
        public void setAdministrativeRegionId(Integer administrativeRegionId) { this.administrativeRegionId = administrativeRegionId; }
    }

    public static class ShippingFeeRequest {
        @JsonProperty("service_type_id")
        private Integer serviceTypeId = 2; // Standard delivery
        @JsonProperty("insurance_value")
        private Integer insuranceValue;
        @JsonProperty("from_district_id")
        private Integer fromDistrictId = 1454; // Default: Ho Chi Minh City District 1
        @JsonProperty("to_district_id")
        private Integer toDistrictId;
        @JsonProperty("to_ward_code")
        private String toWardCode;
        @JsonProperty("height")
        private Integer height = 10; // cm
        @JsonProperty("length")
        private Integer length = 20; // cm
        @JsonProperty("weight")
        private Integer weight = 500; // grams
        @JsonProperty("width")
        private Integer width = 15; // cm

        // Getters and setters
        public Integer getServiceTypeId() { return serviceTypeId; }
        public void setServiceTypeId(Integer serviceTypeId) { this.serviceTypeId = serviceTypeId; }
        public Integer getInsuranceValue() { return insuranceValue; }
        public void setInsuranceValue(Integer insuranceValue) { this.insuranceValue = insuranceValue; }
        public Integer getFromDistrictId() { return fromDistrictId; }
        public void setFromDistrictId(Integer fromDistrictId) { this.fromDistrictId = fromDistrictId; }
        public Integer getToDistrictId() { return toDistrictId; }
        public void setToDistrictId(Integer toDistrictId) { this.toDistrictId = toDistrictId; }
        public String getToWardCode() { return toWardCode; }
        public void setToWardCode(String toWardCode) { this.toWardCode = toWardCode; }
        public Integer getHeight() { return height; }
        public void setHeight(Integer height) { this.height = height; }
        public Integer getLength() { return length; }
        public void setLength(Integer length) { this.length = length; }
        public Integer getWeight() { return weight; }
        public void setWeight(Integer weight) { this.weight = weight; }
        public Integer getWidth() { return width; }
        public void setWidth(Integer width) { this.width = width; }
    }

    public static class ShippingFeeResponse {
        @JsonProperty("code")
        private Integer code;
        @JsonProperty("message")
        private String message;
        @JsonProperty("data")
        private ShippingFeeData data;

        // Getters and setters
        public Integer getCode() { return code; }
        public void setCode(Integer code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public ShippingFeeData getData() { return data; }
        public void setData(ShippingFeeData data) { this.data = data; }
    }

    public static class ShippingFeeData {
        @JsonProperty("total")
        private Integer total;
        @JsonProperty("service_fee")
        private Integer serviceFee;
        @JsonProperty("insurance_fee")
        private Integer insuranceFee;

        // Getters and setters
        public Integer getTotal() { return total; }
        public void setTotal(Integer total) { this.total = total; }
        public Integer getServiceFee() { return serviceFee; }
        public void setServiceFee(Integer serviceFee) { this.serviceFee = serviceFee; }
        public Integer getInsuranceFee() { return insuranceFee; }
        public void setInsuranceFee(Integer insuranceFee) { this.insuranceFee = insuranceFee; }
    }

    public static class GHNResponse<T> {
        @JsonProperty("code")
        private Integer code;
        @JsonProperty("message")
        private String message;
        @JsonProperty("data")
        private T data;

        // Getters and setters
        public Integer getCode() { return code; }
        public void setCode(Integer code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public T getData() { return data; }
        public void setData(T data) { this.data = data; }
    }

    /**
     * Get all provinces using Vietnam Government Address API
     */
    public List<Province> getProvinces() {
        try {
            // Use Vietnam Government Address API for provinces
            String effectiveDate = getCurrentEffectiveDate();
            String url = VIETNAM_GOV_API_BASE + "/" + effectiveDate + "/provinces";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            System.out.println("Calling Vietnam Government Address API: " + url);
            
            // API returns an object with provinces array, not direct array
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), 
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            System.out.println("Vietnam Government Address API Response Status: " + response.getStatusCode());
            
            if (response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody.containsKey("provinces")) {
                    List<Map<String, Object>> provincesData = (List<Map<String, Object>>) responseBody.get("provinces");
                    List<Province> provinces = new ArrayList<>();
                    
                    for (Map<String, Object> provinceData : provincesData) {
                        Province province = new Province();
                        province.setCode((String) provinceData.get("code"));
                        province.setName((String) provinceData.get("name"));
                        province.setEnglishName((String) provinceData.get("englishName"));
                        province.setAdministrativeLevel((String) provinceData.get("administrativeLevel"));
                        province.setDecree((String) provinceData.get("decree"));
                        provinces.add(province);
                    }
                    
                    System.out.println("Successfully loaded " + provinces.size() + " provinces from Vietnam Government Address API");
                    return provinces;
                }
            }
        } catch (Exception e) {
            System.err.println("Error getting provinces from Vietnam Government Address API: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Return mock data if API fails
        System.out.println("Returning mock provinces data");
        return getMockProvinces();
    }
    
    /**
     * Search provinces by name
     */
    public List<Province> searchProvinces(String searchTerm) {
        try {
            List<Province> allProvinces = getProvinces();
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return allProvinces;
            }
            
            String lowerSearchTerm = searchTerm.toLowerCase().trim();
            return allProvinces.stream()
                .filter(province -> province.getProvinceName().toLowerCase().contains(lowerSearchTerm))
                .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error searching provinces: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Search communes by name within a province
     */
    public List<Ward> searchCommunes(String provinceCode, String searchTerm) {
        try {
            List<Ward> allCommunes = getCommunesByProvince(provinceCode);
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return allCommunes;
            }
            
            String lowerSearchTerm = searchTerm.toLowerCase().trim();
            return allCommunes.stream()
                .filter(commune -> commune.getWardName().toLowerCase().contains(lowerSearchTerm))
                .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error searching communes: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Search wards by name within a district
     */
    public List<Ward> searchWards(Integer districtId, String searchTerm) {
        try {
            List<Ward> allWards = getWards(districtId);
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return allWards;
            }
            
            String lowerSearchTerm = searchTerm.toLowerCase().trim();
            return allWards.stream()
                .filter(ward -> ward.getWardName().toLowerCase().contains(lowerSearchTerm))
                .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error searching wards: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Get mock provinces for testing
     */
    private List<Province> getMockProvinces() {
        List<Province> provinces = new ArrayList<>();
        
        Province hcm = new Province();
        hcm.setCode("79");
        hcm.setName("Thành phố Hồ Chí Minh");
        hcm.setEnglishName("");
        hcm.setAdministrativeLevel("Thành phố Trung ương");
        hcm.setDecree("");
        provinces.add(hcm);
        
        Province hn = new Province();
        hn.setCode("01");
        hn.setName("Thành phố Hà Nội");
        hn.setEnglishName("");
        hn.setAdministrativeLevel("Thành phố Trung ương");
        hn.setDecree("");
        provinces.add(hn);
        
        Province dn = new Province();
        dn.setCode("48");
        dn.setName("Thành phố Đà Nẵng");
        dn.setEnglishName("");
        dn.setAdministrativeLevel("Thành phố Trung ương");
        dn.setDecree("");
        provinces.add(dn);
        
        Province bg = new Province();
        bg.setCode("24");
        bg.setName("Tỉnh Bắc Giang");
        bg.setEnglishName("");
        bg.setAdministrativeLevel("Tỉnh");
        bg.setDecree("");
        provinces.add(bg);
        
        Province th = new Province();
        th.setCode("38");
        th.setName("Tỉnh Thanh Hóa");
        th.setEnglishName("");
        th.setAdministrativeLevel("Tỉnh");
        th.setDecree("");
        provinces.add(th);
        
        return provinces;
    }

    /**
     * Get communes by province code using Vietnam Government Address API
     * This replaces the old getDistricts method - now we get communes directly
     */
    public List<Ward> getCommunesByProvince(String provinceCode) {
        try {
            // Use Vietnam Government Address API for communes by province
            String effectiveDate = getCurrentEffectiveDate();
            String url = VIETNAM_GOV_API_BASE + "/" + effectiveDate + "/provinces/" + provinceCode + "/communes";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            System.out.println("Calling Vietnam Government Address API for communes by province: " + url);
            
            // API returns an object with communes array
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), 
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody.containsKey("communes")) {
                    List<Map<String, Object>> communesData = (List<Map<String, Object>>) responseBody.get("communes");
                    List<Ward> communes = new ArrayList<>();
                    
                    for (Map<String, Object> communeData : communesData) {
                        String communeCode = (String) communeData.get("code");
                        String communeName = (String) communeData.get("name");
                        
                        if (communeCode != null && communeName != null) {
                            Ward commune = new Ward();
                            commune.setWardCode(communeCode);
                            commune.setWardName(communeName);
                            commune.setCode(communeCode);
                            // Use provinceCode as districtId for compatibility
                            commune.setDistrictID(Integer.parseInt(provinceCode));
                            communes.add(commune);
                        }
                    }
                    
                    System.out.println("Successfully loaded " + communes.size() + " communes from Vietnam Government Address API");
                    return communes;
                }
            }
        } catch (Exception e) {
            System.err.println("Error getting communes from Vietnam Government Address API: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Return mock data if API fails
        return getMockCommunes(Integer.parseInt(provinceCode));
    }
    
    /**
     * Get mock communes for testing
     */
    private List<Ward> getMockCommunes(Integer provinceId) {
        List<Ward> communes = new ArrayList<>();
        
        if (provinceId == 79) { // TP Hồ Chí Minh
            Ward w1 = new Ward();
            w1.setWardCode("20109");
            w1.setWardName("Phường Bến Nghé");
            w1.setDistrictID(79);
            w1.setCode("20109");
            communes.add(w1);
            
            Ward w2 = new Ward();
            w2.setWardCode("20110");
            w2.setWardName("Phường Bến Thành");
            w2.setDistrictID(79);
            w2.setCode("20110");
            communes.add(w2);
            
            Ward w3 = new Ward();
            w3.setWardCode("20113");
            w3.setWardName("Phường Nguyễn Thái Bình");
            w3.setDistrictID(79);
            w3.setCode("20113");
            communes.add(w3);
        } else if (provinceId == 1) { // Hà Nội
            Ward w1 = new Ward();
            w1.setWardCode("00004");
            w1.setWardName("Phường Ba Đình");
            w1.setDistrictID(1);
            w1.setCode("00004");
            communes.add(w1);
            
            Ward w2 = new Ward();
            w2.setWardCode("00008");
            w2.setWardName("Phường Ngọc Hà");
            w2.setDistrictID(1);
            w2.setCode("00008");
            communes.add(w2);
            
            Ward w3 = new Ward();
            w3.setWardCode("00025");
            w3.setWardName("Phường Giảng Võ");
            w3.setDistrictID(1);
            w3.setCode("00025");
            communes.add(w3);
        }
        
        return communes;
    }

    /**
     * Get wards by district ID using Vietnam Government Address API
     * We need to get communes for the province that contains this district
     */
    public List<Ward> getWards(Integer districtId) {
        try {
            // First, we need to find which province this district belongs to
            // For now, we'll use a simple approach: get all communes and filter by district code
            String effectiveDate = getCurrentEffectiveDate();
            String url = VIETNAM_GOV_API_BASE + "/" + effectiveDate + "/communes";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            System.out.println("Calling Vietnam Government Address API for all communes: " + url);
            
            // API returns an object with communes array
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), 
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );
            
            if (response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                if (responseBody.containsKey("communes")) {
                    List<Map<String, Object>> communesData = (List<Map<String, Object>>) responseBody.get("communes");
                    List<Ward> wards = new ArrayList<>();
                    
                    for (Map<String, Object> communeData : communesData) {
                        String communeCode = (String) communeData.get("code");
                        
                        // Filter communes by district code (first 3 digits of commune code)
                        if (communeCode != null && communeCode.length() >= 3) {
                            String districtCode = communeCode.substring(0, 3);
                            if (districtCode.equals(String.valueOf(districtId))) {
                                Ward ward = new Ward();
                                ward.setWardCode(communeCode);
                                ward.setWardName((String) communeData.get("name"));
                                ward.setDistrictID(districtId);
                                ward.setCode(communeCode);
                                wards.add(ward);
                            }
                        }
                    }
                    
                    System.out.println("Successfully loaded " + wards.size() + " wards from Vietnam Government Address API");
                    return wards;
                }
            }
        } catch (Exception e) {
            System.err.println("Error getting wards from Vietnam Government Address API: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Return mock data if API fails
        return getMockWards(districtId);
    }
    
    /**
     * Get mock wards for testing
     */
    private List<Ward> getMockWards(Integer districtId) {
        List<Ward> wards = new ArrayList<>();
        
        if (districtId == 760) { // Quận 1
            Ward w1 = new Ward();
            w1.setWardCode("20109");
            w1.setWardName("Phường Bến Nghé");
            w1.setDistrictID(760);
            w1.setCode("20109");
            w1.setAdministrativeUnitId(3);
            w1.setAdministrativeRegionId(7);
            wards.add(w1);
            
            Ward w2 = new Ward();
            w2.setWardCode("20110");
            w2.setWardName("Phường Bến Thành");
            w2.setDistrictID(760);
            w2.setCode("20110");
            w2.setAdministrativeUnitId(3);
            w2.setAdministrativeRegionId(7);
            wards.add(w2);
            
            Ward w3 = new Ward();
            w3.setWardCode("20111");
            w3.setWardName("Phường Cầu Kho");
            w3.setDistrictID(760);
            w3.setCode("20111");
            w3.setAdministrativeUnitId(3);
            w3.setAdministrativeRegionId(7);
            wards.add(w3);
        } else if (districtId == 761) { // Quận 2
            Ward w1 = new Ward();
            w1.setWardCode("20201");
            w1.setWardName("Phường An Lạc A");
            w1.setDistrictID(761);
            w1.setCode("20201");
            w1.setAdministrativeUnitId(3);
            w1.setAdministrativeRegionId(7);
            wards.add(w1);
            
            Ward w2 = new Ward();
            w2.setWardCode("20202");
            w2.setWardName("Phường An Lạc");
            w2.setDistrictID(761);
            w2.setCode("20202");
            w2.setAdministrativeUnitId(3);
            w2.setAdministrativeRegionId(7);
            wards.add(w2);
        }
        
        return wards;
    }

    /**
     * Calculate shipping fee
     */
    public BigDecimal calculateShippingFee(Integer toDistrictId, String toWardCode, Integer insuranceValue, Integer weight) {
        try {
            String url = ghnBaseUrl + "/api/v1/shipping-order/fee";
            HttpHeaders headers = createHeaders();
            
            ShippingFeeRequest request = new ShippingFeeRequest();
            request.setToDistrictId(toDistrictId);
            request.setToWardCode(toWardCode);
            request.setInsuranceValue(insuranceValue != null ? insuranceValue : 0);
            request.setWeight(weight != null ? weight : 500);
            
            HttpEntity<ShippingFeeRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<ShippingFeeResponse> response = restTemplate.postForEntity(url, entity, ShippingFeeResponse.class);
            
            if (response.getBody() != null && response.getBody().getCode() == 200) {
                return BigDecimal.valueOf(response.getBody().getData().getTotal());
            }
        } catch (Exception e) {
            System.err.println("Error calculating shipping fee: " + e.getMessage());
        }
        
        // Return default shipping fee if API fails
        return BigDecimal.valueOf(30000); // 30,000 VND default
    }

    /**
     * Create shipping order
     */
    public Map<String, Object> createShippingOrder(Map<String, Object> orderData) {
        try {
            String url = ghnBaseUrl + "/api/v1/shipping-order/create";
            HttpHeaders headers = createHeaders();
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderData, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            
            if (response.getBody() != null && response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Error creating shipping order: " + e.getMessage());
        }
        return Map.of("error", "Failed to create shipping order");
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Token", ghnToken);
        headers.set("Content-Type", "application/json");
        return headers;
    }

    /**
     * Get default shipping fee for testing
     */
    public BigDecimal getDefaultShippingFee() {
        return BigDecimal.valueOf(30000); // 30,000 VND
    }
} 