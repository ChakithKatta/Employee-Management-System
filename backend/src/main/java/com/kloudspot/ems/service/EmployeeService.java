package com.kloudspot.ems.service;

import com.kloudspot.ems.dto.DashboardStatsDTO;
import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PageResponse;
import com.kloudspot.ems.model.EmploymentStatus;

import java.util.List;

public interface EmployeeService {

    EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto);

    EmployeeResponseDTO getEmployeeById(Long id);

    EmployeeResponseDTO getEmployeeByEmployeeId(String employeeId);

    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto);

    void deleteEmployee(Long id);

    PageResponse<EmployeeResponseDTO> getAllEmployees(
            String search,
            String department,
            EmploymentStatus status,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    List<EmployeeResponseDTO> getAllEmployeesUnpaged();

    byte[] exportEmployeesToCsv();

    DashboardStatsDTO getDashboardStats();
}
