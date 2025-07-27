package com.example.project.repository;

import com.example.project.entity.ChatMessage;
import com.example.project.entity.MessageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    List<ChatMessage> findByChatSessionIdOrderByCreatedAtAsc(Long chatSessionId);
    
    List<ChatMessage> findByChatSessionIdOrderByCreatedAtDesc(Long chatSessionId);
    
    List<ChatMessage> findByMessageType(MessageType messageType);
    
    List<ChatMessage> findByChatSessionIdAndMessageType(Long chatSessionId, MessageType messageType);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatSession.id = :sessionId AND cm.createdAt >= :startDate")
    List<ChatMessage> findBySessionAndCreatedAfter(@Param("sessionId") Long sessionId, 
                                                  @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT cm FROM ChatMessage cm WHERE cm.confidenceScore < :threshold")
    List<ChatMessage> findLowConfidenceMessages(@Param("threshold") Double threshold);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.chatSession.id = :sessionId")
    long countBySessionId(@Param("sessionId") Long sessionId);
    
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.messageType = :messageType")
    long countByMessageType(@Param("messageType") MessageType messageType);
    
    @Query("SELECT AVG(cm.tokensUsed) FROM ChatMessage cm WHERE cm.tokensUsed > 0")
    Double getAverageTokensUsed();
    
    @Query("SELECT AVG(cm.processingTimeMs) FROM ChatMessage cm WHERE cm.processingTimeMs > 0")
    Double getAverageProcessingTime();
} 