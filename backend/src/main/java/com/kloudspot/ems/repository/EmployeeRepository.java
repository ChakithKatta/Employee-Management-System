package com.kloudspot.ems.repository;

import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmployeeId(String employeeId);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByEmployeeIdAndIdNot(String employeeId, Long id);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    long countByEmploymentStatus(EmploymentStatus status);

    long countByDepartment(String department);
}
