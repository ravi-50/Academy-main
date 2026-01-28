package com.example.Academy.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stakeholder_efforts")
public class StakeholderEffort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cohort_id", nullable = false)
    private Cohort cohort;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_mentor_id", nullable = true)
    private User trainerMentor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Mode mode;

    @Column(name = "reason_virtual")
    private String reasonVirtual;

    @Column(name = "area_of_work", nullable = false)
    private String areaOfWork;

    @Column(name = "effort_hours", nullable = false, precision = 5, scale = 2)
    private BigDecimal effortHours;

    @Column(name = "effort_date", nullable = false)
    private LocalDate effortDate;

    @Column(nullable = false)
    private String month;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum Role {
        TRAINER, MENTOR, BUDDY_MENTOR, BH_TRAINER
    }

    public enum Mode {
        VIRTUAL, IN_PERSON
    }

    // Constructors
    public StakeholderEffort() {
    }

    public StakeholderEffort(Cohort cohort, User trainerMentor, Role role, Mode mode,
            String areaOfWork, BigDecimal effortHours, LocalDate effortDate,
            String month, User updatedBy) {
        this.cohort = cohort;
        this.trainerMentor = trainerMentor;
        this.role = role;
        this.mode = mode;
        this.areaOfWork = areaOfWork;
        this.effortHours = effortHours;
        this.effortDate = effortDate;
        this.month = month;
        this.updatedBy = updatedBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cohort getCohort() {
        return cohort;
    }

    public void setCohort(Cohort cohort) {
        this.cohort = cohort;
    }

    public User getTrainerMentor() {
        return trainerMentor;
    }

    public void setTrainerMentor(User trainerMentor) {
        this.trainerMentor = trainerMentor;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getReasonVirtual() {
        return reasonVirtual;
    }

    public void setReasonVirtual(String reasonVirtual) {
        this.reasonVirtual = reasonVirtual;
    }

    public String getAreaOfWork() {
        return areaOfWork;
    }

    public void setAreaOfWork(String areaOfWork) {
        this.areaOfWork = areaOfWork;
    }

    public BigDecimal getEffortHours() {
        return effortHours;
    }

    public void setEffortHours(BigDecimal effortHours) {
        this.effortHours = effortHours;
    }

    public LocalDate getEffortDate() {
        return effortDate;
    }

    public void setEffortDate(LocalDate effortDate) {
        this.effortDate = effortDate;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public User getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(User updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}