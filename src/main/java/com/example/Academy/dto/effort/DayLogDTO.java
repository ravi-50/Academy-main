package com.example.Academy.dto.effort;

import java.time.LocalDate;

public class DayLogDTO {
    private LocalDate date;
    private boolean isHoliday;
    private EffortDetailDTO trainer;
    private EffortDetailDTO mentor;
    private EffortDetailDTO buddyMentor;

    public DayLogDTO() {
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isHoliday() {
        return isHoliday;
    }

    public void setHoliday(boolean holiday) {
        isHoliday = holiday;
    }

    public EffortDetailDTO getTrainer() {
        return trainer;
    }

    public void setTrainer(EffortDetailDTO trainer) {
        this.trainer = trainer;
    }

    public EffortDetailDTO getMentor() {
        return mentor;
    }

    public void setMentor(EffortDetailDTO mentor) {
        this.mentor = mentor;
    }

    public EffortDetailDTO getBuddyMentor() {
        return buddyMentor;
    }

    public void setBuddyMentor(EffortDetailDTO buddyMentor) {
        this.buddyMentor = buddyMentor;
    }
}
