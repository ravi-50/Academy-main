package com.example.Academy.dto.effort;

import java.time.LocalDate;
import java.util.List;

public class WeeklyEffortSubmissionDTO {
    private Long cohortId;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private List<DayLogDTO> dayLogs;
    private String location;
    private Long coachId;

    public WeeklyEffortSubmissionDTO() {
    }

    public Long getCoachId() {
        return coachId;
    }

    public void setCoachId(Long coachId) {
        this.coachId = coachId;
    }

    public Long getCohortId() {
        return cohortId;
    }

    public void setCohortId(Long cohortId) {
        this.cohortId = cohortId;
    }

    public LocalDate getWeekStartDate() {
        return weekStartDate;
    }

    public void setWeekStartDate(LocalDate weekStartDate) {
        this.weekStartDate = weekStartDate;
    }

    public LocalDate getWeekEndDate() {
        return weekEndDate;
    }

    public void setWeekEndDate(LocalDate weekEndDate) {
        this.weekEndDate = weekEndDate;
    }

    public List<DayLogDTO> getDayLogs() {
        return dayLogs;
    }

    public void setDayLogs(List<DayLogDTO> dayLogs) {
        this.dayLogs = dayLogs;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
