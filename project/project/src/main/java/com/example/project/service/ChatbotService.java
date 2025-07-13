package com.example.project.service;

import com.example.project.entity.ChatSession;
import com.example.project.entity.ChatMessage;
import com.example.project.entity.User;
import com.example.project.entity.Product;
import com.example.project.entity.MessageType;
import com.example.project.entity.ChatSessionStatus;
import com.example.project.repository.ChatSessionRepository;
import com.example.project.repository.ChatMessageRepository;
import com.example.project.repository.UserRepository;
import com.example.project.repository.ProductRepository;
import com.example.project.service.ai.AIService;
import com.example.project.service.ai.VectorStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class ChatbotService {
    
    @Autowired
    private ChatSessionRepository chatSessionRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private AIService aiService;
    
    @Autowired
    private VectorStoreService vectorStoreService;
    
    @Autowired
    private RecommendationService recommendationService;
    
    /**
     * Start new chat session
     */
    public ChatSession startChatSession(Long userId, String initialMessage) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        if (!user.isChatbotEnabled()) {
            throw new ChatbotDisabledException("Chatbot is disabled for this user");
        }
        
        // Create new chat session
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setSessionId(generateSessionId());
        session.setTitle(generateSessionTitle(initialMessage));
        session.setStatus(ChatSessionStatus.ACTIVE);
        
        ChatSession savedSession = chatSessionRepository.save(session);
        
        // Add initial user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setChatSession(savedSession);
        userMessage.setMessageType(MessageType.USER);
        userMessage.setContent(initialMessage);
        
        chatMessageRepository.save(userMessage);
        
        // Generate AI response
        String aiResponse = generateAIResponse(savedSession, initialMessage);
        
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setChatSession(savedSession);
        aiMessage.setMessageType(MessageType.ASSISTANT);
        aiMessage.setContent(aiResponse);
        aiMessage.setAiModel("gpt-4");
        
        chatMessageRepository.save(aiMessage);
        
        return savedSession;
    }
    
    /**
     * Send message to chat session
     */
    public ChatMessage sendMessage(Long sessionId, String message) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new ChatSessionNotFoundException("Chat session not found with id: " + sessionId);
        }
        
        ChatSession session = sessionOpt.get();
        
        if (!session.isActive()) {
            throw new InactiveChatSessionException("Chat session is not active");
        }
        
        // Add user message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setChatSession(session);
        userMessage.setMessageType(MessageType.USER);
        userMessage.setContent(message);
        
        chatMessageRepository.save(userMessage);
        
        // Generate AI response
        String aiResponse = generateAIResponse(session, message);
        
        ChatMessage aiMessage = new ChatMessage();
        aiMessage.setChatSession(session);
        aiMessage.setMessageType(MessageType.ASSISTANT);
        aiMessage.setContent(aiResponse);
        aiMessage.setAiModel("gpt-4");
        
        // Analyze message intent
        analyzeMessageIntent(aiMessage, message);
        
        chatMessageRepository.save(aiMessage);
        
        return aiMessage;
    }
    
    /**
     * Generate AI response using context and user information
     */
    private String generateAIResponse(ChatSession session, String userMessage) {
        try {
            // Build context from chat history
            String conversationHistory = buildConversationHistory(session);
            
            // Get user profile for personalization
            User user = session.getUser();
            String userProfile = buildUserProfile(user);
            
            // Detect intent
            String intent = detectIntent(userMessage);
            
            // Build system prompt based on intent
            String systemPrompt = buildSystemPrompt(intent, userProfile);
            
            String prompt = """
                {systemPrompt}
                
                Conversation History:
                {conversationHistory}
                
                User Message: {userMessage}
                
                Guidelines:
                - Be helpful, friendly, and professional
                - Provide specific product recommendations when appropriate
                - Ask clarifying questions if needed
                - Keep responses concise but informative
                - Use the user's name when appropriate
                - Reference previous conversation context
                
                Response:
                """;
            
            Map<String, Object> variables = Map.of(
                    "systemPrompt", systemPrompt,
                    "conversationHistory", conversationHistory,
                    "userMessage", userMessage
            );
            
            return aiService.generateText(prompt, variables);
            
        } catch (Exception e) {
            System.err.println("Failed to generate AI response: " + e.getMessage());
            return "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.";
        }
    }
    
    /**
     * Build conversation history for context
     */
    private String buildConversationHistory(ChatSession session) {
        StringBuilder history = new StringBuilder();
        
        List<ChatMessage> messages = chatMessageRepository.findByChatSessionIdOrderByCreatedAtDesc(session.getId());
        
        // Get last 10 messages for context
        messages.stream()
                .limit(10)
                .forEach(msg -> {
                    String role = msg.getMessageType() == MessageType.USER ? "User" : "Assistant";
                    history.append(role).append(": ").append(msg.getContent()).append("\n");
                });
        
        return history.toString();
    }
    
    /**
     * Build user profile for personalization
     */
    private String buildUserProfile(User user) {
        StringBuilder profile = new StringBuilder();
        
        profile.append("User: ").append(user.getFullName()).append("\n");
        profile.append("Interests: ").append(String.join(", ", user.getInterests())).append("\n");
        profile.append("Preferences: ").append(String.join(", ", user.getPreferences())).append("\n");
        profile.append("Previous Orders: ").append(user.getOrders().size()).append("\n");
        
        return profile.toString();
    }
    
    /**
     * Detect user intent from message
     */
    private String detectIntent(String message) {
        String prompt = """
            Analyze this customer message and classify the intent:
            
            Message: "{message}"
            
            Possible intents:
            - PRODUCT_INQUIRY (asking about products)
            - PRODUCT_RECOMMENDATION (wanting product suggestions)
            - ORDER_STATUS (asking about order status)
            - SUPPORT_REQUEST (technical support)
            - GENERAL_QUESTION (general information)
            - COMPLAINT (complaint or issue)
            - COMPLIMENT (positive feedback)
            
            Return only the intent category.
            """;
        
        try {
            return aiService.generateText(prompt, Map.of("message", message)).trim();
        } catch (Exception e) {
            return "GENERAL_QUESTION";
        }
    }
    
    /**
     * Build system prompt based on intent
     */
    private String buildSystemPrompt(String intent, String userProfile) {
        String basePrompt = """
            You are a helpful e-commerce customer service assistant. 
            Your role is to help customers with their shopping needs.
            
            User Profile:
            {userProfile}
            
            """;
        
        String intentSpecificPrompt = switch (intent) {
            case "PRODUCT_INQUIRY" -> """
                Focus on providing detailed product information.
                Use specifications, features, and benefits.
                Compare with similar products if helpful.
                """;
            case "PRODUCT_RECOMMENDATION" -> """
                Provide personalized product recommendations.
                Consider the user's interests and preferences.
                Suggest bundles or complementary products.
                """;
            case "ORDER_STATUS" -> """
                Help with order tracking and status inquiries.
                Provide clear information about shipping and delivery.
                Offer solutions for order issues.
                """;
            case "SUPPORT_REQUEST" -> """
                Provide technical support and troubleshooting.
                Offer step-by-step solutions.
                Escalate to human support if needed.
                """;
            case "COMPLAINT" -> """
                Handle complaints with empathy and professionalism.
                Acknowledge the issue and offer solutions.
                Aim to resolve the problem satisfactorily.
                """;
            default -> """
                Provide general assistance and information.
                Be helpful and guide users to what they need.
                """;
        };
        
        return basePrompt.replace("{userProfile}", userProfile) + intentSpecificPrompt;
    }
    
    /**
     * Analyze message intent and extract entities
     */
    private void analyzeMessageIntent(ChatMessage message, String userMessage) {
        try {
            // Extract entities
            List<String> entities = aiService.extractEntities(userMessage);
            message.setEntities(String.join(",", entities));
            
            // Analyze confidence
            String prompt = """
                Rate your confidence in this response on a scale of 0.0 to 1.0:
                
                User Message: {userMessage}
                AI Response: {aiResponse}
                
                Return only the confidence score as a number.
                """;
            
            Map<String, Object> variables = Map.of(
                    "userMessage", userMessage,
                    "aiResponse", message.getContent()
            );
            
            String confidenceStr = aiService.generateText(prompt, variables);
            try {
                double confidence = Double.parseDouble(confidenceStr.trim());
                message.setConfidenceScore(confidence);
            } catch (NumberFormatException e) {
                message.setConfidenceScore(0.8); // Default confidence
            }
            
        } catch (Exception e) {
            System.err.println("Failed to analyze message intent: " + e.getMessage());
        }
    }
    
    /**
     * Get product recommendations for chat
     */
    public List<Product> getChatProductRecommendations(Long sessionId, String query) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            return List.of();
        }
        
        ChatSession session = sessionOpt.get();
        User user = session.getUser();
        
        try {
            // Use recommendation service to get personalized recommendations
            var recommendations = recommendationService.getPersonalizedRecommendations(user.getId(), 5);
            
            return recommendations.stream()
                    .map(rec -> rec.getProduct())
                    .toList();
            
        } catch (Exception e) {
            System.err.println("Failed to get chat recommendations: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * End chat session
     */
    public void endChatSession(Long sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new ChatSessionNotFoundException("Chat session not found with id: " + sessionId);
        }
        
        ChatSession session = sessionOpt.get();
        session.endSession();
        
        chatSessionRepository.save(session);
    }
    
    /**
     * Get chat session with messages
     */
    public ChatSessionDetails getChatSessionDetails(Long sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new ChatSessionNotFoundException("Chat session not found with id: " + sessionId);
        }
        
        ChatSession session = sessionOpt.get();
        List<ChatMessage> messages = chatMessageRepository.findByChatSessionIdOrderByCreatedAtAsc(session.getId());
        
        return new ChatSessionDetails(session, messages);
    }
    
    /**
     * Get user chat sessions
     */
    public List<ChatSession> getUserChatSessions(Long userId) {
        return chatSessionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    /**
     * Generate session ID
     */
    private String generateSessionId() {
        return "CHAT-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
    }
    
    /**
     * Generate session title from initial message
     */
    private String generateSessionTitle(String initialMessage) {
        try {
            String prompt = """
                Generate a short, descriptive title for this chat session based on the initial message:
                
                Message: "{message}"
                
                Title should be 3-6 words, describing the main topic.
                """;
            
            return aiService.generateText(prompt, Map.of("message", initialMessage));
        } catch (Exception e) {
            return "Customer Support Chat";
        }
    }
    
    // Inner classes and exceptions
    public static class ChatSessionDetails {
        private final ChatSession session;
        private final List<ChatMessage> messages;
        
        public ChatSessionDetails(ChatSession session, List<ChatMessage> messages) {
            this.session = session;
            this.messages = messages;
        }
        
        public ChatSession getSession() { return session; }
        public List<ChatMessage> getMessages() { return messages; }
    }
    
    public static class ChatSessionNotFoundException extends RuntimeException {
        public ChatSessionNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class ChatbotDisabledException extends RuntimeException {
        public ChatbotDisabledException(String message) {
            super(message);
        }
    }
    
    public static class InactiveChatSessionException extends RuntimeException {
        public InactiveChatSessionException(String message) {
            super(message);
        }
    }
} 