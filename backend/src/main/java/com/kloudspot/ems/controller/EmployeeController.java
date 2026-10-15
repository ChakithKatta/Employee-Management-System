package com.kloudspot.ems.controller;

import com.kloudspot.ems.dto.*;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Employee Management", description = "Endpoints for employee CRUD operations, search, filters, pagination, and export")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    @Operation(summary = "Add a new employee", description = "Creates a new employee record with validation")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> createEmployee(
            @Valid @RequestBody EmployeeRequestDTO dto
    ) {
        EmployeeResponseDTO created = employeeService.createEmployee(dto);
        return new ResponseEntity<>(
                ApiResponse.success("Employee created successfully", created),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    @Operation(summary = "View employee details", description = "Retrieves an employee record by its database ID")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> getEmployeeById(
            @PathVariable Long id
    ) {
        EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.success(employee));
    }

    @GetMapping("/code/{employeeId}")
    @Operation(summary = "View employee by Employee ID", description = "Retrieves an employee record by custom Employee ID (e.g., EMP-1001)")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> getEmployeeByCode(
            @PathVariable String employeeId
    ) {
        EmployeeResponseDTO employee = employeeService.getEmployeeByEmployeeId(employeeId);
        return ResponseEntity.ok(ApiResponse.success(employee));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edit employee information", description = "Updates an existing employee's details")
    public ResponseEntity<ApiResponse<EmployeeResponseDTO>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO dto
    ) {
        EmployeeResponseDTO updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an employee", description = "Deletes an employee record from the system")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(
            @PathVariable Long id
    ) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully", null));
    }

    @GetMapping
    @Operation(summary = "List all employees with search, filter, and pagination",
            description = "Fetch employees page-by-page, search by name/email/ID, and filter by department/status")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponseDTO>>> getAllEmployees(
            @Parameter(description = "Search keyword for full name, email, or employee ID")
            @RequestParam(required = false) String search,

            @Parameter(description = "Filter by department name (or ALL)")
            @RequestParam(required = false) String department,

            @Parameter(description = "Filter by employment status (ACTIVE, INACTIVE)")
            @RequestParam(required = false) EmploymentStatus status,

            @Parameter(description = "Page number (0-indexed)")
            @RequestParam(defaultValue = "0") int page,

            @Parameter(description = "Page size (default 10)")
            @RequestParam(defaultValue = "10") int size,

            @Parameter(description = "Sort field (id, fullName, employeeId, salary, dateOfJoining, department)")
            @RequestParam(defaultValue = "id") String sortBy,

            @Parameter(description = "Sort direction (asc, desc)")
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PageResponse<EmployeeResponseDTO> response = employeeService.getAllEmployees(
                search, department, status, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export employee data to CSV", description = "Downloads all employee records as a standard CSV file")
    public ResponseEntity<byte[]> exportEmployeesCsv() {
        byte[] csvData = employeeService.exportEmployeesToCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"employees.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }

    @GetMapping("/stats")
    @Operation(summary = "Get dashboard summary statistics", description = "Returns total, active, inactive counts, and total departments")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        DashboardStatsDTO stats = employeeService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
