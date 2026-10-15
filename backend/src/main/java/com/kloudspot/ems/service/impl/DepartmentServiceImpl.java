package com.kloudspot.ems.service.impl;

import com.kloudspot.ems.dto.DepartmentDTO;
import com.kloudspot.ems.exception.DuplicateResourceException;
import com.kloudspot.ems.exception.ResourceNotFoundException;
import com.kloudspot.ems.model.Department;
import com.kloudspot.ems.repository.DepartmentRepository;
import com.kloudspot.ems.repository.EmployeeRepository;
import com.kloudspot.ems.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(dept -> {
                    DepartmentDTO dto = DepartmentDTO.fromEntity(dept);
                    dto.setEmployeeCount(employeeRepository.countByDepartment(dept.getName()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        DepartmentDTO dto = DepartmentDTO.fromEntity(dept);
        dto.setEmployeeCount(employeeRepository.countByDepartment(dept.getName()));
        return dto;
    }

    @Override
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new DuplicateResourceException("Department", "name", dto.getName());
        }
        Department department = new Department(dto.getName().trim(), dto.getDescription());
        Department saved = departmentRepository.save(department);
        return DepartmentDTO.fromEntity(saved);
    }

    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        if (departmentRepository.existsByNameIgnoreCaseAndIdNot(dto.getName().trim(), id)) {
            throw new DuplicateResourceException("Department", "name", dto.getName());
        }

        existing.setName(dto.getName().trim());
        existing.setDescription(dto.getDescription());
        Department updated = departmentRepository.save(existing);
        return DepartmentDTO.fromEntity(updated);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        departmentRepository.delete(dept);
    }
}
