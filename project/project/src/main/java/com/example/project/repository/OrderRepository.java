package com.example.project.repository;

import com.example.project.entity.Order;
import com.example.project.entity.OrderStatus;
import com.example.project.entity.RiskLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Page<Order> findByUserId(Long userId, Pageable pageable);
    
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    List<Order> findByIsFlaggedForReviewTrue();
    
    List<Order> findByRiskLevel(RiskLevel riskLevel);
    
    Page<Order> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    List<Order> findByPaymentMethod(String paymentMethod);
    
    @Query("SELECT o FROM Order o WHERE o.totalAmount >= :minAmount")
    List<Order> findByMinAmount(@Param("minAmount") BigDecimal minAmount);
    
    @Query("SELECT o FROM Order o WHERE o.totalAmount <= :maxAmount")
    List<Order> findByMaxAmount(@Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT o FROM Order o WHERE o.totalAmount BETWEEN :minAmount AND :maxAmount")
    List<Order> findByAmountRange(@Param("minAmount") BigDecimal minAmount, 
                                  @Param("maxAmount") BigDecimal maxAmount);
    
    @Query("SELECT o FROM Order o WHERE o.fraudScore >= :minScore")
    List<Order> findByMinFraudScore(@Param("minScore") Double minScore);
    
    @Query("SELECT o FROM Order o WHERE o.user.id = :userId AND o.status = :status")
    List<Order> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.createdAt >= :startDate")
    List<Order> findByStatusAndCreatedAfter(@Param("status") OrderStatus status, 
                                           @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT o FROM Order o WHERE o.isFlaggedForReview = true AND o.status = :status")
    List<Order> findFlaggedOrdersByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.status = :status ORDER BY o.totalAmount DESC")
    List<Order> findTopOrdersByStatus(@Param("status") OrderStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.isFlaggedForReview = true")
    long countFlaggedOrders();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.riskLevel = :riskLevel")
    long countByRiskLevel(@Param("riskLevel") RiskLevel riskLevel);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersCreatedAfter(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = :status")
    BigDecimal getTotalRevenue(@Param("status") OrderStatus status);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = :status AND o.createdAt >= :startDate")
    BigDecimal getRevenueAfter(@Param("status") OrderStatus status, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.status = :status")
    BigDecimal getAverageOrderValue(@Param("status") OrderStatus status);
    
    @Query("SELECT AVG(o.fraudScore) FROM Order o WHERE o.fraudScore IS NOT NULL")
    Double getAverageFraudScore();
} 