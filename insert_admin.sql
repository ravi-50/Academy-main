USE academy_db;
INSERT IGNORE INTO users (name, email, password, role, emp_id) VALUES ('Admin User', 'admin@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', 'EMP001');
INSERT IGNORE INTO users (name, email, password, role, emp_id) VALUES ('Coach User', 'coach@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'COACH', 'EMP002');

-- Insert sample cohorts
INSERT IGNORE INTO cohorts (code, bu, skill, active_genc_count, training_location, primary_trainer_id, start_date, end_date, created_at)
VALUES ('JAVA-001', 'Technology', 'Java Full Stack', 25, 'Bangalore', 2, '2024-01-15', '2024-04-15', NOW());

INSERT IGNORE INTO cohorts (code, bu, skill, active_genc_count, training_location, primary_trainer_id, start_date, end_date, created_at)
VALUES ('REACT-002', 'Technology', 'React Development', 20, 'Mumbai', 2, '2024-02-01', '2024-05-01', NOW());

INSERT IGNORE INTO cohorts (code, bu, skill, active_genc_count, training_location, primary_trainer_id, start_date, end_date, created_at)
VALUES ('PYTHON-003', 'Data Science', 'Python ML', 18, 'Delhi', 2, '2024-01-20', '2024-04-20', NOW());

INSERT IGNORE INTO cohorts (code, bu, skill, active_genc_count, training_location, primary_trainer_id, start_date, end_date, created_at)
VALUES ('CLOUD-004', 'Cloud', 'AWS Solutions', 22, 'Chennai', 2, '2024-03-01', '2024-06-01', NOW());