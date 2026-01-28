package com.example.Academy.repository;

import com.example.Academy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmpId(String empId);

    Optional<User> findByEmail(String email);

    boolean existsByEmpId(String empId);

    boolean existsByEmail(String email);

    List<User> findByRoleAndStatus(User.Role role, User.Status status);

}
