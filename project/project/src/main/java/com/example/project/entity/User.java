package com.example.project.entity;

import com.example.project.entity.Order;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(name = "date_of_birth")
    private LocalDateTime dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private UserRole role = UserRole.USER;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;

    @Column(name = "email_verification_token")
    private String emailVerificationToken;

    @Column(name = "email_verification_token_expires_at")
    private LocalDateTime emailVerificationTokenExpiresAt;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expires_at")
    private LocalDateTime passwordResetTokenExpiresAt;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    @Column(name = "login_attempts")
    private Integer loginAttempts = 0;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "country")
    private String country;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "provider_id")
    private String providerId;

    // User behavior and personalization settings  
    @Column(name = "interests", columnDefinition = "TEXT")
    private String interests; // JSON string for user interests

    @Column(name = "preferences", columnDefinition = "TEXT")
    private String preferences; // JSON string for user preferences

    @Column(name = "behaviors", columnDefinition = "TEXT") 
    private String behaviors; // JSON string for user behavior data
    
    @Column(name = "personalization_enabled")
    private Boolean personalizationEnabled = true;
    
    @Column(name = "chatbot_enabled")
    private Boolean chatbotEnabled = true;
    
    @Column(name = "recommendation_enabled")
    private Boolean recommendationEnabled = true;

    @Column(name = "notification_settings", columnDefinition = "TEXT")
    private String notificationSettings; // JSON string for notification preferences

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_favorite_products", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "product_id")
    private Set<Long> favoriteProductIds = new HashSet<>();
    
    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public User() {}
    
    public User(String username, String email, String password, String firstName, String lastName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = UserRole.USER;
        this.isActive = true;
        this.isEmailVerified = false;
        this.personalizationEnabled = true;
        this.chatbotEnabled = true;
        this.recommendationEnabled = true;
        this.loginAttempts = 0;
        this.favoriteProductIds = new HashSet<>();
        this.orders = new ArrayList<>();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDateTime getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDateTime dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsEmailVerified() { return isEmailVerified; }
    public void setIsEmailVerified(Boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }

    public String getEmailVerificationToken() { return emailVerificationToken; }
    public void setEmailVerificationToken(String emailVerificationToken) { this.emailVerificationToken = emailVerificationToken; }

    public LocalDateTime getEmailVerificationTokenExpiresAt() { return emailVerificationTokenExpiresAt; }
    public void setEmailVerificationTokenExpiresAt(LocalDateTime emailVerificationTokenExpiresAt) { this.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt; }

    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }

    public LocalDateTime getPasswordResetTokenExpiresAt() { return passwordResetTokenExpiresAt; }
    public void setPasswordResetTokenExpiresAt(LocalDateTime passwordResetTokenExpiresAt) { this.passwordResetTokenExpiresAt = passwordResetTokenExpiresAt; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public Integer getLoginAttempts() { return loginAttempts; }
    public void setLoginAttempts(Integer loginAttempts) { this.loginAttempts = loginAttempts; }

    public LocalDateTime getLockedUntil() { return lockedUntil; }
    public void setLockedUntil(LocalDateTime lockedUntil) { this.lockedUntil = lockedUntil; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getPreferences() { return preferences; }
    public void setPreferences(String preferences) { this.preferences = preferences; }

    public String getBehaviors() { return behaviors; }
    public void setBehaviors(String behaviors) { this.behaviors = behaviors; }

    public Boolean getPersonalizationEnabled() { return personalizationEnabled; }
    public void setPersonalizationEnabled(Boolean personalizationEnabled) { this.personalizationEnabled = personalizationEnabled; }

    public Boolean getChatbotEnabled() { return chatbotEnabled; }
    public void setChatbotEnabled(Boolean chatbotEnabled) { this.chatbotEnabled = chatbotEnabled; }

    public Boolean getRecommendationEnabled() { return recommendationEnabled; }
    public void setRecommendationEnabled(Boolean recommendationEnabled) { this.recommendationEnabled = recommendationEnabled; }

    public String getNotificationSettings() { return notificationSettings; }
    public void setNotificationSettings(String notificationSettings) { this.notificationSettings = notificationSettings; }

    public Set<Long> getFavoriteProductIds() { return favoriteProductIds; }
    public void setFavoriteProductIds(Set<Long> favoriteProductIds) { this.favoriteProductIds = favoriteProductIds; }

    public List<Order> getOrders() { return orders; }
    public void setOrders(List<Order> orders) { this.orders = orders; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Boolean getter methods for compatibility
    public Boolean isActive() { return this.getIsActive(); }
    public Boolean isEmailVerified() { return this.getIsEmailVerified(); }
    public Boolean isChatbotEnabled() { return this.getChatbotEnabled(); }
    public Boolean isRecommendationEnabled() { return this.getRecommendationEnabled(); }
    public Boolean isPersonalizationEnabled() { return this.getPersonalizationEnabled(); }

    // Utility methods for preferences and interests (Set conversions)
    public void setPreferences(Set<String> preferencesSet) {
        this.preferences = preferencesSet != null ? String.join(",", preferencesSet) : null;
    }

    public Set<String> getPreferencesAsSet() {
        if (preferences == null || preferences.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(Arrays.asList(preferences.split(",")));
    }

    public void setInterests(Set<String> interestsSet) {
        this.interests = interestsSet != null ? String.join(",", interestsSet) : null;
    }

    public Set<String> getInterestsAsSet() {
        if (interests == null || interests.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(Arrays.asList(interests.split(",")));
    }

    // Custom methods
    public boolean isAccountLocked() {
        return lockedUntil != null && lockedUntil.isAfter(LocalDateTime.now());
    }

    public boolean isEmailVerificationTokenValid() {
        return emailVerificationToken != null && 
               emailVerificationTokenExpiresAt != null && 
               emailVerificationTokenExpiresAt.isAfter(LocalDateTime.now());
    }

    public boolean isPasswordResetTokenValid() {
        return passwordResetToken != null && 
               passwordResetTokenExpiresAt != null && 
               passwordResetTokenExpiresAt.isAfter(LocalDateTime.now());
    }

    public void incrementLoginAttempts() {
        this.loginAttempts = (this.loginAttempts == null) ? 1 : this.loginAttempts + 1;
    }

    public void resetLoginAttempts() {
        this.loginAttempts = 0;
        this.lockedUntil = null;
    }

    public void lockAccount(int lockDurationMinutes) {
        this.lockedUntil = LocalDateTime.now().plusMinutes(lockDurationMinutes);
    }

    public String getFullName() {
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }

    // Builder pattern
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private User user = new User();

        public UserBuilder username(String username) { user.username = username; return this; }
        public UserBuilder email(String email) { user.email = email; return this; }
        public UserBuilder password(String password) { user.password = password; return this; }
        public UserBuilder firstName(String firstName) { user.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { user.lastName = lastName; return this; }
        public UserBuilder phoneNumber(String phoneNumber) { user.phoneNumber = phoneNumber; return this; }
        public UserBuilder role(UserRole role) { user.role = role; return this; }
        public UserBuilder isActive(Boolean isActive) { user.isActive = isActive; return this; }
        public UserBuilder isEmailVerified(Boolean isEmailVerified) { user.isEmailVerified = isEmailVerified; return this; }
        public UserBuilder personalizationEnabled(Boolean enabled) { user.personalizationEnabled = enabled; return this; }
        public UserBuilder recommendationEnabled(Boolean enabled) { user.recommendationEnabled = enabled; return this; }
        public UserBuilder chatbotEnabled(Boolean enabled) { user.chatbotEnabled = enabled; return this; }

        public User build() { return user; }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
} 