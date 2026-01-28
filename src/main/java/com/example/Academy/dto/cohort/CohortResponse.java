package com.example.Academy.dto.cohort;

import java.time.LocalDate;

public class CohortResponse {
    private Long id;
    private String code;
    private String bu;
    private String skill;
    private Integer activeGencCount;
    private String trainingLocation;
    private LocalDate startDate;
    private LocalDate endDate;

    private Integer progress; // ⭐ NEW
    private UserSummary coach;

    public static class UserSummary {
        public Long id;
        public String name;

        public UserSummary(Long id, String name) {
            this.id = id;
            this.name = name;
        }
    }

    // Getters & Setters
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

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public UserSummary getCoach() { return coach; }
    public void setCoach(UserSummary coach) { this.coach = coach; }
}
