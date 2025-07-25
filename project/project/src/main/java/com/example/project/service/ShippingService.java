package com.example.project.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.example.project.entity.Warehouse;
import com.example.project.repository.WarehouseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.concurrent.ConcurrentHashMap;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.io.IOException;


@Service
public class ShippingService {

    @Value("${ghn.api.token:}")
    private String ghnToken;

    @Value("${ghn.api.base-url:https://online-gateway.ghn.vn/shiip/public-api/v2}")
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

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Value("${ghn.api.mock-create-order:false}")
    private boolean mockCreateOrder;

    private final Map<String, Integer> wardDistrictCache = new ConcurrentHashMap<>();



    private Integer getDistrictIdByWardCode(String wardCode) {
        if (wardDistrictCache.containsKey(wardCode)) {
            return wardDistrictCache.get(wardCode);
        }
        String ghnWardUrl = ghnBaseUrl.replace("/v2", "") + "/master-data/ward?ward_code=" + wardCode;
        HttpHeaders headers = createHeaders();
        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(ghnWardUrl, HttpMethod.GET, request, Map.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            if (data != null && data.get("DistrictID") != null) {
                Integer districtId = ((Number) data.get("DistrictID")).intValue();
                wardDistrictCache.put(wardCode, districtId);
                return districtId;
            }
        }
        throw new RuntimeException("Không tìm thấy district_id cho ward_code: " + wardCode);
    }

    public static class ShippingResult {
        public double fee;
        public long leadtime;
        public ShippingResult(double fee, long leadtime) {
            this.fee = fee;
            this.leadtime = leadtime;
        }
    }

    public ShippingResult calculateGhnShippingFee(
        Integer fromDistrictId, String fromWardCode,
        Integer toDistrictId, String toWardCode,
        double weight
    ) {
        try {
            // Log chi tiết payload gửi sang GHN
            System.out.println("GHN payload: fromDistrictId=" + fromDistrictId + ", fromWardCode=" + fromWardCode +
                ", toDistrictId=" + toDistrictId + ", toWardCode=" + toWardCode + ", weight=" + weight);
            HttpHeaders headers = createHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("from_district_id", fromDistrictId);
            body.put("from_ward_code", fromWardCode);
            body.put("to_district_id", toDistrictId);
            body.put("to_ward_code", toWardCode);
            body.put("weight", (int) Math.round(weight));
            body.put("service_type_id", 2); // Standard delivery
            body.put("insurance_value", 0);
            body.put("height", 10);
            body.put("length", 20);
            body.put("width", 15);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            String url = ghnBaseUrl + "/shipping-order/fee";
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
                if (data != null && data.get("total") != null) {
                    double fee = ((Number) data.get("total")).doubleValue();
                    long leadtime = data.get("leadtime") != null ? ((Number) data.get("leadtime")).longValue() : 0L;
                    return new ShippingResult(fee, leadtime);
                }
            }
        } catch (Exception e) {
            System.err.println("Error calculating shipping fee: " + e.getMessage());
        }
        // Return default shipping fee if API fails
        return new ShippingResult(-1, 0);
    }

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
    public List<Map<String, Object>> searchCommunes(String provinceCode, String searchTerm) {
        try {
            List<Map<String, Object>> allCommunes = getCommunesByProvince(provinceCode);
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return allCommunes;
            }
            String lowerSearchTerm = searchTerm.toLowerCase().trim();
            return allCommunes.stream()
                .filter(commune -> ((String) commune.get("wardName")).toLowerCase().contains(lowerSearchTerm))
                .toList();
        } catch (Exception e) {
            System.err.println("Error searching communes: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * @deprecated Địa chỉ mới không còn districtId/wardCode, chỉ dùng calculateShippingFeeByProvinceCommune
     */
    @Deprecated
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
    public List<Map<String, Object>> getCommunesByProvince(String provinceCode) {
        try {
            String effectiveDate = getCurrentEffectiveDate();
            String url = VIETNAM_GOV_API_BASE + "/" + effectiveDate + "/provinces/" + provinceCode + "/communes";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers),
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );
            if (response.getBody() != null && response.getBody().containsKey("communes")) {
                List<Map<String, Object>> communesData = (List<Map<String, Object>>) response.getBody().get("communes");
                List<Map<String, Object>> result = new ArrayList<>();
                for (Map<String, Object> c : communesData) {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("wardCode", c.get("code"));
                    map.put("wardName", c.get("name"));
                    // Không có districtID, để null hoặc bỏ qua
                    result.add(map);
                }
                return result;
            }
        } catch (Exception e) {
            System.err.println("Error getting communes from Vietnam Government Address API: " + e.getMessage());
            e.printStackTrace();
        }
        return List.of();
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
     * @deprecated Địa chỉ mới không còn districtId/wardCode, chỉ dùng calculateShippingFeeByProvinceCommune
     */
    @Deprecated
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
     * Tính phí ship dựa trên province/commune (không còn districtId/wardCode)
     */
    public BigDecimal calculateShippingFeeByProvinceCommune(String fromProvince, String fromCommune, String toProvince, String toCommune, Integer insuranceValue, Integer weight) {
        try {
            String url = ghnBaseUrl + "/shipping-order/fee";
            HttpHeaders headers = createHeaders();

            ShippingFeeRequest request = new ShippingFeeRequest();
            request.setFromDistrictId(Integer.parseInt(fromProvince)); // PHẢI là mã GHN, không phải id tự sinh
            request.setToDistrictId(Integer.parseInt(toProvince));     // PHẢI là mã GHN, không phải id tự sinh
            request.setToWardCode(toCommune);         // PHẢI là mã GHN, không phải id tự sinh
            request.setInsuranceValue(insuranceValue != null ? insuranceValue : 0);
            request.setWeight(weight != null ? weight : 500);
            // GHN API mới yêu cầu thêm service_id, shop_id nếu cần
            // request.setServiceId(serviceId); // serviceId lấy từ GHN API get available services
            // request.setShopId(shopId); // shopId lấy từ config hoặc DB

            // Log payload gửi lên GHN để debug
            System.out.println("GHN Shipping Fee Payload: " + new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(request));

            HttpEntity<ShippingFeeRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ShippingFeeResponse> response = restTemplate.postForEntity(url, entity, ShippingFeeResponse.class);

            if (response.getBody() != null && response.getBody().getCode() == 200) {
                return BigDecimal.valueOf(response.getBody().getData().getTotal());
            }
        } catch (Exception e) {
            System.err.println("Error calculating shipping fee: " + e.getMessage());
        }

        // Return default shipping fee if API fails
        return BigDecimal.valueOf(-1); // -1: không có phí mặc định
    }

    /**
     * Create shipping order
     */
    public Map<String, Object> createShippingOrder(Map<String, Object> orderData) {
        try {
            if (mockCreateOrder) {
                // Trả về dữ liệu mẫu, không gọi GHN thật
                return Map.of(
                    "code", 200,
                    "message", "Mocked create order (no real order created)",
                    "data", Map.of(
                        "order_code", "MOCK123456",
                        "expected_delivery_time", System.currentTimeMillis() + 3 * 24 * 3600 * 1000L
                    )
                );
            }
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
        headers.set("Token", ghnToken); // Đảm bảo luôn truyền header Token đúng
        headers.set("Content-Type", "application/json");
        // Nếu GHN yêu cầu header ShopId:
        // headers.set("ShopId", shopId); // shopId lấy từ config hoặc DB
        return headers;
    }

    /**
     * Get default shipping fee for testing
     */
    public BigDecimal getDefaultShippingFee() {
        return BigDecimal.valueOf(-1); // -1: không có phí mặc định
    }
} 