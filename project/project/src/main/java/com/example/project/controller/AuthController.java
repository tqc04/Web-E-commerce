package com.example.project.controller;

import com.example.project.dto.UserCreateRequest;
import com.example.project.entity.User;
import com.example.project.entity.UserRole;
import com.example.project.service.UserService;
import com.example.project.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * User login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        try {
            System.out.println("=== LOGIN REQUEST ===");
            System.out.println("Request body: " + loginRequest);
            
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            System.out.println("Username: " + username);
            System.out.println("Password: " + password);

            Optional<User> userOpt = userService.authenticateUser(username, password);
            System.out.println("User found: " + userOpt.isPresent());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (!Boolean.TRUE.equals(user.getIsEmailVerified())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Email not verified. Please check your email to verify your account.");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
                }
                System.out.println("User details: " + user.getUsername() + ", " + user.getEmail());
                
                // Update last login
                userService.updateLastLogin(user.getId());
                String token = userService.generateToken(user);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("token", token);
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("username", user.getUsername());
                userMap.put("email", user.getEmail());
                userMap.put("firstName", user.getFirstName());
                userMap.put("lastName", user.getLastName());
                userMap.put("isActive", user.getIsActive());
                userMap.put("isEmailVerified", user.getIsEmailVerified());
                userMap.put("personalizationEnabled", user.getPersonalizationEnabled());
                userMap.put("chatbotEnabled", user.getChatbotEnabled());
                userMap.put("recommendationEnabled", user.getRecommendationEnabled());
                userMap.put("createdAt", user.getCreatedAt());
                userMap.put("updatedAt", user.getUpdatedAt());
                userMap.put("role", user.getRole() != null ? user.getRole().name() : null);
                response.put("user", userMap);
                System.out.println("Login successful for user: " + username);
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid username or password");
            System.out.println("Login failed for user: " + username);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            System.out.println("=== LOGIN EXCEPTION ===");
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * User registration
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserCreateRequest userRequest) {
        try {
            // Always set role to USER
            userRequest.setRole(com.example.project.entity.UserRole.USER);
            // Check if user already exists
            if (userService.existsByUsername(userRequest.getUsername())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
            if (userService.existsByEmail(userRequest.getEmail())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }
            User newUser = userService.createUser(userRequest);
            // Send email verification
            emailService.sendEmailVerification(newUser);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful. Please check your email for verification.");
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", newUser.getId());
            userMap.put("username", newUser.getUsername());
            userMap.put("email", newUser.getEmail());
            userMap.put("firstName", newUser.getFirstName());
            userMap.put("lastName", newUser.getLastName());
            userMap.put("isActive", newUser.getIsActive());
            userMap.put("isEmailVerified", newUser.getIsEmailVerified());
            userMap.put("personalizationEnabled", newUser.getPersonalizationEnabled());
            userMap.put("chatbotEnabled", newUser.getChatbotEnabled());
            userMap.put("recommendationEnabled", newUser.getRecommendationEnabled());
            userMap.put("createdAt", newUser.getCreatedAt());
            userMap.put("updatedAt", newUser.getUpdatedAt());
            userMap.put("role", newUser.getRole() != null ? newUser.getRole().name() : null);
            response.put("user", userMap);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Forgot password - Send reset email
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            Optional<User> userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            String resetToken = userService.generatePasswordResetToken(user.getEmail());
            
            // Send password reset email
            emailService.sendPasswordResetEmail(user, resetToken);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password reset email sent successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send reset email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Reset password with token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("password");
            
            if (userService.resetPassword(token, newPassword)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Password reset successfully");
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid or expired reset token");
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Password reset failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Email verification
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            
            if (userService.verifyEmail(token)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Email verified successfully");
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid verification token");
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Email verification failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Change password (authenticated user)
     */
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            // Extract user from token
            String token = authHeader.replace("Bearer ", "");
            Long userId = userService.getUserIdFromToken(token);
            
            if (userService.changePassword(userId, currentPassword, newPassword)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Password changed successfully");
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid current password");
            return ResponseEntity.badRequest().body(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Password change failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Đăng ký tài khoản từ Google OAuth2 (bổ sung username, password)
     */
    @PostMapping("/oauth2-signup")
    public ResponseEntity<?> oauth2Signup(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String username = req.get("username");
        String password = req.get("password");
        if (email == null || username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Thiếu thông tin đăng ký."));
        }
        if (userService.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại."));
        }
        if (userService.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Tên đăng nhập đã tồn tại."));
        }
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setRole(UserRole.USER);
        userService.save(user);
        String token = userService.generateToken(user);
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "isActive", user.getIsActive()
            )
        ));
    }


//    /**
//     * Test endpoint for debugging (remove in production)
//     */
//    @PostMapping("/debug-login")
//    public ResponseEntity<Map<String, Object>> debugLogin(@RequestBody Map<String, String> request) {
//        try {
//            String username = request.get("username");
//            String password = request.get("password");
//
//            System.out.println("=== DEBUG LOGIN ===");
//            System.out.println("Username: " + username);
//            System.out.println("Password: " + password);
//
//            // Find user by username only
//            Optional<User> userOpt = userService.findByUsername(username);
//            System.out.println("User found by username: " + userOpt.isPresent());
//
//            if (userOpt.isPresent()) {
//                User user = userOpt.get();
//                System.out.println("User ID: " + user.getId());
//                System.out.println("User email: " + user.getEmail());
//                System.out.println("User isActive: " + user.getIsActive());
//                System.out.println("Stored password hash: " + user.getPassword());
//
//                // Test password matching
//                boolean passwordMatches = userService.checkPassword(password, user.getPassword());
//                System.out.println("Password matches: " + passwordMatches);
//
//                // Test with "password"
//                boolean passwordMatchesDefault = userService.checkPassword("password", user.getPassword());
//                System.out.println("Password 'password' matches: " + passwordMatchesDefault);
//
//                // Test with "password123"
//                boolean passwordMatches123 = userService.checkPassword("password123", user.getPassword());
//                System.out.println("Password 'password123' matches: " + passwordMatches123);
//
//                Map<String, Object> response = new HashMap<>();
//                response.put("success", true);
//                response.put("userFound", true);
//                response.put("userActive", user.getIsActive());
//                response.put("passwordMatches", passwordMatches);
//                response.put("passwordMatchesDefault", passwordMatchesDefault);
//                response.put("passwordMatches123", passwordMatches123);
//                response.put("storedHash", user.getPassword());
//
//                return ResponseEntity.ok(response);
//            } else {
//                Map<String, Object> response = new HashMap<>();
//                response.put("success", true);
//                response.put("userFound", false);
//                response.put("message", "User not found");
//
//                return ResponseEntity.ok(response);
//            }
//        } catch (Exception e) {
//            System.out.println("Debug login error: " + e.getMessage());
//            e.printStackTrace();
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", false);
//            response.put("error", e.getMessage());
//
//            return ResponseEntity.badRequest().body(response);
//        }
//    }
} 