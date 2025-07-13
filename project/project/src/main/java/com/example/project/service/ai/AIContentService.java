package com.example.project.service.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AIContentService {
    
    @Autowired
    private AIService aiService;
    
    /**
     * Generate product description using AI
     */
    public String generateProductDescription(String productName, String category, String brand, 
                                           List<String> features, List<String> specifications) {
        String prompt = """
            Generate a compelling product description for an e-commerce website based on the following information:
            
            Product Name: {productName}
            Category: {category}
            Brand: {brand}
            Features: {features}
            Specifications: {specifications}
            
            Requirements:
            - Write in a professional, engaging tone
            - Highlight key features and benefits
            - Include relevant keywords for SEO
            - Keep it between 150-300 words
            - Focus on customer benefits
            
            Product Description:
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "brand", brand,
                "features", String.join(", ", features),
                "specifications", String.join(", ", specifications)
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    /**
     * Generate SEO-friendly product title
     */
    public String generateSEOTitle(String productName, String category, String brand, 
                                  List<String> keywords) {
        String prompt = """
            Generate an SEO-friendly product title for an e-commerce website:
            
            Product Name: {productName}
            Category: {category}
            Brand: {brand}
            Keywords: {keywords}
            
            Requirements:
            - Maximum 60 characters
            - Include relevant keywords
            - Professional and appealing
            - Optimized for search engines
            
            SEO Title:
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "brand", brand,
                "keywords", String.join(", ", keywords)
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    /**
     * Generate meta description for SEO
     */
    public String generateMetaDescription(String productName, String category, String brand, 
                                        String description) {
        String prompt = """
            Generate a compelling meta description for SEO based on the product information:
            
            Product Name: {productName}
            Category: {category}
            Brand: {brand}
            Description: {description}
            
            Requirements:
            - Maximum 160 characters
            - Include call-to-action
            - Mention key benefits
            - Optimized for search engines
            
            Meta Description:
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "brand", brand,
                "description", description
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    /**
     * Generate product tags for better categorization
     */
    public List<String> generateProductTags(String productName, String category, String brand, 
                                          String description) {
        String prompt = """
            Generate relevant tags for this product to improve categorization and searchability:
            
            Product Name: {productName}
            Category: {category}
            Brand: {brand}
            Description: {description}
            
            Generate 5-10 relevant tags as a comma-separated list.
            Focus on: materials, features, use cases, style, target audience
            
            Tags:
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "brand", brand,
                "description", description
        );
        
        String response = aiService.generateText(prompt, variables);
        
        // Parse comma-separated tags
        return List.of(response.split(","))
                .stream()
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .toList();
    }
    
    /**
     * Generate product comparison content
     */
    public String generateProductComparison(String product1, String product2, 
                                          String category, List<String> comparisonPoints) {
        String prompt = """
            Generate a detailed comparison between two products:
            
            Product 1: {product1}
            Product 2: {product2}
            Category: {category}
            Comparison Points: {comparisonPoints}
            
            Create a comprehensive comparison that helps customers make informed decisions.
            Include pros and cons for each product.
            
            Comparison:
            """;
        
        Map<String, Object> variables = Map.of(
                "product1", product1,
                "product2", product2,
                "category", category,
                "comparisonPoints", String.join(", ", comparisonPoints)
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    /**
     * Generate product FAQ based on features and common questions
     */
    public String generateProductFAQ(String productName, String category, String description, 
                                    List<String> commonQuestions) {
        String prompt = """
            Generate a comprehensive FAQ section for this product:
            
            Product Name: {productName}
            Category: {category}
            Description: {description}
            Common Questions: {commonQuestions}
            
            Generate 8-10 frequently asked questions with detailed answers.
            Focus on: specifications, usage, maintenance, compatibility, warranty
            
            FAQ:
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "description", description,
                "commonQuestions", String.join(", ", commonQuestions)
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    /**
     * Generate email marketing content for product promotion
     */
    public String generateEmailMarketing(String productName, String category, String brand, 
                                       String offer, String targetAudience) {
        String prompt = """
            Generate compelling email marketing content for product promotion:
            
            Product Name: {productName}
            Category: {category}
            Brand: {brand}
            Special Offer: {offer}
            Target Audience: {targetAudience}
            
            Create an engaging email that includes:
            - Catchy subject line
            - Compelling product benefits
            - Clear call-to-action
            - Sense of urgency
            
            Email Content:
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "brand", brand,
                "offer", offer,
                "targetAudience", targetAudience
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    /**
     * Generate social media posts for product promotion
     */
    public SocialMediaContent generateSocialMediaPosts(String productName, String category, 
                                                      String brand, String hashtags) {
        String facebookPrompt = """
            Generate a Facebook post for product promotion:
            
            Product: {productName}
            Category: {category}
            Brand: {brand}
            Hashtags: {hashtags}
            
            Create engaging Facebook post (max 250 characters) with emojis.
            """;
        
        String twitterPrompt = """
            Generate a Twitter post for product promotion:
            
            Product: {productName}
            Category: {category}
            Brand: {brand}
            Hashtags: {hashtags}
            
            Create catchy Twitter post (max 280 characters) with hashtags.
            """;
        
        String instagramPrompt = """
            Generate an Instagram caption for product promotion:
            
            Product: {productName}
            Category: {category}
            Brand: {brand}
            Hashtags: {hashtags}
            
            Create engaging Instagram caption with emojis and hashtags.
            """;
        
        Map<String, Object> variables = Map.of(
                "productName", productName,
                "category", category,
                "brand", brand,
                "hashtags", hashtags
        );
        
        String facebookPost = aiService.generateText(facebookPrompt, variables);
        String twitterPost = aiService.generateText(twitterPrompt, variables);
        String instagramPost = aiService.generateText(instagramPrompt, variables);
        
        return new SocialMediaContent(facebookPost, twitterPost, instagramPost);
    }
    
    /**
     * Generate product review response template
     */
    public String generateReviewResponse(String reviewContent, int rating, String productName, 
                                       String brandName, boolean isPositive) {
        String prompt = """
            Generate a professional response to a customer product review:
            
            Review Content: {reviewContent}
            Rating: {rating}/5
            Product: {productName}
            Brand: {brandName}
            Review Type: {reviewType}
            
            Create a {tone} response that:
            - Thanks the customer
            - Addresses their concerns (if negative)
            - Maintains professional tone
            - Encourages future purchases
            
            Response:
            """;
        
        Map<String, Object> variables = Map.of(
                "reviewContent", reviewContent,
                "rating", rating,
                "productName", productName,
                "brandName", brandName,
                "reviewType", isPositive ? "positive" : "negative",
                "tone", isPositive ? "appreciative" : "empathetic and solution-focused"
        );
        
        return aiService.generateText(prompt, variables);
    }
    
    // Inner classes
    public static class SocialMediaContent {
        private final String facebookPost;
        private final String twitterPost;
        private final String instagramPost;
        
        public SocialMediaContent(String facebookPost, String twitterPost, String instagramPost) {
            this.facebookPost = facebookPost;
            this.twitterPost = twitterPost;
            this.instagramPost = instagramPost;
        }
        
        public String getFacebookPost() { return facebookPost; }
        public String getTwitterPost() { return twitterPost; }
        public String getInstagramPost() { return instagramPost; }
    }
} 