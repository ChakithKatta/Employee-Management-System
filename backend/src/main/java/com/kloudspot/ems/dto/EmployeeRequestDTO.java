package com.kloudspot.ems.dto;

import com.kloudspot.ems.model.EmploymentStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeRequestDTO {

    @Size(max = 50, message = "Employee ID must not exceed 50 characters")
    private String employeeId;

    @NotBlank(message = "Full Name is required")
    @Size(min = 2, max = 100, message = "Full Name must be between 2 and 100 characters")
    private String fullName;

    @NotBlank(message = "Email Address is required")
    @Email(message = "Email Address must be a valid email format")
    @Size(max = 100, message = "Email Address must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone Number is required")
    @Pattern(regexp = "^[+0-9\\s\\-\\(\\)]{7,20}$", message = "Phone Number must be valid (7-20 digits or phone symbols)")
    private String phoneNumber;

    @NotBlank(message = "Department is required")
    @Size(max = 100, message = "Department must not exceed 100 characters")
    private String department;

    @NotBlank(message = "Designation is required")
    @Size(max = 100, message = "Designation must not exceed 100 characters")
    private String designation;

    @NotNull(message = "Date of Joining is required")
    private LocalDate dateOfJoining;

    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be a positive number greater than 0")
    private BigDecimal salary;

    @NotNull(message = "Employment Status is required (ACTIVE or INACTIVE)")
    private EmploymentStatus employmentStatus;

    public EmployeeRequestDTO() {
    }

    public EmployeeRequestDTO(String employeeId, String fullName, String email, String phoneNumber,
                              String department, String designation, LocalDate dateOfJoining,
                              BigDecimal salary, EmploymentStatus employmentStatus) {
        this.employeeId = employeeId;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.department = department;
        this.designation = designation;
        this.dateOfJoining = dateOfJoining;
        this.salary = salary;
        this.employmentStatus = employmentStatus;
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
}
