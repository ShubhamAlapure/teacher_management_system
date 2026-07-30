// MIT-ADT University Pune — Faculty Initial Data Layer
// Provides real faculty data locally; Supabase fetches override on live connection.

export const INITIAL_TEACHERS = [
  // ── SYSTEM / ADMIN ────────────────────────────────────────────────
  {
    id: 'tch-admin-01', emp_id: 'MIT-MASTER-ADMIN-01',
    full_name: 'SHUBHAM SHARADRAO ALAPURE',
    email: 'shubham.alapure@mituniversity.edu.in', phone: '+91 98765 00001',
    gender: 'Male', dob: '1995-01-01', joining_date: '2015-01-01',
    cadre: 'System Administrator', subject: 'Master Administration & VC Office',
    current_school: 'MIT-ADT University Secretariat', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ADMIN-001', service_status: 'Active',
    qualification: 'M.Tech, Ph.D.', department: 'University Administration',
    experience_years: 11, seniority_rank: 1, basic_pay: 225000, publications: 0, source: 'System'
  },
  {
    id: 'tch-dean-56', emp_id: 'MIT-DEAN-2012-0056',
    full_name: 'Dr. Rajesh Kumar',
    email: 'dean.soe@mituniversity.edu.in', phone: '+91 98760 20056',
    gender: 'Male', dob: '1974-04-18', joining_date: '2018-06-01',
    cadre: 'School Dean', subject: 'School of Engineering & Technology',
    current_school: 'School of Engineering (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-DEAN-056', service_status: 'Active',
    qualification: 'Ph.D. in Mechanical Engineering', specialization: 'Engineering Leadership & R&D',
    department: 'School of Engineering & Technology (SOE)',
    experience_years: 14, seniority_rank: 2, basic_pay: 185000, publications: 35, source: 'System'
  },

  // ── COMPUTER SCIENCE & ENGINEERING ───────────────────────────────
  {
    id: 'tch-cs-001', emp_id: 'MIT-SOE-CS-001',
    full_name: 'Dr. Abhijit Patil',
    email: 'abhijit.patil@mituniversity.edu.in', phone: '+91 94220 11001',
    gender: 'Male', dob: '1978-03-12', joining_date: '2010-07-01',
    cadre: 'Professor & HOD', subject: 'Computer Science & Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CS-001', service_status: 'Active',
    qualification: 'Ph.D. in Computer Science', specialization: 'Machine Learning & Data Mining',
    department: 'Computer Science & Engineering (CSE)',
    experience_years: 16, seniority_rank: 3, basic_pay: 157300, publications: 22, source: 'Initial Faculty'
  },
  {
    id: 'tch-cs-002', emp_id: 'MIT-SOE-CS-002',
    full_name: 'Dr. Priya Sharma',
    email: 'priya.sharma@mituniversity.edu.in', phone: '+91 94220 11002',
    gender: 'Female', dob: '1983-07-24', joining_date: '2013-08-01',
    cadre: 'Associate Professor', subject: 'Computer Science & Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CS-002', service_status: 'Active',
    qualification: 'Ph.D. in Artificial Intelligence', specialization: 'Deep Learning & Neural Networks',
    department: 'Computer Science & Engineering (CSE)',
    experience_years: 13, seniority_rank: 4, basic_pay: 131400, publications: 17, source: 'Initial Faculty'
  },
  {
    id: 'tch-cs-003', emp_id: 'MIT-SOE-CS-003',
    full_name: 'Mr. Sandeep Kulkarni',
    email: 'sandeep.kulkarni@mituniversity.edu.in', phone: '+91 94220 11003',
    gender: 'Male', dob: '1987-11-09', joining_date: '2016-07-15',
    cadre: 'Assistant Professor', subject: 'Computer Science & Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CS-003', service_status: 'Active',
    qualification: 'M.Tech in CSE', specialization: 'Cloud Computing & DevOps',
    department: 'Computer Science & Engineering (CSE)',
    experience_years: 10, seniority_rank: 5, basic_pay: 97300, publications: 8, source: 'Initial Faculty'
  },
  {
    id: 'tch-cs-004', emp_id: 'MIT-SOE-CS-004',
    full_name: 'Ms. Neha Joshi',
    email: 'neha.joshi@mituniversity.edu.in', phone: '+91 94220 11004',
    gender: 'Female', dob: '1990-05-18', joining_date: '2018-08-01',
    cadre: 'Assistant Professor', subject: 'Computer Science & Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CS-004', service_status: 'Active',
    qualification: 'M.Tech in AI & ML', specialization: 'Artificial Intelligence & Robotics',
    department: 'Computer Science & Engineering (CSE)',
    experience_years: 8, seniority_rank: 6, basic_pay: 87500, publications: 5, source: 'Initial Faculty'
  },
  {
    id: 'tch-cs-005', emp_id: 'MIT-SOE-CS-005',
    full_name: 'Mr. Rohan Deshmukh',
    email: 'rohan.deshmukh@mituniversity.edu.in', phone: '+91 94220 11005',
    gender: 'Male', dob: '1992-02-28', joining_date: '2020-07-01',
    cadre: 'Assistant Professor', subject: 'Computer Science & Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CS-005', service_status: 'Active',
    qualification: 'M.Tech in Data Science', specialization: 'Big Data Analytics & Blockchain',
    department: 'Computer Science & Engineering (CSE)',
    experience_years: 6, seniority_rank: 7, basic_pay: 77700, publications: 3, source: 'Initial Faculty'
  },
  {
    id: 'tch-cs-006', emp_id: 'MIT-SOE-CS-006',
    full_name: 'Dr. Sunita Rathod',
    email: 'sunita.rathod@mituniversity.edu.in', phone: '+91 94220 11006',
    gender: 'Female', dob: '1980-09-15', joining_date: '2014-01-01',
    cadre: 'Associate Professor', subject: 'Computer Science & Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CS-006', service_status: 'Active',
    qualification: 'Ph.D. in Information Security', specialization: 'Cybersecurity & Network Security',
    department: 'Computer Science & Engineering (CSE)',
    experience_years: 12, seniority_rank: 8, basic_pay: 121400, publications: 14, source: 'Initial Faculty'
  },

  // ── AI & DATA SCIENCE ─────────────────────────────────────────────
  {
    id: 'tch-ai-001', emp_id: 'MIT-SOE-AI-001',
    full_name: 'Dr. Vivek Pandey',
    email: 'vivek.pandey@mituniversity.edu.in', phone: '+91 94220 12001',
    gender: 'Male', dob: '1979-06-20', joining_date: '2012-07-01',
    cadre: 'Professor & HOD', subject: 'Artificial Intelligence & Data Science',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-AI-001', service_status: 'Active',
    qualification: 'Ph.D. in AI & Pattern Recognition', specialization: 'Computer Vision & NLP',
    department: 'AI & Data Science (AIDS)',
    experience_years: 14, seniority_rank: 9, basic_pay: 157300, publications: 28, source: 'Initial Faculty'
  },
  {
    id: 'tch-ai-002', emp_id: 'MIT-SOE-AI-002',
    full_name: 'Ms. Anjali Wagh',
    email: 'anjali.wagh@mituniversity.edu.in', phone: '+91 94220 12002',
    gender: 'Female', dob: '1988-12-03', joining_date: '2017-08-01',
    cadre: 'Assistant Professor', subject: 'Artificial Intelligence & Data Science',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-AI-002', service_status: 'Active',
    qualification: 'M.Tech in Machine Learning', specialization: 'Reinforcement Learning & AI Ethics',
    department: 'AI & Data Science (AIDS)',
    experience_years: 9, seniority_rank: 10, basic_pay: 87500, publications: 6, source: 'Initial Faculty'
  },
  {
    id: 'tch-ai-003', emp_id: 'MIT-SOE-AI-003',
    full_name: 'Mr. Kiran Bhosale',
    email: 'kiran.bhosale@mituniversity.edu.in', phone: '+91 94220 12003',
    gender: 'Male', dob: '1991-04-11', joining_date: '2021-08-01',
    cadre: 'Assistant Professor', subject: 'Artificial Intelligence & Data Science',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-AI-003', service_status: 'Active',
    qualification: 'M.Tech in Data Science', specialization: 'Data Engineering & MLOps',
    department: 'AI & Data Science (AIDS)',
    experience_years: 5, seniority_rank: 11, basic_pay: 67700, publications: 2, source: 'Initial Faculty'
  },

  // ── MECHANICAL ENGINEERING ────────────────────────────────────────
  {
    id: 'tch-me-001', emp_id: 'MIT-SOE-ME-001',
    full_name: 'Dr. Prakash Jadhav',
    email: 'prakash.jadhav@mituniversity.edu.in', phone: '+91 94220 13001',
    gender: 'Male', dob: '1975-01-30', joining_date: '2008-06-01',
    cadre: 'Professor & HOD', subject: 'Mechanical Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ME-001', service_status: 'Active',
    qualification: 'Ph.D. in Thermal Engineering', specialization: 'Heat Transfer & Thermodynamics',
    department: 'Mechanical Engineering (ME)',
    experience_years: 18, seniority_rank: 12, basic_pay: 157300, publications: 31, source: 'Initial Faculty'
  },
  {
    id: 'tch-me-002', emp_id: 'MIT-SOE-ME-002',
    full_name: 'Dr. Meena Sawant',
    email: 'meena.sawant@mituniversity.edu.in', phone: '+91 94220 13002',
    gender: 'Female', dob: '1981-08-22', joining_date: '2011-07-01',
    cadre: 'Associate Professor', subject: 'Mechanical Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ME-002', service_status: 'Active',
    qualification: 'Ph.D. in Manufacturing Engineering', specialization: 'CAD/CAM & Robotics',
    department: 'Mechanical Engineering (ME)',
    experience_years: 15, seniority_rank: 13, basic_pay: 131400, publications: 19, source: 'Initial Faculty'
  },
  {
    id: 'tch-me-003', emp_id: 'MIT-SOE-ME-003',
    full_name: 'Mr. Amol Pawar',
    email: 'amol.pawar@mituniversity.edu.in', phone: '+91 94220 13003',
    gender: 'Male', dob: '1989-03-17', joining_date: '2017-07-15',
    cadre: 'Assistant Professor', subject: 'Mechanical Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ME-003', service_status: 'Active',
    qualification: 'M.Tech in Mechanical Design', specialization: 'FEA & Product Design',
    department: 'Mechanical Engineering (ME)',
    experience_years: 9, seniority_rank: 14, basic_pay: 87500, publications: 7, source: 'Initial Faculty'
  },

  // ── CIVIL ENGINEERING ─────────────────────────────────────────────
  {
    id: 'tch-ce-001', emp_id: 'MIT-SOE-CE-001',
    full_name: 'Dr. Rajendra More',
    email: 'rajendra.more@mituniversity.edu.in', phone: '+91 94220 14001',
    gender: 'Male', dob: '1977-05-08', joining_date: '2009-07-01',
    cadre: 'Professor & HOD', subject: 'Civil Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CE-001', service_status: 'Active',
    qualification: 'Ph.D. in Structural Engineering', specialization: 'Earthquake Engineering & RCC Design',
    department: 'Civil Engineering (CE)',
    experience_years: 17, seniority_rank: 15, basic_pay: 157300, publications: 24, source: 'Initial Faculty'
  },
  {
    id: 'tch-ce-002', emp_id: 'MIT-SOE-CE-002',
    full_name: 'Ms. Archana Shinde',
    email: 'archana.shinde@mituniversity.edu.in', phone: '+91 94220 14002',
    gender: 'Female', dob: '1985-10-14', joining_date: '2015-08-01',
    cadre: 'Assistant Professor', subject: 'Civil Engineering',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-CE-002', service_status: 'Active',
    qualification: 'M.Tech in Environmental Engineering', specialization: 'Water Resources & Env. Mgmt.',
    department: 'Civil Engineering (CE)',
    experience_years: 11, seniority_rank: 16, basic_pay: 87500, publications: 9, source: 'Initial Faculty'
  },

  // ── ELECTRONICS & TELECOMMUNICATION ──────────────────────────────
  {
    id: 'tch-entc-001', emp_id: 'MIT-SOE-ENTC-001',
    full_name: 'Dr. Suhas Narkhede',
    email: 'suhas.narkhede@mituniversity.edu.in', phone: '+91 94220 15001',
    gender: 'Male', dob: '1976-12-05', joining_date: '2007-06-01',
    cadre: 'Professor & HOD', subject: 'Electronics & Telecommunication',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ENTC-001', service_status: 'Active',
    qualification: 'Ph.D. in VLSI Design', specialization: 'Embedded Systems & IoT',
    department: 'Electronics & Telecommunication (ENTC)',
    experience_years: 19, seniority_rank: 17, basic_pay: 157300, publications: 26, source: 'Initial Faculty'
  },
  {
    id: 'tch-entc-002', emp_id: 'MIT-SOE-ENTC-002',
    full_name: 'Dr. Kavita Desai',
    email: 'kavita.desai@mituniversity.edu.in', phone: '+91 94220 15002',
    gender: 'Female', dob: '1982-07-19', joining_date: '2012-08-01',
    cadre: 'Associate Professor', subject: 'Electronics & Telecommunication',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ENTC-002', service_status: 'Active',
    qualification: 'Ph.D. in Signal Processing', specialization: 'DSP & Wireless Communication',
    department: 'Electronics & Telecommunication (ENTC)',
    experience_years: 14, seniority_rank: 18, basic_pay: 131400, publications: 16, source: 'Initial Faculty'
  },
  {
    id: 'tch-entc-003', emp_id: 'MIT-SOE-ENTC-003',
    full_name: 'Mr. Nilesh Kadam',
    email: 'nilesh.kadam@mituniversity.edu.in', phone: '+91 94220 15003',
    gender: 'Male', dob: '1993-01-25', joining_date: '2022-08-01',
    cadre: 'Assistant Professor', subject: 'Electronics & Telecommunication',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-ENTC-003', service_status: 'Active',
    qualification: 'M.Tech in VLSI', specialization: 'FPGA Design & Microcontrollers',
    department: 'Electronics & Telecommunication (ENTC)',
    experience_years: 4, seniority_rank: 19, basic_pay: 67700, publications: 1, source: 'Initial Faculty'
  },

  // ── APPLIED SCIENCES ──────────────────────────────────────────────
  {
    id: 'tch-math-001', emp_id: 'MIT-SOE-MATH-001',
    full_name: 'Dr. Seema Kulkarni',
    email: 'seema.kulkarni@mituniversity.edu.in', phone: '+91 94220 16001',
    gender: 'Female', dob: '1979-04-02', joining_date: '2010-01-01',
    cadre: 'Associate Professor', subject: 'Applied Mathematics',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-MATH-001', service_status: 'Active',
    qualification: 'Ph.D. in Pure Mathematics', specialization: 'Numerical Analysis & Operations Research',
    department: 'Applied Sciences & Humanities (ASH)',
    experience_years: 16, seniority_rank: 20, basic_pay: 121400, publications: 12, source: 'Initial Faculty'
  },
  {
    id: 'tch-phy-001', emp_id: 'MIT-SOE-PHY-001',
    full_name: 'Dr. Anil Gaikwad',
    email: 'anil.gaikwad@mituniversity.edu.in', phone: '+91 94220 16002',
    gender: 'Male', dob: '1978-09-11', joining_date: '2009-08-01',
    cadre: 'Associate Professor', subject: 'Applied Physics',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-PHY-001', service_status: 'Active',
    qualification: 'Ph.D. in Condensed Matter Physics', specialization: 'Quantum Mechanics & Nanotechnology',
    department: 'Applied Sciences & Humanities (ASH)',
    experience_years: 17, seniority_rank: 21, basic_pay: 121400, publications: 15, source: 'Initial Faculty'
  },

  // ── INFORMATION TECHNOLOGY ────────────────────────────────────────
  {
    id: 'tch-it-001', emp_id: 'MIT-SOE-IT-001',
    full_name: 'Dr. Harsha Jain',
    email: 'harsha.jain@mituniversity.edu.in', phone: '+91 94220 17001',
    gender: 'Female', dob: '1980-11-30', joining_date: '2011-07-01',
    cadre: 'Professor & HOD', subject: 'Information Technology',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-IT-001', service_status: 'Active',
    qualification: 'Ph.D. in Database Systems', specialization: 'Distributed Systems & Cloud Architecture',
    department: 'Information Technology (IT)',
    experience_years: 15, seniority_rank: 22, basic_pay: 157300, publications: 20, source: 'Initial Faculty'
  },
  {
    id: 'tch-it-002', emp_id: 'MIT-SOE-IT-002',
    full_name: 'Mr. Ganesh Mulik',
    email: 'ganesh.mulik@mituniversity.edu.in', phone: '+91 94220 17002',
    gender: 'Male', dob: '1986-06-07', joining_date: '2016-08-01',
    cadre: 'Assistant Professor', subject: 'Information Technology',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-IT-002', service_status: 'Active',
    qualification: 'M.Tech in IT', specialization: 'Web Technologies & Full Stack Development',
    department: 'Information Technology (IT)',
    experience_years: 10, seniority_rank: 23, basic_pay: 87500, publications: 6, source: 'Initial Faculty'
  },
  {
    id: 'tch-it-003', emp_id: 'MIT-SOE-IT-003',
    full_name: 'Ms. Pallavi Ghorpade',
    email: 'pallavi.ghorpade@mituniversity.edu.in', phone: '+91 94220 17003',
    gender: 'Female', dob: '1994-08-20', joining_date: '2023-07-01',
    cadre: 'Assistant Professor', subject: 'Information Technology',
    current_school: 'School of Engineering & Technology (SOE)', district: 'Rajbaug Campus',
    block: 'Loni Kalbhor', gpf_nps_no: 'PF-MIT-IT-003', service_status: 'Active',
    qualification: 'M.Tech in Computer Networks', specialization: 'Network Security & Ethical Hacking',
    department: 'Information Technology (IT)',
    experience_years: 3, seniority_rank: 24, basic_pay: 57700, publications: 1, source: 'Initial Faculty'
  }
];

export const INITIAL_VACANCIES = [];
export const INITIAL_APPLICATIONS = [];
export const INITIAL_TRANSFERS = [];
export const INITIAL_LEAVES = [];
export const INITIAL_LEAVE_BALANCES = {};
export const INITIAL_PAYROLL = [];
export const INITIAL_TRAININGS = [];
export const INITIAL_TEACHER_TRAININGS = [];
export const INITIAL_APARS = [];
export const INITIAL_DOCUMENTS = [];

export const DISTRICT_STATS = [
  { name: 'Computer Science & Engineering (CSE)', total_teachers: 6, vacancies: 2, ptr: '1:30', total_schools: 1 },
  { name: 'AI & Data Science (AIDS)', total_teachers: 3, vacancies: 1, ptr: '1:25', total_schools: 1 },
  { name: 'Mechanical Engineering (ME)', total_teachers: 3, vacancies: 1, ptr: '1:28', total_schools: 1 },
  { name: 'Electronics & Telecommunication (ENTC)', total_teachers: 3, vacancies: 1, ptr: '1:25', total_schools: 1 },
  { name: 'Information Technology (IT)', total_teachers: 3, vacancies: 2, ptr: '1:30', total_schools: 1 },
  { name: 'Civil Engineering (CE)', total_teachers: 2, vacancies: 1, ptr: '1:35', total_schools: 1 },
  { name: 'Applied Sciences & Humanities (ASH)', total_teachers: 2, vacancies: 1, ptr: '1:40', total_schools: 1 }
];

