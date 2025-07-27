package com.example.project.controller;

import com.example.project.dto.CartDTO;
import com.example.project.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.project.entity.User;
import com.example.project.service.UserService;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    /**
     * Get current cart
     * Supports both authenticated users and guest users
     */
    @GetMapping
    public ResponseEntity<CartDTO> getCart(
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            CartDTO cart = userId != null 
                ? cartService.getCart(userId, session)
                : cartService.getGuestCart(session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Add product to cart
     */
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @RequestBody Map<String, Object> request,
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            if (userId == null) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
                    String username = authentication.getName();
                    Optional<User> userOpt = userService.findByUsernameOrEmail(username);
                    if (userOpt.isPresent()) {
                        userId = userOpt.get().getId();
                    }
                }
            }
            Long productId = Long.valueOf(request.get("productId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            
            CartDTO cart = cartService.addToCart(userId, productId, quantity, session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update cart item quantity
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(
            @RequestBody Map<String, Object> request,
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            System.out.println("Cart update request: " + request);
            
            // Validate required fields
            if (!request.containsKey("productId") || !request.containsKey("quantity")) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Missing required fields: productId and quantity"
                ));
            }
            
            Long productId = Long.valueOf(request.get("productId").toString());
            Integer quantity = Integer.valueOf(request.get("quantity").toString());
            
            System.out.println("Updating cart - userId: " + userId + ", productId: " + productId + ", quantity: " + quantity);
            
            // If quantity is 0 or negative, remove the item
            if (quantity <= 0) {
                System.out.println("Quantity is " + quantity + ", removing item from cart");
                CartDTO cart = cartService.removeFromCart(userId, productId, session);
                return ResponseEntity.ok(cart);
            }
            
            CartDTO cart = cartService.updateCartItem(userId, productId, quantity, session);
            System.out.println("Cart updated successfully");
            return ResponseEntity.ok(cart);
            
        } catch (NumberFormatException e) {
            System.err.println("Number format error: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Invalid number format in request",
                "details", e.getMessage()
            ));
        } catch (Exception e) {
            System.err.println("Error updating cart: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Failed to update cart",
                "details", e.getMessage()
            ));
        }
    }

    /**
     * Remove product from cart
     */
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @PathVariable Long productId,
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            CartDTO cart = cartService.removeFromCart(userId, productId, session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Clear entire cart
     */
    @DeleteMapping("/clear")
    public ResponseEntity<CartDTO> clearCart(
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            CartDTO cart = cartService.clearCart(userId, session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Apply promo code
     */
    @PostMapping("/promo")
    public ResponseEntity<CartDTO> applyPromoCode(
            @RequestBody Map<String, String> request,
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            String promoCode = request.get("promoCode");
            CartDTO cart = cartService.applyPromoCode(userId, promoCode, session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Remove promo code
     */
    @DeleteMapping("/promo")
    public ResponseEntity<CartDTO> removePromoCode(
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            CartDTO cart = cartService.removePromoCode(userId, session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get cart item count
     */
    @GetMapping("/count")
    public ResponseEntity<Integer> getCartItemCount(
            @RequestParam(required = false) Long userId,
            HttpSession session) {
        try {
            Integer count = cartService.getCartItemCount(userId, session);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.ok(0);
        }
    }

    /**
     * Merge guest cart with user cart after login
     */
    @PostMapping("/merge")
    public ResponseEntity<CartDTO> mergeGuestCart(
            @RequestParam Long userId,
            HttpSession session) {
        try {
            CartDTO cart = cartService.mergeGuestCart(userId, session);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "service", "CartController",
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
} 