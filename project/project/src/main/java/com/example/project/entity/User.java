package com.example.project.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(min = 3, max = 50)
    @Column(unique = true)
    private String username;
    
    @NotBlank
    @Size(max = 100)
    @Email
    @Column(unique = true)
    private String email;
    
    @NotBlank
    @Size(min = 6, max = 100)
    private String password;
    
    @Size(max = 50)
    private String firstName;
    
    @Size(max = 50)
    private String lastName;
    
    @Size(max = 15)
    private String phoneNumber;
    
    @Lob
    private String address;
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @Column(name = "is_email_verified")
    private boolean isEmailVerified = false;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<Role> roles = new HashSet<>();
    
    // AI-related fields
    @ElementCollection
    @CollectionTable(name = "user_preferences", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "preference")
    private Set<String> preferences = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private Set<String> interests = new HashSet<>();
    
    @Column(name = "personalization_enabled")
    private boolean personalizationEnabled = true;
    
    @Column(name = "chatbot_enabled")
    private boolean chatbotEnabled = true;
    
    @Column(name = "recommendation_enabled")
    private boolean recommendationEnabled = true;
    
    // OAuth2 fields
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;
    
    private String providerId;
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserBehavior> behaviors = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChatSession> chatSessions = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
    
    public boolean isEmailVerified() {
        return isEmailVerified;
    }
    
    public void setEmailVerified(boolean emailVerified) {
        isEmailVerified = emailVerified;
    }
    
    public Set<Role> getRoles() {
        return roles;
    }
    
    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    
    public Set<String> getPreferences() {
        return preferences;
    }
    
    public void setPreferences(Set<String> preferences) {
        this.preferences = preferences;
    }
    
    public Set<String> getInterests() {
        return interests;
    }
    
    public void setInterests(Set<String> interests) {
        this.interests = interests;
    }
    
    public boolean isPersonalizationEnabled() {
        return personalizationEnabled;
    }
    
    public void setPersonalizationEnabled(boolean personalizationEnabled) {
        this.personalizationEnabled = personalizationEnabled;
    }
    
    public boolean isChatbotEnabled() {
        return chatbotEnabled;
    }
    
    public void setChatbotEnabled(boolean chatbotEnabled) {
        this.chatbotEnabled = chatbotEnabled;
    }
    
    public boolean isRecommendationEnabled() {
        return recommendationEnabled;
    }
    
    public void setRecommendationEnabled(boolean recommendationEnabled) {
        this.recommendationEnabled = recommendationEnabled;
    }
    
    public AuthProvider getProvider() {
        return provider;
    }
    
    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }
    
    public String getProviderId() {
        return providerId;
    }
    
    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<Order> getOrders() {
        return orders;
    }
    
    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
    
    public List<UserBehavior> getBehaviors() {
        return behaviors;
    }
    
    public void setBehaviors(List<UserBehavior> behaviors) {
        this.behaviors = behaviors;
    }
    
    public List<ChatSession> getChatSessions() {
        return chatSessions;
    }
    
    public void setChatSessions(List<ChatSession> chatSessions) {
        this.chatSessions = chatSessions;
    }
    
    // Helper methods
    public void addRole(Role role) {
        this.roles.add(role);
    }
    
    public void removeRole(Role role) {
        this.roles.remove(role);
    }
    
    public boolean hasRole(Role role) {
        return this.roles.contains(role);
    }
    
    public String getFullName() {
        return (firstName != null ? firstName : "") + 
               (lastName != null ? " " + lastName : "");
    }
}

enum Role {
    ADMIN,
    USER,
    MODERATOR
}

enum AuthProvider {
    LOCAL,
    GOOGLE,
    FACEBOOK
} 