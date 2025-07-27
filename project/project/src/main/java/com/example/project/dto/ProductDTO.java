package com.example.project.dto;

import com.example.project.entity.Product;

import java.math.BigDecimal;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private String sku;
    private BigDecimal price;
    private String categoryName;
    private String brandName;

    // Static factory method to convert from Product entity
    public static ProductDTO from(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.id = product.getId();
        dto.name = product.getName();
        dto.description = product.getDescription();
        dto.sku = product.getSku();
        dto.price = product.getPrice();

        // Safely access lazy-loaded relationships with try-catch
        try {
            if (product.getCategory() != null) {
                dto.categoryName = product.getCategory().getName();
            }
        } catch (Exception e) {
            dto.categoryName = "Unknown Category";
        }

        try {
            if (product.getBrand() != null) {
                dto.brandName = product.getBrand().getName();
            }
        } catch (Exception e) {
            dto.brandName = "Unknown Brand";
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }

    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }

    public String getSku() { 
        return sku; 
    }
    
    public void setSku(String sku) { 
        this.sku = sku; 
    }

    public BigDecimal getPrice() { 
        return price; 
    }
    
    public void setPrice(BigDecimal price) { 
        this.price = price; 
    }

    public String getCategoryName() { 
        return categoryName; 
    }
    
    public void setCategoryName(String categoryName) { 
        this.categoryName = categoryName; 
    }

    public String getBrandName() { 
        return brandName; 
    }
    
    public void setBrandName(String brandName) { 
        this.brandName = brandName; 
    }
} 