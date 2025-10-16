-- 1. Insert into companies (3 records)
INSERT INTO companies (company_id, company_name, registration_number, location, business_email, website, entry_user_id, created_at, updated_at)
VALUES
(1, 'Apex Solutions', 'REG12345', 'New York, USA', 'info@apex.com', 'https://apex.com', 1, NOW(), NOW()),
(2, 'Wazar Technologies', 'REG67890', 'London, UK', 'contact@wazar.com', 'https://wazar.com', 1, NOW(), NOW()),
(3, 'Arreta Pharmaceuticals', 'REG24680', 'Karachi, PK', 'support@arreta.com', 'https://arreta.com', 1, NOW(), NOW());

-- 2. Insert into user_roles (10 records)
INSERT INTO user_roles (role_id, role_name, permissions, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 'Admin', JSON_OBJECT('access', 'all'), 1, 1, NOW(), NOW()),
(2, 'Project Manager', JSON_OBJECT('access', 'manage_projects'), 1, 1, NOW(), NOW()),
(3, 'Employee', JSON_OBJECT('access', 'basic_tasks'), 1, 1, NOW(), NOW()),
(4, 'HR', JSON_OBJECT('access', 'manage_users'), 1, 1, NOW(), NOW()),
(5, 'Finance', JSON_OBJECT('access', 'manage_invoices'), 1, 1, NOW(), NOW()),
(6, 'Admin', JSON_OBJECT('access', 'all'), 2, 1, NOW(), NOW()),
(7, 'Employee', JSON_OBJECT('access', 'basic_tasks'), 2, 1, NOW(), NOW()),
(8, 'Admin', JSON_OBJECT('access', 'all'), 3, 1, NOW(), NOW()),
(9, 'Project Manager', JSON_OBJECT('access', 'manage_projects'), 3, 1, NOW(), NOW()),
(10, 'Employee', JSON_OBJECT('access', 'basic_tasks'), 3, 1, NOW(), NOW());

-- 3. Insert into users (10 records)
INSERT INTO users (id, name, email, password, role_id, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 'John Doe', 'john@apex.com', 'password123', 1, 1, 1, NOW(), NOW()),
(2, 'Jane Smith', 'jane@apex.com', 'password123', 2, 1, 1, NOW(), NOW()),
(3, 'Alice Johnson', 'alice@apex.com', 'password123', 3, 1, 1, NOW(), NOW()),
(4, 'Bob Williams', 'bob@apex.com', 'password123', 4, 1, 1, NOW(), NOW()),
(5, 'Charlie Brown', 'charlie@apex.com', 'password123', 5, 1, 1, NOW(), NOW()),
(6, 'David Lee', 'david@wazar.com', 'password123', 6, 2, 1, NOW(), NOW()),
(7, 'Emma Davis', 'emma@wazar.com', 'password123', 7, 2, 1, NOW(), NOW()),
(8, 'Frank Miller', 'frank@arreta.com', 'password123', 8, 3, 1, NOW(), NOW()),
(9, 'Grace Taylor', 'grace@arreta.com', 'password123', 9, 3, 1, NOW(), NOW()),
(10, 'Henry Wilson', 'henry@arreta.com', 'password123', 10, 3, 1, NOW(), NOW());

-- 4. Insert into statuses (10 records)
INSERT INTO statuses (status_id, status_name, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 'Pending', 1, 1, NOW(), NOW()),
(2, 'In Progress', 1, 1, NOW(), NOW()),
(3, 'Completed', 1, 1, NOW(), NOW()),
(4, 'On Hold', 1, 1, NOW(), NOW()),
(5, 'Cancelled', 1, 1, NOW(), NOW()),
(6, 'Pending', 2, 1, NOW(), NOW()),
(7, 'In Progress', 2, 1, NOW(), NOW()),
(8, 'Completed', 3, 1, NOW(), NOW()),
(9, 'On Hold', 3, 1, NOW(), NOW()),
(10, 'Cancelled', 3, 1, NOW(), NOW());

-- 5. Insert into clients (10 records)
INSERT INTO clients (client_id, name, contact_number, address, company_id, entry_user_id)
VALUES
(1, 'Tech Corp', '1234567890', 'New York', 1, 1),
(2, 'Soft Inc', '9876543210', 'Los Angeles', 1, 1),
(3, 'MediHealth', '5551234567', 'London', 2, 1),
(4, 'EduSmart', '4449876543', 'Manchester', 2, 1),
(5, 'PharmaLife', '3331112222', 'Karachi', 3, 1),
(6, 'BioTech', '2223334444', 'Lahore', 3, 1),
(7, 'CloudNet', '1119998888', 'San Francisco', 1, 1),
(8, 'AppWorld', '6665554444', 'Chicago', 1, 1),
(9, 'SecureSys', '7778889999', 'Berlin', 2, 1),
(10, 'NextGen', '8887776666', 'Paris', 3, 1);

-- 6. Insert into projects (10 records)
INSERT INTO projects (project_id, name, description, start_date, end_date, status_id, project_manager_id, client_id, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 'ERP System', 'ERP development for Tech Corp', NOW(), NOW() + INTERVAL 90 DAY, 2, 2, 1, 1, 1, NOW(), NOW()),
(2, 'Mobile App', 'Cross-platform app for Soft Inc', NOW(), NOW() + INTERVAL 60 DAY, 1, 2, 2, 1, 1, NOW(), NOW()),
(3, 'Health Portal', 'Web portal for MediHealth', NOW(), NOW() + INTERVAL 120 DAY, 2, 6, 3, 2, 1, NOW(), NOW()),
(4, 'E-Learning Platform', 'Learning platform for EduSmart', NOW(), NOW() + INTERVAL 150 DAY, 1, 6, 4, 2, 1, NOW(), NOW()),
(5, 'Drug Inventory', 'Inventory system for PharmaLife', NOW(), NOW() + INTERVAL 100 DAY, 2, 9, 5, 3, 1, NOW(), NOW()),
(6, 'BioData System', 'Bio research system for BioTech', NOW(), NOW() + INTERVAL 80 DAY, 1, 9, 6, 3, 1, NOW(), NOW()),
(7, 'Cloud Migration', 'Migration service for CloudNet', NOW(), NOW() + INTERVAL 50 DAY, 2, 2, 7, 1, 1, NOW(), NOW()),
(8, 'E-Commerce App', 'App for AppWorld', NOW(), NOW() + INTERVAL 90 DAY, 3, 2, 8, 1, 1, NOW(), NOW()),
(9, 'Cyber Security Tool', 'Security tool for SecureSys', NOW(), NOW() + INTERVAL 120 DAY, 2, 6, 9, 2, 1, NOW(), NOW()),
(10, 'AI Research', 'AI project for NextGen', NOW(), NOW() + INTERVAL 200 DAY, 1, 9, 10, 3, 1, NOW(), NOW());

-- 7. Insert into tasks (10 records)
INSERT INTO tasks (task_id, project_id, name, description, assigned_to, status_id, priority, due_date, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 1, 'Requirement Gathering', 'Collect requirements', 3, 1, 'High', NOW() + INTERVAL 10 DAY, 1, 1, NOW(), NOW()),
(2, 1, 'Database Design', 'Design database schema', 3, 2, 'High', NOW() + INTERVAL 20 DAY, 1, 1, NOW(), NOW()),
(3, 2, 'UI/UX Design', 'Design mobile app screens', 7, 1, 'Medium', NOW() + INTERVAL 15 DAY, 1, 1, NOW(), NOW()),
(4, 3, 'Backend API', 'Develop REST APIs', 6, 2, 'High', NOW() + INTERVAL 30 DAY, 2, 1, NOW(), NOW()),
(5, 4, 'Frontend Integration', 'Integrate APIs with frontend', 6, 1, 'Medium', NOW() + INTERVAL 40 DAY, 2, 1, NOW(), NOW()),
(6, 5, 'Stock Module', 'Implement stock module', 9, 2, 'High', NOW() + INTERVAL 25 DAY, 3, 1, NOW(), NOW()),
(7, 6, 'Research Data Input', 'Input bio data', 9, 1, 'Low', NOW() + INTERVAL 20 DAY, 3, 1, NOW(), NOW()),
(8, 7, 'Server Migration', 'Migrate servers to cloud', 2, 2, 'High', NOW() + INTERVAL 30 DAY, 1, 1, NOW(), NOW()),
(9, 8, 'Payment Gateway', 'Integrate payment system', 3, 1, 'High', NOW() + INTERVAL 35 DAY, 1, 1, NOW(), NOW()),
(10, 9, 'Firewall Setup', 'Setup firewalls', 6, 2, 'High', NOW() + INTERVAL 45 DAY, 2, 1, NOW(), NOW());

-- 8. Insert into invoices (10 records)
INSERT INTO invoices (invoice_id, project_id, client_id, amount, status_id, due_date, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 1, 1, 5000.00, 1, NOW() + INTERVAL 30 DAY, 1, 1, NOW(), NOW()),
(2, 2, 2, 8000.00, 2, NOW() + INTERVAL 60 DAY, 1, 1, NOW(), NOW()),
(3, 3, 3, 12000.00, 3, NOW() + INTERVAL 90 DAY, 2, 1, NOW(), NOW()),
(4, 4, 4, 15000.00, 1, NOW() + INTERVAL 40 DAY, 2, 1, NOW(), NOW()),
(5, 5, 5, 20000.00, 2, NOW() + INTERVAL 50 DAY, 3, 1, NOW(), NOW()),
(6, 6, 6, 18000.00, 1, NOW() + INTERVAL 70 DAY, 3, 1, NOW(), NOW()),
(7, 7, 7, 9000.00, 2, NOW() + INTERVAL 80 DAY, 1, 1, NOW(), NOW()),
(8, 8, 8, 7000.00, 3, NOW() + INTERVAL 20 DAY, 1, 1, NOW(), NOW()),
(9, 9, 9, 22000.00, 2, NOW() + INTERVAL 90 DAY, 2, 1, NOW(), NOW()),
(10, 10, 10, 25000.00, 1, NOW() + INTERVAL 100 DAY, 3, 1, NOW(), NOW());

-- 9. Insert into expenses (10 records)
INSERT INTO expenses (expense_id, project_id, name, amount, date, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 1, 'Domain Purchase', 100.00, NOW(), 1, 1, NOW(), NOW()),
(2, 2, 'Hosting', 200.00, NOW(), 1, 1, NOW(), NOW()),
(3, 3, 'Software License', 300.00, NOW(), 2, 1, NOW(), NOW()),
(4, 4, 'Travel', 400.00, NOW(), 2, 1, NOW(), NOW()),
(5, 5, 'Lab Equipment', 500.00, NOW(), 3, 1, NOW(), NOW()),
(6, 6, 'Chemicals', 600.00, NOW(), 3, 1, NOW(), NOW()),
(7, 7, 'Cloud Service', 700.00, NOW(), 1, 1, NOW(), NOW()),
(8, 8, 'Design Tools', 800.00, NOW(), 1, 1, NOW(), NOW()),
(9, 9, 'Firewall License', 900.00, NOW(), 2, 1, NOW(), NOW()),
(10, 10, 'AI GPU', 1000.00, NOW(), 3, 1, NOW(), NOW());

-- 10. Insert into notification_types (10 records)
INSERT INTO notification_types (type_id, type_name, company_id, entry_user_id, created_at, updated_at)
VALUES
(1, 'Email', 1, 1, NOW(), NOW()),
(2, 'SMS', 1, 1, NOW(), NOW()),
(3, 'Push', 1, 1, NOW(), NOW()),
(4, 'System Alert', 2, 1, NOW(), NOW()),
(5, 'Reminder', 2, 1, NOW(), NOW()),
(6, 'Email', 3, 1, NOW(), NOW()),
(7, 'SMS', 3, 1, NOW(), NOW()),
(8, 'Push', 3, 1, NOW(), NOW()),
(9, 'System Alert', 1, 1, NOW(), NOW()),
(10, 'Reminder', 2, 1, NOW(), NOW());

-- 11. Insert into notifications (10 records)
INSERT INTO notifications (notification_id, user_id, message, type_id, is_read, company_id, entry_user_id, created_at)
VALUES
(1, 1, 'Your task deadline is approaching.', 1, 0, 1, 1, NOW()),
(2, 2, 'New project assigned.', 2, 0, 1, 1, NOW()),
(3, 3, 'Invoice generated.', 3, 1, 1, 1, NOW()),
(4, 4, 'Meeting scheduled tomorrow.', 4, 0, 1, 1, NOW()),
(5, 5, 'Expense approved.', 5, 1, 1, 1, NOW()),
(6, 6, 'System alert: Server downtime.', 6, 0, 2, 1, NOW()),
(7, 7, 'Reminder: Update profile.', 7, 0, 2, 1, NOW()),
(8, 8, 'Push notification test.', 8, 0, 3, 1, NOW()),
(9, 9, 'System alert: Security patch.', 9, 0, 3, 1, NOW()),
(10, 10, 'Reminder: Submit report.', 10, 1, 3, 1, NOW());
