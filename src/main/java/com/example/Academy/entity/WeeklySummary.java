package com.example.Academy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "weekly_effort_summary")
public class WeeklySummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cohort_id", nullable = false)
    private Cohort cohort;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "week_end_date", nullable = false)
    private LocalDate weekEndDate;

    @Column(name = "total_hours", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalHours;

    @Column(name = "summary_date")
    private LocalDateTime summaryDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public WeeklySummary() {}

    public WeeklySummary(Cohort cohort, LocalDate weekStartDate, LocalDate weekEndDate, BigDecimal totalHours) {
        this.cohort = cohort;
        this.weekStartDate = weekStartDate;
        this.weekEndDate = weekEndDate;
        this.totalHours = totalHours;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cohort getCohort() { return cohort; }
    public void setCohort(Cohort cohort) { this.cohort = cohort; }

    public LocalDate getWeekStartDate() { return weekStartDate; }
    public void setWeekStartDate(LocalDate weekStartDate) { this.weekStartDate = weekStartDate; }

    public LocalDate getWeekEndDate() { return weekEndDate; }
    public void setWeekEndDate(LocalDate weekEndDate) { this.weekEndDate = weekEndDate; }

    public BigDecimal getTotalHours() { return totalHours; }
    public void setTotalHours(BigDecimal totalHours) { this.totalHours = totalHours; }

    public LocalDateTime getSummaryDate() { return summaryDate; }
    public void setSummaryDate(LocalDateTime summaryDate) { this.summaryDate = summaryDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}