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
        Map<String, Object> inventoryMap = new java.util.HashMap<>();
        inventoryMap.put("id", inventory.getId());
        inventoryMap.put("quantityAvailable", inventory.getQuantityAvailable());
        inventoryMap.put("quantityOnHand", inventory.getQuantityOnHand());
        inventoryMap.put("warehouseId", warehouse.getId());

        Map<String, Object> warehouseMap = new java.util.HashMap<>();
        warehouseMap.put("id", warehouse.getId());
        warehouseMap.put("address", warehouse.getAddress());
        warehouseMap.put("province", warehouse.getProvince());
        warehouseMap.put("commune", warehouse.getCommune());
        warehouseMap.put("districtId", warehouse.getDistrictId());
        warehouseMap.put("wardCode", warehouse.getWardCode());
        warehouseMap.put("provinceCode", warehouse.getProvince()); // fallback nếu có

        Map<String, Object> result = new java.util.HashMap<>();
        result.put("inventory", inventoryMap);
        result.put("warehouse", warehouseMap);
        return ResponseEntity.ok(result);
    }
} 