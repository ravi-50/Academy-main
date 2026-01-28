package com.example.Academy.dto.effort;

import com.example.Academy.entity.StakeholderEffort;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EffortSubmissionDTO {

    private Long cohortId;
    private Long trainerMentorId;
    private StakeholderEffort.Role role;
    private StakeholderEffort.Mode mode;
    private String reasonVirtual;
    private String areaOfWork;
    private BigDecimal effortHours;
    private LocalDate effortDate;
    private String month;

    // Default constructor
    public EffortSubmissionDTO() {}

    // Constructor with all fields
    public EffortSubmissionDTO(Long cohortId, Long trainerMentorId, StakeholderEffort.Role role,
                               StakeholderEffort.Mode mode, String reasonVirtual, String areaOfWork,
                               BigDecimal effortHours, LocalDate effortDate, String month) {
        this.cohortId = cohortId;
        this.trainerMentorId = trainerMentorId;
        this.role = role;
        this.mode = mode;
        this.reasonVirtual = reasonVirtual;
        this.areaOfWork = areaOfWork;
        this.effortHours = effortHours;
        this.effortDate = effortDate;
        this.month = month;
    }

    // Getters and Setters
    public Long getCohortId() {
        return cohortId;
    }

    public void setCohortId(Long cohortId) {
        this.cohortId = cohortId;
    }

    public Long getTrainerMentorId() {
        return trainerMentorId;
    }

    public void setTrainerMentorId(Long trainerMentorId) {
        this.trainerMentorId = trainerMentorId;
    }

    public StakeholderEffort.Role getRole() {
        return role;
    }

    public void setRole(StakeholderEffort.Role role) {
        this.role = role;
    }

    public StakeholderEffort.Mode getMode() {
        return mode;
    }

    public void setMode(StakeholderEffort.Mode mode) {
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
}