package com.kloudspot.ems.service;

import com.kloudspot.ems.dto.DepartmentDTO;
import com.kloudspot.ems.exception.DuplicateResourceException;
import com.kloudspot.ems.exception.ResourceNotFoundException;
import com.kloudspot.ems.model.Department;
import com.kloudspot.ems.repository.DepartmentRepository;
import com.kloudspot.ems.repository.EmployeeRepository;
import com.kloudspot.ems.service.impl.DepartmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private DepartmentServiceImpl departmentService;

    private Department sampleDepartment;
    private DepartmentDTO sampleDepartmentDTO;

    @BeforeEach
    void setUp() {
        sampleDepartment = new Department(1L, "Engineering", "Software development and DevOps");
        sampleDepartmentDTO = new DepartmentDTO(1L, "Engineering", "Software development and DevOps");
    }

    @Test
    @DisplayName("Get All Departments - Returns list with employee counts")
    void testGetAllDepartments() {
        when(departmentRepository.findAll()).thenReturn(List.of(sampleDepartment));
        when(employeeRepository.countByDepartment("Engineering")).thenReturn(5L);

        List<DepartmentDTO> result = departmentService.getAllDepartments();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Engineering", result.get(0).getName());
        assertEquals(5L, result.get(0).getEmployeeCount());
    }

    @Test
    @DisplayName("Create Department - Successfully creates department")
    void testCreateDepartment_Success() {
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(sampleDepartment);

        DepartmentDTO result = departmentService.createDepartment(sampleDepartmentDTO);

        assertNotNull(result);
        assertEquals("Engineering", result.getName());
        verify(departmentRepository, times(1)).save(any(Department.class));
    }

    @Test
    @DisplayName("Create Department - Fails when department name already exists")
    void testCreateDepartment_DuplicateName_ThrowsException() {
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> departmentService.createDepartment(sampleDepartmentDTO));
        verify(departmentRepository, never()).save(any(Department.class));
    }

    @Test
    @DisplayName("Delete Department - Successfully deletes existing department")
    void testDeleteDepartment_Success() {
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(sampleDepartment));
        doNothing().when(departmentRepository).delete(sampleDepartment);

        assertDoesNotThrow(() -> departmentService.deleteDepartment(1L));
        verify(departmentRepository, times(1)).delete(sampleDepartment);
    }

    @Test
    @DisplayName("Delete Department - Throws exception when department not found")
    void testDeleteDepartment_NotFound_ThrowsException() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> departmentService.deleteDepartment(99L));
        verify(departmentRepository, never()).delete(any(Department.class));
    }
}
