package com.kloudspot.ems.controller;

import com.kloudspot.ems.dto.ApiResponse;
import com.kloudspot.ems.dto.DepartmentDTO;
import com.kloudspot.ems.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Tag(name = "Department Management", description = "Endpoints for managing corporate departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    @Operation(summary = "List all departments", description = "Retrieves all departments along with employee counts")
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get department by ID", description = "Retrieves a department record by its ID")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable Long id) {
        DepartmentDTO department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(department));
    }

    @PostMapping
    @Operation(summary = "Create department", description = "Adds a new department to the system")
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@Valid @RequestBody DepartmentDTO dto) {
        DepartmentDTO created = departmentService.createDepartment(dto);
        return new ResponseEntity<>(ApiResponse.success("Department created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update department", description = "Updates an existing department's name or description")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentDTO dto
    ) {
        DepartmentDTO updated = departmentService.updateDepartment(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete department", description = "Deletes a department record")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
    }
}
