package com.example.Academy.repository;

import com.example.Academy.entity.StakeholderEffort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StakeholderEffortRepository extends JpaRepository<StakeholderEffort, Long> {

    List<StakeholderEffort> findByCohortId(Long cohortId);

    List<StakeholderEffort> findByCohortIdAndEffortDateBetween(Long cohortId, LocalDate startDate, LocalDate endDate);

    List<StakeholderEffort> findByTrainerMentorId(Long trainerMentorId);

    @Query("SELECT SUM(se.effortHours) FROM StakeholderEffort se WHERE se.cohort.id = :cohortId AND se.effortDate BETWEEN :startDate AND :endDate")
    Double sumEffortHoursByCohortAndDateRange(@Param("cohortId") Long cohortId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(se.effortHours) FROM StakeholderEffort se WHERE se.cohort.id = :cohortId AND se.role = :role AND se.effortDate BETWEEN :startDate AND :endDate")
    Double sumEffortHoursByCohortRoleAndDateRange(@Param("cohortId") Long cohortId,
            @Param("role") StakeholderEffort.Role role,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}