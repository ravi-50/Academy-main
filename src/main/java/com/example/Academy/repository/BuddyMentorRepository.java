package com.example.Academy.repository;

import com.example.Academy.entity.BuddyMentor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuddyMentorRepository extends JpaRepository<BuddyMentor, Long> {

    Optional<BuddyMentor> findByEmpId(String empId);

    Optional<BuddyMentor> findByEmail(String email);

    boolean existsByEmpId(String empId);

    boolean existsByEmail(String email);
}