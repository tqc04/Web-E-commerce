package com.example.project.repository;

import com.example.project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    Optional<User> findByPasswordResetToken(String passwordResetToken);
    
    Optional<User> findByEmailVerificationToken(String emailVerificationToken);
    
    List<User> findByIsActiveTrue();
    
    List<User> findByIsActiveFalse();
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
    
    @Query("SELECT u FROM User u WHERE u.personalizationEnabled = true")
    List<User> findPersonalizationEnabledUsers();
    
    @Query("SELECT u FROM User u WHERE u.recommendationEnabled = true")
    List<User> findRecommendationEnabledUsers();
    
    @Query("SELECT u FROM User u WHERE u.chatbotEnabled = true")
    List<User> findChatbotEnabledUsers();
    
    @Query("SELECT u FROM User u WHERE u.providerId = :providerId")
    List<User> findByProviderId(@Param("providerId") String providerId);
    
    @Query("SELECT u FROM User u WHERE u.isEmailVerified = true")
    List<User> findEmailVerifiedUsers();
    
    @Query("SELECT u FROM User u WHERE u.isEmailVerified = false")
    List<User> findUnverifiedUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :startDate")
    long countUsersCreatedAfter(@Param("startDate") java.time.LocalDateTime startDate);
} 