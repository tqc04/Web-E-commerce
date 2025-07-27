package com.example.project.service;

import com.example.project.dto.CartDTO;
import com.example.project.dto.CartItemDTO;
import com.example.project.dto.ProductDTO;
import com.example.project.entity.Product;
import com.example.project.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {
    
    private static final String CART_SESSION_KEY = "user_cart";
    private static final String GUEST_CART_PREFIX = "guest_cart_";
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private InventoryService inventoryService;
    
    // In-memory storage for demo purposes (in production, use Redis or database)
    private final Map<String, CartDTO> cartStorage = new HashMap<>();
    
    // Cart expiration time (24 hours)
    private static final long CART_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    /**
     * Get cart for authenticated user
     */
    public CartDTO getCart(Long userId, HttpSession session) {
        String cartKey = "user_" + userId;
        CartDTO cart = cartStorage.get(cartKey);
        
        if (cart == null) {
            cart = new CartDTO(userId);
            cartStorage.put(cartKey, cart);
        } else {
            // Update cart timestamp
            cart.setUpdatedAt(java.time.LocalDateTime.now());
        }
        
        return cart;
    }
    
    /**
     * Get cart for guest user (session-based)
     */
    public CartDTO getGuestCart(HttpSession session) {
        String sessionId = session.getId();
        String cartKey = GUEST_CART_PREFIX + sessionId;
        
        // First try to get from session attribute
        CartDTO cart = (CartDTO) session.getAttribute("guest_cart");
        if (cart != null) {
            System.out.println("Found guest cart in session: " + cart.getItems().size() + " items");
            // Also update in-memory storage
            cartStorage.put(cartKey, cart);
            return cart;
        }
        
        // Then try in-memory storage
        cart = cartStorage.get(cartKey);
        if (cart == null) {
            cart = new CartDTO(sessionId);
            cartStorage.put(cartKey, cart);
            // Save to session
            session.setAttribute("guest_cart", cart);
            System.out.println("Created new guest cart for session: " + sessionId);
        } else {
            // Update cart timestamp
            cart.setUpdatedAt(java.time.LocalDateTime.now());
        }
        
        return cart;
    }
    
    /**
     * Add product to cart
     */
    public CartDTO addToCart(Long userId, Long productId, Integer quantity, HttpSession session) {
        // Validate input
        if (productId == null || quantity == null || quantity <= 0) {
            throw new RuntimeException("Invalid product ID or quantity");
        }
        
        // Get product information
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        if (!product.getIsActive()) {
            throw new RuntimeException("Product is not active");
        }
        
        // Check stock quantity
        Integer stockQuantity = getProductStockQuantity(productId);
        if (stockQuantity <= 0) {
            throw new RuntimeException("Product is out of stock");
        }
        
        // Get cart
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        
        // Check if item already exists in cart
        CartItemDTO existingItem = cart.getItem(productId);
        int newTotalQuantity = quantity;
        
        if (existingItem != null) {
            newTotalQuantity = existingItem.getQuantity() + quantity;
        }
        
        // Validate total quantity against stock
        if (newTotalQuantity > stockQuantity) {
            throw new RuntimeException("Total quantity (" + newTotalQuantity + ") exceeds available stock (" + stockQuantity + ")");
        }
        
        // Create cart item
        CartItemDTO cartItem = createCartItemFromProduct(product, quantity);
        
        // Add to cart
        cart.addItem(cartItem);
        
        // Save cart
        saveCart(cart, userId, session);
        
        System.out.println("Added product " + productId + " to cart. New cart total: " + cart.getTotalItems() + " items");
        
        return cart;
    }
    
    /**
     * Update cart item quantity
     */
    public CartDTO updateCartItem(Long userId, Long productId, Integer newQuantity, HttpSession session) {
        System.out.println("Updating cart item - userId: " + userId + ", productId: " + productId + ", newQuantity: " + newQuantity);
        
        // Validate input
        if (productId == null || newQuantity == null) {
            throw new RuntimeException("Invalid product ID or quantity");
        }
        
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        System.out.println("Current cart items: " + cart.getItems().size());
        
        // Check if item exists in cart
        CartItemDTO existingItem = cart.getItem(productId);
        if (existingItem == null) {
            System.out.println("Product not found in cart, adding it with quantity: " + newQuantity);
            // If item doesn't exist and quantity > 0, add it to cart
            if (newQuantity > 0) {
                return addToCart(userId, productId, newQuantity, session);
            } else {
                // If quantity is 0 and item doesn't exist, just return current cart
                return cart;
            }
        }
        
        if (newQuantity <= 0) {
            System.out.println("Removing item due to zero quantity");
            cart.removeItem(productId);
        } else {
            // Check stock availability
            Integer stockQuantity = getProductStockQuantity(productId);
            if (newQuantity > stockQuantity) {
                throw new RuntimeException("Requested quantity (" + newQuantity + ") exceeds available stock (" + stockQuantity + ")");
            }
            
            System.out.println("Updating item quantity from " + existingItem.getQuantity() + " to " + newQuantity);
            cart.updateItemQuantity(productId, newQuantity);
        }
        
        saveCart(cart, userId, session);
        System.out.println("Updated cart items: " + cart.getItems().size());
        return cart;
    }
    
    /**
     * Remove product from cart
     */
    public CartDTO removeFromCart(Long userId, Long productId, HttpSession session) {
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        cart.removeItem(productId);
        saveCart(cart, userId, session);
        return cart;
    }
    
    /**
     * Clear entire cart
     */
    public CartDTO clearCart(Long userId, HttpSession session) {
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        cart.clearCart();
        saveCart(cart, userId, session);
        return cart;
    }
    
    /**
     * Apply promo code
     */
    public CartDTO applyPromoCode(Long userId, String promoCode, HttpSession session) {
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        
        // Validate promo code and get discount percentage
        BigDecimal discountPercentage = validatePromoCode(promoCode);
        if (discountPercentage == null) {
            throw new RuntimeException("Invalid promo code");
        }
        
        cart.applyPromoCode(promoCode, discountPercentage);
        saveCart(cart, userId, session);
        return cart;
    }
    
    /**
     * Remove promo code
     */
    public CartDTO removePromoCode(Long userId, HttpSession session) {
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        cart.removePromoCode();
        saveCart(cart, userId, session);
        return cart;
    }
    
    /**
     * Get cart item count
     */
    public Integer getCartItemCount(Long userId, HttpSession session) {
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        return cart.getTotalItems();
    }
    
    /**
     * Merge guest cart with user cart after login
     */
    public CartDTO mergeGuestCart(Long userId, HttpSession session) {
        String guestCartKey = GUEST_CART_PREFIX + session.getId();
        String userCartKey = "user_" + userId;
        
        CartDTO guestCart = cartStorage.get(guestCartKey);
        CartDTO userCart = cartStorage.get(userCartKey);
        
        if (guestCart != null && !guestCart.isEmpty()) {
            if (userCart == null) {
                userCart = new CartDTO(userId);
            }
            
            // Merge guest cart items into user cart
            for (CartItemDTO item : guestCart.getItems()) {
                userCart.addItem(item);
            }
            
            // Save merged cart and remove guest cart
            cartStorage.put(userCartKey, userCart);
            cartStorage.remove(guestCartKey);
            
            return userCart;
        }
        
        return userCart != null ? userCart : new CartDTO(userId);
    }
    
    // Helper methods
    private CartItemDTO createCartItemFromProduct(Product product, Integer quantity) {
        CartItemDTO cartItem = new CartItemDTO();
        cartItem.setProductId(product.getId());
        cartItem.setProductName(product.getName());
        cartItem.setProductSku(product.getSku());
        cartItem.setProductPrice(product.getPrice());
        cartItem.setQuantity(quantity);
        cartItem.setStockQuantity(getProductStockQuantity(product.getId()));
        cartItem.setIsActive(product.getIsActive());
        
        // Set category and brand names safely
        try {
            if (product.getCategory() != null) {
                cartItem.setCategoryName(product.getCategory().getName());
            }
        } catch (Exception e) {
            cartItem.setCategoryName("Unknown Category");
        }
        
        try {
            if (product.getBrand() != null) {
                cartItem.setBrandName(product.getBrand().getName());
            }
        } catch (Exception e) {
            cartItem.setBrandName("Unknown Brand");
        }
        
        // Set product image (get first image if available)
        try {
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                cartItem.setProductImage(product.getImages().get(0).getImageUrl());
            }
        } catch (Exception e) {
            cartItem.setProductImage(null);
        }
        
        cartItem.calculateSubtotal();
        return cartItem;
    }
    
    private Integer getProductStockQuantity(Long productId) {
        try {
            // Get stock directly from product
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                Integer productStock = product.getStockQuantity();
                
                System.out.println("Stock for product " + productId + " - Available: " + productStock);
                return productStock != null ? productStock : 0;
            }
        } catch (Exception e) {
            System.err.println("Error getting stock quantity for product " + productId + ": " + e.getMessage());
        }
        return 0;
    }
    
    private BigDecimal validatePromoCode(String promoCode) {
        // Simple promo code validation - in real app would check database
        Map<String, BigDecimal> validPromoCodes = Map.of(
                "SAVE10", BigDecimal.valueOf(10),
                "WELCOME20", BigDecimal.valueOf(20),
                "STUDENT15", BigDecimal.valueOf(15),
                "TECH25", BigDecimal.valueOf(25)
        );
        
        return validPromoCodes.get(promoCode.toUpperCase());
    }
    
    private void saveCart(CartDTO cart, Long userId, HttpSession session) {
        String cartKey = userId != null ? "user_" + userId : GUEST_CART_PREFIX + session.getId();
        cartStorage.put(cartKey, cart);
        
        // Also save to session for persistence
        if (userId == null) {
            // For guest users, save cart to session
            session.setAttribute("guest_cart", cart);
            System.out.println("Saved guest cart to session: " + cart.getItems().size() + " items");
        }
    }
    
    /**
     * Clear cart after successful order
     */
    public void clearCartAfterOrder(Long userId, HttpSession session) {
        String cartKey = userId != null ? "user_" + userId : GUEST_CART_PREFIX + session.getId();
        cartStorage.remove(cartKey);
        System.out.println("Cart cleared after order for: " + cartKey);
    }
} 
