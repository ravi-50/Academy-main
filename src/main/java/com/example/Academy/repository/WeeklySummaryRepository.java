package com.example.Academy.repository;

import com.example.Academy.entity.WeeklySummary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface WeeklySummaryRepository extends JpaRepository<WeeklySummary, Long> {

    Optional<WeeklySummary> findByCohortIdAndWeekStartDate(Long cohortId, LocalDate weekStartDate);

    boolean existsByCohortIdAndWeekStartDate(Long cohortId, LocalDate weekStartDate);
}