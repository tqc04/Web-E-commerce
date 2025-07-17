package com.example.project.dto;

import com.example.project.entity.User;

import java.time.LocalDateTime;
import java.util.Set;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private Boolean chatbotEnabled;
    private Boolean recommendationEnabled;
    private Boolean personalizationEnabled;
    private String providerId;
    private String role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Static factory method to convert from User entity
    public static UserDTO from(User user) {
        UserDTO dto = new UserDTO();
        dto.id = user.getId();
        dto.username = user.getUsername();
        dto.email = user.getEmail();
        dto.firstName = user.getFirstName();
        dto.lastName = user.getLastName();
        dto.phoneNumber = user.getPhoneNumber();
        dto.address = user.getAddress();
        dto.isActive = user.isActive(); 
        dto.isEmailVerified = user.isEmailVerified(); 
        dto.chatbotEnabled = user.isChatbotEnabled(); 
        dto.recommendationEnabled = user.isRecommendationEnabled(); 
        dto.personalizationEnabled = user.isPersonalizationEnabled(); 
        dto.providerId = user.getProviderId();
        dto.createdAt = user.getCreatedAt();
        dto.updatedAt = user.getUpdatedAt();
        dto.role = user.getRole() != null ? user.getRole().name() : null;
        return dto;
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

    public Boolean getIsActive() { 
        return isActive; 
    }
    
    public void setIsActive(Boolean isActive) { 
        this.isActive = isActive; 
    }

    public Boolean getIsEmailVerified() { 
        return isEmailVerified; 
    }
    
    public void setIsEmailVerified(Boolean isEmailVerified) { 
        this.isEmailVerified = isEmailVerified; 
    }

    public Boolean getChatbotEnabled() { 
        return chatbotEnabled; 
    }
    
    public void setChatbotEnabled(Boolean chatbotEnabled) { 
        this.chatbotEnabled = chatbotEnabled; 
    }

    public Boolean getRecommendationEnabled() { 
        return recommendationEnabled; 
    }
    
    public void setRecommendationEnabled(Boolean recommendationEnabled) { 
        this.recommendationEnabled = recommendationEnabled; 
    }

    public Boolean getPersonalizationEnabled() { 
        return personalizationEnabled; 
    }
    
    public void setPersonalizationEnabled(Boolean personalizationEnabled) { 
        this.personalizationEnabled = personalizationEnabled; 
    }

    public String getProviderId() { 
        return providerId; 
    }
    
    public void setProviderId(String providerId) { 
        this.providerId = providerId; 
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

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
} 