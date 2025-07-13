package com.example.project.controller;

import com.example.project.entity.Product;
import com.example.project.entity.Brand;
import com.example.project.entity.Category;
import com.example.project.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * Lấy thông tin sản phẩm
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        try {
            Optional<Product> product = productService.findById(id);
            return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lấy danh sách tất cả sản phẩm active
     */
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(Pageable pageable) {
        try {
            Page<Product> products = productService.findAllActive(pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo sản phẩm mới
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            String sku = (String) request.get("sku");
            BigDecimal price = new BigDecimal(request.get("price").toString());
            Category category = (Category) request.get("category");
            Brand brand = (Brand) request.get("brand");
            List<String> features = (List<String>) request.get("features");
            List<String> specifications = (List<String>) request.get("specifications");
            
            Product createdProduct = productService.createProduct(name, description, sku, price, category, brand, features, specifications);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật sản phẩm
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String description = (String) request.get("description");
            BigDecimal price = new BigDecimal(request.get("price").toString());
            List<String> features = (List<String>) request.get("features");
            List<String> specifications = (List<String>) request.get("specifications");
            
            Product updatedProduct = productService.updateProduct(id, name, description, price, features, specifications);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa sản phẩm
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tìm kiếm sản phẩm
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(@RequestParam String query, Pageable pageable) {
        try {
            Page<Product> products = productService.searchProducts(query, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy sản phẩm theo danh mục
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<Product>> getProductsByCategory(@PathVariable Long categoryId, Pageable pageable) {
        try {
            Page<Product> products = productService.findByCategory(categoryId, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phân tích cảm xúc đánh giá sản phẩm
     */
    @GetMapping("/{id}/sentiment-analysis")
    public ResponseEntity<ProductService.ProductSentimentAnalysis> analyzeSentiment(@PathVariable Long id) {
        try {
            ProductService.ProductSentimentAnalysis sentiment = productService.analyzeProductSentiment(id);
            return ResponseEntity.ok(sentiment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tìm sản phẩm tương tự
     */
    @GetMapping("/{id}/similar")
    public ResponseEntity<List<Product>> findSimilarProducts(@PathVariable Long id, @RequestParam(defaultValue = "10") int limit) {
        try {
            List<Product> similarProducts = productService.getSimilarProducts(id, limit);
            return ResponseEntity.ok(similarProducts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * So sánh sản phẩm
     */
    @GetMapping("/{id1}/compare/{id2}")
    public ResponseEntity<ProductService.ProductComparison> compareProducts(@PathVariable Long id1, @PathVariable Long id2) {
        try {
            ProductService.ProductComparison comparison = productService.compareProducts(id1, id2);
            return ResponseEntity.ok(comparison);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo FAQ cho sản phẩm
     */
    @PostMapping("/{id}/faq")
    public ResponseEntity<String> generateProductFAQ(@PathVariable Long id) {
        try {
            String faq = productService.generateProductFAQ(id);
            return ResponseEntity.ok(faq);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo nội dung marketing cho sản phẩm
     */
    @PostMapping("/{id}/marketing-content")
    public ResponseEntity<ProductService.MarketingContent> generateMarketingContent(@PathVariable Long id, @RequestParam String targetAudience, @RequestParam String specialOffer) {
        try {
            ProductService.MarketingContent content = productService.generateMarketingContent(id, targetAudience, specialOffer);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 