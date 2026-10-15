package com.kloudspot.ems.config;

import com.kloudspot.ems.model.Department;
import com.kloudspot.ems.model.Employee;
import com.kloudspot.ems.model.EmploymentStatus;
import com.kloudspot.ems.repository.DepartmentRepository;
import com.kloudspot.ems.repository.EmployeeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DataInitializer(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            logger.info("Initializing sample departments...");
            List<Department> departments = Arrays.asList(
                    new Department("Engineering", "Software development, architecture, QA and DevOps"),
                    new Department("Product Management", "Product roadmaps, UI/UX design and business analysis"),
                    new Department("Human Resources", "Recruitment, talent retention and employee welfare"),
                    new Department("Finance", "Financial planning, accounting and payroll"),
                    new Department("Marketing", "Brand marketing, SEO and content creation"),
                    new Department("Sales", "Client acquisition and business development")
            );
            departmentRepository.saveAll(departments);
            logger.info("Inserted {} departments", departments.size());
        }

        if (employeeRepository.count() == 0) {
            logger.info("Initializing sample employees...");
            List<Employee> employees = Arrays.asList(
                    new Employee(null, "EMP-1001", "Aarav Sharma", "aarav.sharma@kloudspot.com", "+91 9876543210",
                            "Engineering", "Senior Backend Engineer", LocalDate.of(2022, 3, 15),
                            new BigDecimal("1250000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1002", "Priya Patel", "priya.patel@kloudspot.com", "+91 9876543211",
                            "Engineering", "Full Stack Developer", LocalDate.of(2023, 1, 10),
                            new BigDecimal("950000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1003", "Rohan Verma", "rohan.verma@kloudspot.com", "+91 9876543212",
                            "Product Management", "Lead Product Manager", LocalDate.of(2021, 8, 1),
                            new BigDecimal("1400000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1004", "Ananya Iyer", "ananya.iyer@kloudspot.com", "+91 9876543213",
                            "Human Resources", "HR Manager", LocalDate.of(2020, 5, 20),
                            new BigDecimal("850000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1005", "Vikram Malhotra", "vikram.m@kloudspot.com", "+91 9876543214",
                            "Finance", "Financial Analyst", LocalDate.of(2022, 11, 14),
                            new BigDecimal("900000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1006", "Sneha Reddy", "sneha.reddy@kloudspot.com", "+91 9876543215",
                            "Marketing", "Digital Marketing Strategist", LocalDate.of(2023, 4, 3),
                            new BigDecimal("750000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1007", "Karan Singhania", "karan.s@kloudspot.com", "+91 9876543216",
                            "Engineering", "DevOps Specialist", LocalDate.of(2021, 10, 18),
                            new BigDecimal("1100000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1008", "Meera Nair", "meera.nair@kloudspot.com", "+91 9876543217",
                            "Sales", "Enterprise Account Executive", LocalDate.of(2022, 6, 1),
                            new BigDecimal("1050000.00"), EmploymentStatus.INACTIVE),
                    new Employee(null, "EMP-1009", "Aditya Joshi", "aditya.joshi@kloudspot.com", "+91 9876543218",
                            "Engineering", "Frontend Engineer", LocalDate.of(2023, 7, 15),
                            new BigDecimal("800000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1010", "Neha Kulkarni", "neha.k@kloudspot.com", "+91 9876543219",
                            "Human Resources", "Recruitment Specialist", LocalDate.of(2023, 9, 1),
                            new BigDecimal("650000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1011", "Rahul Deshmukh", "rahul.d@kloudspot.com", "+91 9876543220",
                            "Engineering", "Cloud Architect", LocalDate.of(2021, 2, 12),
                            new BigDecimal("1600000.00"), EmploymentStatus.ACTIVE),
                    new Employee(null, "EMP-1012", "Pooja Bhatt", "pooja.bhatt@kloudspot.com", "+91 9876543221",
                            "Product Management", "UI/UX Designer", LocalDate.of(2023, 10, 5),
                            new BigDecimal("780000.00"), EmploymentStatus.INACTIVE)
            );
            employeeRepository.saveAll(employees);
            logger.info("Inserted {} employees", employees.size());
        }
    }
}
