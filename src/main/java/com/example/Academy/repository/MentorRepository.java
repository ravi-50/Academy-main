package com.example.Academy.repository;

import com.example.Academy.entity.Mentor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MentorRepository extends JpaRepository<Mentor, Long> {

    Optional<Mentor> findByEmpId(String empId);

    Optional<Mentor> findByEmail(String email);

    boolean existsByEmpId(String empId);

    boolean existsByEmail(String email);
}