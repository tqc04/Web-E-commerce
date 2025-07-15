package com.example.project.service;

import com.example.project.dto.ProductDTO;
import com.example.project.entity.Product;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<Product> findAllActive(Pageable pageable) {
        // Use eager loading to avoid lazy initialization issues
        return productRepository.findActiveWithCategoryAndBrand(pageable);
    }

    // New method that returns DTOs directly
    public Page<ProductDTO> findAllActiveDTO(Pageable pageable) {
        return productRepository.findActiveWithCategoryAndBrand(pageable)
                .map(ProductDTO::from);
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public long countActiveProducts() {
        return productRepository.countByIsActiveTrue();
    }

    public List<Product> findAllWithEagerLoading() {
        return productRepository.findAllWithCategory();
    }
} 