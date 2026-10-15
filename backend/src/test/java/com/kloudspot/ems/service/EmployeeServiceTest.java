package com.kloudspot.ems.service;

import com.kloudspot.ems.dto.DashboardStatsDTO;
import com.kloudspot.ems.dto.EmployeeRequestDTO;
import com.kloudspot.ems.dto.EmployeeResponseDTO;
import com.kloudspot.ems.dto.PageResponse;
import com.kloudspot.ems.exception.DuplicateResourceException;
import com.kloudspot.ems.exception.ResourceNotFoundException;
import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.repository.DepartmentRepository;
import com.kloudspot.ems.repository.EmployeeRepository;
import com.kloudspot.ems.service.impl.EmployeeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private EmployeeServiceImpl employeeService;

    private Employee sampleEmployee;
    private EmployeeRequestDTO sampleRequestDTO;

    @BeforeEach
    void setUp() {
        sampleEmployee = new Employee(
                1L,
                "EMP-1001",
                "Aarav Sharma",
                "aarav.sharma@kloudspot.com",
                "+91 9876543210",
                "Engineering",
                "Senior Backend Engineer",
                LocalDate.of(2022, 3, 15),
                new BigDecimal("1250000.00"),
                EmploymentStatus.ACTIVE
        );

        sampleRequestDTO = new EmployeeRequestDTO(
                "EMP-1001",
                "Aarav Sharma",
                "aarav.sharma@kloudspot.com",
                "+91 9876543210",
                "Engineering",
                "Senior Backend Engineer",
                LocalDate.of(2022, 3, 15),
                new BigDecimal("1250000.00"),
                EmploymentStatus.ACTIVE
        );
    }

    @Test
    @DisplayName("Create Employee - Successfully creates employee")
    void testCreateEmployee_Success() {
        when(employeeRepository.existsByEmployeeId("EMP-1001")).thenReturn(false);
        when(employeeRepository.existsByEmail("aarav.sharma@kloudspot.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        EmployeeResponseDTO result = employeeService.createEmployee(sampleRequestDTO);

        assertNotNull(result);
        assertEquals("EMP-1001", result.getEmployeeId());
        assertEquals("Aarav Sharma", result.getFullName());
        assertEquals("aarav.sharma@kloudspot.com", result.getEmail());
        assertEquals(EmploymentStatus.ACTIVE, result.getEmploymentStatus());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    @DisplayName("Create Employee - Fails when email is duplicate")
    void testCreateEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.existsByEmployeeId("EMP-1001")).thenReturn(false);
        when(employeeRepository.existsByEmail("aarav.sharma@kloudspot.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> employeeService.createEmployee(sampleRequestDTO));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Create Employee - Fails when Employee ID is duplicate")
    void testCreateEmployee_DuplicateEmployeeId_ThrowsException() {
        when(employeeRepository.existsByEmployeeId("EMP-1001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> employeeService.createEmployee(sampleRequestDTO));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Create Employee - Auto generates employee ID when empty")
    void testCreateEmployee_AutoGeneratesEmployeeId() {
        sampleRequestDTO.setEmployeeId(null);
        when(employeeRepository.count()).thenReturn(5L);
        when(employeeRepository.existsByEmployeeId(anyString())).thenReturn(false);
        when(employeeRepository.existsByEmail(anyString())).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        EmployeeResponseDTO result = employeeService.createEmployee(sampleRequestDTO);

        assertNotNull(result);
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    @DisplayName("Get Employee By ID - Returns employee details when found")
    void testGetEmployeeById_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));

        EmployeeResponseDTO result = employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Aarav Sharma", result.getFullName());
    }

    @Test
    @DisplayName("Get Employee By ID - Throws exception when not found")
    void testGetEmployeeById_NotFound_ThrowsException() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.getEmployeeById(999L));
    }

    @Test
    @DisplayName("Get Employee By EmployeeId - Returns employee details")
    void testGetEmployeeByEmployeeId_Success() {
        when(employeeRepository.findByEmployeeId("EMP-1001")).thenReturn(Optional.of(sampleEmployee));

        EmployeeResponseDTO result = employeeService.getEmployeeByEmployeeId("EMP-1001");

        assertNotNull(result);
        assertEquals("EMP-1001", result.getEmployeeId());
    }

    @Test
    @DisplayName("Update Employee - Successfully updates existing employee")
    void testUpdateEmployee_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.existsByEmailAndIdNot(anyString(), eq(1L))).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        sampleRequestDTO.setFullName("Aarav Sharma Updated");
        sampleRequestDTO.setSalary(new BigDecimal("1350000.00"));

        EmployeeResponseDTO result = employeeService.updateEmployee(1L, sampleRequestDTO);

        assertNotNull(result);
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    @DisplayName("Update Employee - Throws exception when employee ID not found")
    void testUpdateEmployee_NotFound_ThrowsException() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.updateEmployee(999L, sampleRequestDTO));
    }

    @Test
    @DisplayName("Update Employee - Throws exception when email is used by another employee")
    void testUpdateEmployee_DuplicateEmail_ThrowsException() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));
        when(employeeRepository.existsByEmailAndIdNot(sampleRequestDTO.getEmail(), 1L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> employeeService.updateEmployee(1L, sampleRequestDTO));
        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Delete Employee - Successfully deletes existing employee")
    void testDeleteEmployee_Success() {
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(sampleEmployee));
        doNothing().when(employeeRepository).delete(sampleEmployee);

        assertDoesNotThrow(() -> employeeService.deleteEmployee(1L));
        verify(employeeRepository, times(1)).delete(sampleEmployee);
    }

    @Test
    @DisplayName("Delete Employee - Throws exception when employee does not exist")
    void testDeleteEmployee_NotFound_ThrowsException() {
        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> employeeService.deleteEmployee(999L));
        verify(employeeRepository, never()).delete(any(Employee.class));
    }

    @Test
    @DisplayName("Get All Employees - Returns paginated list")
    void testGetAllEmployees_Pagination() {
        Page<Employee> page = new PageImpl<>(List.of(sampleEmployee));
        when(employeeRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        PageResponse<EmployeeResponseDTO> result = employeeService.getAllEmployees(
                null, null, null, 0, 10, "id", "desc"
        );

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(1, result.getTotalElements());
        assertEquals("Aarav Sharma", result.getContent().get(0).getFullName());
    }

    @Test
    @DisplayName("Export Employees CSV - Returns properly formatted CSV bytes")
    void testExportEmployeesToCsv() {
        when(employeeRepository.findAll(any(org.springframework.data.domain.Sort.class)))
                .thenReturn(List.of(sampleEmployee));

        byte[] csvBytes = employeeService.exportEmployeesToCsv();

        assertNotNull(csvBytes);
        String csvContent = new String(csvBytes, StandardCharsets.UTF_8);
        assertTrue(csvContent.contains("Employee ID,Full Name,Email Address,Phone Number"));
        assertTrue(csvContent.contains("EMP-1001"));
        assertTrue(csvContent.contains("Aarav Sharma"));
        assertTrue(csvContent.contains("1250000.00"));
    }

    @Test
    @DisplayName("Dashboard Stats - Computes accurate totals")
    void testGetDashboardStats() {
        when(employeeRepository.count()).thenReturn(12L);
        when(employeeRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE)).thenReturn(10L);
        when(employeeRepository.countByEmploymentStatus(EmploymentStatus.INACTIVE)).thenReturn(2L);
        when(departmentRepository.count()).thenReturn(6L);

        DashboardStatsDTO stats = employeeService.getDashboardStats();

        assertNotNull(stats);
        assertEquals(12, stats.getTotalEmployees());
        assertEquals(10, stats.getActiveEmployees());
        assertEquals(2, stats.getInactiveEmployees());
        assertEquals(6, stats.getTotalDepartments());
    }
}
