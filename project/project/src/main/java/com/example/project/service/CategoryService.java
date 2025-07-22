package com.example.project.service;

import com.example.project.entity.Category;
import com.example.project.repository.CategoryRepository;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Map<String, Object>> getAllCategoriesWithProductCount(ProductRepository productRepository) {
        return categoryRepository.findAll().stream().map(category -> {
            long productCount = productRepository.countActiveProductsByCategory(category.getId());
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", category.getId());
            map.put("name", category.getName());
            map.put("description", category.getDescription());
            map.put("slug", category.getSlug());
            map.put("imageUrl", category.getImageUrl());
            map.put("productCount", productCount);
            return map;
        }).collect(Collectors.toList());
    }
} 