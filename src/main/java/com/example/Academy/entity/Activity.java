package com.example.Academy.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "coach_id")
    private User coach;

    @ManyToOne
    @JoinColumn(name = "cohort_id")
    private Cohort cohort;

    public Activity() {}

    public Long getId() {
        return id;
    }
  
    public void setId(Long id) {
        this.id = id;
    }
  
    public String getTitle() {
        return title;
    }
  
    public void setTitle(String title) {
        this.title = title;
    }
  
    public String getDescription() {
        return description;
    }
  
    public void setDescription(String description) {
        this.description = description;
    }
  
    public LocalDate getDate() {
        return date;
    }
  
    public void setDate(LocalDate date) {
        this.date = date;
    }
  
    public User getCoach() {
        return coach;
    }
  
    public void setCoach(User coach) {
        this.coach = coach;
    }
  
    public Cohort getCohort() {
        return cohort;
    }
  
    public void setCohort(Cohort cohort) {
        this.cohort = cohort;
    }
}
