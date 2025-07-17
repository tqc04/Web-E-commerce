package com.example.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns(
                            "http://localhost:3000",     // React/Vite development
                            "http://localhost:3001",     // Alternative React port
                            "http://localhost:8080",     // Alternative backend port
                            "http://127.0.0.1:3000",     // Alternative localhost
                            "http://127.0.0.1:3001",     // Alternative localhost
                            "http://127.0.0.1:8080"      // Alternative localhost
                        )
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization", "Content-Type")
                        .allowCredentials(true)
                        .maxAge(3600); // 1 hour cache
            }
        };
    }
}