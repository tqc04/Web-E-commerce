package com.example.project.service;

import com.example.project.dto.ProductDTO;
import com.example.project.entity.Product;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    /**
     * Find product by ID
     */
    @Cacheable("products")
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    /**
     * Find all active products with pagination
     */
    @Cacheable("products")
    public Page<Product> findAllActive(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable);
    }
    
    /**
     * Find all active products with filters and pagination
     */
    public Page<Product> findAllActiveWithFilters(int page, int size, String search, String category, String sort) {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        
        if (search != null && !search.trim().isEmpty()) {
            // Search by name or description
            return productRepository.findByNameContainingOrDescriptionContaining(search.trim(), search.trim(), pageable);
        } else if (category != null && !category.trim().isEmpty()) {
            // Filter by category name
            return productRepository.findByCategoryNameAndIsActiveTrue(category.trim(), pageable);
        } else {
            // Default: get all active products
            return productRepository.findByIsActiveTrue(pageable);
        }
    }
    
    /**
     * Count active products
     */
    @Cacheable("products")
    public Long countActiveProducts() {
        return productRepository.countByIsActiveTrue();
    }

    /**
     * Find all products with eager loading
     */
    @Cacheable("products")
    public List<Product> findAllWithEagerLoading() {
        return productRepository.findAll(); // Use findAll for now, eager loading can be configured in repository
    }

    /**
     * Save product
     */
    public Product save(Product product) {
        return productRepository.save(product);
    }

    /**
     * Check if product exists by ID
     */
    @Cacheable("products")
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }

    /**
     * Update stock for all products
     */
    public int updateAllStock(Integer stockQuantity) {
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            product.setStockQuantity(stockQuantity);
        }
        productRepository.saveAll(products);
        return products.size();
    }
} 