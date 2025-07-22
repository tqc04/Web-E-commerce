package com.example.project.controller;

import com.example.project.ai.AIEnterpriseService;
import com.example.project.service.ai.AIContentService;
import com.example.project.service.ai.AIService.SentimentAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIEnterpriseService aiService;

    @Autowired
    private AIContentService aiContentService;

    @Autowired
    private com.example.project.service.ai.AIService aiServiceAlt;

    /**
     * Tạo văn bản AI
     */
    @PostMapping("/generate-text")
    public ResponseEntity<String> generateText(@RequestBody Map<String, Object> request) {
        try {
            String prompt = (String) request.get("prompt");
            Map<String, Object> variables = (Map<String, Object>) request.get("variables");
            
            String result = aiService.generateText(prompt, variables);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo embedding cho văn bản
     */
    @PostMapping("/generate-embedding")
    public ResponseEntity<List<Double>> generateEmbedding(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            List<Double> embedding = aiServiceAlt.generateEmbedding(text);
            return ResponseEntity.ok(embedding);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phân tích cảm xúc
     */
    @PostMapping("/analyze-sentiment")
    public ResponseEntity<Map<String, Object>> analyzeSentiment(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            SentimentAnalysis sentiment = aiServiceAlt.analyzeSentiment(text);
            
            Map<String, Object> result = new HashMap<>();
            result.put("sentiment", sentiment.getSentiment());
            result.put("confidence", sentiment.getConfidence());
            result.put("explanation", sentiment.getExplanation());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo mô tả sản phẩm
     */
    @PostMapping("/generate-product-description")
    public ResponseEntity<String> generateProductDescription(@RequestBody Map<String, Object> request) {
        try {
            String productName = (String) request.get("productName");
            String category = (String) request.get("category");
            String brand = (String) request.get("brand");
            List<String> features = (List<String>) request.get("features");
            List<String> specifications = (List<String>) request.get("specifications");
            
            String description = aiContentService.generateProductDescription(productName, category, brand, features, specifications);
            return ResponseEntity.ok(description);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tạo nội dung marketing
     */
    @PostMapping("/generate-marketing-content")
    public ResponseEntity<String> generateMarketingContent(@RequestBody Map<String, Object> request) {
        try {
            String productName = (String) request.get("productName");
            String targetAudience = (String) request.get("targetAudience");
            String tone = (String) request.get("tone");
            String specialOffer = (String) request.get("specialOffer");
            
            // Use AI service to generate marketing content
            String prompt = String.format(
                "Create marketing content for product: %s. Target audience: %s. Tone: %s. Special offer: %s",
                productName, targetAudience, tone, specialOffer
            );
            String content = aiService.generateText(prompt);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tìm kiếm tương tự bằng vector (placeholder implementation)
     */
    @PostMapping("/vector-search")
    public ResponseEntity<List<Map<String, Object>>> vectorSearch(@RequestBody Map<String, Object> request) {
        try {
            String query = (String) request.get("query");
            Integer limit = (Integer) request.get("limit");
            
            // Placeholder implementation - vector search not available
            System.out.println("Vector search not available for query: " + query);
            
            return ResponseEntity.ok(List.of());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 