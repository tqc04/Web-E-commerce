package com.example.project.repository;

import com.example.project.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    @EntityGraph(attributePaths = "warehouse")
    InventoryItem findFirstByProductIdAndQuantityAvailableGreaterThan(Long productId, int quantity);
} 