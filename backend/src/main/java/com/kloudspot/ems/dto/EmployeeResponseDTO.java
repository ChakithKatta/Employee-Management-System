package com.kloudspot.ems.dto;

import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EmployeeResponseDTO {

    private Long id;
    private String employeeId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String department;
    private String designation;
    private LocalDate dateOfJoining;
    private BigDecimal salary;
    private EmploymentStatus employmentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public EmployeeResponseDTO() {
    }

    public EmployeeResponseDTO(Long id, String employeeId, String fullName, String email,
                               String phoneNumber, String department, String designation,
                               LocalDate dateOfJoining, BigDecimal salary,
                               EmploymentStatus employmentStatus, LocalDateTime createdAt,
                               LocalDateTime updatedAt) {
        this.id = id;
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.department = department;
        this.designation = designation;
        this.dateOfJoining = dateOfJoining;
        this.salary = salary;
        this.employmentStatus = employmentStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static EmployeeResponseDTO fromEntity(Employee employee) {
        if (employee == null) return null;
        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getEmployeeId(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getDateOfJoining(),
                employee.getSalary(),
                employee.getEmploymentStatus(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public LocalDate getDateOfJoining() {
        return dateOfJoining;
    }

    public void setDateOfJoining(LocalDate dateOfJoining) {
        this.dateOfJoining = dateOfJoining;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public EmploymentStatus getEmploymentStatus() {
        return employmentStatus;
    }

    public void setEmploymentStatus(EmploymentStatus employmentStatus) {
        this.employmentStatus = employmentStatus;
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
}
