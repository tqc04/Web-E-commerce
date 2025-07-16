package com.example.project.service;

import com.example.project.entity.User;
import com.example.project.entity.UserRole;
import com.example.project.dto.UserCreateRequest;
import com.example.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Authenticate user with username/email and password
     */
    public Optional<User> authenticateUser(String usernameOrEmail, String password) {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(usernameOrEmail);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Check if user is active and password matches
            if (user.getIsActive() && passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }

    /**
     * Generate JWT token for user (simplified implementation)
     */
    public String generateToken(User user) {
        // This is a simplified token generation
        // In production, use proper JWT library like jjwt
        return "jwt_token_" + user.getId() + "_" + user.getUsername();
    }

    /**
     * Update last login timestamp
     */
    public void updateLastLogin(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    /**
     * Create new user
     */
    public User createUser(UserCreateRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : UserRole.USER)
                .isActive(true)
                .isEmailVerified(false)
                .personalizationEnabled(true)
                .recommendationEnabled(true)
                .chatbotEnabled(true)
                .build();

        // Generate email verification token
        user.setEmailVerificationToken(UUID.randomUUID().toString());
        user.setEmailVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24)); // 24 hour expiry

        return userRepository.save(user);
    }

    /**
     * Find user by username
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Check if username exists
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Generate password reset token
     */
    public String generatePasswordResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setPasswordResetToken(token);
            user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusHours(1)); // 1 hour expiry
            userRepository.save(user);
            return token;
        }
        return null;
    }

    /**
     * Reset password using token
     */
    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByPasswordResetToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Check if token is still valid
            if (user.getPasswordResetTokenExpiresAt() != null &&
                user.getPasswordResetTokenExpiresAt().isAfter(LocalDateTime.now())) {
                
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setPasswordResetToken(null);
                user.setPasswordResetTokenExpiresAt(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    /**
     * Verify email using token
     */
    public boolean verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByEmailVerificationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isEmailVerificationTokenValid()) {
                user.setIsEmailVerified(true);
                user.setEmailVerificationToken(null);
                user.setEmailVerificationTokenExpiresAt(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    /**
     * Get all users (admin function)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Update user profile
     */
    public User updateUserProfile(Long userId, UserCreateRequest updateRequest) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            if (updateRequest.getFirstName() != null) {
                user.setFirstName(updateRequest.getFirstName());
            }
            if (updateRequest.getLastName() != null) {
                user.setLastName(updateRequest.getLastName());
            }
            if (updateRequest.getPhoneNumber() != null) {
                user.setPhoneNumber(updateRequest.getPhoneNumber());
            }
            if (updateRequest.getEmail() != null && !updateRequest.getEmail().equals(user.getEmail())) {
                user.setEmail(updateRequest.getEmail());
                user.setIsEmailVerified(false); // Need to re-verify email
            }
            
            return userRepository.save(user);
        }
        return null;
    }

    /**
     * Change user password
     */
    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify current password
            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    /**
     * Activate or deactivate user
     */
    public boolean toggleUserStatus(Long userId, boolean isActive) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsActive(isActive);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    /**
     * Extract user ID from JWT token (simplified implementation)
     */
    public Long getUserIdFromToken(String token) {
        // Simplified token parsing - in production use proper JWT library
        if (token != null && token.startsWith("jwt_token_")) {
            try {
                String[] parts = token.split("_");
                if (parts.length >= 3) {
                    return Long.parseLong(parts[2]);
                }
            } catch (NumberFormatException e) {
                // Invalid token format
                return null;
            }
        }
        return null;
    }

    /**
     * Find user by ID - alias for getUserById for consistency
     */
    public Optional<User> findById(Long id) {
        return getUserById(id);
    }

    /**
     * Save user - wrapper for repository save
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * Check password for debugging (remove in production)
     */
    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Reset admin password (for testing purposes)
     */
    public boolean resetAdminPassword(String newPassword) {
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(admin);
            return true;
        }
        return false;
    }
} 
