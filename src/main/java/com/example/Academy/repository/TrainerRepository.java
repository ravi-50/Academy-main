package com.example.Academy.repository;

import com.example.Academy.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {

    Optional<Trainer> findByEmpId(String empId);

    Optional<Trainer> findByEmail(String email);

    boolean existsByEmpId(String empId);

    boolean existsByEmail(String email);
}