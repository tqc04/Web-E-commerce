package com.example.project.repository;

import com.example.project.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    @EntityGraph(attributePaths = "warehouse")
    InventoryItem findFirstByProductIdAndQuantityAvailableGreaterThan(Long productId, int quantity);
    
    // Find inventory item by product ID
    Optional<InventoryItem> findByProductId(Long productId);
    
    // Find all inventory items by product ID
    List<InventoryItem> findAllByProductId(Long productId);
    
    // Find inventory items with low stock
    @Query("SELECT i FROM InventoryItem i WHERE i.quantityAvailable <= i.reorderPoint")
    List<InventoryItem> findLowStockItems();
    
    // Find inventory items that are out of stock
    @Query("SELECT i FROM InventoryItem i WHERE i.quantityAvailable <= 0")
    List<InventoryItem> findOutOfStockItems();
    
    // Get total available quantity for a product across all warehouses
    @Query("SELECT COALESCE(SUM(i.quantityAvailable), 0) FROM InventoryItem i WHERE i.product.id = :productId")
    Integer getTotalAvailableQuantityByProductId(@Param("productId") Long productId);
    
    // Get total reserved quantity for a product across all warehouses
    @Query("SELECT COALESCE(SUM(i.quantityReserved), 0) FROM InventoryItem i WHERE i.product.id = :productId")
    Integer getTotalReservedQuantityByProductId(@Param("productId") Long productId);
} 