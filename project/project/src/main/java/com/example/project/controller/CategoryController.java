package com.example.project.controller;

import com.example.project.entity.Category;
import com.example.project.service.CategoryService;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final ProductRepository productRepository;

    @Autowired
    public CategoryController(CategoryService categoryService, ProductRepository productRepository) {
        this.categoryService = categoryService;
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/with-count")
    public List<Map<String, Object>> getAllCategoriesWithProductCount() {
        return categoryService.getAllCategoriesWithProductCount(productRepository);
    }
} 