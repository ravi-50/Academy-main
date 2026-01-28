package com.example.Academy.controller;

import com.example.Academy.entity.Mentor;
import com.example.Academy.service.MentorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mentors")
@CrossOrigin(origins = "*")
public class MentorController {

    @Autowired
    private MentorService mentorService;

    @GetMapping
    public ResponseEntity<List<Mentor>> getAllMentors() {
        List<Mentor> mentors = mentorService.getAllMentors();
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/cohort/{cohortId}")
    public ResponseEntity<List<Mentor>> getMentorsByCohortId(@PathVariable Long cohortId) {
        List<Mentor> mentors = mentorService.getMentorsByCohortId(cohortId);
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mentor> getMentorById(@PathVariable Long id) {
        Optional<Mentor> mentor = mentorService.getMentorById(id);
        return mentor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Mentor> createMentor(@RequestBody Mentor mentor,
            @RequestParam(required = false) Long cohortId) {
        Mentor createdMentor = mentorService.createMentor(mentor, cohortId);
        return ResponseEntity.ok(createdMentor);
    }

    @PostMapping("/{id}/assign/{cohortId}")
    public ResponseEntity<Void> assignMentor(@PathVariable Long id, @PathVariable Long cohortId) {
        mentorService.assignMentorToCohort(id, cohortId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reactivate")
    public ResponseEntity<Void> reactivateMentor(@PathVariable Long id) {
        mentorService.reactivateMentor(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/cohort/{cohortId}")
    public ResponseEntity<Void> unassignMentor(@PathVariable Long id, @PathVariable Long cohortId) {
        mentorService.unassignMentorFromCohort(id, cohortId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Mentor> updateMentor(@PathVariable Long id, @RequestBody Mentor mentor) {
        Mentor updatedMentor = mentorService.updateMentor(id, mentor);
        return updatedMentor != null ? ResponseEntity.ok(updatedMentor)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMentor(@PathVariable Long id) {
        mentorService.deleteMentor(id);
        return ResponseEntity.noContent().build();
    }
}