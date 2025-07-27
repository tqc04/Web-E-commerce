package com.example.project.service;

import com.example.project.entity.Product;
import com.example.project.entity.User;
import com.example.project.entity.UserBehavior;
import com.example.project.repository.ProductRepository;
import com.example.project.repository.UserRepository;
import com.example.project.service.ai.AIService;
import com.example.project.service.ai.VectorStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.util.Arrays;

@Service
@Transactional
public class RecommendationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private VectorStoreService vectorStoreService;
    
    /**
     * Get personalized product recommendations for user
     */
    public List<ProductRecommendation> getPersonalizedRecommendations(Long userId, int limit) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        if (!user.isRecommendationEnabled()) {
            return getFallbackRecommendations(limit);
        }
        
        // Build recommendation query from user data  
        Set<String> interests = new HashSet<>();
        
        // Get interests from user - handle String field properly
        if (user.getInterests() != null && !user.getInterests().isEmpty()) {
            interests.addAll(Arrays.asList(user.getInterests().split(",")));
        }
        
        // Get preferences from user - handle String field properly  
        if (user.getPreferences() != null && !user.getPreferences().isEmpty()) {
            interests.addAll(Arrays.asList(user.getPreferences().split(",")));
        }
        
        String query = String.join(" ", interests);
        
        try {
            // Use vector search to find similar products
            var documents = vectorStoreService.findProductsForUser(
                    userId, new ArrayList<>(interests), null, limit * 2);
            
            List<ProductRecommendation> recommendations = documents.stream()
                    .map(doc -> {
                        Long productId = (Long) doc.getMetadata().get("productId");
                        Optional<Product> productOpt = productRepository.findById(productId);
                        
                        if (productOpt.isEmpty()) {
                            return null;
                        }
                        
                        Product product = productOpt.get();
                        double relevanceScore = calculateRelevanceScore(user, product);
                        String reason = generateRecommendationReason(user, product);
                        
                        return new ProductRecommendation(
                                product,
                                relevanceScore,
                                reason,
                                RecommendationType.PERSONALIZED
                        );
                    })
                    .filter(Objects::nonNull)
                    .sorted((r1, r2) -> Double.compare(r2.getRelevanceScore(), r1.getRelevanceScore()))
                    .limit(limit)
                    .collect(Collectors.toList());
            
            // If we don't have enough recommendations, add fallback ones
            if (recommendations.size() < limit) {
                List<ProductRecommendation> fallback = getFallbackRecommendations(limit - recommendations.size());
                recommendations.addAll(fallback);
            }
            
            return recommendations;
            
        } catch (Exception e) {
            System.err.println("Failed to get personalized recommendations: " + e.getMessage());
            return getFallbackRecommendations(limit);
        }
    }
    
    /**
     * Get recommendations based on product similarity
     */
    public List<ProductRecommendation> getSimilarProducts(Long productId, int limit) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        
        String query = String.format("%s %s %s %s", 
                product.getName(), 
                product.getDescription(),
                product.getCategory().getName(),
                product.getBrand().getName());
        
        try {
            var documents = vectorStoreService.findSimilarProducts(query, limit + 1);
            
            return documents.stream()
                    .map(doc -> {
                        Long id = (Long) doc.getMetadata().get("productId");
                        if (id.equals(productId)) {
                            return null; // Skip the same product
                        }
                        
                        Optional<Product> similarProductOpt = productRepository.findById(id);
                        if (similarProductOpt.isEmpty()) {
                            return null;
                        }
                        
                        Product similarProduct = similarProductOpt.get();
                        double similarity = calculateProductSimilarity(product, similarProduct);
                        String reason = String.format("Similar to %s in %s category", 
                                product.getName(), product.getCategory().getName());
                        
                        return new ProductRecommendation(
                                similarProduct,
                                similarity,
                                reason,
                                RecommendationType.SIMILAR_PRODUCTS
                        );
                    })
                    .filter(Objects::nonNull)
                    .limit(limit)
                    .collect(Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Failed to get similar products: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Get trending products recommendations
     */
    public List<ProductRecommendation> getTrendingProducts(int limit) {
        List<Product> trendingProducts = productRepository.findMostViewedProducts(
                org.springframework.data.domain.PageRequest.of(0, limit));
        
        return trendingProducts.stream()
                .map(product -> new ProductRecommendation(
                        product,
                        0.8, // High relevance for trending
                        "Trending now - " + product.getViewCount() + " views",
                        RecommendationType.TRENDING
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * Get recommendations for users who viewed this product
     */
    public List<ProductRecommendation> getViewedAlsoViewedRecommendations(Long productId, int limit) {
        // This would typically use collaborative filtering
        // For now, we'll use category-based recommendations
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return List.of();
        }
        
        Product product = productOpt.get();
        List<Product> categoryProducts = productRepository.findActiveByCategoryId(product.getCategory().getId());
        
        return categoryProducts.stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(limit)
                .map(p -> new ProductRecommendation(
                        p,
                        0.7,
                        "Others who viewed this also viewed",
                        RecommendationType.COLLABORATIVE
                ))
                .collect(Collectors.toList());
    }
    
    /**
     * Get AI-powered bundle recommendations
     */
    public List<ProductBundle> getBundleRecommendations(Long productId, int limit) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return List.of();
        }
        
        Product product = productOpt.get();
        
        String prompt = """
            Suggest products that would complement this product for a bundle offer:
            
            Product: {productName}
            Category: {category}
            Brand: {brand}
            Description: {description}
            
            Suggest 2-3 complementary products that customers would likely buy together.
            Focus on products that enhance the main product's functionality or user experience.
            
            Return as JSON array with product types/categories.
            """;
        
        try {
            Map<String, Object> variables = Map.of(
                    "productName", product.getName(),
                    "category", product.getCategory().getName(),
                    "brand", product.getBrand().getName(),
                    "description", product.getDescription()
            );
            
            String response = aiService.generateText(prompt, variables);
            
            // Parse AI response and find actual products
            // For now, return category-based bundles
            List<Product> complementaryProducts = productRepository.findActiveByCategoryId(product.getCategory().getId())
                    .stream()
                    .filter(p -> !p.getId().equals(productId))
                    .limit(limit)
                    .toList();
            
            return complementaryProducts.stream()
                    .map(p -> new ProductBundle(
                            List.of(product, p),
                            "Perfect pair for " + product.getCategory().getName(),
                            0.9
                    ))
                    .collect(Collectors.toList());
            
        } catch (Exception e) {
            System.err.println("Failed to generate bundle recommendations: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Get seasonal recommendations using AI
     */
    public List<ProductRecommendation> getSeasonalRecommendations(int limit) {
        String prompt = """
            Based on the current season and time of year, suggest product categories 
            that would be most relevant for e-commerce recommendations.
            
            Consider:
            - Current season
            - Upcoming holidays
            - Seasonal trends
            - Weather considerations
            
            Return 5-10 product categories as comma-separated values.
            """;
        
        try {
            String response = aiService.generateText(prompt);
            
            // Parse categories and find products
            List<String> categories = Arrays.stream(response.split(","))
                    .map(String::trim)
                    .filter(cat -> !cat.isEmpty())
                    .limit(5)
                    .toList();
            
            List<ProductRecommendation> recommendations = new ArrayList<>();
            
            for (String category : categories) {
                // Find products in this category (simplified - would need better category matching)
                List<Product> products = productRepository.findTopRatedProducts(
                        org.springframework.data.domain.PageRequest.of(0, 2));
                
                products.forEach(product -> {
                    if (recommendations.size() < limit) {
                        recommendations.add(new ProductRecommendation(
                                product,
                                0.8,
                                "Perfect for this season",
                                RecommendationType.SEASONAL
                        ));
                    }
                });
            }
            
            return recommendations;
            
        } catch (Exception e) {
            System.err.println("Failed to get seasonal recommendations: " + e.getMessage());
            return getFallbackRecommendations(limit);
        }
    }
    
    /**
     * Calculate relevance score between user and product
     */
    private double calculateRelevanceScore(User user, Product product) {
        double score = 0.0;
        
        // Check interests match - properly handle String fields
        Set<String> userInterests = new HashSet<>();
        
        // Convert user interests from String to Set
        if (user.getInterests() != null && !user.getInterests().isEmpty()) {
            userInterests.addAll(Arrays.asList(user.getInterests().split(",")));
        }
        
        // Convert user preferences from String to Set
        if (user.getPreferences() != null && !user.getPreferences().isEmpty()) {
            userInterests.addAll(Arrays.asList(user.getPreferences().split(",")));
        }
        
        Set<String> productTags = new HashSet<>();
        // Convert product tags from String to Set
        if (product.getTags() != null && !product.getTags().isEmpty()) {
            productTags.addAll(Arrays.asList(product.getTags().split(",")));
        }
        // Convert AI tags from String to Set
        if (product.getAiTags() != null && !product.getAiTags().isEmpty()) {
            productTags.addAll(Arrays.asList(product.getAiTags().split(",")));
        }
        productTags.add(product.getCategory().getName());
        productTags.add(product.getBrand().getName());
        
        // Calculate overlap
        Set<String> intersection = new HashSet<>(userInterests);
        intersection.retainAll(productTags);
        
        if (!userInterests.isEmpty()) {
            score = (double) intersection.size() / userInterests.size();
        }
        
        // Boost score based on product quality
        if (product.getAverageRating() != null && product.getAverageRating() > 4.0) {
            score += 0.1;
        }
        
        if (product.getRecommendationScore() != null) {
            score = (score + product.getRecommendationScore()) / 2;
        }
        
        return Math.min(1.0, score);
    }
    
    /**
     * Calculate similarity between two products
     */
    private double calculateProductSimilarity(Product product1, Product product2) {
        double similarity = 0.0;
        
        // Same category
        if (product1.getCategory().getId().equals(product2.getCategory().getId())) {
            similarity += 0.4;
        }
        
        // Same brand
        if (product1.getBrand().getId().equals(product2.getBrand().getId())) {
            similarity += 0.3;
        }
        
        // Similar price range (within 20%)
        if (product1.getPrice() != null && product2.getPrice() != null) {
            double priceDiff = Math.abs(product1.getPrice().doubleValue() - product2.getPrice().doubleValue());
            double avgPrice = (product1.getPrice().doubleValue() + product2.getPrice().doubleValue()) / 2;
            if (priceDiff / avgPrice <= 0.2) {
                similarity += 0.2;
            }
        }
        
        // Similar tags - handle String fields properly
        Set<String> tags1 = new HashSet<>();
        if (product1.getTags() != null && !product1.getTags().isEmpty()) {
            tags1.addAll(Arrays.asList(product1.getTags().split(",")));
        }
        
        Set<String> tags2 = new HashSet<>();
        if (product2.getTags() != null && !product2.getTags().isEmpty()) {
            tags2.addAll(Arrays.asList(product2.getTags().split(",")));
        }
        
        Set<String> intersection = new HashSet<>(tags1);
        intersection.retainAll(tags2);
        
        if (!tags1.isEmpty() && !tags2.isEmpty()) {
            similarity += 0.1 * intersection.size() / Math.max(tags1.size(), tags2.size());
        }
        
        return Math.min(1.0, similarity);
    }
    
    /**
     * Generate recommendation reason using AI
     */
    private String generateRecommendationReason(User user, Product product) {
        try {
            String prompt = """
                Generate a brief, personalized reason why this product would be recommended to this user:
                
                User interests: {interests}
                Product: {productName}
                Category: {category}
                Brand: {brand}
                
                Create a friendly, 1-sentence explanation (max 100 characters).
                """;
            
            // Handle user interests as String field
            String userInterestsStr = "";
            if (user.getInterests() != null && !user.getInterests().isEmpty()) {
                userInterestsStr = user.getInterests().replace(",", ", ");
            }
            
            Map<String, Object> variables = Map.of(
                    "interests", userInterestsStr,
                    "productName", product.getName(),
                    "category", product.getCategory().getName(),
                    "brand", product.getBrand().getName()
            );
            
            return aiService.generateText(prompt, variables);
            
        } catch (Exception e) {
            return "Recommended based on your interests";
        }
    }
    
    /**
     * Get fallback recommendations when AI fails
     */
    private List<ProductRecommendation> getFallbackRecommendations(int limit) {
        List<Product> popularProducts = productRepository.findBestSellingProducts(
                org.springframework.data.domain.PageRequest.of(0, limit));
        
        return popularProducts.stream()
                .map(product -> new ProductRecommendation(
                        product,
                        0.6,
                        "Popular choice",
                        RecommendationType.POPULAR
                ))
                .collect(Collectors.toList());
    }
    
    // Inner classes
    public static class ProductRecommendation {
        private final Product product;
        private final double relevanceScore;
        private final String reason;
        private final RecommendationType type;
        
        public ProductRecommendation(Product product, double relevanceScore, String reason, RecommendationType type) {
            this.product = product;
            this.relevanceScore = relevanceScore;
            this.reason = reason;
            this.type = type;
        }
        
        public Product getProduct() { return product; }
        public double getRelevanceScore() { return relevanceScore; }
        public String getReason() { return reason; }
        public RecommendationType getType() { return type; }
    }
    
    public static class ProductBundle {
        private final List<Product> products;
        private final String description;
        private final double bundleScore;
        
        public ProductBundle(List<Product> products, String description, double bundleScore) {
            this.products = products;
            this.description = description;
            this.bundleScore = bundleScore;
        }
        
        public List<Product> getProducts() { return products; }
        public String getDescription() { return description; }
        public double getBundleScore() { return bundleScore; }
    }
    
    public enum RecommendationType {
        PERSONALIZED,
        SIMILAR_PRODUCTS,
        TRENDING,
        COLLABORATIVE,
        SEASONAL,
        POPULAR
    }
    
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException(String message) {
            super(message);
        }
    }
} 