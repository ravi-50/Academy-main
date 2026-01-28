package com.example.Academy.controller;

import com.example.Academy.entity.Trainer;
import com.example.Academy.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "*")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        List<Trainer> trainers = trainerService.getAllTrainers();
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/cohort/{cohortId}")
    public ResponseEntity<List<Trainer>> getTrainersByCohortId(@PathVariable Long cohortId) {
        List<Trainer> trainers = trainerService.getTrainersByCohortId(cohortId);
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getTrainerById(@PathVariable Long id) {
        Optional<Trainer> trainer = trainerService.getTrainerById(id);
        return trainer.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Trainer> createTrainer(@RequestBody Trainer trainer,
            @RequestParam(required = false) Long cohortId) {
        Trainer createdTrainer = trainerService.createTrainer(trainer, cohortId);
        return ResponseEntity.ok(createdTrainer);
    }

    @PostMapping("/{id}/assign/{cohortId}")
    public ResponseEntity<Void> assignTrainer(@PathVariable Long id, @PathVariable Long cohortId) {
        trainerService.assignTrainerToCohort(id, cohortId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reactivate")
    public ResponseEntity<Void> reactivateTrainer(@PathVariable Long id) {
        trainerService.reactivateTrainer(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/cohort/{cohortId}")
    public ResponseEntity<Void> unassignTrainer(@PathVariable Long id, @PathVariable Long cohortId) {
        trainerService.unassignTrainerFromCohort(id, cohortId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        Trainer updatedTrainer = trainerService.updateTrainer(id, trainer);
        return updatedTrainer != null ? ResponseEntity.ok(updatedTrainer)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }
}