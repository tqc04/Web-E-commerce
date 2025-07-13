package com.example.project.controller;

import com.example.project.entity.User;
import com.example.project.entity.UserBehavior;
import com.example.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        try {
            Optional<User> user = userService.findById(id);
            return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tạo người dùng mới
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody Map<String, String> userRequest) {
        try {
            String username = userRequest.get("username");
            String email = userRequest.get("email");
            String password = userRequest.get("password");
            String firstName = userRequest.get("firstName");
            String lastName = userRequest.get("lastName");
            
            User createdUser = userService.createUser(username, email, password, firstName, lastName);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật thông tin người dùng
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Xóa người dùng
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Tìm người dùng theo email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        try {
            Optional<User> user = userService.findByEmail(email);
            return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Tìm người dùng theo username
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        try {
            Optional<User> user = userService.findByUsername(username);
            return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Lấy gợi ý sản phẩm cá nhân hóa
     */
    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<UserService.PersonalizedRecommendation>> getPersonalizedRecommendations(@PathVariable Long id, @RequestParam(defaultValue = "10") int limit) {
        try {
            List<UserService.PersonalizedRecommendation> recommendations = userService.getPersonalizedRecommendations(id, limit);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Cập nhật preferences người dùng
     */
    @PostMapping("/{id}/preferences")
    public ResponseEntity<Void> updateUserPreferences(@PathVariable Long id, @RequestBody List<String> preferences) {
        try {
            userService.updateUserPreferences(id, preferences);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Phân tích hành vi người dùng
     */
    @PostMapping("/{id}/behavior")
    public ResponseEntity<Void> analyzeUserBehavior(@PathVariable Long id, @RequestBody UserBehavior behavior) {
        try {
            userService.analyzeUserBehavior(id, behavior);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Lấy thông tin chi tiết người dùng
     */
    @GetMapping("/{id}/insights")
    public ResponseEntity<UserService.UserInsights> getUserInsights(@PathVariable Long id) {
        try {
            UserService.UserInsights insights = userService.getUserInsights(id);
            return ResponseEntity.ok(insights);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 