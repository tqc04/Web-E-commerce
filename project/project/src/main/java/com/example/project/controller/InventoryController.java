package com.example.project.controller;

import com.example.project.entity.InventoryItem;
import com.example.project.entity.Warehouse;
import com.example.project.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getInventoryByProduct(@PathVariable Long productId) {
        InventoryItem inventory = inventoryItemRepository.findFirstByProductIdAndQuantityAvailableGreaterThan(productId, 0);
        if (inventory == null) {
            return ResponseEntity.status(404).body(Map.of("error", "No inventory found for product " + productId));
        }
        Warehouse warehouse = inventory.getWarehouse();
        if (warehouse == null) {
            return ResponseEntity.status(404).body(Map.of("error", "No warehouse found for inventory of product " + productId));
        }
        Map<String, Object> result = Map.of(
            "inventory", Map.of(
                "id", inventory.getId(),
                "quantityAvailable", inventory.getQuantityAvailable(),
                "quantityOnHand", inventory.getQuantityOnHand(),
                "warehouseId", warehouse.getId()
            ),
            "warehouse", Map.of(
                "id", warehouse.getId(),
                "address", warehouse.getAddress(),
                "province", warehouse.getProvince(),
                "commune", warehouse.getCommune()
            )
        );
        return ResponseEntity.ok(result);
    }
} 