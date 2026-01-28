package com.example.Academy.controller;

import com.example.Academy.entity.Candidate;
import com.example.Academy.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @GetMapping
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        List<Candidate> candidates = candidateService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/cohort/{cohortId}")
    public ResponseEntity<List<Candidate>> getCandidatesByCohortId(@PathVariable Long cohortId) {
        List<Candidate> candidates = candidateService.getCandidatesByCohortId(cohortId);
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable Long id) {
        Optional<Candidate> candidate = candidateService.getCandidateById(id);
        return candidate.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<Candidate> createCandidate(@RequestBody Candidate candidate) {
        try {
            Candidate createdCandidate = candidateService.createCandidate(candidate);
            return ResponseEntity.ok(createdCandidate);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<List<Candidate>> createCandidates(@RequestBody List<Candidate> candidates) {
        try {
            List<Candidate> createdCandidates = candidateService.createCandidates(candidates);
            return ResponseEntity.ok(createdCandidates);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<Candidate> updateCandidate(@PathVariable Long id, @RequestBody Candidate candidate) {
        Candidate updatedCandidate = candidateService.updateCandidate(id, candidate);
        return updatedCandidate != null ? ResponseEntity.ok(updatedCandidate)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COACH')")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }
}