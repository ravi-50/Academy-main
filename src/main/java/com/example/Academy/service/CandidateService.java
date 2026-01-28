package com.example.Academy.service;

import com.example.Academy.entity.Candidate;
import com.example.Academy.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private com.example.Academy.repository.CohortRepository cohortRepository;

    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    public List<Candidate> getCandidatesByCohortId(Long cohortId) {
        return candidateRepository.findByCohortId(cohortId);
    }

    public Optional<Candidate> getCandidateById(Long id) {
        return candidateRepository.findById(id);
    }

    public Candidate createCandidate(Candidate candidate) {
        if (candidateRepository.existsByCandidateId(candidate.getCandidateId())) {
            throw new RuntimeException("Candidate ID already exists");
        }
        if (candidate.getEmail() != null && candidateRepository.existsByEmail(candidate.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        candidate.setCreatedAt(LocalDateTime.now());
        candidate.setUpdatedAt(LocalDateTime.now());

        Candidate savedCandidate = candidateRepository.save(candidate);

        if (savedCandidate.getCohort() != null && savedCandidate.getStatus() == Candidate.Status.ACTIVE) {
            com.example.Academy.entity.Cohort cohort = savedCandidate.getCohort();
            cohort.setActiveGencCount(cohort.getActiveGencCount() + 1);
            cohortRepository.save(cohort);
        }

        return savedCandidate;
    }

    public List<Candidate> createCandidates(List<Candidate> candidates) {
        for (Candidate candidate : candidates) {
            if (candidateRepository.existsByCandidateId(candidate.getCandidateId())) {
                throw new RuntimeException("Candidate ID already exists: " + candidate.getCandidateId());
            }
            if (candidate.getEmail() != null && candidateRepository.existsByEmail(candidate.getEmail())) {
                throw new RuntimeException("Email already exists: " + candidate.getEmail());
            }
            candidate.setCreatedAt(LocalDateTime.now());
            candidate.setUpdatedAt(LocalDateTime.now());
        }
        List<Candidate> savedCandidates = candidateRepository.saveAll(candidates);

        // Group by cohort and update counts (simplified approach: iterate and update)
        // For better performance in large batches, we should group by cohort ID first.
        // given the valid use cases are small, iterating is acceptable.
        for (Candidate c : savedCandidates) {
            if (c.getCohort() != null && c.getStatus() == Candidate.Status.ACTIVE) {
                com.example.Academy.entity.Cohort cohort = cohortRepository.findById(c.getCohort().getId())
                        .orElse(null);
                if (cohort != null) {
                    cohort.setActiveGencCount(cohort.getActiveGencCount() + 1);
                    cohortRepository.save(cohort);
                }
            }
        }

        return savedCandidates;
    }

    public Candidate updateCandidate(Long id, Candidate candidateDetails) {
        Optional<Candidate> optionalCandidate = candidateRepository.findById(id);
        if (optionalCandidate.isPresent()) {
            Candidate candidate = optionalCandidate.get();
            Candidate.Status oldStatus = candidate.getStatus();

            candidate.setName(candidateDetails.getName());
            candidate.setEmail(candidateDetails.getEmail());
            candidate.setSkill(candidateDetails.getSkill());
            candidate.setLocation(candidateDetails.getLocation());

            // Only update cohort if provided, otherwise keep existing
            if (candidateDetails.getCohort() != null) {
                // Handle cohort change logic if needed (decrement old, increment new) - Out of
                // scope for simple edit
                // For now, assuming direct edit doesn't change cohort often, but if it does:
                if (!candidate.getCohort().getId().equals(candidateDetails.getCohort().getId())) {
                    // Decrement old
                    if (oldStatus == Candidate.Status.ACTIVE) {
                        com.example.Academy.entity.Cohort oldCohort = candidate.getCohort();
                        oldCohort.setActiveGencCount(Math.max(0, oldCohort.getActiveGencCount() - 1));
                        cohortRepository.save(oldCohort);
                    }
                    // Increment new (handled below by check)
                    candidate.setCohort(candidateDetails.getCohort());
                }
            }

            candidate.setStatus(candidateDetails.getStatus());
            candidate.setJoinDate(candidateDetails.getJoinDate());
            candidate.setUpdatedAt(LocalDateTime.now());

            // Update counts if status changed
            if (oldStatus != candidateDetails.getStatus()) {
                com.example.Academy.entity.Cohort cohort = candidate.getCohort();
                if (cohort != null) {
                    if (candidateDetails.getStatus() == Candidate.Status.ACTIVE) {
                        cohort.setActiveGencCount(cohort.getActiveGencCount() + 1);
                    } else if (oldStatus == Candidate.Status.ACTIVE) {
                        cohort.setActiveGencCount(Math.max(0, cohort.getActiveGencCount() - 1));
                    }
                    cohortRepository.save(cohort);
                }
            } else if (candidateDetails.getCohort() != null
                    && !candidateDetails.getCohort().getId().equals(optionalCandidate.get().getCohort().getId())
                    && candidateDetails.getStatus() == Candidate.Status.ACTIVE) {
                // Status didn't change (Active -> Active) but Cohort changed
                com.example.Academy.entity.Cohort newCohort = candidateDetails.getCohort();
                // Reload to be sure
                newCohort = cohortRepository.findById(newCohort.getId()).orElse(newCohort);
                newCohort.setActiveGencCount(newCohort.getActiveGencCount() + 1);
                cohortRepository.save(newCohort);
            }

            return candidateRepository.save(candidate);
        }
        return null;
    }

    public void deleteCandidate(Long id) {
        Optional<Candidate> candidate = candidateRepository.findById(id);
        if (candidate.isPresent()) {
            Candidate c = candidate.get();
            if (c.getCohort() != null && c.getStatus() == Candidate.Status.ACTIVE) {
                com.example.Academy.entity.Cohort cohort = c.getCohort();
                cohort.setActiveGencCount(Math.max(0, cohort.getActiveGencCount() - 1));
                cohortRepository.save(cohort);
            }
            candidateRepository.deleteById(id);
        }
    }
}