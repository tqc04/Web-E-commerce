package com.example.project.service;

import com.example.project.event.UserBehaviorEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class EventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(EventPublisher.class);
    
    @Autowired(required = false)
    private KafkaTemplate<String, String> kafkaTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Kafka topic names
    private static final String USER_BEHAVIOR_TOPIC = "user-behavior-events";
    private static final String ORDER_EVENTS_TOPIC = "order-events";
    private static final String PRODUCT_EVENTS_TOPIC = "product-events";
    private static final String PAYMENT_EVENTS_TOPIC = "payment-events";
    
    /**
     * Publish user behavior event
     */
    public void publishUserBehaviorEvent(UserBehaviorEvent event) {
        if (kafkaTemplate == null) {
            logger.debug("Kafka is disabled, skipping event publication: {}", event.getEventType());
            return;
        }
        try {
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(USER_BEHAVIOR_TOPIC, event.getUserId().toString(), eventJson);
            logger.info("Published user behavior event: {}", event.getEventType());
        } catch (JsonProcessingException e) {
            logger.error("Error publishing user behavior event", e);
        }
    }
    
    /**
     * Publish user login event
     */
    public void publishUserLoginEvent(Long userId, String sessionId, String ipAddress, String userAgent, String deviceType) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("loginTime", LocalDateTime.now());
        eventData.put("loginSource", "web");
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "USER_LOGIN", 
            eventData, 
            sessionId, 
            ipAddress, 
            userAgent, 
            deviceType, 
            "authentication"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish product view event
     */
    public void publishProductViewEvent(Long userId, Long productId, String sessionId, String ipAddress, String userAgent) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("productId", productId);
        eventData.put("viewTime", LocalDateTime.now());
        eventData.put("viewDuration", 0); // Will be updated later
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "PRODUCT_VIEW", 
            eventData, 
            sessionId, 
            ipAddress, 
            userAgent, 
            "web", 
            "product-catalog"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish product search event
     */
    public void publishProductSearchEvent(Long userId, String searchQuery, int resultsCount, String sessionId, String ipAddress) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("searchQuery", searchQuery);
        eventData.put("resultsCount", resultsCount);
        eventData.put("searchTime", LocalDateTime.now());
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "PRODUCT_SEARCH", 
            eventData, 
            sessionId, 
            ipAddress, 
            "", 
            "web", 
            "search"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish add to cart event
     */
    public void publishAddToCartEvent(Long userId, Long productId, int quantity, String sessionId, String ipAddress) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("productId", productId);
        eventData.put("quantity", quantity);
        eventData.put("addTime", LocalDateTime.now());
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "ADD_TO_CART", 
            eventData, 
            sessionId, 
            ipAddress, 
            "", 
            "web", 
            "shopping-cart"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish order created event
     */
    public void publishOrderCreatedEvent(Long userId, Long orderId, Double totalAmount, String sessionId, String ipAddress) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("orderId", orderId);
        eventData.put("totalAmount", totalAmount);
        eventData.put("orderTime", LocalDateTime.now());
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "ORDER_CREATED", 
            eventData, 
            sessionId, 
            ipAddress, 
            "", 
            "web", 
            "checkout"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish payment completed event
     */
    public void publishPaymentCompletedEvent(Long userId, Long orderId, String paymentMethod, Double amount, String sessionId) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("orderId", orderId);
        eventData.put("paymentMethod", paymentMethod);
        eventData.put("amount", amount);
        eventData.put("paymentTime", LocalDateTime.now());
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "PAYMENT_COMPLETED", 
            eventData, 
            sessionId, 
            "", 
            "", 
            "web", 
            "payment"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish chatbot interaction event
     */
    public void publishChatbotInteractionEvent(Long userId, String message, String response, String sessionId) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("userMessage", message);
        eventData.put("botResponse", response);
        eventData.put("interactionTime", LocalDateTime.now());
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "CHATBOT_INTERACTION", 
            eventData, 
            sessionId, 
            "", 
            "", 
            "web", 
            "chatbot"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish recommendation click event
     */
    public void publishRecommendationClickEvent(Long userId, Long productId, String recommendationType, String sessionId) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("productId", productId);
        eventData.put("recommendationType", recommendationType);
        eventData.put("clickTime", LocalDateTime.now());
        
        UserBehaviorEvent event = new UserBehaviorEvent(
            userId, 
            "RECOMMENDATION_CLICK", 
            eventData, 
            sessionId, 
            "", 
            "", 
            "web", 
            "recommendations"
        );
        
        publishUserBehaviorEvent(event);
    }
    
    /**
     * Publish generic event
     */
    public void publishGenericEvent(String topic, String key, Object eventData) {
        if (kafkaTemplate == null) {
            logger.debug("Kafka is disabled, skipping event publication to topic: {}", topic);
            return;
        }
        try {
            String eventJson = objectMapper.writeValueAsString(eventData);
            kafkaTemplate.send(topic, key, eventJson);
            logger.info("Published event to topic: {}", topic);
        } catch (JsonProcessingException e) {
            logger.error("Error publishing event to topic: {}", topic, e);
        }
    }
} 