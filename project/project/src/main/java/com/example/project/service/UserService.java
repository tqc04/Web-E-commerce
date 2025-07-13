package com.example.project.service;

import com.example.project.entity.User;
import com.example.project.entity.UserBehavior;
import com.example.project.entity.BehaviorType;
import com.example.project.repository.UserRepository;
import com.example.project.ai.AIEnterpriseService;
import com.example.project.service.ai.VectorStoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AIEnterpriseService aiService;
    
    @Autowired
    private VectorStoreService vectorStoreService;
    
    /**
     * Create new user with AI-powered preference initialization
     */
    public User createUser(String username, String email, String password, 
                          String firstName, String lastName) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setActive(true);
        user.setPersonalizationEnabled(true);
        user.setRecommendationEnabled(true);
        user.setChatbotEnabled(true);
        
        User savedUser = userRepository.save(user);
        
        // Initialize AI-powered user profile
        initializeUserAIProfile(savedUser);
        
        return savedUser;
    }
    
    /**
     * Initialize AI-powered user profile based on basic information
     */
    private void initializeUserAIProfile(User user) {
        try {
            // Generate initial interests based on user's basic info
            String userInfo = String.format("%s %s", 
                    user.getFirstName() != null ? user.getFirstName() : "",
                    user.getLastName() != null ? user.getLastName() : "");
            
            // Use AI to suggest initial interests (this is basic - in real app, you'd use more sophisticated methods)
            String prompt = String.format("""
                Based on the user's basic information, suggest 5-10 initial product interests/preferences 
                that would be relevant for an e-commerce platform. Return as comma-separated values.
                
                User info: %s
                
                Focus on general categories like: electronics, fashion, home, books, sports, etc.
                """, userInfo);
            
            String response = aiService.generateText(prompt);
            
            // Parse and set initial interests
            List<String> interests = Arrays.stream(response.split(","))
                    .map(String::trim)
                    .filter(interest -> !interest.isEmpty())
                    .limit(10)
                    .toList();
            
            user.setInterests(new HashSet<>(interests));
            userRepository.save(user);
            
        } catch (Exception e) {
            // Log error but don't fail user creation
            System.err.println("Failed to initialize AI profile for user: " + e.getMessage());
        }
    }
    
    /**
     * Update user preferences with AI analysis
     */
    public void updateUserPreferences(Long userId, List<String> explicitPreferences) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        // Combine explicit preferences with AI-analyzed preferences
        Set<String> combinedPreferences = new HashSet<>(explicitPreferences);
        
        // Use AI to analyze and enhance preferences
        String prompt = String.format("""
            Analyze these user preferences and suggest 3-5 additional related preferences 
            that would be relevant for product recommendations:
            
            Current preferences: %s
            
            Return additional preferences as comma-separated values.
            """, String.join(", ", explicitPreferences));
        
        try {
            String response = aiService.generateText(prompt);
            
            List<String> aiSuggestions = Arrays.stream(response.split(","))
                    .map(String::trim)
                    .filter(pref -> !pref.isEmpty())
                    .limit(5)
                    .toList();
            
            combinedPreferences.addAll(aiSuggestions);
            
        } catch (Exception e) {
            System.err.println("Failed to enhance preferences with AI: " + e.getMessage());
        }
        
        user.setPreferences(combinedPreferences);
        userRepository.save(user);
    }
    
    /**
     * Get personalized recommendations for user
     */
    public List<PersonalizedRecommendation> getPersonalizedRecommendations(Long userId, int limit) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        if (!user.isRecommendationEnabled()) {
            return List.of();
        }
        
        // Combine user preferences and interests for recommendation query
        Set<String> allPreferences = new HashSet<>();
        allPreferences.addAll(user.getPreferences());
        allPreferences.addAll(user.getInterests());
        
        String query = String.join(" ", allPreferences);
        
        // Use vector store to find similar products
        try {
            var documents = vectorStoreService.findProductsForUser(userId, 
                    new ArrayList<>(allPreferences), null, limit);
            
            return documents.stream()
                    .map(doc -> {
                        Map<String, Object> metadata = doc.getMetadata();
                        return new PersonalizedRecommendation(
                                (Long) metadata.get("productId"),
                                (String) metadata.get("productName"),
                                (String) metadata.get("category"),
                                (String) metadata.get("brand"),
                                0.8, // TODO: Calculate actual relevance score
                                "Based on your interests in " + String.join(", ", allPreferences)
                        );
                    })
                    .toList();
        } catch (Exception e) {
            System.err.println("Failed to get personalized recommendations: " + e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Analyze user behavior and update AI profile
     */
    public void analyzeUserBehavior(Long userId, UserBehavior behavior) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return;
        }
        
        User user = userOpt.get();
        
        if (!user.isPersonalizationEnabled()) {
            return;
        }
        
        try {
            // Extract insights from behavior
            String behaviorText = String.format("%s %s", 
                    behavior.getBehaviorType().toString(),
                    behavior.getProduct() != null ? behavior.getProduct().getName() : "");
            
            // Use AI to analyze behavior and extract preferences
            String prompt = String.format("""
                Analyze this user behavior and extract potential interests/preferences:
                
                Behavior: %s
                
                Return 2-3 relevant interests/preferences as comma-separated values.
                """, behaviorText);
            
            String response = aiService.generateText(prompt);
            
            List<String> extractedInterests = Arrays.stream(response.split(","))
                    .map(String::trim)
                    .filter(interest -> !interest.isEmpty())
                    .limit(3)
                    .toList();
            
            // Update user interests
            Set<String> currentInterests = user.getInterests();
            currentInterests.addAll(extractedInterests);
            user.setInterests(currentInterests);
            
            userRepository.save(user);
            
            // Store behavior in vector store for future analysis
            Map<String, Object> behaviorContext = Map.of(
                    "behaviorType", behavior.getBehaviorType().toString(),
                    "productId", behavior.getProduct() != null ? behavior.getProduct().getId() : 0,
                    "sessionId", behavior.getSessionId()
            );
            
            vectorStoreService.storeUserBehaviorEmbedding(userId, 
                    behavior.getBehaviorType().toString(), behaviorText, behaviorContext);
            
        } catch (Exception e) {
            System.err.println("Failed to analyze user behavior: " + e.getMessage());
        }
    }
    
    /**
     * Get user insights using AI analysis
     */
    public UserInsights getUserInsights(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        try {
            // Analyze user's behavior patterns
            String userProfile = String.format("""
                User Profile Analysis:
                - Interests: %s
                - Preferences: %s
                - Total Orders: %d
                - Account Age: %s
                """,
                String.join(", ", user.getInterests()),
                String.join(", ", user.getPreferences()),
                user.getOrders().size(),
                user.getCreatedAt().toString()
            );
            
            String prompt = String.format("""
                Analyze this user profile and provide insights:
                
                %s
                
                Provide insights about:
                1. Shopping behavior patterns
                2. Product preferences
                3. Recommended categories to explore
                4. Potential upselling opportunities
                
                Format as JSON with keys: behaviorPatterns, preferences, recommendations, opportunities
                """, userProfile);
            
            String response = aiService.generateText(prompt);
            
            // TODO: Parse JSON response properly
            return new UserInsights(
                    "Active shopper with diverse interests",
                    new ArrayList<>(user.getInterests()),
                    List.of("Electronics", "Fashion", "Home & Garden"),
                    List.of("Premium products", "Seasonal items", "Bundle deals")
            );
            
        } catch (Exception e) {
            System.err.println("Failed to generate user insights: " + e.getMessage());
            return new UserInsights("Unable to generate insights", List.of(), List.of(), List.of());
        }
    }
    
    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * Find user by username
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    /**
     * Get user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Update user profile
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * Delete user
     */
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
    
    // Inner classes for AI responses
    public static class PersonalizedRecommendation {
        private final Long productId;
        private final String productName;
        private final String category;
        private final String brand;
        private final double relevanceScore;
        private final String reason;
        
        public PersonalizedRecommendation(Long productId, String productName, String category, 
                                        String brand, double relevanceScore, String reason) {
            this.productId = productId;
            this.productName = productName;
            this.category = category;
            this.brand = brand;
            this.relevanceScore = relevanceScore;
            this.reason = reason;
        }
        
        // Getters
        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public String getCategory() { return category; }
        public String getBrand() { return brand; }
        public double getRelevanceScore() { return relevanceScore; }
        public String getReason() { return reason; }
    }
    
    public static class UserInsights {
        private final String behaviorPattern;
        private final List<String> topInterests;
        private final List<String> recommendedCategories;
        private final List<String> opportunities;
        
        public UserInsights(String behaviorPattern, List<String> topInterests, 
                          List<String> recommendedCategories, List<String> opportunities) {
            this.behaviorPattern = behaviorPattern;
            this.topInterests = topInterests;
            this.recommendedCategories = recommendedCategories;
            this.opportunities = opportunities;
        }
        
        // Getters
        public String getBehaviorPattern() { return behaviorPattern; }
        public List<String> getTopInterests() { return topInterests; }
        public List<String> getRecommendedCategories() { return recommendedCategories; }
        public List<String> getOpportunities() { return opportunities; }
    }
    
    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException(String message) {
            super(message);
        }
    }
} 