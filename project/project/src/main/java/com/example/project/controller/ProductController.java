package com.example.project.controller;

import com.example.project.dto.ProductDTO;
import com.example.project.entity.Product;
import com.example.project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Lấy thông tin sản phẩm
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        try {
            Optional<Product> productOpt = productService.findById(id);
            if (productOpt.isPresent()) {
                return ResponseEntity.ok(ProductDTO.from(productOpt.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy danh sách tất cả sản phẩm active với search và filter
     */
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "id,asc") String sort) {
        try {
            Page<Product> products = productService.findAllActiveWithFilters(page, size, search, category, sort);
            Page<ProductDTO> dtoPage = products.map(ProductDTO::from);
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            e.printStackTrace(); // log lỗi thật
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Simple health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Products API is working!");
    }

    /**
     * Test endpoint with hardcoded JSON response
     */
    @GetMapping("/test-json")
    public ResponseEntity<Map<String, Object>> testJson() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Simple test working - no database call");
        response.put("timestamp", System.currentTimeMillis());
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    /**
     * Test database connection with simple count
     */
    @GetMapping("/db-test")
    public ResponseEntity<String> testDatabase() {
        try {
            long count = productService.countActiveProducts();
            return ResponseEntity.ok("Database connection OK. Product count: " + count);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Database connection failed: " + e.getMessage());
        }
    }

    /**
     * Get products with eager loading (test endpoint)
     */
    @GetMapping("/test-eager")
    public ResponseEntity<List<ProductDTO>> testEager() {
        try {
            List<Product> products = productService.findAllWithEagerLoading();
            List<ProductDTO> dtoList = products.stream()
                    .map(ProductDTO::from)
                    .toList();
            return ResponseEntity.ok(dtoList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Update stock for all products (admin endpoint)
     */
    @PostMapping("/update-stock")
    public ResponseEntity<Map<String, String>> updateAllStock(@RequestBody Map<String, Integer> request) {
        try {
            Integer stockQuantity = request.get("stockQuantity");
            if (stockQuantity == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "stockQuantity is required"));
            }
            
            int updatedCount = productService.updateAllStock(stockQuantity);
            return ResponseEntity.ok(Map.of(
                "message", "Updated stock for " + updatedCount + " products",
                "stockQuantity", stockQuantity.toString()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
} 