package com.example.project.config;

import com.example.project.entity.User;
import com.example.project.entity.UserRole;
import com.example.project.service.UserService;
import com.example.project.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Optional;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler, ApplicationContextAware {

    @Autowired
    private JwtUtil jwtUtil;

    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext context) {
        applicationContext = context;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Lấy UserService từ ApplicationContext (tránh vòng lặp)
        UserService userService = applicationContext.getBean(UserService.class);

        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            // Nếu user đã tồn tại, Google đã xác thực thành công, cho login luôn
            User user = userOpt.get();
            String token = userService.generateToken(user);
            String redirectUrl = "http://localhost:3000/oauth2/success?token=" + token;
            response.sendRedirect(redirectUrl);
        } else {
            // Chưa có user, redirect về trang bổ sung thông tin
            String redirectUrl = "http://localhost:3000/oauth2/complete-signup?email=" + java.net.URLEncoder.encode(email, "UTF-8");
            response.sendRedirect(redirectUrl);
        }
    }
}