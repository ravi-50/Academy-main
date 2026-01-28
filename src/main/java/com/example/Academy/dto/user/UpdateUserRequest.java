package com.example.Academy.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UpdateUserRequest {

    @NotBlank
    private String empId;

    @NotBlank
    private String name;

    @Email
    private String email;

    @NotBlank
    private String employeeType;

    private String location;

    // Getters & Setters
    public String getEmpId() { return empId; }
    public void setEmpId(String empId) { this.empId = empId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmployeeType() { return employeeType; }
    public void setEmployeeType(String employeeType) { this.employeeType = employeeType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
