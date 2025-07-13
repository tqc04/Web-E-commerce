package com.example.project.controller;

import com.example.project.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    /**
     * Lấy gợi ý sản phẩm cho người dùng
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationService.ProductRecommendation>> getUserRecommendations(@PathVariable Long userId, @RequestParam(defaultValue = "10") int limit) {
        try {
            List<RecommendationService.ProductRecommendation> recommendations = recommendationService.getPersonalizedRecommendations(userId, limit);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy sản phẩm tương tự
     */
    @GetMapping("/similar/{productId}")
    public ResponseEntity<List<RecommendationService.ProductRecommendation>> getSimilarProducts(@PathVariable Long productId, @RequestParam(defaultValue = "10") int limit) {
        try {
            List<RecommendationService.ProductRecommendation> similar = recommendationService.getSimilarProducts(productId, limit);
            return ResponseEntity.ok(similar);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy gợi ý theo mùa
     */
    @GetMapping("/seasonal")
    public ResponseEntity<List<RecommendationService.ProductRecommendation>> getSeasonalRecommendations(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<RecommendationService.ProductRecommendation> seasonal = recommendationService.getSeasonalRecommendations(limit);
            return ResponseEntity.ok(seasonal);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 