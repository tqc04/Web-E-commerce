package com.example.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Province {
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

    // Constructors
    public Province() {}

    public Province(String code, String name) {
        this.code = code;
        this.name = name;
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEnglishName() {
        return englishName;
    }

    public void setEnglishName(String englishName) {
        this.englishName = englishName;
    }

    public String getAdministrativeLevel() {
        return administrativeLevel;
    }

    public void setAdministrativeLevel(String administrativeLevel) {
        this.administrativeLevel = administrativeLevel;
    }

    public String getDecree() {
        return decree;
    }

    public void setDecree(String decree) {
        this.decree = decree;
    }

    // For backward compatibility with frontend
    public Integer getProvinceID() {
        try {
            return Integer.parseInt(this.code);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String getProvinceName() {
        return this.name;
    }
} 