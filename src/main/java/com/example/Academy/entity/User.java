package com.example.Academy.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emp_id", unique = true, nullable = false)
    private String empId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type", nullable = false)
    private EmployeeType employeeType;

    private String skill;

    private String location;

    @Column(name = "assigned_cohorts", columnDefinition = "int default 0")
    private Integer assignedCohorts = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20) default 'ACTIVE'")
    private Status status = Status.ACTIVE;

    @Column(name = "training_start_date")
    private LocalDate trainingStartDate;

    @Column(name = "training_end_date")
    private LocalDate trainingEndDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Role {
        COACH, LOCATION_LEAD, ADMIN
    }

    public enum EmployeeType {
        INTERNAL, EXTERNAL
    }

    public enum Status {
        ACTIVE, INACTIVE
    }

    // Constructors
    public User() {}

    public User(String empId, String name, String email, String password, Role role, EmployeeType employeeType) {
        this.empId = empId;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.employeeType = employeeType;
        this.assignedCohorts = 0;
        this.status = Status.ACTIVE;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public EmployeeType getEmployeeType() { return employeeType; }
    public void setEmployeeType(EmployeeType employeeType) { this.employeeType = employeeType; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getAssignedCohorts() { return assignedCohorts; }
    public void setAssignedCohorts(Integer assignedCohorts) { this.assignedCohorts = assignedCohorts; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDate getTrainingStartDate() { return trainingStartDate; }
    public void setTrainingStartDate(LocalDate trainingStartDate) { this.trainingStartDate = trainingStartDate; }

    public LocalDate getTrainingEndDate() { return trainingEndDate; }
    public void setTrainingEndDate(LocalDate trainingEndDate) { this.trainingEndDate = trainingEndDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
