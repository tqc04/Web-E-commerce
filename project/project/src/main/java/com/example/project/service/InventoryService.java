package com.example.project.service;

import com.example.project.entity.InventoryItem;
import com.example.project.entity.Product;
import com.example.project.repository.InventoryItemRepository;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class InventoryService {
    
    @Autowired
    private InventoryItemRepository inventoryItemRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    // In-memory locks for inventory items
    private final ConcurrentHashMap<Long, ReentrantLock> inventoryLocks = new ConcurrentHashMap<>();
    
    /**
     * Reserve inventory for order (with lock)
     */
    @Transactional
    public boolean reserveInventory(Long productId, Integer quantity, String orderId) {
        ReentrantLock lock = inventoryLocks.computeIfAbsent(productId, k -> new ReentrantLock());
        
        try {
            lock.lock();
            
            // Check product stock first
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Product not found: " + productId);
            }
            
            Product product = productOpt.get();
            Integer currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            
            if (currentStock < quantity) {
                return false; // Insufficient stock
            }
            
            // Update product stock
            product.setStockQuantity(currentStock - quantity);
            productRepository.save(product);
            
            System.out.println("Reserved " + quantity + " units of product " + productId + " for order " + orderId);
            return true;
            
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Release reserved inventory (when order is cancelled)
     */
    @Transactional
    public void releaseInventory(Long productId, Integer quantity, String orderId) {
        ReentrantLock lock = inventoryLocks.computeIfAbsent(productId, k -> new ReentrantLock());
        
        try {
            lock.lock();
            
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                Integer currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                product.setStockQuantity(currentStock + quantity);
                productRepository.save(product);
                
                System.out.println("Released " + quantity + " units of product " + productId + " from order " + orderId);
            }
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Confirm inventory reservation (when order is confirmed)
     */
    @Transactional
    public void confirmInventoryReservation(Long productId, Integer quantity, String orderId) {
        // For simple implementation, no additional action needed
        // Stock was already reduced during reservation
        System.out.println("Confirmed " + quantity + " units of product " + productId + " for order " + orderId);
    }
    
    /**
     * Get current stock status
     */
    public InventoryStatus getInventoryStatus(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            Integer stock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
            return new InventoryStatus(stock, stock, 0, 0);
        }
        return new InventoryStatus(0, 0, 0, 0);
    }
    
    /**
     * Check if product is in stock
     */
    public boolean isInStock(Long productId, Integer quantity) {
        InventoryStatus status = getInventoryStatus(productId);
        return status.availableQuantity >= quantity;
    }
    
    /**
     * Get low stock products
     */
    public List<InventoryItem> getLowStockProducts(Integer threshold) {
        return inventoryItemRepository.findLowStockItems();
    }
    
    /**
     * Get out of stock products
     */
    public List<InventoryItem> getOutOfStockProducts() {
        return inventoryItemRepository.findOutOfStockItems();
    }
    
    /**
     * Get total available quantity for a product
     */
    public Integer getTotalAvailableQuantity(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        return productOpt.map(product -> product.getStockQuantity() != null ? product.getStockQuantity() : 0).orElse(0);
    }
    
    /**
     * Get total reserved quantity for a product
     */
    public Integer getTotalReservedQuantity(Long productId) {
        // For simple implementation, return 0
        return 0;
    }
    
    /**
     * Create inventory item for a product if it doesn't exist
     */
    @Transactional
    public void createInventoryItemIfNotExists(Long productId, String warehouseLocation, Integer initialQuantity) {
        Optional<InventoryItem> existingItem = inventoryItemRepository.findByProductId(productId);
        if (existingItem.isEmpty()) {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                InventoryItem inventoryItem = new InventoryItem(productOpt.get(), warehouseLocation, initialQuantity);
                inventoryItemRepository.save(inventoryItem);
                System.out.println("Created inventory item for product " + productId);
            }
        }
    }
    
    // Inner class for inventory status
    public static class InventoryStatus {
        public final int totalQuantity;
        public final int availableQuantity;
        public final int reservedQuantity;
        public final int soldQuantity;
        
        public InventoryStatus(int totalQuantity, int availableQuantity, int reservedQuantity, int soldQuantity) {
            this.totalQuantity = totalQuantity;
            this.availableQuantity = availableQuantity;
            this.reservedQuantity = reservedQuantity;
            this.soldQuantity = soldQuantity;
        }
    }
} 