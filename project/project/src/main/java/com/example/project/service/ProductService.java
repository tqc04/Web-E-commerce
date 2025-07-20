package com.example.project.service;

import com.example.project.dto.ProductDTO;
import com.example.project.entity.Product;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    /**
     * Find product by ID
     */
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    /**
     * Find all active products with pagination
     */
    public Page<Product> findAllActive(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable);
    }
    
    /**
     * Count active products
     */
    public Long countActiveProducts() {
        return productRepository.countByIsActiveTrue();
    }

    /**
     * Find all products with eager loading
     */
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