package com.example.Academy.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_id", unique = true, nullable = false)
    @JsonProperty("emp_id")
    private String empId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "trainer_role", nullable = false)
    @JsonProperty("type")
    private TrainerType trainerType;

    @Column(nullable = false)
    private String skill;

    @Column(name = "is_internal")
    @JsonProperty("is_internal")
    private boolean isInternal;

    @Column(name = "training_start_date")
    @JsonProperty("training_start_date")
    private LocalDate trainingStartDate;

    @Column(name = "training_end_date")
    @JsonProperty("training_end_date")
    private LocalDate trainingEndDate;

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    @JsonProperty("avatar_url")
    private String avatarUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(nullable = false)
    private String status = "ACTIVE";

    public enum TrainerType {
        technical, behavioral
    }

    // Constructors
    public Trainer() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonProperty("emp_id")
    public String getEmpId() {
        return empId;
    }

    @JsonProperty("emp_id")
    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    @JsonProperty("type")
    public TrainerType getTrainerType() {
        return trainerType;
    }

    @JsonProperty("type")
    public void setTrainerType(TrainerType trainerType) {
        this.trainerType = trainerType;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    @JsonProperty("is_internal")
    public boolean isInternal() {
        return isInternal;
    }

    @JsonProperty("is_internal")
    public void setInternal(boolean internal) {
        isInternal = internal;
    }

    public LocalDate getTrainingStartDate() {
        return trainingStartDate;
    }

    public void setTrainingStartDate(LocalDate trainingStartDate) {
        this.trainingStartDate = trainingStartDate;
    }

    public LocalDate getTrainingEndDate() {
        return trainingEndDate;
    }

    public void setTrainingEndDate(LocalDate trainingEndDate) {
        this.trainingEndDate = trainingEndDate;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}