package com.example.project.controller;

import com.example.project.dto.UserDTO;
import com.example.project.entity.User;
import com.example.project.entity.UserBehavior;
import com.example.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Lấy thông tin người dùng
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(UserDTO.from(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tạo người dùng mới
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody Map<String, String> userRequest) {
        try {
            String username = userRequest.get("username");
            String email = userRequest.get("email");
            String password = userRequest.get("password");
            String firstName = userRequest.get("firstName");
            String lastName = userRequest.get("lastName");
            
            User createdUser = userService.createUser(username, email, password, firstName, lastName);
            return ResponseEntity.ok(UserDTO.from(createdUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tìm người dùng theo email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        try {
            Optional<User> user = userService.findByEmail(email);
            if (user.isPresent()) {
                return ResponseEntity.ok(UserDTO.from(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tìm người dùng theo username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        try {
            Optional<User> user = userService.findByUsername(username);
            if (user.isPresent()) {
                return ResponseEntity.ok(UserDTO.from(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Đăng nhập người dùng
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            if (username == null || password == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username and password are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Find user by username
            Optional<User> userOpt = userService.findByUsername(username);
            if (!userOpt.isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "User not found");
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            
            // Simple password check (in real app, use password hashing)
            if (!"password123".equals(password)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid password");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Create response with token and user info using DTO
            Map<String, Object> response = new HashMap<>();
            response.put("token", "jwt_token_" + user.getId() + "_" + System.currentTimeMillis());
            response.put("user", UserDTO.from(user));
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Đăng ký người dùng mới
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String username = registerRequest.get("username");
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");
            String firstName = registerRequest.get("firstName");
            String lastName = registerRequest.get("lastName");
            
            if (username == null || email == null || password == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username, email and password are required");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if user already exists
            if (userService.findByUsername(username).isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Username already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (userService.findByEmail(email).isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Email already exists");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            User createdUser = userService.createUser(username, email, password, firstName, lastName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("user", UserDTO.from(createdUser));
            response.put("success", true);
            response.put("message", "User created successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Users API is working!");
    }
} 