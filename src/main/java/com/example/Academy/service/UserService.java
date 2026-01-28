package com.example.Academy.service;

import com.example.Academy.dto.user.CreateUserRequest;
import com.example.Academy.dto.user.UpdateUserRequest;
import com.example.Academy.entity.User;
import com.example.Academy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        if (userRepository.existsByEmpId(user.getEmpId())) {
            throw new RuntimeException("Employee ID already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User createUserFromDto(CreateUserRequest request) {

    if (userRepository.existsByEmpId(request.getEmpId())) {
        throw new RuntimeException("Employee ID already exists");
    }

    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    User user = new User();
    user.setEmpId(request.getEmpId());
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));

    user.setRole(User.Role.valueOf(request.getRole()));
    user.setEmployeeType(User.EmployeeType.valueOf(request.getEmployeeType()));

    user.setSkill(request.getSkill());
    user.setLocation(request.getLocation());

    user.setStatus(User.Status.ACTIVE);
    user.setAssignedCohorts(0);
    user.setCreatedAt(java.time.LocalDateTime.now());

    return userRepository.save(user);
}

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmpId(String empId) {
        return userRepository.findByEmpId(empId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check for duplicate empId
        if (!user.getEmpId().equals(userDetails.getEmpId()) &&
            userRepository.existsByEmpId(userDetails.getEmpId())) {
            throw new RuntimeException("Employee ID already exists");
        }

        // Check for duplicate email
        if (!user.getEmail().equals(userDetails.getEmail()) &&
            userRepository.existsByEmail(userDetails.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        user.setEmpId(userDetails.getEmpId());
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }

        if (userDetails.getEmployeeType() != null) {
            user.setEmployeeType(userDetails.getEmployeeType());
        }

        // Only allow skill for non-coach/non-admin roles (future-proof)
        if (user.getRole() != User.Role.COACH && user.getRole() != User.Role.ADMIN) {
            user.setSkill(userDetails.getSkill());
        } else {
            user.setSkill(null);
        }

        user.setLocation(userDetails.getLocation());
        user.setAssignedCohorts(userDetails.getAssignedCohorts());
        user.setStatus(userDetails.getStatus());
        user.setTrainingStartDate(userDetails.getTrainingStartDate());
        user.setTrainingEndDate(userDetails.getTrainingEndDate());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return userRepository.save(user);
    }

    public User updateUserFromDto(Long id, UpdateUserRequest request) {
    User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getEmpId().equals(request.getEmpId()) &&
        userRepository.existsByEmpId(request.getEmpId())) {
        throw new RuntimeException("Employee ID already exists");
    }

    if (!user.getEmail().equals(request.getEmail()) &&
        userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    user.setEmpId(request.getEmpId());
    user.setName(request.getName());
    user.setEmail(request.getEmail());
    user.setEmployeeType(User.EmployeeType.valueOf(request.getEmployeeType()));
    user.setLocation(request.getLocation());

    return userRepository.save(user);
}

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean authenticateUser(String empId, String password) {
        Optional<User> user = userRepository.findByEmpId(empId);
        if (user.isPresent()) {
            return passwordEncoder.matches(password, user.get().getPassword());
        }
        return false;
    }

    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .toList();
    }
    public List<User> findByRoleAndStatus(String role, String status) {
    return userRepository.findByRoleAndStatus(
        User.Role.valueOf(role),
        User.Status.valueOf(status)
    );
}


}