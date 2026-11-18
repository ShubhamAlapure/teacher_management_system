import fs from 'fs';

// Load .env into process.env for Node test runner
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
} catch (e) {
  // ignore
}

import { 
  getGroqApiKey,
  isGroqConfigured,
  extractJsonFromResponse,
  detectAttendanceAnomaliesWithGroq,
  generateWorkforceIntelligenceWithGroq,
  generateTrainingRecommendationsWithGroq,
  queryTlmsAssistantWithGroq,
  OFFICIAL_TRAINING_CATALOG
} from './src/services/groqService.js';

console.log('====================================================');
console.log('MIT-ADT TLMS 4 GROQ-POWERED AI MODULES INTEGRATION TEST');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failCount++;
  }
}

// -----------------------------------------------------------------
// TEST 1: Service Configuration & JSON Extraction
// -----------------------------------------------------------------
console.log('Test 1: Groq Service Configuration & JSON Extractor');
{
  assert(typeof getGroqApiKey === 'function', 'getGroqApiKey function exists');
  
  const rawMarkdownJson = '```json\n{"status":"success","score":95}\n```';
  const parsed = extractJsonFromResponse(rawMarkdownJson);
  assert(parsed && parsed.status === 'success' && parsed.score === 95, 'extractJsonFromResponse strips markdown fences cleanly');

  const dirtyJson = 'Some preamble text\n{"result":"ok"}\nSome trailing text';
  const parsedDirty = extractJsonFromResponse(dirtyJson);
  assert(parsedDirty && parsedDirty.result === 'ok', 'extractJsonFromResponse handles preamble & trailing text');
}

// -----------------------------------------------------------------
// TEST 2: AI Attendance Anomaly Detection
// -----------------------------------------------------------------
console.log('\nTest 2: AI Attendance Anomaly Detection');
{
  // 2a. Empty attendance records
  const emptyRes = await detectAttendanceAnomaliesWithGroq({
    attendanceRecords: [],
    departmentFilter: 'All'
  });
  assert(emptyRes.summary.totalRecords === 0, 'Empty records handled gracefully (totalRecords: 0)');
  assert(Array.isArray(emptyRes.anomalies) && emptyRes.anomalies.length === 0, 'Empty records returns 0 anomalies');

  // 2b. Simulated attendance records with anomalies
  const sampleRecords = [
    { emp_id: 'MIT-FAC-001', teacher_name: 'Dr. Ramesh Kulkarni', department: 'Computer Science', date: '2026-11-15', punch_in_time: '09:25:00', punch_out_time: '15:35:00', status: 'Late', is_late: true },
    { emp_id: 'MIT-FAC-001', teacher_name: 'Dr. Ramesh Kulkarni', department: 'Computer Science', date: '2026-11-16', punch_in_time: '09:30:00', punch_out_time: '15:40:00', status: 'Late', is_late: true },
    { emp_id: 'MIT-FAC-001', teacher_name: 'Dr. Ramesh Kulkarni', department: 'Computer Science', date: '2026-11-17', punch_in_time: '09:15:00', punch_out_time: null, status: 'Late', is_late: true },
    { emp_id: 'MIT-FAC-002', teacher_name: 'Prof. Neha Joshi', department: 'Computer Science', date: '2026-11-15', punch_in_time: '08:50:00', punch_out_time: '15:35:00', status: 'Present', is_geofence_verified: true },
    { emp_id: 'MIT-FAC-002', teacher_name: 'Prof. Neha Joshi', department: 'Computer Science', date: '2026-11-16', punch_in_time: '08:52:00', punch_out_time: '15:30:00', status: 'Present', is_geofence_verified: true },
    { emp_id: 'MIT-FAC-003', teacher_name: 'Dr. Rohan Deshmukh', department: 'Computer Science', date: '2026-11-15', punch_in_time: '08:55:00', punch_out_time: '15:30:00', status: 'Present (Outside Campus)', is_geofence_verified: false, distance_from_campus: 4200 }
  ];

  const anomalyRes = await detectAttendanceAnomaliesWithGroq({
    attendanceRecords: sampleRecords,
    departmentFilter: 'Computer Science'
  });

  assert(anomalyRes.summary.totalRecords === 6, 'Analyzed 6 sample records correctly');
  assert(anomalyRes.summary.lateArrivals === 3, 'Identified 3 late arrivals deterministically');
  assert(anomalyRes.summary.missingPunchOuts === 1, 'Identified 1 missing punch out deterministically');
  assert(anomalyRes.summary.outsideCampusPunches === 1, 'Identified 1 outside campus punch deterministically');
  assert(Array.isArray(anomalyRes.anomalies) && anomalyRes.anomalies.length > 0, 'Generated anomaly cards with explanations');
}

// -----------------------------------------------------------------
// TEST 3: Intelligent Faculty Workforce Analytics
// -----------------------------------------------------------------
console.log('\nTest 3: Intelligent Faculty Workforce Analytics');
{
  const sampleFaculty = [
    { emp_id: 'T1', full_name: 'Dr. A', department: 'Computer Science', cadre: 'Professor', qualification: 'Ph.D. in CSE', experience_years: 15 },
    { emp_id: 'T2', full_name: 'Dr. B', department: 'Computer Science', cadre: 'Associate Professor', qualification: 'Ph.D. in AI', experience_years: 10 },
    { emp_id: 'T3', full_name: 'Prof. C', department: 'Computer Science', cadre: 'Assistant Professor', qualification: 'M.Tech in CSE', experience_years: 4 },
    { emp_id: 'T4', full_name: 'Dr. D', department: 'Mechanical', cadre: 'Associate Professor', qualification: 'Ph.D. in Thermal', experience_years: 12 },
    { emp_id: 'T5', full_name: 'Prof. E', department: 'Mechanical', cadre: 'Assistant Professor', qualification: 'M.E. in CAD/CAM', experience_years: 3 }
  ];

  const sampleVacancies = [
    { title: 'Assistant Professor - CSE', total_posts: 2 },
    { title: 'Associate Professor - Mechanical', total_posts: 1 }
  ];

  const workforceRes = await generateWorkforceIntelligenceWithGroq({
    facultyList: sampleFaculty,
    vacancies: sampleVacancies,
    districtStats: [],
    departmentFilter: 'All'
  });

  assert(workforceRes.metrics.totalFaculty === 5, 'Total faculty metric matches 5');
  assert(workforceRes.metrics.openVacancies === 3, 'Total open vacancies metric matches 3');
  assert(workforceRes.metrics.cadreCounts['Assistant Professor'] === 2, 'Cadre distribution computed correctly');
  assert(typeof workforceRes.executiveSummary === 'string' && workforceRes.executiveSummary.length > 20, 'Executive summary narrative generated');
  assert(Array.isArray(workforceRes.strategicActionItems) && workforceRes.strategicActionItems.length > 0, 'Strategic action items generated');
}

// -----------------------------------------------------------------
// TEST 4: TLMS AI Assistant (Role-Aware Retrieval)
// -----------------------------------------------------------------
console.log('\nTest 4: TLMS AI Assistant / Chatbot');
{
  const teacherContext = {
    myTodayStatus: 'Present at 08:52:00'
  };

  const assistantRes = await queryTlmsAssistantWithGroq({
    query: 'What is my attendance status today and what are the campus geofence shift rules?',
    userRole: 'teacher',
    currentUser: { full_name: 'Dr. Ramesh Kulkarni', emp_id: 'MIT-FAC-001' },
    activeTeacher: { department: 'Computer Science & Engineering', cadre: 'Assistant Professor' },
    systemContext: teacherContext
  });

  assert(typeof assistantRes.content === 'string' && assistantRes.content.length > 20, 'Assistant responded with meaningful text');
  assert(assistantRes.modelUsed !== undefined, `Model used: ${assistantRes.modelUsed}`);
}

// -----------------------------------------------------------------
// TEST 5: AI Training & Professional Development Recommendation
// -----------------------------------------------------------------
console.log('\nTest 5: AI Training & Development Recommendation Engine');
{
  assert(Array.isArray(OFFICIAL_TRAINING_CATALOG) && OFFICIAL_TRAINING_CATALOG.length >= 5, 'Official training catalog loaded with >= 5 courses');

  const facultyProfile = {
    full_name: 'Dr. Ramesh Kulkarni',
    cadre: 'Assistant Professor',
    department: 'Computer Science & Engineering (CSE)',
    qualification: 'Ph.D. in Computer Science',
    specialization: 'Artificial Intelligence & Machine Learning',
    experience_years: 5
  };

  const recRes = await generateTrainingRecommendationsWithGroq({
    facultyProfile,
    completedCourses: [],
    catalog: OFFICIAL_TRAINING_CATALOG
  });

  assert(typeof recRes.careerDevelopmentNote === 'string', 'Career development note formulated');
  assert(Array.isArray(recRes.recommendedCourses) && recRes.recommendedCourses.length > 0, 'Recommended courses list generated');
  assert(recRes.recommendedCourses[0].courseCode !== undefined, 'Recommended course includes courseCode');
  assert(Array.isArray(recRes.targetedSkillGaps), 'Targeted skill gaps identified');
}

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL 4 GROQ AI MODULE INTEGRATION TESTS COMPLETED SUCCESSFULLY!\n');
}
