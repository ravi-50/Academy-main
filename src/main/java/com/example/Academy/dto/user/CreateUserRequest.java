package com.example.Academy.dto.user;

import jakarta.validation.constraints.*;

public class CreateUserRequest {

    @NotBlank
    private String empId;

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String role; // ADMIN or COACH

    @NotBlank
    private String employeeType; // INTERNAL or EXTERNAL

    private String skill;
    private String location;

    // Getters & Setters
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getEmployeeType() { return employeeType; }
    public void setEmployeeType(String employeeType) { this.employeeType = employeeType; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
