package com.example.project.ai;

import com.example.project.entity.Product;
import com.example.project.entity.User;
import com.example.project.entity.UserBehavior;
import com.example.project.entity.BehaviorType;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class AIEnterpriseService {
    
    @Autowired(required = false)
    private ChatClient chatClient;
    
    @Autowired(required = false)
    private EmbeddingClient embeddingClient;
    
    @Autowired(required = false)
    private WebClient webClient;
    
    @Value("${ai.service.content-generation.enabled:true}")
    private boolean contentGenerationEnabled;
    
    @Value("${ai.service.recommendation.enabled:true}")
    private boolean recommendationEnabled;
    
    @Value("${ai.service.chatbot.enabled:true}")
    private boolean chatbotEnabled;
    
    @Value("${ai.service.fraud-detection.enabled:true}")
    private boolean fraudDetectionEnabled;
    
    @Value("${ai.service.inventory-forecasting.enabled:true}")
    private boolean inventoryForecastingEnabled;
    
    /**
     * Generate text using AI with variables
     */
    public String generateText(String prompt, Map<String, Object> variables) {
        try {
            // Return empty string if chatClient is not available
            if (chatClient == null) {
                return "";
            }
            
            // Replace variables in prompt
            String processedPrompt = processPromptVariables(prompt, variables);
            
            Message message = new UserMessage(processedPrompt);
            Prompt chatPrompt = new Prompt(List.of(message));
            ChatResponse response = chatClient.call(chatPrompt);
            
            return response.getResult().getOutput().getContent();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate text", e);
        }
    }
    
    /**
     * Generate text using AI with simple string prompt
     */
    public String generateText(String prompt) {
        try {
            // Return empty string if chatClient is not available
            if (chatClient == null) {
                return "";
            }
            
            Message message = new UserMessage(prompt);
            Prompt chatPrompt = new Prompt(List.of(message));
            ChatResponse response = chatClient.call(chatPrompt);
            
            return response.getResult().getOutput().getContent();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate text", e);
        }
    }
    
    /**
     * Process prompt variables - replace {variable} with actual values
     */
    private String processPromptVariables(String prompt, Map<String, Object> variables) {
        String processedPrompt = prompt;
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String placeholder = "{" + entry.getKey() + "}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            processedPrompt = processedPrompt.replace(placeholder, value);
        }
        return processedPrompt;
    }

    // Content Generation Service
    public CompletableFuture<String> generateProductDescription(Product product) {
        if (!contentGenerationEnabled) {
            return CompletableFuture.completedFuture(null);
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                String prompt = String.format(
                    "Generate a compelling product description for: %s\n" +
                    "Category: %s\n" +
                    "Brand: %s\n" +
                    "Price: $%.2f\n" +
                    "Current Description: %s\n\n" +
                    "Please create a detailed, SEO-friendly product description that highlights key features and benefits. " +
                    "Make it engaging for online shoppers and include relevant keywords.",
                    product.getName(),
                    product.getCategory() != null ? product.getCategory().getName() : "Unknown",
                    product.getBrand() != null ? product.getBrand().getName() : "Unknown",
                    product.getPrice(),
                    product.getDescription()
                );
                
                Message message = new UserMessage(prompt);
                Prompt chatPrompt = new Prompt(List.of(message));
                ChatResponse response = chatClient.call(chatPrompt);
                
                return response.getResult().getOutput().getContent();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate product description", e);
            }
        });
    }
    
    public CompletableFuture<List<String>> generateProductTags(Product product) {
        if (!contentGenerationEnabled) {
            return CompletableFuture.completedFuture(List.of());
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                String prompt = String.format(
                    "Generate 10 relevant tags for this product: %s\n" +
                    "Description: %s\n" +
                    "Category: %s\n" +
                    "Brand: %s\n\n" +
                    "Return only the tags as a comma-separated list, no explanations.",
                    product.getName(),
                    product.getDescription(),
                    product.getCategory() != null ? product.getCategory().getName() : "Unknown",
                    product.getBrand() != null ? product.getBrand().getName() : "Unknown"
                );
                
                Message message = new UserMessage(prompt);
                Prompt chatPrompt = new Prompt(List.of(message));
                ChatResponse response = chatClient.call(chatPrompt);
                
                String tagsString = response.getResult().getOutput().getContent();
                return List.of(tagsString.split(",\\s*"));
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate product tags", e);
            }
        });
    }
    
    // Vector Operations Service
    public CompletableFuture<String> generateEmbedding(String text) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                EmbeddingResponse response = embeddingClient.embedForResponse(List.of(text));
                List<Double> embedding = response.getResults().get(0).getOutput();
                
                // Convert to string representation for storage
                return embedding.toString();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate embedding", e);
            }
        });
    }
    
    public CompletableFuture<List<Product>> findSimilarProducts(String embedding, int limit) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                // This would typically use vector database search
                // For now, returning empty list as placeholder
                return List.of();
            } catch (Exception e) {
                throw new RuntimeException("Failed to find similar products", e);
            }
        });
    }
    
    // Recommendation Service
    public CompletableFuture<List<Product>> generatePersonalizedRecommendations(User user, int limit) {
        if (!recommendationEnabled) {
            return CompletableFuture.completedFuture(List.of());
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                // Generate user behavior summary
                String userProfile = generateUserProfile(user);
                
                String prompt = String.format(
                    "Based on this user profile, recommend products that would be most interesting:\n" +
                    "User Profile: %s\n" +
                    "User Preferences: %s\n" +
                    "User Interests: %s\n\n" +
                    "Provide product recommendations with reasoning.",
                    userProfile,
                    user.getPreferences().toString(),
                    user.getInterests().toString()
                );
                
                Message message = new UserMessage(prompt);
                Prompt chatPrompt = new Prompt(List.of(message));
                ChatResponse response = chatClient.call(chatPrompt);
                
                // This would typically parse the response and return actual products
                // For now, returning empty list as placeholder
                return List.of();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate personalized recommendations", e);
            }
        });
    }
    
    private String generateUserProfile(User user) {
        StringBuilder profile = new StringBuilder();
        profile.append("User: ").append(user.getUsername()).append("\n");
        profile.append("Registration Date: ").append(user.getCreatedAt()).append("\n");
        profile.append("Total Orders: ").append(user.getOrders().size()).append("\n");
        profile.append("Active User: ").append(user.isActive()).append("\n");
        
        // Add behavior analysis
        Map<String, Long> behaviorCounts = user.getBehaviors().stream()
            .collect(Collectors.groupingBy(
                behavior -> behavior.getBehaviorType().name(),
                Collectors.counting()
            ));
        
        profile.append("Behavior Summary: ").append(behaviorCounts.toString()).append("\n");
        
        return profile.toString();
    }
    
    // Chatbot Service
    public CompletableFuture<String> generateChatbotResponse(String userMessage, String conversationHistory) {
        if (!chatbotEnabled) {
            return CompletableFuture.completedFuture("I'm sorry, but the chatbot service is currently unavailable.");
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                String prompt = String.format(
                    "You are a helpful e-commerce assistant. Your personality is friendly, professional, and knowledgeable about products.\n" +
                    "Conversation History:\n%s\n\n" +
                    "User Message: %s\n\n" +
                    "Please provide a helpful response. If the user is asking about products, try to be specific and helpful. " +
                    "If you don't know something, be honest about it and offer to help in other ways.",
                    conversationHistory,
                    userMessage
                );
                
                Message message = new UserMessage(prompt);
                Prompt chatPrompt = new Prompt(List.of(message));
                ChatResponse response = chatClient.call(chatPrompt);
                
                return response.getResult().getOutput().getContent();
            } catch (Exception e) {
                throw new RuntimeException("Failed to generate chatbot response", e);
            }
        });
    }
    
    // Fraud Detection Service
    public CompletableFuture<FraudAnalysisResult> analyzeFraudRisk(Map<String, Object> orderData) {
        if (!fraudDetectionEnabled) {
            return CompletableFuture.completedFuture(new FraudAnalysisResult(0.0, "Low", "Fraud detection disabled"));
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                String prompt = String.format(
                    "Analyze this order for potential fraud indicators:\n" +
                    "Order Data: %s\n\n" +
                    "Consider factors like:\n" +
                    "- Unusual purchasing patterns\n" +
                    "- Billing/shipping address mismatches\n" +
                    "- High-value orders from new accounts\n" +
                    "- Multiple orders in short time periods\n" +
                    "- Suspicious email domains\n\n" +
                    "Provide a risk score (0-1), risk level (Low/Medium/High/Critical), and analysis summary.",
                    orderData.toString()
                );
                
                Message message = new UserMessage(prompt);
                Prompt chatPrompt = new Prompt(List.of(message));
                ChatResponse response = chatClient.call(chatPrompt);
                
                String analysis = response.getResult().getOutput().getContent();
                
                // Parse the response to extract risk score and level
                // This is a simplified implementation
                double riskScore = parseRiskScore(analysis);
                String riskLevel = parseRiskLevel(analysis);
                
                return new FraudAnalysisResult(riskScore, riskLevel, analysis);
            } catch (Exception e) {
                throw new RuntimeException("Failed to analyze fraud risk", e);
            }
        });
    }
    
    private double parseRiskScore(String analysis) {
        // Simple regex to find risk score
        // In a real implementation, this would be more sophisticated
        if (analysis.toLowerCase().contains("high")) return 0.8;
        if (analysis.toLowerCase().contains("medium")) return 0.5;
        if (analysis.toLowerCase().contains("low")) return 0.2;
        return 0.1;
    }
    
    private String parseRiskLevel(String analysis) {
        if (analysis.toLowerCase().contains("critical")) return "Critical";
        if (analysis.toLowerCase().contains("high")) return "High";
        if (analysis.toLowerCase().contains("medium")) return "Medium";
        return "Low";
    }
    
    // Inventory Forecasting Service
    public CompletableFuture<InventoryForecast> forecastInventoryDemand(Long productId, int days) {
        if (!inventoryForecastingEnabled) {
            return CompletableFuture.completedFuture(new InventoryForecast(0, 0, "Inventory forecasting disabled"));
        }
        
        return CompletableFuture.supplyAsync(() -> {
            try {
                // This would typically use historical sales data
                // For now, returning a simple forecast
                return new InventoryForecast(50, 10, "Based on historical trends");
            } catch (Exception e) {
                throw new RuntimeException("Failed to forecast inventory demand", e);
            }
        });
    }
    
    // Helper classes for AI responses
    public static class FraudAnalysisResult {
        private final double riskScore;
        private final String riskLevel;
        private final String analysis;
        
        public FraudAnalysisResult(double riskScore, String riskLevel, String analysis) {
            this.riskScore = riskScore;
            this.riskLevel = riskLevel;
            this.analysis = analysis;
        }
        
        public double getRiskScore() { return riskScore; }
        public String getRiskLevel() { return riskLevel; }
        public String getAnalysis() { return analysis; }
    }
    
    public static class InventoryForecast {
        private final int forecastedDemand;
        private final int recommendedStock;
        private final String analysis;
        
        public InventoryForecast(int forecastedDemand, int recommendedStock, String analysis) {
            this.forecastedDemand = forecastedDemand;
            this.recommendedStock = recommendedStock;
            this.analysis = analysis;
        }
        
        public int getForecastedDemand() { return forecastedDemand; }
        public int getRecommendedStock() { return recommendedStock; }
        public String getAnalysis() { return analysis; }
    }
} 