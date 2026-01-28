package com.example.Academy.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "cohorts")
public class Cohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String bu;

    @Column(nullable = false)
    private String skill;

    @Column(name = "active_genc_count", nullable = false)
    private Integer activeGencCount;

    @Column(name = "training_location", nullable = false)
    private String trainingLocation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_trainer_id")
    private User primaryTrainer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_mentor_id")
    private User primaryMentor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "buddy_mentor_id")
    private User buddyMentor;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "coach_id")
    private User coach;


    // Constructors
    public Cohort() {}

    public Cohort(String code, String bu, String skill, Integer activeGencCount, String trainingLocation,
                  LocalDate startDate, LocalDate endDate, User coach) {
        this.code = code;
        this.bu = bu;
        this.skill = skill;
        this.activeGencCount = activeGencCount;
        this.trainingLocation = trainingLocation;
        this.coach = coach;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getBu() { return bu; }
    public void setBu(String bu) { this.bu = bu; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public Integer getActiveGencCount() { return activeGencCount; }
    public void setActiveGencCount(Integer activeGencCount) { this.activeGencCount = activeGencCount; }

    public String getTrainingLocation() { return trainingLocation; }
    public void setTrainingLocation(String trainingLocation) { this.trainingLocation = trainingLocation; }

    public User getPrimaryTrainer() { return primaryTrainer; }
    public void setPrimaryTrainer(User primaryTrainer) { this.primaryTrainer = primaryTrainer; }

    public User getPrimaryMentor() { return primaryMentor; }
    public void setPrimaryMentor(User primaryMentor) { this.primaryMentor = primaryMentor; }

    public User getBuddyMentor() { return buddyMentor; }
    public void setBuddyMentor(User buddyMentor) { this.buddyMentor = buddyMentor; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public User getCoach() { return coach; }    
    public void setCoach(User coach) { this.coach = coach; }
}
