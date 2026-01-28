package com.example.Academy.repository;

import com.example.Academy.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByCohortId(Long cohortId);
    boolean existsByCandidateId(String candidateId);
    boolean existsByEmail(String email);
}