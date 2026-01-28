package com.example.Academy.service;

import com.example.Academy.entity.Mentor;
import com.example.Academy.entity.CohortMentorMapping;
import com.example.Academy.repository.MentorRepository;
import com.example.Academy.repository.CohortMentorMappingRepository;
import com.example.Academy.repository.CohortRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MentorService {

    @Autowired
    private MentorRepository mentorRepository;

    @Autowired
    private CohortMentorMappingRepository mappingRepository;

    @Autowired
    private CohortRepository cohortRepository;

    public List<Mentor> getAllMentors() {
        return mentorRepository.findAll();
    }

    public List<Mentor> getMentorsByCohortId(Long cohortId) {
        List<CohortMentorMapping> mappings = mappingRepository.findByCohortId(cohortId);
        return mappings.stream()
                .map(CohortMentorMapping::getMentor)
                .collect(Collectors.toList());
    }

    public Optional<Mentor> getMentorById(Long id) {
        return mentorRepository.findById(id);
    }

    @org.springframework.transaction.annotation.Transactional
    public Mentor createMentor(Mentor mentor, Long cohortId) {
        if (mentorRepository.existsByEmail(mentor.getEmail())) {
            throw new RuntimeException("Mentor with email " + mentor.getEmail() + " already exists");
        }
        if (mentorRepository.existsByEmpId(mentor.getEmpId())) {
            throw new RuntimeException("Mentor with Employee ID " + mentor.getEmpId() + " already exists");
        }
        mentor.setCreatedAt(LocalDateTime.now());
        mentor.setUpdatedAt(LocalDateTime.now());
        Mentor savedMentor = mentorRepository.save(mentor);

        if (cohortId != null) {
            assignMentorToCohort(savedMentor.getId(), cohortId);
        }

        return savedMentor;
    }

    @org.springframework.transaction.annotation.Transactional
    public void assignMentorToCohort(Long mentorId, Long cohortId) {
        mentorRepository.findById(mentorId).ifPresent(mentor -> {
            cohortRepository.findById(cohortId).ifPresent(cohort -> {
                if (!mappingRepository.existsByCohortIdAndMentorId(cohortId, mentorId)) {
                    CohortMentorMapping mapping = new CohortMentorMapping();
                    mapping.setCohort(cohort);
                    mapping.setMentor(mentor);
                    mapping.setRole(CohortMentorMapping.Role.MENTOR);
                    mapping.setCreatedAt(LocalDateTime.now());
                    mappingRepository.save(mapping);
                }
            });
        });
    }

    public Mentor updateMentor(Long id, Mentor mentor) {
        return mentorRepository.findById(id).map(existing -> {
            existing.setEmpId(mentor.getEmpId());
            existing.setName(mentor.getName());
            existing.setEmail(mentor.getEmail());
            existing.setPhone(mentor.getPhone());
            existing.setMentorType(mentor.getMentorType());
            existing.setSkill(mentor.getSkill());
            existing.setInternal(mentor.isInternal());
            existing.setTrainingStartDate(mentor.getTrainingStartDate());
            existing.setTrainingEndDate(mentor.getTrainingEndDate());
            existing.setAvatarUrl(mentor.getAvatarUrl());
            existing.setUpdatedAt(LocalDateTime.now());
            // status is preserved
            return mentorRepository.save(existing);
        }).orElse(null);
    }

    @org.springframework.transaction.annotation.Transactional
    public void unassignMentorFromCohort(Long mentorId, Long cohortId) {
        mappingRepository.deleteByCohortIdAndMentorId(cohortId, mentorId);
    }

    public void deleteMentor(Long id) {
        mentorRepository.findById(id).ifPresent(mentor -> {
            mentor.setStatus("INACTIVE");
            mentor.setUpdatedAt(LocalDateTime.now());
            mentorRepository.save(mentor);
        });
    }

    public void reactivateMentor(Long id) {
        mentorRepository.findById(id).ifPresent(mentor -> {
            mentor.setStatus("ACTIVE");
            mentor.setUpdatedAt(LocalDateTime.now());
            mentorRepository.save(mentor);
        });
    }
}