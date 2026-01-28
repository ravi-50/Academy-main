package com.example.Academy.config;

import com.example.Academy.entity.User;
import com.example.Academy.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin User
            User admin = new User();
            admin.setEmpId("admin1001");
            admin.setName("Admin User");
            admin.setEmail("admin@academy.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setEmployeeType(User.EmployeeType.INTERNAL);
            admin.setStatus(User.Status.ACTIVE);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);

            // Create Coach User 1
            User coach1 = new User();
            coach1.setEmpId("coach2001");
            coach1.setName("Coach One");
            coach1.setEmail("coach1@academy.com");
            coach1.setPassword(passwordEncoder.encode("coach123"));
            coach1.setRole(User.Role.COACH);
            coach1.setEmployeeType(User.EmployeeType.INTERNAL);
            coach1.setStatus(User.Status.ACTIVE);
            coach1.setCreatedAt(LocalDateTime.now());
            coach1.setUpdatedAt(LocalDateTime.now());
            userRepository.save(coach1);

            // Create Coach User 2
            User coach2 = new User();
            coach2.setEmpId("coach2002");
            coach2.setName("Coach Two");
            coach2.setEmail("coach2@academy.com");
            coach2.setPassword(passwordEncoder.encode("coach123"));
            coach2.setRole(User.Role.COACH);
            coach2.setEmployeeType(User.EmployeeType.EXTERNAL);
            coach2.setStatus(User.Status.ACTIVE);
            coach2.setCreatedAt(LocalDateTime.now());
            coach2.setUpdatedAt(LocalDateTime.now());
            userRepository.save(coach2);

            System.out.println("Users loaded successfully.");
        } else {
            System.out.println("Users already exist. Skipping data loading.");
        }
    }
}
