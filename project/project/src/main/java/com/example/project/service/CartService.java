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
    
    // In-memory storage for demo purposes (in production, use Redis or database)
    private final Map<String, CartDTO> cartStorage = new HashMap<>();
    
    /**
     * Get cart for authenticated user
     */
    public CartDTO getCart(Long userId, HttpSession session) {
        String cartKey = "user_" + userId;
        CartDTO cart = cartStorage.get(cartKey);
        
        if (cart == null) {
            cart = new CartDTO(userId);
            cartStorage.put(cartKey, cart);
        }
        
        return cart;
    }
    
    /**
     * Get cart for guest user (session-based)
     */
    public CartDTO getGuestCart(HttpSession session) {
        String sessionId = session.getId();
        String cartKey = GUEST_CART_PREFIX + sessionId;
        
        CartDTO cart = cartStorage.get(cartKey);
        if (cart == null) {
            cart = new CartDTO(sessionId);
            cartStorage.put(cartKey, cart);
        }
        
        return cart;
    }
    
    /**
     * Add product to cart
     */
    public CartDTO addToCart(Long userId, Long productId, Integer quantity, HttpSession session) {
        // Get product information
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + productId);
        }
        
        Product product = productOpt.get();
        if (!product.isActive()) {
            throw new RuntimeException("Product is not active");
        }
        
        // Check stock quantity
        Integer stockQuantity = getProductStockQuantity(productId);
        if (stockQuantity <= 0) {
            throw new RuntimeException("Product is out of stock");
        }
        
        if (quantity > stockQuantity) {
            throw new RuntimeException("Requested quantity exceeds available stock");
        }
        
        // Get cart
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        
        // Create cart item
        CartItemDTO cartItem = createCartItemFromProduct(product, quantity);
        
        // Add to cart
        cart.addItem(cartItem);
        
        // Save cart
        saveCart(cart, userId, session);
        
        return cart;
    }
    
    /**
     * Update cart item quantity
     */
    public CartDTO updateCartItem(Long userId, Long productId, Integer newQuantity, HttpSession session) {
        CartDTO cart = userId != null ? getCart(userId, session) : getGuestCart(session);
        
        if (newQuantity <= 0) {
            cart.removeItem(productId);
        } else {
            // Check stock availability
            Integer stockQuantity = getProductStockQuantity(productId);
            if (newQuantity > stockQuantity) {
                throw new RuntimeException("Requested quantity exceeds available stock");
            }
            
            cart.updateItemQuantity(productId, newQuantity);
        }
        
        saveCart(cart, userId, session);
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
        cartItem.setIsActive(product.isActive());
        
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
        // This is simplified - in real app would check actual inventory
        try {
            Optional<Product> productOpt = productRepository.findById(productId);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                // Return stockQuantity from product entity if it exists
                // Otherwise return a default stock amount
                return product.getStockQuantity() != null ? product.getStockQuantity() : 100;
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
    }
} 