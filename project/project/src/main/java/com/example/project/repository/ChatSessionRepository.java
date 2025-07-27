package com.example.project.repository;

import com.example.project.entity.ChatSession;
import com.example.project.entity.ChatSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    
    List<ChatSession> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<ChatSession> findByStatus(ChatSessionStatus status);
    
    Optional<ChatSession> findBySessionId(String sessionId);
    
    List<ChatSession> findByUserIdAndStatus(Long userId, ChatSessionStatus status);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.createdAt >= :startDate")
    List<ChatSession> findSessionsCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT cs FROM ChatSession cs WHERE cs.endedAt IS NULL AND cs.createdAt < :cutoffDate")
    List<ChatSession> findActiveSessions(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(cs) FROM ChatSession cs WHERE cs.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(cs) FROM ChatSession cs WHERE cs.status = :status")
    long countByStatus(@Param("status") ChatSessionStatus status);
    
    @Query("SELECT AVG(cs.totalTokensUsed) FROM ChatSession cs WHERE cs.totalTokensUsed > 0")
    Double getAverageTokensUsed();
    
    @Query("SELECT AVG(cs.totalCost) FROM ChatSession cs WHERE cs.totalCost > 0")
    Double getAverageCost();
} 