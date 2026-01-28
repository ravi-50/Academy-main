package com.example.Academy.controller;

import com.example.Academy.dto.user.CreateUserRequest;
import com.example.Academy.entity.User;
import com.example.Academy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.example.Academy.dto.user.UpdateUserRequest;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Get only coaches
    @GetMapping("/coaches")
    @PreAuthorize("hasAnyRole('ADMIN', 'COACH')")
    public ResponseEntity<List<User>> getCoaches() {
        return ResponseEntity.ok(
            userService.findByRoleAndStatus("COACH", "ACTIVE")
        );
    }

    // Search users by role + status
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> searchUsers(
        @RequestParam String role,
        @RequestParam String status
    ) {
        return ResponseEntity.ok(
            userService.findByRoleAndStatus(role, status)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        return ResponseEntity.ok(
            userService.createUserFromDto(request)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        return ResponseEntity.ok(
            userService.updateUserFromDto(id, request)
        );
    }
}
