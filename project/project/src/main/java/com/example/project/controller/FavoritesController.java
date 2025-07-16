package com.example.project.controller;

import com.example.project.entity.Product;
import com.example.project.entity.User;
import com.example.project.service.ProductService;
import com.example.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoritesController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    /**
     * Get user's favorite products
     */
    @GetMapping
    public ResponseEntity<Set<Product>> getFavorites(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            Set<Product> favoriteProducts = user.getFavoriteProductIds().stream()
                    .map(productService::findById)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            
            return ResponseEntity.ok(favoriteProducts);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Add product to favorites
     */
    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> addToFavorites(
            @PathVariable Long productId,
            HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Product> productOpt = productService.findById(productId);
            if (productOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Product not found");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            Product product = productOpt.get();
            
            // Add to favorites
            user.getFavoriteProductIds().add(productId);
            userService.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product added to favorites");
            response.put("product", createProductResponse(product));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add to favorites: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Remove product from favorites
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> removeFromFavorites(
            @PathVariable Long productId,
            HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Product> productOpt = productService.findById(productId);
            if (productOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Product not found");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOpt.get();
            Product product = productOpt.get();
            
            // Remove from favorites
            user.getFavoriteProductIds().remove(productId);
            userService.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product removed from favorites");
            response.put("product", createProductResponse(product));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to remove from favorites: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Check if product is in favorites
     */
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> isFavorite(
            @PathVariable Long productId,
            HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            boolean isFavorite = user.getFavoriteProductIds().contains(productId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isFavorite", isFavorite);
            response.put("productId", productId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to check favorite status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Helper method to create clean product response
     */
    private Map<String, Object> createProductResponse(Product product) {
        Map<String, Object> productData = new HashMap<>();
        productData.put("id", product.getId());
        productData.put("name", product.getName());
        productData.put("price", product.getPrice());
        productData.put("imageUrl", product.getImageUrl());
        productData.put("isInStock", product.isInStock());
        return productData;
    }
} 