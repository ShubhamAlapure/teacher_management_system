-- ======================================================================
-- MIT-ADT UNIVERSITY — FACULTY SEED DATA (FIXED)
-- Run this ENTIRE script in Supabase SQL Editor (single run, no error)
-- https://supabase.com/dashboard/project/oehmekbmoszcmroxsfbr/sql/new
-- ======================================================================

-- STEP 1: Convert cadre column from ENUM to VARCHAR so we can use any title freely
-- (Avoids the 55P04 "new enum value must be committed first" PostgreSQL error)
ALTER TABLE teachers ALTER COLUMN cadre TYPE VARCHAR(100) USING cadre::text;

-- STEP 2: Add extra columns (safe, idempotent — won't fail if already exist)
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialization  VARCHAR(150);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualification   VARCHAR(100);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department      VARCHAR(150);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS aadhaar_no      VARCHAR(20);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS pan_no          VARCHAR(20);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(100);
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS publications    INT DEFAULT 0;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS source         VARCHAR(100) DEFAULT 'Initial Faculty';

-- ======================================================================
-- STEP 3: SEED ALL FACULTY MEMBERS (24 real faculty + 2 admin = 26 rows)
-- ON CONFLICT (emp_id) DO UPDATE → safe to re-run anytime
-- ======================================================================
INSERT INTO teachers (
  emp_id, full_name, email, phone, gender, dob, joining_date,
  cadre, subject, current_school, district, block,
  gpf_nps_no, service_status, password,
  qualification, specialization, department,
  experience_years, seniority_rank, basic_pay, publications, source
) VALUES

-- ─── ADMIN & DEAN ───────────────────────────────────────────────────
(
  'MIT-MASTER-ADMIN-01',
  'SHUBHAM SHARADRAO ALAPURE',
  'shubham.alapure@mituniversity.edu.in',
  '+91 98765 00001', 'Male', '1995-01-01', '2015-01-01',
  'System Administrator', 'Master Administration & VC Office',
  'MIT-ADT University Secretariat', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ADMIN-001', 'Active', 'admin@123',
  'M.Tech, Ph.D.', 'University Governance & Administration', 'University Administration',
  11, 1, 225000.00, 0, 'System'
),
(
  'MIT-DEAN-2012-0056',
  'Dr. Rajesh Kumar',
  'dean.soe@mituniversity.edu.in',
  '+91 98760 20056', 'Male', '1974-04-18', '2018-06-01',
  'School Dean', 'School of Engineering & Technology',
  'School of Engineering (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-DEAN-056', 'Active', 'admin@123',
  'Ph.D. in Mechanical Engineering', 'Engineering Leadership & R&D',
  'School of Engineering & Technology (SOE)',
  14, 2, 185000.00, 35, 'System'
),

-- ─── COMPUTER SCIENCE & ENGINEERING ─────────────────────────────────
(
  'MIT-SOE-CS-001', 'Dr. Abhijit Patil',
  'abhijit.patil@mituniversity.edu.in',
  '+91 94220 11001', 'Male', '1978-03-12', '2010-07-01',
  'Professor & HOD', 'Computer Science & Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CS-001', 'Active', 'admin@123',
  'Ph.D. in Computer Science', 'Machine Learning & Data Mining',
  'Computer Science & Engineering (CSE)',
  16, 3, 157300.00, 22, 'Initial Faculty'
),
(
  'MIT-SOE-CS-002', 'Dr. Priya Sharma',
  'priya.sharma@mituniversity.edu.in',
  '+91 94220 11002', 'Female', '1983-07-24', '2013-08-01',
  'Associate Professor', 'Computer Science & Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CS-002', 'Active', 'admin@123',
  'Ph.D. in Artificial Intelligence', 'Deep Learning & Neural Networks',
  'Computer Science & Engineering (CSE)',
  13, 4, 131400.00, 17, 'Initial Faculty'
),
(
  'MIT-SOE-CS-003', 'Mr. Sandeep Kulkarni',
  'sandeep.kulkarni@mituniversity.edu.in',
  '+91 94220 11003', 'Male', '1987-11-09', '2016-07-15',
  'Assistant Professor', 'Computer Science & Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CS-003', 'Active', 'admin@123',
  'M.Tech in CSE', 'Cloud Computing & DevOps',
  'Computer Science & Engineering (CSE)',
  10, 5, 97300.00, 8, 'Initial Faculty'
),
(
  'MIT-SOE-CS-004', 'Ms. Neha Joshi',
  'neha.joshi@mituniversity.edu.in',
  '+91 94220 11004', 'Female', '1990-05-18', '2018-08-01',
  'Assistant Professor', 'Computer Science & Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CS-004', 'Active', 'admin@123',
  'M.Tech in AI & ML', 'Artificial Intelligence & Robotics',
  'Computer Science & Engineering (CSE)',
  8, 6, 87500.00, 5, 'Initial Faculty'
),
(
  'MIT-SOE-CS-005', 'Mr. Rohan Deshmukh',
  'rohan.deshmukh@mituniversity.edu.in',
  '+91 94220 11005', 'Male', '1992-02-28', '2020-07-01',
  'Assistant Professor', 'Computer Science & Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CS-005', 'Active', 'admin@123',
  'M.Tech in Data Science', 'Big Data Analytics & Blockchain',
  'Computer Science & Engineering (CSE)',
  6, 7, 77700.00, 3, 'Initial Faculty'
),
(
  'MIT-SOE-CS-006', 'Dr. Sunita Rathod',
  'sunita.rathod@mituniversity.edu.in',
  '+91 94220 11006', 'Female', '1980-09-15', '2014-01-01',
  'Associate Professor', 'Computer Science & Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CS-006', 'Active', 'admin@123',
  'Ph.D. in Information Security', 'Cybersecurity & Network Security',
  'Computer Science & Engineering (CSE)',
  12, 8, 121400.00, 14, 'Initial Faculty'
),

-- ─── AI & DATA SCIENCE ──────────────────────────────────────────────
(
  'MIT-SOE-AI-001', 'Dr. Vivek Pandey',
  'vivek.pandey@mituniversity.edu.in',
  '+91 94220 12001', 'Male', '1979-06-20', '2012-07-01',
  'Professor & HOD', 'Artificial Intelligence & Data Science',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-AI-001', 'Active', 'admin@123',
  'Ph.D. in AI & Pattern Recognition', 'Computer Vision & NLP',
  'AI & Data Science (AIDS)',
  14, 9, 157300.00, 28, 'Initial Faculty'
),
(
  'MIT-SOE-AI-002', 'Ms. Anjali Wagh',
  'anjali.wagh@mituniversity.edu.in',
  '+91 94220 12002', 'Female', '1988-12-03', '2017-08-01',
  'Assistant Professor', 'Artificial Intelligence & Data Science',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-AI-002', 'Active', 'admin@123',
  'M.Tech in Machine Learning', 'Reinforcement Learning & AI Ethics',
  'AI & Data Science (AIDS)',
  9, 10, 87500.00, 6, 'Initial Faculty'
),
(
  'MIT-SOE-AI-003', 'Mr. Kiran Bhosale',
  'kiran.bhosale@mituniversity.edu.in',
  '+91 94220 12003', 'Male', '1991-04-11', '2021-08-01',
  'Assistant Professor', 'Artificial Intelligence & Data Science',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-AI-003', 'Active', 'admin@123',
  'M.Tech in Data Science', 'Data Engineering & MLOps',
  'AI & Data Science (AIDS)',
  5, 11, 67700.00, 2, 'Initial Faculty'
),

-- ─── MECHANICAL ENGINEERING ─────────────────────────────────────────
(
  'MIT-SOE-ME-001', 'Dr. Prakash Jadhav',
  'prakash.jadhav@mituniversity.edu.in',
  '+91 94220 13001', 'Male', '1975-01-30', '2008-06-01',
  'Professor & HOD', 'Mechanical Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ME-001', 'Active', 'admin@123',
  'Ph.D. in Thermal Engineering', 'Heat Transfer & Thermodynamics',
  'Mechanical Engineering (ME)',
  18, 12, 157300.00, 31, 'Initial Faculty'
),
(
  'MIT-SOE-ME-002', 'Dr. Meena Sawant',
  'meena.sawant@mituniversity.edu.in',
  '+91 94220 13002', 'Female', '1981-08-22', '2011-07-01',
  'Associate Professor', 'Mechanical Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ME-002', 'Active', 'admin@123',
  'Ph.D. in Manufacturing Engineering', 'CAD/CAM & Robotics',
  'Mechanical Engineering (ME)',
  15, 13, 131400.00, 19, 'Initial Faculty'
),
(
  'MIT-SOE-ME-003', 'Mr. Amol Pawar',
  'amol.pawar@mituniversity.edu.in',
  '+91 94220 13003', 'Male', '1989-03-17', '2017-07-15',
  'Assistant Professor', 'Mechanical Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ME-003', 'Active', 'admin@123',
  'M.Tech in Mechanical Design', 'FEA & Product Design',
  'Mechanical Engineering (ME)',
  9, 14, 87500.00, 7, 'Initial Faculty'
),

-- ─── CIVIL ENGINEERING ──────────────────────────────────────────────
(
  'MIT-SOE-CE-001', 'Dr. Rajendra More',
  'rajendra.more@mituniversity.edu.in',
  '+91 94220 14001', 'Male', '1977-05-08', '2009-07-01',
  'Professor & HOD', 'Civil Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CE-001', 'Active', 'admin@123',
  'Ph.D. in Structural Engineering', 'Earthquake Engineering & RCC Design',
  'Civil Engineering (CE)',
  17, 15, 157300.00, 24, 'Initial Faculty'
),
(
  'MIT-SOE-CE-002', 'Ms. Archana Shinde',
  'archana.shinde@mituniversity.edu.in',
  '+91 94220 14002', 'Female', '1985-10-14', '2015-08-01',
  'Assistant Professor', 'Civil Engineering',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-CE-002', 'Active', 'admin@123',
  'M.Tech in Environmental Engineering', 'Water Resources & Environmental Mgmt.',
  'Civil Engineering (CE)',
  11, 16, 87500.00, 9, 'Initial Faculty'
),

-- ─── ELECTRONICS & TELECOMMUNICATION ────────────────────────────────
(
  'MIT-SOE-ENTC-001', 'Dr. Suhas Narkhede',
  'suhas.narkhede@mituniversity.edu.in',
  '+91 94220 15001', 'Male', '1976-12-05', '2007-06-01',
  'Professor & HOD', 'Electronics & Telecommunication',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ENTC-001', 'Active', 'admin@123',
  'Ph.D. in VLSI Design', 'Embedded Systems & IoT',
  'Electronics & Telecommunication (ENTC)',
  19, 17, 157300.00, 26, 'Initial Faculty'
),
(
  'MIT-SOE-ENTC-002', 'Dr. Kavita Desai',
  'kavita.desai@mituniversity.edu.in',
  '+91 94220 15002', 'Female', '1982-07-19', '2012-08-01',
  'Associate Professor', 'Electronics & Telecommunication',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ENTC-002', 'Active', 'admin@123',
  'Ph.D. in Signal Processing', 'DSP & Wireless Communication',
  'Electronics & Telecommunication (ENTC)',
  14, 18, 131400.00, 16, 'Initial Faculty'
),
(
  'MIT-SOE-ENTC-003', 'Mr. Nilesh Kadam',
  'nilesh.kadam@mituniversity.edu.in',
  '+91 94220 15003', 'Male', '1993-01-25', '2022-08-01',
  'Assistant Professor', 'Electronics & Telecommunication',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-ENTC-003', 'Active', 'admin@123',
  'M.Tech in VLSI', 'FPGA Design & Microcontrollers',
  'Electronics & Telecommunication (ENTC)',
  4, 19, 67700.00, 1, 'Initial Faculty'
),

-- ─── APPLIED SCIENCES ───────────────────────────────────────────────
(
  'MIT-SOE-MATH-001', 'Dr. Seema Kulkarni',
  'seema.kulkarni@mituniversity.edu.in',
  '+91 94220 16001', 'Female', '1979-04-02', '2010-01-01',
  'Associate Professor', 'Applied Mathematics',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-MATH-001', 'Active', 'admin@123',
  'Ph.D. in Pure Mathematics', 'Numerical Analysis & Operations Research',
  'Applied Sciences & Humanities (ASH)',
  16, 20, 121400.00, 12, 'Initial Faculty'
),
(
  'MIT-SOE-PHY-001', 'Dr. Anil Gaikwad',
  'anil.gaikwad@mituniversity.edu.in',
  '+91 94220 16002', 'Male', '1978-09-11', '2009-08-01',
  'Associate Professor', 'Applied Physics',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-PHY-001', 'Active', 'admin@123',
  'Ph.D. in Condensed Matter Physics', 'Quantum Mechanics & Nanotechnology',
  'Applied Sciences & Humanities (ASH)',
  17, 21, 121400.00, 15, 'Initial Faculty'
),

-- ─── INFORMATION TECHNOLOGY ─────────────────────────────────────────
(
  'MIT-SOE-IT-001', 'Dr. Harsha Jain',
  'harsha.jain@mituniversity.edu.in',
  '+91 94220 17001', 'Female', '1980-11-30', '2011-07-01',
  'Professor & HOD', 'Information Technology',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-IT-001', 'Active', 'admin@123',
  'Ph.D. in Database Systems', 'Distributed Systems & Cloud Architecture',
  'Information Technology (IT)',
  15, 22, 157300.00, 20, 'Initial Faculty'
),
(
  'MIT-SOE-IT-002', 'Mr. Ganesh Mulik',
  'ganesh.mulik@mituniversity.edu.in',
  '+91 94220 17002', 'Male', '1986-06-07', '2016-08-01',
  'Assistant Professor', 'Information Technology',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-IT-002', 'Active', 'admin@123',
  'M.Tech in IT', 'Web Technologies & Full Stack Development',
  'Information Technology (IT)',
  10, 23, 87500.00, 6, 'Initial Faculty'
),
(
  'MIT-SOE-IT-003', 'Ms. Pallavi Ghorpade',
  'pallavi.ghorpade@mituniversity.edu.in',
  '+91 94220 17003', 'Female', '1994-08-20', '2023-07-01',
  'Assistant Professor', 'Information Technology',
  'School of Engineering & Technology (SOE)', 'Rajbaug Campus', 'Loni Kalbhor',
  'PF-MIT-IT-003', 'Active', 'admin@123',
  'M.Tech in Computer Networks', 'Network Security & Ethical Hacking',
  'Information Technology (IT)',
  3, 24, 57700.00, 1, 'Initial Faculty'
)

ON CONFLICT (emp_id) DO UPDATE SET
  full_name        = EXCLUDED.full_name,
  email            = EXCLUDED.email,
  phone            = EXCLUDED.phone,
  cadre            = EXCLUDED.cadre,
  subject          = EXCLUDED.subject,
  current_school   = EXCLUDED.current_school,
  department       = EXCLUDED.department,
  specialization   = EXCLUDED.specialization,
  qualification    = EXCLUDED.qualification,
  experience_years = EXCLUDED.experience_years,
  basic_pay        = EXCLUDED.basic_pay,
  publications     = EXCLUDED.publications,
  service_status   = EXCLUDED.service_status,
  source           = EXCLUDED.source;

-- ======================================================================
-- VERIFY: Run this to confirm all 26 records are inserted correctly
-- ======================================================================
SELECT emp_id, full_name, cadre, department, basic_pay, experience_years
FROM teachers
ORDER BY seniority_rank;
