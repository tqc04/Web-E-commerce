package com.example.project.repository;

import com.example.project.entity.OrderStatusHistory;
import com.example.project.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    
    List<OrderStatusHistory> findByOrderIdOrderByCreatedAtDesc(Long orderId);
    
    List<OrderStatusHistory> findByOrderId(Long orderId);
    
    List<OrderStatusHistory> findByToStatus(OrderStatus status);
    
    List<OrderStatusHistory> findByChangedBy(String changedBy);
    
    List<OrderStatusHistory> findBySystemGenerated(boolean systemGenerated);
    
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.id = :orderId AND h.toStatus = :status")
    List<OrderStatusHistory> findByOrderIdAndToStatus(@Param("orderId") Long orderId, 
                                                      @Param("status") OrderStatus status);
    
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.createdAt BETWEEN :startDate AND :endDate")
    List<OrderStatusHistory> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT h FROM OrderStatusHistory h WHERE h.order.id = :orderId ORDER BY h.createdAt ASC")
    List<OrderStatusHistory> findOrderHistoryChronological(@Param("orderId") Long orderId);
    
    @Query("SELECT COUNT(h) FROM OrderStatusHistory h WHERE h.toStatus = :status AND h.createdAt >= :startDate")
    long countStatusChangesAfter(@Param("status") OrderStatus status, @Param("startDate") LocalDateTime startDate);
} 