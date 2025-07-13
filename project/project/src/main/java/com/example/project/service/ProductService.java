package com.example.project.service;

import com.example.project.entity.Product;
import com.example.project.entity.Brand;
import com.example.project.entity.Category;
import com.example.project.repository.ProductRepository;
import com.example.project.service.ai.AIService;
import com.example.project.service.ai.AIContentService;
import com.example.project.service.ai.VectorStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private AIContentService aiContentService;
    
    @Autowired
    private VectorStoreService vectorStoreService;
    
    /**
     * Create new product with AI-generated content
     */
    public Product createProduct(String name, String description, String sku, 
                                BigDecimal price, Category category, Brand brand,
                                List<String> features, List<String> specifications) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setSku(sku);
        product.setPrice(price);
        product.setCategory(category);
        product.setBrand(brand);
        product.setActive(true);
        
        // Generate AI-enhanced content
        enhanceProductWithAI(product, features, specifications);
        
        Product savedProduct = productRepository.save(product);
        
        // Store in vector database for recommendations
        storeProductInVectorDB(savedProduct);
        
        return savedProduct;
    }
    
    /**
     * Enhance product with AI-generated content
     */
    private void enhanceProductWithAI(Product product, List<String> features, 
                                     List<String> specifications) {
        try {
            // Generate AI-enhanced product description
            String aiDescription = aiContentService.generateProductDescription(
                    product.getName(),
                    product.getCategory().getName(),
                    product.getBrand().getName(),
                    features,
                    specifications
            );
            product.setAiGeneratedDescription(aiDescription);
            
            // Generate SEO-friendly meta title
            List<String> keywords = List.of(
                    product.getName().toLowerCase(),
                    product.getCategory().getName().toLowerCase(),
                    product.getBrand().getName().toLowerCase()
            );
            
            String metaTitle = aiContentService.generateSEOTitle(
                    product.getName(),
                    product.getCategory().getName(),
                    product.getBrand().getName(),
                    keywords
            );
            product.setMetaTitle(metaTitle);
            
            // Generate meta description
            String metaDescription = aiContentService.generateMetaDescription(
                    product.getName(),
                    product.getCategory().getName(),
                    product.getBrand().getName(),
                    product.getDescription()
            );
            product.setMetaDescription(metaDescription);
            
            // Generate AI tags
            List<String> aiTags = aiContentService.generateProductTags(
                    product.getName(),
                    product.getCategory().getName(),
                    product.getBrand().getName(),
                    product.getDescription()
            );
            product.setAiTags(new HashSet<>(aiTags));
            
            // Calculate AI content score (quality metric)
            double contentScore = calculateContentScore(product);
            product.setAiContentScore(contentScore);
            
        } catch (Exception e) {
            System.err.println("Failed to enhance product with AI: " + e.getMessage());
        }
    }
    
    /**
     * Calculate content quality score using AI
     */
    private double calculateContentScore(Product product) {
        try {
            String prompt = """
                Analyze this product information and rate the content quality from 0.0 to 1.0:
                
                Product Name: {name}
                Description: {description}
                AI Description: {aiDescription}
                Category: {category}
                Brand: {brand}
                
                Consider:
                - Completeness of information
                - Clarity and readability
                - SEO optimization
                - Marketing appeal
                
                Return only a number between 0.0 and 1.0.
                """;
            
            Map<String, Object> variables = Map.of(
                    "name", product.getName(),
                    "description", product.getDescription(),
                    "aiDescription", product.getAiGeneratedDescription() != null ? product.getAiGeneratedDescription() : "",
                    "category", product.getCategory().getName(),
                    "brand", product.getBrand().getName()
            );
            
            String response = aiService.generateText(prompt, variables);
            
            try {
                return Double.parseDouble(response.trim());
            } catch (NumberFormatException e) {
                return 0.5; // Default score if parsing fails
            }
            
        } catch (Exception e) {
            return 0.5; // Default score if AI fails
        }
    }
    
    /**
     * Store product in vector database for recommendations
     */
    private void storeProductInVectorDB(Product product) {
        try {
            List<String> tags = new ArrayList<>();
            tags.addAll(product.getTags());
            if (product.getAiTags() != null) {
                tags.addAll(product.getAiTags());
            }
            
            vectorStoreService.storeProductEmbedding(
                    product.getId(),
                    product.getName(),
                    product.getDescription(),
                    product.getCategory().getName(),
                    product.getBrand().getName(),
                    tags
            );
        } catch (Exception e) {
            System.err.println("Failed to store product in vector DB: " + e.getMessage());
        }
    }
    
    /**
     * Update product with AI re-enhancement
     */
    public Product updateProduct(Long productId, String name, String description, 
                                BigDecimal price, List<String> features, 
                                List<String> specifications) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        
        // Re-enhance with AI
        enhanceProductWithAI(product, features, specifications);
        
        Product savedProduct = productRepository.save(product);
        
        // Update vector store
        storeProductInVectorDB(savedProduct);
        
        return savedProduct;
    }
    
    /**
     * Generate product comparison using AI
     */
    public ProductComparison compareProducts(Long productId1, Long productId2) {
        Optional<Product> product1Opt = productRepository.findById(productId1);
        Optional<Product> product2Opt = productRepository.findById(productId2);
        
        if (product1Opt.isEmpty() || product2Opt.isEmpty()) {
            throw new ProductNotFoundException("One or both products not found");
        }
        
        Product product1 = product1Opt.get();
        Product product2 = product2Opt.get();
        
        try {
            String comparison = aiContentService.generateProductComparison(
                    product1.getName() + " - " + product1.getDescription(),
                    product2.getName() + " - " + product2.getDescription(),
                    product1.getCategory().getName(),
                    List.of("price", "features", "quality", "brand reputation", "specifications")
            );
            
            return new ProductComparison(product1, product2, comparison);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate product comparison: " + e.getMessage());
        }
    }
    
    /**
     * Generate product FAQ using AI
     */
    public String generateProductFAQ(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        
        List<String> commonQuestions = List.of(
                "What are the key features?",
                "How to use this product?",
                "What is the warranty?",
                "Is it compatible with...?",
                "What's included in the box?",
                "How to maintain/clean it?",
                "What are the dimensions?",
                "Is it suitable for beginners?"
        );
        
        return aiContentService.generateProductFAQ(
                product.getName(),
                product.getCategory().getName(),
                product.getDescription(),
                commonQuestions
        );
    }
    
    /**
     * Generate marketing content for product
     */
    public MarketingContent generateMarketingContent(Long productId, String targetAudience, 
                                                    String specialOffer) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        
        // Generate email marketing content
        String emailContent = aiContentService.generateEmailMarketing(
                product.getName(),
                product.getCategory().getName(),
                product.getBrand().getName(),
                specialOffer,
                targetAudience
        );
        
        // Generate social media content
        String hashtags = "#" + product.getBrand().getName().toLowerCase() + 
                         " #" + product.getCategory().getName().toLowerCase() + 
                         " #" + product.getName().toLowerCase().replace(" ", "");
        
        var socialContent = aiContentService.generateSocialMediaPosts(
                product.getName(),
                product.getCategory().getName(),
                product.getBrand().getName(),
                hashtags
        );
        
        return new MarketingContent(emailContent, socialContent);
    }
    
    /**
     * Analyze product sentiment from reviews
     */
    public ProductSentimentAnalysis analyzeProductSentiment(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        
        // Aggregate all review content
        StringBuilder reviewContent = new StringBuilder();
        product.getReviews().forEach(review -> {
            reviewContent.append(review.getContent()).append(" ");
        });
        
        if (reviewContent.length() == 0) {
            return new ProductSentimentAnalysis("NEUTRAL", 0.0, "No reviews available");
        }
        
        try {
            var sentiment = aiService.analyzeSentiment(reviewContent.toString());
            return new ProductSentimentAnalysis(
                    sentiment.getSentiment(),
                    sentiment.getConfidence(),
                    sentiment.getExplanation()
            );
        } catch (Exception e) {
            return new ProductSentimentAnalysis("NEUTRAL", 0.0, "Analysis failed");
        }
    }
    
    /**
     * Get similar products using AI
     */
    public List<Product> getSimilarProducts(Long productId, int limit) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        
        String query = product.getName() + " " + product.getDescription() + " " + 
                      product.getCategory().getName() + " " + product.getBrand().getName();
        
        try {
            var documents = vectorStoreService.findSimilarProducts(query, limit + 1);
            
            return documents.stream()
                    .map(doc -> {
                        Long id = (Long) doc.getMetadata().get("productId");
                        return productRepository.findById(id).orElse(null);
                    })
                    .filter(Objects::nonNull)
                    .filter(p -> !p.getId().equals(productId)) // Exclude the same product
                    .limit(limit)
                    .toList();
        } catch (Exception e) {
            System.err.println("Failed to get similar products: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Search products by text query
     */
    public Page<Product> searchProducts(String query, Pageable pageable) {
        return productRepository.findByNameContainingOrDescriptionContaining(query, query, pageable);
    }
    
    /**
     * Get product by ID
     */
    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }
    
    /**
     * Get all active products
     */
    public Page<Product> findAllActive(Pageable pageable) {
        return productRepository.findByIsActiveTrue(pageable);
    }
    
    /**
     * Get products by category
     */
    public Page<Product> findByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }
    
    /**
     * Delete product
     */
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
        // TODO: Also remove from vector store
    }
    
    // Inner classes for responses
    public static class ProductComparison {
        private final Product product1;
        private final Product product2;
        private final String comparison;
        
        public ProductComparison(Product product1, Product product2, String comparison) {
            this.product1 = product1;
            this.product2 = product2;
            this.comparison = comparison;
        }
        
        public Product getProduct1() { return product1; }
        public Product getProduct2() { return product2; }
        public String getComparison() { return comparison; }
    }
    
    public static class MarketingContent {
        private final String emailContent;
        private final AIContentService.SocialMediaContent socialContent;
        
        public MarketingContent(String emailContent, AIContentService.SocialMediaContent socialContent) {
            this.emailContent = emailContent;
            this.socialContent = socialContent;
        }
        
        public String getEmailContent() { return emailContent; }
        public AIContentService.SocialMediaContent getSocialContent() { return socialContent; }
    }
    
    public static class ProductSentimentAnalysis {
        private final String sentiment;
        private final double confidence;
        private final String explanation;
        
        public ProductSentimentAnalysis(String sentiment, double confidence, String explanation) {
            this.sentiment = sentiment;
            this.confidence = confidence;
            this.explanation = explanation;
        }
        
        public String getSentiment() { return sentiment; }
        public double getConfidence() { return confidence; }
        public String getExplanation() { return explanation; }
    }
    
    public static class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException(String message) {
            super(message);
        }
    }
} 