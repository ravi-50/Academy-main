package com.example.Academy.controller;

import com.example.Academy.entity.Cohort;
import com.example.Academy.entity.StakeholderEffort;
import com.example.Academy.entity.User;
import com.example.Academy.entity.WeeklySummary;
import com.example.Academy.dto.effort.EffortSubmissionDTO;
import com.example.Academy.dto.effort.WeeklyEffortSubmissionDTO;
import com.example.Academy.service.CohortService;
import com.example.Academy.service.EffortService;
import com.example.Academy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/efforts")
@CrossOrigin(origins = "*")
public class EffortController {

    @Autowired
    private EffortService effortService;

    @Autowired
    private CohortService cohortService;

    @Autowired
    private UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('COACH') or hasRole('LOCATION_LEAD')")
    public ResponseEntity<StakeholderEffort> submitEffort(@RequestBody EffortSubmissionDTO effortDTO,
            Authentication authentication) {
        // Get current user
        Long currentUserId;
        if (authentication != null) {
            String empId = authentication.getName();
            User currentUser = userService.getUserByEmpId(empId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            currentUserId = currentUser.getId();
        } else {
            // Fallback for development/unprotected mode
            currentUserId = effortDTO.getTrainerMentorId();
        }

        // Create effort entity
        StakeholderEffort effort = new StakeholderEffort();
        Cohort cohort = cohortService.getCohortById(effortDTO.getCohortId())
                .orElseThrow(() -> new RuntimeException("Cohort not found"));
        User trainerMentor = userService.getUserById(effortDTO.getTrainerMentorId())
                .orElseThrow(() -> new RuntimeException("Trainer/Mentor not found"));

        effort.setCohort(cohort);
        effort.setTrainerMentor(trainerMentor);
        effort.setRole(effortDTO.getRole());
        effort.setMode(effortDTO.getMode());
        effort.setReasonVirtual(effortDTO.getReasonVirtual());
        effort.setAreaOfWork(effortDTO.getAreaOfWork());
        effort.setEffortHours(effortDTO.getEffortHours());
        effort.setEffortDate(effortDTO.getEffortDate());

        StakeholderEffort savedEffort = effortService.submitEffort(effort, currentUserId);
        return ResponseEntity.ok(savedEffort);
    }

    @PostMapping("/weekly")
    @PreAuthorize("hasRole('COACH') or hasRole('LOCATION_LEAD')")
    public ResponseEntity<Void> submitWeeklyEffort(@RequestBody WeeklyEffortSubmissionDTO weeklyDTO,
            Authentication authentication) {
        // Get current user
        Long currentUserId;
        if (authentication != null) {
            String empId = authentication.getName();
            User currentUser = userService.getUserByEmpId(empId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            currentUserId = currentUser.getId();
        } else {
            currentUserId = weeklyDTO.getCoachId();
            if (currentUserId == null) {
                throw new RuntimeException("User authentication missing and no coachId provided");
            }
        }

        effortService.submitWeeklyEffort(weeklyDTO, currentUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cohort/{cohortId}")
    public ResponseEntity<List<StakeholderEffort>> getEffortsByCohort(@PathVariable Long cohortId) {
        List<StakeholderEffort> efforts = effortService.getEffortsByCohort(cohortId);
        return ResponseEntity.ok(efforts);
    }

    @GetMapping("/cohort/{cohortId}/range")
    public ResponseEntity<List<StakeholderEffort>> getEffortsByCohortAndDateRange(
            @PathVariable Long cohortId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<StakeholderEffort> efforts = effortService.getEffortsByCohortAndDateRange(cohortId, startDate, endDate);
        return ResponseEntity.ok(efforts);
    }

    @GetMapping("/trainer-mentor/{trainerMentorId}")
    public ResponseEntity<List<StakeholderEffort>> getEffortsByTrainerMentor(@PathVariable Long trainerMentorId) {
        List<StakeholderEffort> efforts = effortService.getEffortsByTrainerMentor(trainerMentorId);
        return ResponseEntity.ok(efforts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StakeholderEffort> getEffortById(@PathVariable Long id) {
        Optional<StakeholderEffort> effort = effortService.getEffortById(id);
        return effort.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COACH') or hasRole('LOCATION_LEAD')")
    public ResponseEntity<Void> deleteEffort(@PathVariable Long id, Authentication authentication) {
        // Get current user
        String empId = authentication.getName();
        User currentUser = userService.getUserByEmpId(empId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only allow deletion by the user who submitted or admin
        StakeholderEffort effort = effortService.getEffortById(id)
                .orElseThrow(() -> new RuntimeException("Effort not found"));

        if (!effort.getUpdatedBy().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        effortService.deleteEffort(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/weekly-summary/cohort/{cohortId}")
    public ResponseEntity<List<WeeklySummary>> getWeeklySummariesByCohort(@PathVariable Long cohortId) {
        List<WeeklySummary> summaries = effortService.getWeeklySummariesByCohort(cohortId);
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/weekly-summary/cohort/{cohortId}/week")
    public ResponseEntity<WeeklySummary> getWeeklySummary(@PathVariable Long cohortId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStartDate) {
        Optional<WeeklySummary> summary = effortService.getWeeklySummary(cohortId, weekStartDate);
        return summary.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}