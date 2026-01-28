package com.example.Academy.controller;

import com.example.Academy.entity.User;
import com.example.Academy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            User user = userService.getUserByEmail(loginRequest.getEmail()).orElseThrow();

            return ResponseEntity.ok(new AuthResponse(
                    "Login successful",
                    null,
                    user.getId(),
                    user.getEmail(),
                    user.getName(),
                    user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        // Getters and setters
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
    }

    public static class AuthResponse {
        private String message;
        private String token;
        private Long userId;
        private String email;
        private String name;
        private String role;

        public AuthResponse(String message, String token, Long userId, String email, String name, String role) {
            this.message = message;
            this.token = token;
            this.userId = userId;
            this.email = email;
            this.name = name;
            this.role = role;
        }

        // Getters
        public String getMessage() {
            return message;
        }

        public String getToken() {
            return token;
        }

        public Long getUserId() {
            return userId;
        }

        public String getEmail() {
            return email;
        }

        public String getName() {
            return name;
        }

        public String getRole() {
            return role;
        }
    }
}