package com.example.Academy.service;

import com.example.Academy.entity.Cohort;
import com.example.Academy.entity.StakeholderEffort;
import com.example.Academy.entity.User;
import com.example.Academy.entity.WeeklySummary;
import com.example.Academy.repository.CohortRepository;
import com.example.Academy.repository.StakeholderEffortRepository;
import com.example.Academy.repository.UserRepository;
import com.example.Academy.repository.WeeklySummaryRepository;
import com.example.Academy.dto.effort.WeeklyEffortSubmissionDTO;
import com.example.Academy.dto.effort.DayLogDTO;
import com.example.Academy.dto.effort.EffortDetailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EffortService {

    @Autowired
    private StakeholderEffortRepository effortRepository;

    @Autowired
    private CohortRepository cohortRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeeklySummaryRepository weeklySummaryRepository;

    @Autowired
    private EmailService emailService;

    public StakeholderEffort submitEffort(StakeholderEffort effort, Long userId) {
        // Validate cohort exists
        Cohort cohort = cohortRepository.findById(effort.getCohort().getId())
                .orElseThrow(() -> new RuntimeException("Cohort not found"));

        // Validate trainer/mentor exists
        if (!userRepository.existsById(effort.getTrainerMentor().getId())) {
            throw new RuntimeException("Trainer/Mentor not found");
        }

        // Set updated by
        User updatedBy = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        effort.setUpdatedBy(updatedBy);
        effort.setUpdatedDate(LocalDateTime.now());

        // Set month from date
        effort.setMonth(effort.getEffortDate().getMonth().toString());

        StakeholderEffort savedEffort = effortRepository.save(effort);

        // Update weekly summary
        updateWeeklySummary(cohort, effort.getEffortDate());

        // Send email notification
        emailService.sendDailyEffortNotification(savedEffort);

        return savedEffort;
    }

    public List<StakeholderEffort> getEffortsByCohort(Long cohortId) {
        return effortRepository.findByCohortId(cohortId);
    }

    public List<StakeholderEffort> getEffortsByCohortAndDateRange(Long cohortId, LocalDate startDate,
            LocalDate endDate) {
        return effortRepository.findByCohortIdAndEffortDateBetween(cohortId, startDate, endDate);
    }

    public List<StakeholderEffort> getEffortsByTrainerMentor(Long trainerMentorId) {
        return effortRepository.findByTrainerMentorId(trainerMentorId);
    }

    public Optional<StakeholderEffort> getEffortById(Long id) {
        return effortRepository.findById(id);
    }

    public void deleteEffort(Long id) {
        StakeholderEffort effort = effortRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Effort not found"));

        effortRepository.deleteById(id);

        // Update weekly summary after deletion
        updateWeeklySummary(effort.getCohort(), effort.getEffortDate());
    }

    private void updateWeeklySummary(Cohort cohort, LocalDate effortDate) {
        // Find Monday of the week containing the effort date
        LocalDate weekStart = effortDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate weekEnd = weekStart.plusDays(6);

        // Calculate total hours for the week
        Double totalHoursDouble = effortRepository.sumEffortHoursByCohortAndDateRange(
                cohort.getId(), weekStart, weekEnd);
        BigDecimal totalHours = totalHoursDouble != null ? BigDecimal.valueOf(totalHoursDouble) : BigDecimal.ZERO;

        // Find or create weekly summary
        Optional<WeeklySummary> existingSummary = weeklySummaryRepository
                .findByCohortIdAndWeekStartDate(cohort.getId(), weekStart);

        WeeklySummary summary;
        if (existingSummary.isPresent()) {
            summary = existingSummary.get();
            summary.setTotalHours(totalHours);
            summary.setSummaryDate(LocalDateTime.now());
        } else {
            summary = new WeeklySummary(cohort, weekStart, weekEnd, totalHours);
        }

        WeeklySummary savedSummary = weeklySummaryRepository.save(summary);

        // Send weekly summary email if it's Friday
        if (LocalDate.now().getDayOfWeek().name().equals("FRIDAY")) {
            emailService.sendWeeklySummaryNotification(savedSummary);
        }
    }

    public List<WeeklySummary> getWeeklySummariesByCohort(Long cohortId) {
        // This would need a custom query, but for now return all and filter in service
        return weeklySummaryRepository.findAll().stream()
                .filter(summary -> summary.getCohort().getId().equals(cohortId))
                .toList();
    }

    public Optional<WeeklySummary> getWeeklySummary(Long cohortId, LocalDate weekStartDate) {
        return weeklySummaryRepository.findByCohortIdAndWeekStartDate(cohortId, weekStartDate);
    }

    public void submitWeeklyEffort(WeeklyEffortSubmissionDTO dto, Long userId) {
        Cohort cohort = cohortRepository.findById(dto.getCohortId())
                .orElseThrow(() -> new RuntimeException("Cohort not found"));

        User submittedBy = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Clear existing efforts for this week to allow clean overwrite
        List<StakeholderEffort> existing = effortRepository.findByCohortIdAndEffortDateBetween(
                cohort.getId(), dto.getWeekStartDate(), dto.getWeekEndDate());
        effortRepository.deleteAll(existing);

        if (dto.getDayLogs() != null) {
            for (DayLogDTO dayLog : dto.getDayLogs()) {
                if (dayLog.isHoliday())
                    continue;

                // Trainer Log
                if (dayLog.getTrainer() != null && dayLog.getTrainer().getHours() != null
                        && dayLog.getTrainer().getHours().compareTo(BigDecimal.ZERO) > 0) {
                    saveDayEffort(cohort, cohort.getPrimaryTrainer(), StakeholderEffort.Role.TRAINER,
                            dayLog.getDate(), dayLog.getTrainer(), submittedBy);
                }

                // Mentor Log
                if (dayLog.getMentor() != null && dayLog.getMentor().getHours() != null
                        && dayLog.getMentor().getHours().compareTo(BigDecimal.ZERO) > 0) {
                    saveDayEffort(cohort, cohort.getPrimaryMentor(), StakeholderEffort.Role.MENTOR,
                            dayLog.getDate(), dayLog.getMentor(), submittedBy);
                }

                // Buddy Mentor Log
                if (dayLog.getBuddyMentor() != null && dayLog.getBuddyMentor().getHours() != null
                        && dayLog.getBuddyMentor().getHours().compareTo(BigDecimal.ZERO) > 0) {
                    saveDayEffort(cohort, cohort.getBuddyMentor(), StakeholderEffort.Role.BUDDY_MENTOR,
                            dayLog.getDate(), dayLog.getBuddyMentor(), submittedBy);
                }
            }
        }

        updateWeeklySummary(cohort, dto.getWeekStartDate());
    }

    private void saveDayEffort(Cohort cohort, User stakeholder, StakeholderEffort.Role role,
            LocalDate date, EffortDetailDTO detail, User submittedBy) {
        if (stakeholder == null)
            return;

        StakeholderEffort effort = new StakeholderEffort();
        effort.setCohort(cohort);
        effort.setTrainerMentor(stakeholder);
        effort.setRole(role);
        effort.setMode(StakeholderEffort.Mode.IN_PERSON);
        effort.setAreaOfWork(
                detail.getNotes() != null && !detail.getNotes().isEmpty() ? detail.getNotes() : "Daily effort logging");
        effort.setEffortHours(detail.getHours());
        effort.setEffortDate(date);
        effort.setMonth(date.getMonth().toString());
        effort.setUpdatedBy(submittedBy);
        effort.setUpdatedDate(LocalDateTime.now());
        effort.setCreatedAt(LocalDateTime.now());

        effortRepository.save(effort);
    }
}