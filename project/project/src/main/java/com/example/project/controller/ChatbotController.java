package com.example.project.controller;

import com.example.project.entity.ChatSession;
import com.example.project.entity.ChatMessage;
import com.example.project.entity.Product;
import com.example.project.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;

    /**
     * Tạo session chat mới
     */
    @PostMapping("/session")
    public ResponseEntity<ChatSession> createChatSession(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String initialMessage = (String) request.get("initialMessage");
            
            ChatSession session = chatbotService.startChatSession(userId, initialMessage);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Gửi tin nhắn và nhận phản hồi từ AI
     */
    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            String message = (String) request.get("message");
            
            ChatMessage response = chatbotService.sendMessage(sessionId, message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy chi tiết session và lịch sử chat
     */
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<ChatbotService.ChatSessionDetails> getChatSessionDetails(@PathVariable Long sessionId) {
        try {
            ChatbotService.ChatSessionDetails details = chatbotService.getChatSessionDetails(sessionId);
            return ResponseEntity.ok(details);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Kết thúc session chat
     */
    @PostMapping("/session/{sessionId}/end")
    public ResponseEntity<Void> endChatSession(@PathVariable Long sessionId) {
        try {
            chatbotService.endChatSession(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy danh sách session của user
     */
    @GetMapping("/user/{userId}/sessions")
    public ResponseEntity<List<ChatSession>> getUserSessions(@PathVariable Long userId) {
        try {
            List<ChatSession> sessions = chatbotService.getUserChatSessions(userId);
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy gợi ý sản phẩm cho chat
     */
    @PostMapping("/product-recommendations")
    public ResponseEntity<List<Product>> getProductRecommendations(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            String query = (String) request.get("query");
            
            List<Product> products = chatbotService.getChatProductRecommendations(sessionId, query);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 