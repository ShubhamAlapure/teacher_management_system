-- =====================================================================
-- SHIKSHAK SETU: DIGITAL TEACHER LIFECYCLE MANAGEMENT SYSTEM
-- SUPABASE POSTGRESQL DATABASE SCHEMA
-- =====================================================================

-- 1. EXTENSIONS & ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Role Types
CREATE TYPE user_role AS ENUM ('applicant', 'teacher', 'principal', 'admin');

-- Teacher Cadre / Level
CREATE TYPE teacher_cadre AS ENUM ('PRT', 'TGT', 'PGT', 'Headmaster', 'Principal');

-- Status Types
CREATE TYPE app_status AS ENUM ('Submitted', 'Document Verification', 'Shortlisted', 'Merit List', 'Appointed', 'Rejected');
CREATE TYPE transfer_status AS ENUM ('Pending Principal', 'Recommended', 'Pending DEO', 'Approved', 'Rejected');
CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE verification_status AS ENUM ('Verified', 'Pending', 'Action Required');

-- 2. TEACHERS (CENTRAL SERVICE BOOK RECORD)
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emp_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  gender VARCHAR(20),
  dob DATE,
  joining_date DATE NOT NULL,
  cadre teacher_cadre NOT NULL DEFAULT 'TGT',
  subject VARCHAR(50) NOT NULL,
  current_school VARCHAR(150) NOT NULL,
  district VARCHAR(100) NOT NULL,
  block VARCHAR(100),
  tet_score INT,
  experience_years INT DEFAULT 0,
  basic_pay NUMERIC(10, 2) DEFAULT 44900.00,
  gpf_nps_no VARCHAR(50),
  seniority_rank INT,
  service_status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RECRUITMENT VACANCIES & APPLICATIONS
CREATE TABLE IF NOT EXISTS recruitment_vacancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  cadre teacher_cadre NOT NULL,
  district VARCHAR(100) NOT NULL,
  total_posts INT NOT NULL,
  filled_posts INT DEFAULT 0,
  min_qualification VARCHAR(100) NOT NULL,
  tet_required BOOLEAN DEFAULT TRUE,
  application_deadline DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recruitment_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vacancy_id UUID REFERENCES recruitment_vacancies(id) ON DELETE CASCADE,
  applicant_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  ctet_score INT NOT NULL,
  bed_percentage NUMERIC(5,2),
  preferred_district VARCHAR(100),
  status app_status DEFAULT 'Submitted',
  remarks TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. POSTINGS & TRANSFER MANAGEMENT
CREATE TABLE IF NOT EXISTS transfer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  request_type VARCHAR(50) NOT NULL, -- Mutual, Hardship, Spouse Ground, General
  current_school VARCHAR(150) NOT NULL,
  target_district VARCHAR(100) NOT NULL,
  target_school VARCHAR(150),
  reason TEXT NOT NULL,
  principal_recommendation BOOLEAN,
  principal_remarks TEXT,
  deo_approval transfer_status DEFAULT 'Pending Principal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. LEAVE & PAYROLL INTEGRATION
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  leave_type VARCHAR(50) NOT NULL, -- Casual Leave, Medical Leave, Duty Leave, Earned Leave
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL,
  reason TEXT NOT NULL,
  status leave_status DEFAULT 'Pending',
  approver_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payroll_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  month_year VARCHAR(20) NOT NULL, -- e.g. "July 2026"
  basic_pay NUMERIC(10, 2) NOT NULL,
  da_amount NUMERIC(10, 2) NOT NULL, -- Dearness Allowance
  hra_amount NUMERIC(10, 2) NOT NULL, -- House Rent Allowance
  ta_amount NUMERIC(10, 2) NOT NULL, -- Transport Allowance
  gpf_nps_deduction NUMERIC(10, 2) NOT NULL,
  tax_deduction NUMERIC(10, 2) NOT NULL,
  net_salary NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Disbursed',
  disbursed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TRAINING & APAR EVALUATION MODULE
CREATE TABLE IF NOT EXISTS training_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(150) NOT NULL,
  provider VARCHAR(100) DEFAULT 'NCERT NISHTHA',
  duration_hours INT NOT NULL,
  credit_points INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS teacher_trainings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  course_id UUID REFERENCES training_courses(id) ON DELETE CASCADE,
  enrolled_date DATE DEFAULT CURRENT_DATE,
  completion_status VARCHAR(20) DEFAULT 'In Progress', -- In Progress, Completed
  completion_date DATE,
  certificate_url TEXT
);

CREATE TABLE IF NOT EXISTS apar_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  academic_year VARCHAR(20) NOT NULL, -- e.g. "2025-2026"
  self_appraisal_score INT NOT NULL, -- Out of 100
  principal_score INT,
  deo_score INT,
  final_grade VARCHAR(20), -- Outstanding, Very Good, Good, Satisfactory
  teacher_remarks TEXT,
  reviewer_remarks TEXT,
  status VARCHAR(30) DEFAULT 'Submitted by Teacher',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DIGITAL DOCUMENT VAULT
CREATE TABLE IF NOT EXISTS teacher_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  doc_name VARCHAR(100) NOT NULL,
  doc_category VARCHAR(50) NOT NULL, -- Aadhaar, TET Certificate, B.Ed Degree, Appointment Letter
  file_url TEXT NOT NULL,
  status verification_status DEFAULT 'Pending',
  verified_by VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE apar_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_documents ENABLE ROW LEVEL SECURITY;

-- Allow full access for anon/publishable client inserts & queries
DROP POLICY IF EXISTS "Allow public read teachers" ON teachers;
CREATE POLICY "Allow public all teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all recruitment" ON recruitment_applications FOR ALL USING (true);
CREATE POLICY "Allow public all transfers" ON transfer_requests FOR ALL USING (true);
CREATE POLICY "Allow public all leaves" ON leave_requests FOR ALL USING (true);
CREATE POLICY "Allow public all apar" ON apar_evaluations FOR ALL USING (true);
CREATE POLICY "Allow public all docs" ON teacher_documents FOR ALL USING (true);
