-- Employee Management System Database Setup Script
-- Compatible with MySQL and PostgreSQL (with serial) / H2

CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    salary DECIMAL(12, 2) NOT NULL,
    employment_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Departments
INSERT INTO departments (name, description) VALUES
('Engineering', 'Software development, architecture, QA and DevOps'),
('Product Management', 'Product roadmaps, UI/UX design and business analysis'),
('Human Resources', 'Recruitment, talent retention and employee welfare'),
('Finance', 'Financial planning, accounting and payroll'),
('Marketing', 'Brand marketing, SEO and content creation'),
('Sales', 'Client acquisition and business development');

-- Initial Employee Records
INSERT INTO employees (employee_id, full_name, email, phone_number, department, designation, date_of_joining, salary, employment_status) VALUES
('EMP-1001', 'Aarav Sharma', 'aarav.sharma@kloudspot.com', '+91 9876543210', 'Engineering', 'Senior Backend Engineer', '2022-03-15', 1250000.00, 'ACTIVE'),
('EMP-1002', 'Priya Patel', 'priya.patel@kloudspot.com', '+91 9876543211', 'Engineering', 'Full Stack Developer', '2023-01-10', 950000.00, 'ACTIVE'),
('EMP-1003', 'Rohan Verma', 'rohan.verma@kloudspot.com', '+91 9876543212', 'Product Management', 'Lead Product Manager', '2021-08-01', 1400000.00, 'ACTIVE'),
('EMP-1004', 'Ananya Iyer', 'ananya.iyer@kloudspot.com', '+91 9876543213', 'Human Resources', 'HR Manager', '2020-05-20', 850000.00, 'ACTIVE'),
('EMP-1005', 'Vikram Malhotra', 'vikram.m@kloudspot.com', '+91 9876543214', 'Finance', 'Financial Analyst', '2022-11-14', 900000.00, 'ACTIVE'),
('EMP-1006', 'Sneha Reddy', 'sneha.reddy@kloudspot.com', '+91 9876543215', 'Marketing', 'Digital Marketing Strategist', '2023-04-03', 750000.00, 'ACTIVE'),
('EMP-1007', 'Karan Singhania', 'karan.s@kloudspot.com', '+91 9876543216', 'Engineering', 'DevOps Specialist', '2021-10-18', 1100000.00, 'ACTIVE'),
('EMP-1008', 'Meera Nair', 'meera.nair@kloudspot.com', '+91 9876543217', 'Sales', 'Enterprise Account Executive', '2022-06-01', 1050000.00, 'INACTIVE'),
('EMP-1009', 'Aditya Joshi', 'aditya.joshi@kloudspot.com', '+91 9876543218', 'Engineering', 'Frontend Engineer', '2023-07-15', 800000.00, 'ACTIVE'),
('EMP-1010', 'Neha Kulkarni', 'neha.k@kloudspot.com', '+91 9876543219', 'Human Resources', 'Recruitment Specialist', '2023-09-01', 650000.00, 'ACTIVE'),
('EMP-1011', 'Rahul Deshmukh', 'rahul.d@kloudspot.com', '+91 9876543220', 'Engineering', 'Cloud Architect', '2021-02-12', 1600000.00, 'ACTIVE'),
('EMP-1012', 'Pooja Bhatt', 'pooja.bhatt@kloudspot.com', '+91 9876543221', 'Product Management', 'UI/UX Designer', '2023-10-05', 780000.00, 'INACTIVE');
