package com.example.project.service.ai;

import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.embedding.EmbeddingClient;
import org.springframework.ai.embedding.EmbeddingRequest;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AIService {
    
    @Autowired(required = false)
    private ChatClient chatClient;
    
    @Autowired(required = false)
    private EmbeddingClient embeddingClient;
    
    @Value("${spring.ai.openai.chat.model:gpt-4}")
    private String defaultModel;
    
    @Value("${spring.ai.openai.embedding.model:text-embedding-ada-002}")
    private String embeddingModel;
    
    /**
     * Generate text using AI chat model
     */
    public String generateText(String prompt) {
        return generateText(prompt, Map.of());
    }
    
    /**
     * Generate text using AI chat model with variables
     */
    public String generateText(String prompt, Map<String, Object> variables) {
        try {
            // Return empty string if chatClient is not available
            if (chatClient == null) {
                return "";
            }
            
            PromptTemplate promptTemplate = new PromptTemplate(prompt);
            Prompt finalPrompt = promptTemplate.create(variables);
            
            return chatClient.call(finalPrompt).getResult().getOutput().getContent();
        } catch (Exception e) {
            throw new AIServiceException("Failed to generate text: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate text with system message
     */
    public String generateTextWithSystem(String systemMessage, String userMessage) {
        try {
            // Return empty string if chatClient is not available
            if (chatClient == null) {
                return "";
            }
            
            List<Message> messages = List.of(
                new UserMessage(systemMessage + "\n\n" + userMessage)
            );
            
            Prompt prompt = new Prompt(messages);
            return chatClient.call(prompt).getResult().getOutput().getContent();
        } catch (Exception e) {
            throw new AIServiceException("Failed to generate text with system: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate embeddings for text
     */
    public List<Double> generateEmbedding(String text) {
        try {
            // Return empty list if embeddingClient is not available
            if (embeddingClient == null) {
                return List.of();
            }
            
            EmbeddingRequest request = new EmbeddingRequest(List.of(text), null);
            EmbeddingResponse response = embeddingClient.call(request);
            return response.getResults().get(0).getOutput();
        } catch (Exception e) {
            throw new AIServiceException("Failed to generate embedding: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate embeddings for multiple texts
     */
    public List<List<Double>> generateEmbeddings(List<String> texts) {
        try {
            // Return empty list if embeddingClient is not available
            if (embeddingClient == null) {
                return List.of();
            }
            
            EmbeddingRequest request = new EmbeddingRequest(texts, null);
            EmbeddingResponse response = embeddingClient.call(request);
            return response.getResults().stream()
                    .map(result -> result.getOutput())
                    .toList();
        } catch (Exception e) {
            throw new AIServiceException("Failed to generate embeddings: " + e.getMessage(), e);
        }
    }
    
    /**
     * Analyze sentiment of text
     */
    public SentimentAnalysis analyzeSentiment(String text) {
        String prompt = """
            Analyze the sentiment of the following text and provide:
            1. Sentiment label (POSITIVE, NEGATIVE, NEUTRAL)
            2. Confidence score (0.0 to 1.0)
            3. Brief explanation
            
            Text: "{text}"
            
            Respond in JSON format:
            {
                "sentiment": "POSITIVE/NEGATIVE/NEUTRAL",
                "confidence": 0.95,
                "explanation": "Brief explanation"
            }
            """;
        
        try {
            String response = generateText(prompt, Map.of("text", text));
            return parseSentimentResponse(response);
        } catch (Exception e) {
            throw new AIServiceException("Failed to analyze sentiment: " + e.getMessage(), e);
        }
    }
    
    /**
     * Detect language of text
     */
    public String detectLanguage(String text) {
        String prompt = """
            Detect the language of the following text and return only the language code (e.g., 'en', 'vi', 'fr'):
            
            Text: "{text}"
            """;
        
        try {
            return generateText(prompt, Map.of("text", text)).trim();
        } catch (Exception e) {
            throw new AIServiceException("Failed to detect language: " + e.getMessage(), e);
        }
    }
    
    /**
     * Moderate content for inappropriate content
     */
    public ContentModeration moderateContent(String text) {
        String prompt = """
            Analyze the following text for inappropriate content and provide:
            1. Risk level (LOW, MEDIUM, HIGH, CRITICAL)
            2. Confidence score (0.0 to 1.0)
            3. Detected issues (if any)
            4. Recommendation (APPROVE, REVIEW, REJECT)
            
            Text: "{text}"
            
            Respond in JSON format:
            {
                "riskLevel": "LOW/MEDIUM/HIGH/CRITICAL",
                "confidence": 0.95,
                "issues": ["issue1", "issue2"],
                "recommendation": "APPROVE/REVIEW/REJECT",
                "explanation": "Brief explanation"
            }
            """;
        
        try {
            String response = generateText(prompt, Map.of("text", text));
            return parseModerationResponse(response);
        } catch (Exception e) {
            throw new AIServiceException("Failed to moderate content: " + e.getMessage(), e);
        }
    }
    
    /**
     * Extract entities from text
     */
    public List<String> extractEntities(String text) {
        String prompt = """
            Extract all named entities from the following text.
            Return only the entities as a JSON array of strings.
            
            Text: "{text}"
            
            Example response: ["entity1", "entity2", "entity3"]
            """;
        
        try {
            String response = generateText(prompt, Map.of("text", text));
            return parseEntitiesResponse(response);
        } catch (Exception e) {
            throw new AIServiceException("Failed to extract entities: " + e.getMessage(), e);
        }
    }
    
    /**
     * Generate summary of text
     */
    public String generateSummary(String text, int maxLength) {
        String prompt = """
            Generate a concise summary of the following text in maximum {maxLength} words:
            
            Text: "{text}"
            
            Summary:
            """;
        
        try {
            return generateText(prompt, Map.of("text", text, "maxLength", maxLength));
        } catch (Exception e) {
            throw new AIServiceException("Failed to generate summary: " + e.getMessage(), e);
        }
    }
    
    // Helper methods for parsing AI responses
    private SentimentAnalysis parseSentimentResponse(String response) {
        // TODO: Implement JSON parsing for sentiment analysis
        // For now, return a default response
        return new SentimentAnalysis("NEUTRAL", 0.5, "Default response");
    }
    
    private ContentModeration parseModerationResponse(String response) {
        // TODO: Implement JSON parsing for content moderation
        // For now, return a default response
        return new ContentModeration("LOW", 0.1, List.of(), "APPROVE", "Default response");
    }
    
    private List<String> parseEntitiesResponse(String response) {
        // TODO: Implement JSON parsing for entities
        // For now, return empty list
        return List.of();
    }
    
    // Inner classes for AI responses
    public static class SentimentAnalysis {
        private final String sentiment;
        private final double confidence;
        private final String explanation;
        
        public SentimentAnalysis(String sentiment, double confidence, String explanation) {
            this.sentiment = sentiment;
            this.confidence = confidence;
            this.explanation = explanation;
        }
        
        public String getSentiment() { return sentiment; }
        public double getConfidence() { return confidence; }
        public String getExplanation() { return explanation; }
    }
    
    public static class ContentModeration {
        private final String riskLevel;
        private final double confidence;
        private final List<String> issues;
        private final String recommendation;
        private final String explanation;
        
        public ContentModeration(String riskLevel, double confidence, List<String> issues, 
                               String recommendation, String explanation) {
            this.riskLevel = riskLevel;
            this.confidence = confidence;
            this.issues = issues;
            this.recommendation = recommendation;
            this.explanation = explanation;
        }
        
        public String getRiskLevel() { return riskLevel; }
        public double getConfidence() { return confidence; }
        public List<String> getIssues() { return issues; }
        public String getRecommendation() { return recommendation; }
        public String getExplanation() { return explanation; }
    }
    
    public static class AIServiceException extends RuntimeException {
        public AIServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }
} 