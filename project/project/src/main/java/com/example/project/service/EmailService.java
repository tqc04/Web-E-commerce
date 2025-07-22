package com.example.project.service;

import com.example.project.entity.User;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    /**
     * Send email verification
     */
    public void sendEmailVerification(User user) {
        try {
            String to = user.getEmail();
            String subject = "Email Verification";
            String verificationUrl = "http://localhost:3000/verify-email?token=" + user.getEmailVerificationToken();
            String text = "Please verify your email by clicking the link below:\n" + verificationUrl + "\n\nIf you did not request this, please ignore this email.";

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);

            logger.info("Sent email verification to: {} with token: {}", user.getEmail(), user.getEmailVerificationToken());
        } catch (Exception e) {
            logger.error("Failed to send email verification to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    /**
     * Send password reset email
     * TODO: Implement actual email sending with SMTP/Email service provider
     */
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            // For now, just log the password reset email
            logger.info("Sending password reset email to: {} with token: {}", 
                       user.getEmail(), resetToken);
            
            // TODO: Implement actual email sending
            // Example with JavaMailSender:
            // SimpleMailMessage message = new SimpleMailMessage();
            // message.setTo(user.getEmail());
            // message.setSubject("Password Reset");
            // message.setText("Reset your password: " + resetUrl);
            // mailSender.send(message);
            
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    /**
     * Send welcome email after registration
     */
    public void sendWelcomeEmail(User user) {
        try {
            logger.info("Sending welcome email to: {}", user.getEmail());
            
            // TODO: Implement actual email sending
            
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }

    /**
     * Send order confirmation email
     */
    public void sendOrderConfirmationEmail(User user, String orderNumber) {
        try {
            logger.info("Sending order confirmation email to: {} for order: {}", 
                       user.getEmail(), orderNumber);
            
            // TODO: Implement actual email sending
            
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email to: {}", user.getEmail(), e);
        }
    }
} 