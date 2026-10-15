package com.kloudspot.ems.service.impl;

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
import com.kloudspot.ems.service.EmployeeService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public EmployeeResponseDTO createEmployee(EmployeeRequestDTO dto) {
        String empId = dto.getEmployeeId();
        if (empId == null || empId.trim().isEmpty()) {
            empId = generateUniqueEmployeeId();
        } else {
            empId = empId.trim().toUpperCase();
            if (employeeRepository.existsByEmployeeId(empId)) {
                throw new DuplicateResourceException("Employee", "employeeId", empId);
            }
        }

        String email = dto.getEmail().trim().toLowerCase();
        if (employeeRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Employee", "email", email);
        }

        Employee employee = new Employee();
        employee.setEmployeeId(empId);
        employee.setFullName(dto.getFullName().trim());
        employee.setEmail(email);
        employee.setPhoneNumber(dto.getPhoneNumber().trim());
        employee.setDepartment(dto.getDepartment().trim());
        employee.setDesignation(dto.getDesignation().trim());
        employee.setDateOfJoining(dto.getDateOfJoining());
        employee.setSalary(dto.getSalary());
        employee.setEmploymentStatus(dto.getEmploymentStatus());

        Employee saved = employeeRepository.save(employee);
        return EmployeeResponseDTO.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return EmployeeResponseDTO.fromEntity(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeByEmployeeId(String employeeId) {
        Employee employee = employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "employeeId", employeeId));
        return EmployeeResponseDTO.fromEntity(employee);
    }

    @Override
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        String newEmail = dto.getEmail().trim().toLowerCase();
        if (employeeRepository.existsByEmailAndIdNot(newEmail, id)) {
            throw new DuplicateResourceException("Employee", "email", newEmail);
        }

        if (dto.getEmployeeId() != null && !dto.getEmployeeId().trim().isEmpty()) {
            String newEmpId = dto.getEmployeeId().trim().toUpperCase();
            if (employeeRepository.existsByEmployeeIdAndIdNot(newEmpId, id)) {
                throw new DuplicateResourceException("Employee", "employeeId", newEmpId);
            }
            employee.setEmployeeId(newEmpId);
        }

        employee.setFullName(dto.getFullName().trim());
        employee.setEmail(newEmail);
        employee.setPhoneNumber(dto.getPhoneNumber().trim());
        employee.setDepartment(dto.getDepartment().trim());
        employee.setDesignation(dto.getDesignation().trim());
        employee.setDateOfJoining(dto.getDateOfJoining());
        employee.setSalary(dto.getSalary());
        employee.setEmploymentStatus(dto.getEmploymentStatus());

        Employee updated = employeeRepository.save(employee);
        return EmployeeResponseDTO.fromEntity(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        employeeRepository.delete(employee);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponseDTO> getAllEmployees(
            String search,
            String department,
            EmploymentStatus status,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Employee> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by Name or Email
            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("fullName")), searchPattern);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), searchPattern);
                Predicate empIdMatch = cb.like(cb.lower(root.get("employeeId")), searchPattern);
                predicates.add(cb.or(nameMatch, emailMatch, empIdMatch));
            }

            // Filter by Department
            if (department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("ALL")) {
                predicates.add(cb.equal(cb.lower(root.get("department")), department.trim().toLowerCase()));
            }

            // Filter by Status
            if (status != null) {
                predicates.add(cb.equal(root.get("employmentStatus"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Employee> employeePage = employeeRepository.findAll(spec, pageable);
        List<EmployeeResponseDTO> content = employeePage.getContent().stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                employeePage.getNumber(),
                employeePage.getSize(),
                employeePage.getTotalElements(),
                employeePage.getTotalPages(),
                employeePage.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponseDTO> getAllEmployeesUnpaged() {
        return employeeRepository.findAll(Sort.by("id").ascending()).stream()
                .map(EmployeeResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportEmployeesToCsv() {
        List<Employee> employees = employeeRepository.findAll(Sort.by("id").ascending());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            // CSV Header
            writer.println("Employee ID,Full Name,Email Address,Phone Number,Department,Designation,Date of Joining,Salary,Employment Status");

            for (Employee emp : employees) {
                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,\"%s\"%n",
                        escapeCsv(emp.getEmployeeId()),
                        escapeCsv(emp.getFullName()),
                        escapeCsv(emp.getEmail()),
                        escapeCsv(emp.getPhoneNumber()),
                        escapeCsv(emp.getDepartment()),
                        escapeCsv(emp.getDesignation()),
                        emp.getDateOfJoining() != null ? emp.getDateOfJoining().format(dateFormatter) : "",
                        emp.getSalary() != null ? emp.getSalary().doubleValue() : 0.0,
                        emp.getEmploymentStatus() != null ? emp.getEmploymentStatus().name() : ""
                );
            }
        }

        return out.toByteArray();
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long total = employeeRepository.count();
        long active = employeeRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
        long inactive = employeeRepository.countByEmploymentStatus(EmploymentStatus.INACTIVE);
        long totalDepartments = departmentRepository.count();

        return new DashboardStatsDTO(total, active, inactive, totalDepartments);
    }

    private String generateUniqueEmployeeId() {
        long count = employeeRepository.count() + 1;
        String candidate = String.format("EMP-%04d", count);
        while (employeeRepository.existsByEmployeeId(candidate)) {
            candidate = String.format("EMP-%04d", ThreadLocalRandom.current().nextInt(1000, 9999));
        }
        return candidate;
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        return value.replace("\"", "\"\"");
    }
}
