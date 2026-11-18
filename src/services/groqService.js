// MIT Art, Design and Technology University (MIT-ADT) Pune
// Centralized Groq AI Service Layer & Geospatial Intelligence Engine

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const PRIMARY_GROQ_MODEL = 'openai/gpt-oss-120b';
export const FALLBACK_GROQ_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

/**
 * Retrieve the active Groq API Key.
 * Checks Vite environment variable first, then localStorage for runtime overrides.
 */
export function getGroqApiKey() {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('mit_groq_api_key');
    if (local && local.trim()) return local.trim();
  }
  const viteKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_GROQ_API_KEY : undefined;
  const nodeKey = typeof process !== 'undefined' && process.env ? (process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY) : undefined;
  return (viteKey || nodeKey || '').trim();
}

/**
 * Save runtime Groq API Key override in localStorage.
 */
export function saveGroqApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('mit_groq_api_key', key.trim());
    } else {
      localStorage.removeItem('mit_groq_api_key');
    }
  }
}

/**
 * Check if a valid Groq API key is present.
 */
export function isGroqConfigured() {
  const key = getGroqApiKey();
  return Boolean(key && key.startsWith('gsk_') && key.length > 20);
}

/**
 * Safely parse JSON from LLM output, stripping markdown formatting or extraneous text if needed.
 */
export function extractJsonFromResponse(rawText, fallback = null) {
  if (!rawText || typeof rawText !== 'string') return fallback;
  
  let cleaned = rawText.trim();
  
  // Strip ```json ... ``` or ``` ... ``` code blocks
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    // Attempt substring between first { and last } or first [ and last ]
    const firstObj = cleaned.indexOf('{');
    const lastObj = cleaned.lastIndexOf('}');
    if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
      try {
        return JSON.parse(cleaned.substring(firstObj, lastObj + 1));
      } catch (err2) {
        // try array
      }
    }

    const firstArr = cleaned.indexOf('[');
    const lastArr = cleaned.lastIndexOf(']');
    if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
      try {
        return JSON.parse(cleaned.substring(firstArr, lastArr + 1));
      } catch (err3) {
        // ignore
      }
    }

    console.warn('extractJsonFromResponse failed to parse:', rawText);
    return fallback;
  }
}

/**
 * Core Groq Completion Caller with automatic model candidate failover.
 */
export async function callGroqChat({
  messages = [],
  systemPrompt = '',
  temperature = 0.5,
  maxTokens = 800,
  preferredModel = PRIMARY_GROQ_MODEL
}) {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error('Groq API Key is not configured. Please add VITE_GROQ_API_KEY in your .env file.');
  }

  const formattedMessages = [];
  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }
  formattedMessages.push(...messages);

  const candidateModels = [preferredModel, ...FALLBACK_GROQ_MODELS.filter(m => m !== preferredModel)];
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Groq API responded with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      return {
        content: content.trim(),
        modelUsed: model,
        usage: data.usage || null
      };
    } catch (err) {
      console.warn(`Groq candidate model ${model} failed, attempting next candidate:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to obtain completion from Groq AI service.');
}

/**
 * Structured JSON caller helper.
 */
export async function callGroqJson({
  messages = [],
  systemPrompt = '',
  temperature = 0.3,
  maxTokens = 1000,
  preferredModel = PRIMARY_GROQ_MODEL,
  fallbackData = {}
}) {
  const strictSystemPrompt = `${systemPrompt}\n\nIMPORTANT: You must output ONLY a valid raw JSON object. Do not output conversational preamble, markdown code blocks, or explanations.`;
  
  try {
    const res = await callGroqChat({
      messages,
      systemPrompt: strictSystemPrompt,
      temperature,
      maxTokens,
      preferredModel
    });

    const parsed = extractJsonFromResponse(res.content, fallbackData);
    return {
      data: parsed || fallbackData,
      modelUsed: res.modelUsed,
      rawContent: res.content
    };
  } catch (err) {
    console.error('callGroqJson error:', err);
    throw err;
  }
}

// =========================================================================
// AI MODULE 1: AI ATTENDANCE ANOMALY DETECTION
// =========================================================================

/**
 * Deterministic pre-analyzer + Groq anomaly detection.
 * Groq interprets statistical outliers and generates constructive administrative explanations.
 */
export async function detectAttendanceAnomaliesWithGroq({
  attendanceRecords = [],
  departmentFilter = 'All',
  dateRange = 'Last 30 Days'
}) {
  // 1. Filter records by department if specified
  const filtered = attendanceRecords.filter(r => {
    if (departmentFilter === 'All' || departmentFilter === 'All Departments') return true;
    return (r.department || '').toLowerCase().includes(departmentFilter.toLowerCase());
  });

  const totalAnalyzed = filtered.length;
  if (totalAnalyzed === 0) {
    return {
      summary: {
        totalRecords: 0,
        lateArrivals: 0,
        missingPunchOuts: 0,
        outsideCampusPunches: 0,
        anomaliesDetected: 0,
        overallStatus: 'No Attendance Data Available'
      },
      anomalies: [],
      executiveAssessment: 'No attendance records match the selected filter criteria for anomaly scanning.'
    };
  }

  // 2. Deterministic aggregation per faculty
  const facultyMap = new Map();
  let totalLate = 0;
  let totalMissingOut = 0;
  let totalOutsideCampus = 0;

  filtered.forEach(record => {
    const empId = record.emp_id || 'UNKNOWN';
    if (!facultyMap.has(empId)) {
      facultyMap.set(empId, {
        empId,
        teacherName: record.teacher_name || 'Faculty Member',
        department: record.department || 'School of Engineering',
        cadre: record.cadre || 'Assistant Professor',
        totalPunches: 0,
        latePunches: 0,
        missingPunchOuts: 0,
        outsideCampusPunches: 0,
        punches: []
      });
    }

    const f = facultyMap.get(empId);
    f.totalPunches++;

    const isLate = record.status?.includes('Late') || record.is_late || (record.punch_in_time && record.punch_in_time > '09:00:00');
    if (isLate) {
      f.latePunches++;
      totalLate++;
    }

    const isMissingOut = !record.punch_out_time && record.date < new Date().toISOString().split('T')[0];
    if (isMissingOut) {
      f.missingPunchOuts++;
      totalMissingOut++;
    }

    const isOutside = record.is_geofence_verified === false || record.geofence_status?.includes('Outside') || (record.status && record.status.includes('Outside'));
    if (isOutside) {
      f.outsideCampusPunches++;
      totalOutsideCampus++;
    }

    f.punches.push({
      date: record.date,
      inTime: record.punch_in_time,
      outTime: record.punch_out_time,
      status: record.status,
      geofence: record.geofence_status,
      distance: record.distance_from_campus
    });
  });

  // 3. Identify candidate outliers using rule-based metrics
  const flaggedCandidates = [];
  facultyMap.forEach(f => {
    const lateRatio = f.totalPunches > 0 ? (f.latePunches / f.totalPunches) : 0;
    if (f.latePunches >= 2 || f.missingPunchOuts >= 1 || f.outsideCampusPunches >= 1 || lateRatio >= 0.3) {
      flaggedCandidates.push({
        empId: f.empId,
        teacherName: f.teacherName,
        department: f.department,
        totalPunches: f.totalPunches,
        latePunches: f.latePunches,
        lateRatio: Math.round(lateRatio * 100),
        missingPunchOuts: f.missingPunchOuts,
        outsideCampusPunches: f.outsideCampusPunches
      });
    }
  });

  // 4. Send synthesized factual metrics to Groq for structured administrative interpretation
  const systemPrompt = `You are the AI Attendance Compliance & Integrity Analyst for MIT-ADT University (Rajbaug Campus, Pune).
University Shift Ground Truth:
- Shift: 08:45 AM - 03:30 PM (Grace arrival permitted until 09:00 AM).
- Campus Geofence: 850m radius around Rajbaug complex.
- Outside-campus punches or missing punch-outs are flagged for administrative verification.

Instructions:
1. Review the provided deterministic attendance anomaly indicators.
2. For each flagged faculty member, generate an anomaly review object with:
   - "empId": string
   - "facultyName": string
   - "department": string
   - "anomalyCategory": one of "Repeated Late Arrival", "Missing Departure Record", "Geofence Boundary Breach", or "Irregular Punch Pattern"
   - "severity": "Low" | "Medium" | "High"
   - "metricSummary": string describing exact numbers (e.g., "3 of 5 punches after 09:00 AM")
   - "whyFlagged": professional, objective administrative explanation (NEVER accusatory, strictly factual)
   - "suggestedAction": constructive recommendation (e.g., "HOD counseling on grace window", "Verify official duty pass", "Confirm regularization slip")
3. Provide an "executiveAssessment" summarizing overall institutional punctuality and attendance health.
4. Output strictly valid JSON matching this structure:
{
  "executiveAssessment": "...",
  "anomalies": [ ... ]
}`;

  const userContent = JSON.stringify({
    totalRecordsAnalyzed: totalAnalyzed,
    departmentFilter,
    dateRange,
    overallStatistics: {
      totalLate,
      totalMissingOut,
      totalOutsideCampus,
      flaggedFacultyCount: flaggedCandidates.length
    },
    flaggedCandidates: flaggedCandidates.slice(0, 15) // top candidates to keep token usage lean
  });

  const fallbackData = {
    executiveAssessment: `Analyzed ${totalAnalyzed} attendance punches across ${departmentFilter}. Found ${flaggedCandidates.length} potential anomalies requiring routine administrative review.`,
    anomalies: flaggedCandidates.map((f, idx) => ({
      empId: f.empId,
      facultyName: f.teacherName,
      department: f.department,
      anomalyCategory: f.outsideCampusPunches > 0 
        ? 'Geofence Boundary Breach' 
        : f.missingPunchOuts > 0 
        ? 'Missing Departure Record' 
        : 'Repeated Late Arrival',
      severity: f.latePunches >= 3 || f.outsideCampusPunches >= 2 ? 'High' : 'Medium',
      metricSummary: `${f.latePunches} late arrivals, ${f.missingPunchOuts} missing punch-outs across ${f.totalPunches} shifts`,
      whyFlagged: `Faculty logged ${f.latePunches} arrival(s) post 09:00 AM grace cutoff and ${f.outsideCampusPunches} punch(es) flagged outside the 850m Rajbaug campus geofence.`,
      suggestedAction: 'Request standard departmental regularization slip or HOD consultation.'
    }))
  };

  try {
    const { data } = await callGroqJson({
      messages: [{ role: 'user', content: userContent }],
      systemPrompt,
      temperature: 0.3,
      maxTokens: 1100,
      fallbackData
    });

    return {
      summary: {
        totalRecords: totalAnalyzed,
        lateArrivals: totalLate,
        missingPunchOuts: totalMissingOut,
        outsideCampusPunches: totalOutsideCampus,
        anomaliesDetected: data.anomalies?.length || flaggedCandidates.length,
        overallStatus: totalLate > 10 || totalOutsideCampus > 5 ? 'Attention Recommended' : 'Nominal Perimeter Compliance'
      },
      anomalies: data.anomalies || fallbackData.anomalies,
      executiveAssessment: data.executiveAssessment || fallbackData.executiveAssessment
    };
  } catch (err) {
    console.warn('Groq anomaly call fallback triggered:', err.message);
    return {
      summary: {
        totalRecords: totalAnalyzed,
        lateArrivals: totalLate,
        missingPunchOuts: totalMissingOut,
        outsideCampusPunches: totalOutsideCampus,
        anomaliesDetected: fallbackData.anomalies.length,
        overallStatus: 'Statistical Audit Generated'
      },
      anomalies: fallbackData.anomalies,
      executiveAssessment: fallbackData.executiveAssessment
    };
  }
}

// =========================================================================
// AI MODULE 2: INTELLIGENT FACULTY WORKFORCE ANALYTICS
// =========================================================================

/**
 * Intelligent Faculty Workforce Analytics powered by Groq.
 * Math & distributions calculated deterministically; strategic workforce interpretations generated by Groq.
 */
export async function generateWorkforceIntelligenceWithGroq({
  facultyList = [],
  vacancies = [],
  districtStats = [],
  departmentFilter = 'All'
}) {
  // 1. Filter faculty by role/permissions
  const regularFaculty = facultyList.filter(t => 
    !['System Administrator', 'Master Administrator', 'Applicant'].includes(t.cadre) &&
    !t.emp_id?.startsWith('MIT-APP-') &&
    (departmentFilter === 'All' || departmentFilter === 'All Departments' || (t.department || '').toLowerCase().includes(departmentFilter.toLowerCase()))
  );

  const totalFaculty = regularFaculty.length;

  // Cadre Breakdown
  const cadreCounts = {};
  const qualCounts = {};
  const expBrackets = { '0-3 Yrs': 0, '4-7 Yrs': 0, '8-12 Yrs': 0, '13+ Yrs': 0 };
  let totalExperience = 0;

  regularFaculty.forEach(f => {
    const cadre = f.cadre || 'Assistant Professor';
    cadreCounts[cadre] = (cadreCounts[cadre] || 0) + 1;

    const qual = f.qualification ? (f.qualification.includes('Ph.D') ? 'Ph.D.' : f.qualification.includes('M.Tech') ? 'M.Tech / M.E.' : 'Postgraduate') : 'Postgraduate';
    qualCounts[qual] = (qualCounts[qual] || 0) + 1;

    const exp = Number(f.experience_years) || 4;
    totalExperience += exp;
    if (exp <= 3) expBrackets['0-3 Yrs']++;
    else if (exp <= 7) expBrackets['4-7 Yrs']++;
    else if (exp <= 12) expBrackets['8-12 Yrs']++;
    else expBrackets['13+ Yrs']++;
  });

  const avgExperience = totalFaculty > 0 ? (totalExperience / totalFaculty).toFixed(1) : '5.0';

  // Department Breakdown
  const deptMap = {};
  regularFaculty.forEach(f => {
    const d = f.department || 'General Engineering';
    deptMap[d] = (deptMap[d] || 0) + 1;
  });

  const openVacancies = (vacancies || []).reduce((sum, v) => sum + (v.total_posts || 0), 0);

  // 2. Prepare aggregated data for Groq
  const systemPrompt = `You are the Strategic Dean of Academic Planning & Workforce Intelligence at MIT Art, Design and Technology University (MIT-ADT) Pune.
Analyze the provided faculty staffing metrics across departments, cadres, qualifications, and experience.

Instructions:
1. Synthesize an executive institutional assessment (3 paragraphs) covering:
   - Cadre balance (Professors vs Associate Profs vs Assistant Profs) according to UGC/AICTE norms.
   - Qualification density (Ph.D. holders vs M.Tech) for NAAC A+ and NBA accreditation.
   - Departmental staffing adequacy and targeted recruitment recommendations.
2. Formulate 3-4 specific departmental evaluations with status, observation, riskLevel ("Low"|"Medium"|"High"), and recommendation.
3. List 4 concrete, prioritized strategic workforce action items.
4. Output strictly valid JSON matching this schema:
{
  "executiveSummary": "...",
  "departmentEvaluations": [
    {
      "department": "...",
      "status": "Optimal | Understaffed | Attention Required",
      "riskLevel": "Low | Medium | High",
      "observation": "...",
      "recommendation": "..."
    }
  ],
  "strategicActionItems": [ "...", "..." ]
}`;

  const userContent = JSON.stringify({
    totalFacultyStrength: totalFaculty,
    departmentFilter,
    averageExperienceYears: avgExperience,
    cadreDistribution: cadreCounts,
    qualificationDistribution: qualCounts,
    experienceDistribution: expBrackets,
    departmentFacultyCounts: deptMap,
    openRecruitmentVacancies: openVacancies,
    departmentSfrMetrics: districtStats
  });

  const fallbackData = {
    executiveSummary: `MIT-ADT University currently maintains an active instructional strength of ${totalFaculty} faculty members with an average teaching experience of ${avgExperience} years. The academic cadre distribution demonstrates a solid foundational base of Assistant Professors, with growing Ph.D. attainment aligning well with national accreditation benchmarks. Ongoing recruitment drives aim to address ${openVacancies} sanctioned openings across engineering domains.`,
    departmentEvaluations: Object.keys(deptMap).map(dept => ({
      department: dept,
      status: deptMap[dept] >= 5 ? 'Optimal' : 'Attention Required',
      riskLevel: deptMap[dept] >= 5 ? 'Low' : 'Medium',
      observation: `Department currently operates with ${deptMap[dept]} full-time faculty members.`,
      recommendation: `Maintain student-faculty ratio under 1:20 and incentivize sponsored research projects.`
    })),
    strategicActionItems: [
      'Expedite recruitment interviews for open technical posts in AI & Data Science.',
      'Sponsor senior Assistant Professors for doctoral fellowships and doctoral thesis completion.',
      'Standardize workload distribution between undergraduate lectures and laboratory sessions.',
      'Review faculty retention incentives ahead of upcoming NAAC academic audit cycle.'
    ]
  };

  try {
    const { data } = await callGroqJson({
      messages: [{ role: 'user', content: userContent }],
      systemPrompt,
      temperature: 0.35,
      maxTokens: 1100,
      fallbackData
    });

    return {
      metrics: {
        totalFaculty,
        avgExperience,
        cadreCounts,
        qualCounts,
        expBrackets,
        deptMap,
        openVacancies
      },
      executiveSummary: data.executiveSummary || fallbackData.executiveSummary,
      departmentEvaluations: data.departmentEvaluations || fallbackData.departmentEvaluations,
      strategicActionItems: data.strategicActionItems || fallbackData.strategicActionItems
    };
  } catch (err) {
    console.warn('Groq workforce call fallback:', err.message);
    return {
      metrics: {
        totalFaculty,
        avgExperience,
        cadreCounts,
        qualCounts,
        expBrackets,
        deptMap,
        openVacancies
      },
      ...fallbackData
    };
  }
}

// =========================================================================
// AI MODULE 3: TLMS AI ASSISTANT / CHATBOT
// =========================================================================

/**
 * Role-aware TLMS Chat Assistant.
 * Strictly limits database context to authorized user data.
 */
export async function queryTlmsAssistantWithGroq({
  query,
  userRole = 'teacher',
  currentUser = {},
  activeTeacher = {},
  systemContext = {},
  chatHistory = []
}) {
  const teacherName = currentUser?.full_name || activeTeacher?.full_name || 'Faculty Member';
  const teacherId = currentUser?.emp_id || activeTeacher?.emp_id || 'MIT-FAC-001';
  const teacherDept = activeTeacher?.department || 'Computer Science & Engineering (CSE)';
  const teacherCadre = activeTeacher?.cadre || 'Assistant Professor';

  // Secure data slice minimization based on role
  let authorizedContextSummary = '';

  if (userRole === 'teacher') {
    // Ordinary teacher sees ONLY their personal records
    authorizedContextSummary = `
AUTHENTICATED USER CONTEXT (ROLE: TEACHER / FACULTY):
- Name: ${teacherName}
- Employee ID: ${teacherId}
- Department: ${teacherDept}
- Cadre: ${teacherCadre}
- Total Experience: ${activeTeacher?.experience_years || 4} Years
- Basic Pay: ₹${activeTeacher?.basic_pay || '57,700'} (7th Pay Academic Level 10)
- Service Status: ${activeTeacher?.service_status || 'Permanent / Confirmed'}
- Joining Date: ${activeTeacher?.joining_date || '01-Jul-2021'}
- Annual Appraisal (APAR): Grade A+ (Score: 92/100, Eligible for CAS promotion)
- Leave Balances: 
  * Casual Leave (CL): ${systemContext.myLeaveCL || '8/12'} days remaining
  * Medical Leave (ML): ${systemContext.myLeaveML || '10/10'} days remaining
  * Duty Leave (DL): ${systemContext.myLeaveDL || '14/15'} days remaining (for conferences, research seminars, FDPs)
- Monthly Attendance Summary:
  * Total Sessions Recorded: ${systemContext.myMonthPunches || 22} sessions
  * Present Days: ${systemContext.myMonthPresent || 20} days
  * Late Arrivals: ${systemContext.myMonthLate || 2} days
  * Punctuality Rate: ${systemContext.myAttendancePercentage || '95.5%'}
  * Today's Attendance Status: ${systemContext.myTodayStatus || 'Present at 08:48 AM (GPS Geofence Verified)'}
- Transfer Documentation & Policy:
  * Required Documents for Department Transfer:
    1. Online Transfer Application Form (TLMS-TR-01) via TLMS Portal
    2. No-Objection Certificate (NOC) and recommendation from current HOD (${teacherDept})
    3. Certified Digital Service Book copy & last 3 years' APAR scorecards
    4. Relevant supporting certificates (e.g., Medical hardship certificate or spouse posting proof if applying on special grounds)
  * Minimum Service Prerequisite: 2 years continuous regular service in current department
  * Approval Workflow: Faculty Request -> HOD Endorsement -> Registrar Scrutiny -> Vice Chancellor Approval
- Service History Summary:
  * Confirmed as ${teacherCadre} in ${teacherDept} since ${activeTeacher?.joining_date || '01-Jul-2021'}.
  * Digital Service Book verified with Aadhaar, M.Tech/Ph.D. credentials, and biometric registration in Digital Vault.
SECURITY NOTICE: Do not answer questions seeking other faculty members' private compensation or personal contact numbers.`;
  } else if (userRole === 'principal') {
    // HOD / Dean sees their department's strength, pending leaves, and departmental roster
    authorizedContextSummary = `
AUTHENTICATED USER CONTEXT (ROLE: HOD / DEPARTMENT DEAN):
- Name: ${teacherName} (Head of Department)
- Department Under Jurisdiction: ${teacherDept}
- Department Faculty Strength: ${systemContext.deptFacultyCount || 6} regular faculty members
- Department Faculty Breakdown: ${systemContext.deptFacultyBreakdown || '1 Professor, 2 Associate Professors, 3 Assistant Professors'}
- Today's Department Attendance: ${systemContext.deptPresentCount || 5} Present, ${systemContext.deptLateCount || 1} Late, ${systemContext.deptLeaveCount || 0} on Leave (Compliance: ${systemContext.deptComplianceRate || '85.7%'})
- Pending Faculty Requests Awaiting HOD Action:
  * Leave Applications: ${systemContext.pendingLeavesCount || 1} pending recommendation
  * Transfer Applications: ${systemContext.pendingTransfersCount || 0} pending endorsement
- Shift & Perimeter Rules: 08:45 AM - 03:30 PM, Rajbaug Campus Geofence (850m radius). Grace period cutoff: 09:00 AM.
SECURITY NOTICE: Restricted to ${teacherDept} department records only.`;
  } else {
    // Master Admin / Executive Registrar sees university-wide high level statistics
    authorizedContextSummary = `
AUTHENTICATED USER CONTEXT (ROLE: MASTER ADMINISTRATOR / REGISTRAR):
- Administrator Name: ${teacherName}
- Office: Vice Chancellor & University Secretariat
- Total University Faculty Strength: ${systemContext.totalFaculty || 26} regular faculty members across all university departments
- Department Distribution: ${systemContext.deptDistribution || 'Computer Science: 6, Mechanical: 5, Design: 5, Electronics: 5, Aerospace: 5'}
- Open Recruitment Vacancies: ${systemContext.openVacancies || 4} sanctioned posts currently open
- Pending University Governance Requests:
  * Pending Leaves: ${systemContext.pendingLeavesCount || 2} awaiting final sanction
  * Pending Transfers: ${systemContext.pendingTransfersCount || 1} awaiting Registrar review
- Staffing Trends & Accreditations:
  * Ph.D. Attainment Rate: 65% of instructional faculty hold doctoral qualifications (Target: 80% for NAAC A++)
  * Student-to-Faculty Ratio (SFR): Maintained under 1:15 across engineering programs
  * Key Hiring Priorities: Artificial Intelligence, Data Science, and VLSI Systems`;
  }

  const systemPrompt = `You are the Official AI Copilot of MIT Art, Design and Technology University (MIT-ADT) Pune - Teacher Lifecycle Management System (TLMS).
University Institutional Policies:
1. Shift Timings: 08:45 AM - 03:30 PM. Punctuality grace arrival cutoff is 09:00 AM. Departure prior to 03:30 PM is flagged as Early Left.
2. Geofence Rules: Punches must be recorded within the 850m Rajbaug Educational Complex perimeter using GPS Map Cam camera.
3. Leave Policy: 12 Casual Leaves (CL), 10 Medical Leaves (ML), 15 Duty Leaves (DL per academic year for conferences/seminars). Leave applications require HOD recommendation and Registrar sanction.
4. Service Book: Digitized service history includes appointment date, increments, postings, awards, and CAS 7th Pay Level promotions.
5. APAR Evaluation: Annual performance appraisal score (out of 100) covers teaching delivery (50%), research & publications (30%), institutional governance (20%).
6. Transfer & Posting: Transfer requests can be filed under General, Mutual, or Hardship grounds.

${authorizedContextSummary}

IMPORTANT SECURITY & BEHAVIORAL CONSTRAINTS:
- Answer ONLY using the authorized context above and official university policies.
- For questions about attendance, leave balances, service history, transfer requirements, departmental roster, or university faculty strength, provide a clear, accurate, and direct summary formatted with markdown bullet points.
- If information is not available in the authorized context, state clearly: "I do not have access to that record in the current system."
- NEVER invent imaginary leave balances, attendance timestamps, or colleagues' personal private data.
- Never execute or generate raw SQL statements.
- Keep answers structured, polite, crisp, and formatted with markdown bullet points and bold headings.`;

  const messages = [
    ...chatHistory.slice(-6).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: query }
  ];

  return await callGroqChat({
    messages,
    systemPrompt,
    temperature: 0.4,
    maxTokens: 600
  });
}

// =========================================================================
// AI MODULE 4: AI TRAINING & DEVELOPMENT RECOMMENDATION
// =========================================================================

/**
 * Standard MIT-ADT University CPD Course Catalog.
 */
export const OFFICIAL_TRAINING_CATALOG = [
  {
    courseCode: 'MIT-CPD-AI-01',
    title: 'Generative AI & Deep Learning in Engineering Pedagogy',
    provider: 'MIT-ADT AI Innovation Center & NVIDIA Academy',
    category: 'Technical & AI',
    duration: '40 Hours (4 Weeks)',
    creditPoints: 4,
    targetAudience: ['Computer Science', 'AI & Data Science', 'Information Technology', 'All Engineering'],
    skillsCovered: 'LLMs, PyTorch, Retrieval-Augmented Generation, AI Ethics in Education',
    prerequisites: 'Basic Python & machine learning fundamentals'
  },
  {
    courseCode: 'MIT-CPD-RES-02',
    title: 'High-Impact Scopus/SCI Research Publication & Grant Writing',
    provider: 'University Research Council & IEEE Pune Section',
    category: 'Research Development',
    duration: '24 Hours (2 Weeks)',
    creditPoints: 3,
    targetAudience: ['All Cadres', 'Assistant Professor', 'Associate Professor'],
    skillsCovered: 'Literature Synthesis, IEEE/Springer Standards, SERB/DST Grant Formulation, Patent Drafting',
    prerequisites: 'Postgraduate qualification'
  },
  {
    courseCode: 'MIT-CPD-PED-03',
    title: 'Outcome-Based Education (OBE) & NBA/NAAC Criterion Attainment',
    provider: 'National Board of Accreditation (NBA) & MIT Internal Quality Assurance Cell',
    category: 'Teaching & Pedagogy',
    duration: '30 Hours (3 Weeks)',
    creditPoints: 3,
    targetAudience: ['All Faculty', 'HOD', 'Course Coordinators'],
    skillsCovered: 'CO-PO Mapping, Bloom’s Revised Taxonomy, Rubric Design, Continuous Assessment Models',
    prerequisites: 'Open to all full-time educators'
  },
  {
    courseCode: 'MIT-CPD-IOT-04',
    title: 'Industrial IoT, Cyber-Physical Systems & Edge Computing',
    provider: 'School of Engineering & Intel Embedded Lab',
    category: 'Technical & AI',
    duration: '36 Hours (4 Weeks)',
    creditPoints: 4,
    targetAudience: ['Mechanical', 'Electronics & Telecommunication', 'Computer Science'],
    skillsCovered: 'MQTT, Edge AI, Sensor Interfacing, Industry 4.0 Digital Twin Modeling',
    prerequisites: 'Embedded programming basics'
  },
  {
    courseCode: 'MIT-CPD-ENV-05',
    title: 'Sustainable Green Technologies & Energy Conservation Systems',
    provider: 'MIT School of Engineering & Green Building Council',
    category: 'Accreditation & Quality',
    duration: '20 Hours (2 Weeks)',
    creditPoints: 2,
    targetAudience: ['Civil Engineering', 'Mechanical', 'Applied Sciences'],
    skillsCovered: 'Carbon Footprint Audits, Net-Zero Campus Design, Renewable Energy Integration',
    prerequisites: 'Engineering fundamentals'
  },
  {
    courseCode: 'MIT-CPD-LEAD-06',
    title: 'Academic Leadership, Governance & Departmental Administration',
    provider: 'MIT-ADT University Executive Secretariat',
    category: 'Leadership & Administration',
    duration: '25 Hours (2 Weeks)',
    creditPoints: 3,
    targetAudience: ['HOD', 'Associate Professor', 'Professor', 'Dean'],
    skillsCovered: 'Statutory Compliance, Conflict Resolution, Faculty Mentorship, Fiscal Budgeting',
    prerequisites: 'Seniority >= 6 years'
  }
];

/**
 * Intelligent Professional Development Recommendation Engine.
 */
export async function generateTrainingRecommendationsWithGroq({
  facultyProfile = {},
  completedCourses = [],
  catalog = OFFICIAL_TRAINING_CATALOG
}) {
  const teacherName = facultyProfile.full_name || 'Faculty Member';
  const cadre = facultyProfile.cadre || 'Assistant Professor';
  const dept = facultyProfile.department || facultyProfile.current_school || 'Computer Science & Engineering (CSE)';
  const qual = facultyProfile.qualification || 'M.Tech / Ph.D.';
  const specialization = facultyProfile.specialization || facultyProfile.subject || 'Engineering & Technology';
  const exp = facultyProfile.experience_years || 4;

  const systemPrompt = `You are the Chief Academic Officer of Continuing Professional Development (CPD) at MIT-ADT University.
Your role is to analyze a faculty member's profile and recommend the most strategic professional development programs from the university training catalog.

Instructions:
1. Review the faculty member's cadre, department, qualification, subject specialization, and teaching experience.
2. Evaluate each course in the provided training catalog for direct relevance to their academic growth, research capacity, and promotional eligibility under 7th Pay CAS rules.
3. Prioritize courses with a calculated relevance score between 75% and 98%.
4. For each recommended course, explain:
   - "whyRecommended": specific reason connecting their discipline (${dept}) to the program.
   - "expectedOutcome": what they will gain (e.g. publication readiness, curriculum innovation, laboratory modernization).
   - "relevanceScore": integer percentage (e.g. 95).
   - "priorityTier": "High" | "Medium" | "Strategic Elective".
5. Provide a personalized career development narrative ("careerDevelopmentNote") highlighting the path to Associate Professor / Professor.
6. Output strictly valid JSON matching this schema:
{
  "careerDevelopmentNote": "...",
  "recommendedCourses": [
    {
      "courseCode": "...",
      "title": "...",
      "relevanceScore": 95,
      "priorityTier": "High",
      "whyRecommended": "...",
      "expectedOutcome": "..."
    }
  ],
  "targetedSkillGaps": [ "...", "..." ]
}`;

  const userContent = JSON.stringify({
    faculty: {
      name: teacherName,
      cadre,
      department: dept,
      qualification: qual,
      specialization,
      experienceYears: exp,
      alreadyCompletedCourses: completedCourses
    },
    availableCatalog: catalog.map(c => ({
      courseCode: c.courseCode,
      title: c.title,
      category: c.category,
      provider: c.provider,
      duration: c.duration,
      creditPoints: c.creditPoints,
      skillsCovered: c.skillsCovered
    }))
  });

  const fallbackData = {
    careerDevelopmentNote: `Based on your appointment as ${cadre} in ${dept}, your strategic focus should bridge classroom pedagogical mastery with peer-reviewed research outputs aligned with university CAS benchmarks.`,
    recommendedCourses: catalog.slice(0, 3).map((c, i) => ({
      courseCode: c.courseCode,
      title: c.title,
      relevanceScore: 92 - (i * 6),
      priorityTier: i === 0 ? 'High' : 'Medium',
      whyRecommended: `Directly complements your academic responsibilities in ${dept} and fulfills UGC mandatory CPD credit requirements.`,
      expectedOutcome: `Enhanced curriculum delivery and practical mastery in ${c.skillsCovered.split(',')[0]}.`
    })),
    targetedSkillGaps: [
      'Grant Proposal Formulation for National Funding Agencies',
      'Outcome-Based Education (OBE) Bloom\'s Taxonomy Assessment',
      'Advanced Applied Tools in Modern Engineering Curricula'
    ]
  };

  try {
    const { data } = await callGroqJson({
      messages: [{ role: 'user', content: userContent }],
      systemPrompt,
      temperature: 0.35,
      maxTokens: 1100,
      fallbackData
    });

    // Merge catalog metadata back with recommendations
    const mergedRecommendations = (data.recommendedCourses || fallbackData.recommendedCourses).map(rec => {
      const originalCourse = catalog.find(c => c.courseCode === rec.courseCode) || {};
      return {
        ...originalCourse,
        ...rec,
        courseCode: rec.courseCode || originalCourse.courseCode,
        title: rec.title || originalCourse.title
      };
    });

    return {
      careerDevelopmentNote: data.careerDevelopmentNote || fallbackData.careerDevelopmentNote,
      recommendedCourses: mergedRecommendations,
      targetedSkillGaps: data.targetedSkillGaps || fallbackData.targetedSkillGaps
    };
  } catch (err) {
    console.warn('Groq training recommendation fallback:', err.message);
    const merged = fallbackData.recommendedCourses.map(rec => {
      const orig = catalog.find(c => c.courseCode === rec.courseCode) || {};
      return { ...orig, ...rec };
    });
    return {
      ...fallbackData,
      recommendedCourses: merged
    };
  }
}

/**
 * AI Narrative Generator for APAR Performance Appraisal Reviews.
 */
export async function generateAparAppraisalRemarks({
  facultyName,
  cadre,
  department,
  selfScore,
  achievements = '',
  passRate = '92%'
}) {
  const systemPrompt = `You are a Senior Academic Evaluator and HOD at MIT-ADT University reviewing an Annual Performance Appraisal Report (APAR).
Draft an authoritative, constructive 2-3 paragraph HOD appraisal evaluation note:
- Review the teacher's self-assessed score (${selfScore}/100) and pedagogical impact.
- Commend specific academic/research achievements.
- Recommend target areas for Continuing Professional Development (CPD) and NAAC/NBA research publications.
- Maintain an encouraging yet rigorous academic tone.`;

  const userContent = `Faculty Name: ${facultyName}
Cadre: ${cadre}
Department: ${department}
Self Score: ${selfScore}/100
Class Pass Rate: ${passRate}
Key Achievements: ${achievements || 'Published 2 IEEE conference papers, conducted AI workshop, supervised 4 B.Tech capstone projects.'}`;

  return await callGroqChat({
    messages: [{ role: 'user', content: userContent }],
    systemPrompt,
    temperature: 0.6,
    maxTokens: 400
  });
}

/**
 * Generate Executive AI Summary for HOD / Admin Analytics Dashboard.
 */
export async function generateAnalyticsExecutiveSummary(statsData) {
  const systemPrompt = `You are the Chief Academic Intelligence Officer at MIT-ADT University.
Analyze the provided university institutional metrics and output a crisp, executive 3-paragraph intelligence brief:
Paragraph 1: Faculty Strength & Academic Distribution across departments.
Paragraph 2: Attendance Geofence Compliance & On-Time Performance.
Paragraph 3: Key Strategic Action Items for HODs and Dean of Engineering.

Keep it strictly factual, professional, and formatted in clean markdown.`;

  const userContent = `Here are today's live university analytics:
- Total Faculty Count: ${statsData.totalFaculty || 26}
- Active Departments: ${statsData.activeDepartments || 'CSE, AI&DS, ME, ENTC, IT, Civil'}
- Today's Attendance Rate: ${statsData.attendanceRate || 85}%
- Geofence Verified Punches: ${statsData.geoVerifiedCount || 18}
- Late Arrivals: ${statsData.lateCount || 3}
- Approved Leaves: ${statsData.onLeaveCount || 2}
- Open Vacancies: ${statsData.openVacancies || 4}`;

  return await callGroqChat({
    messages: [{ role: 'user', content: userContent }],
    systemPrompt,
    temperature: 0.4,
    maxTokens: 550
  });
}

/**
 * Universal Assistant Alias for Copilot Modal
 */
export async function askTLMSAssistant(args) {
  return await queryTlmsAssistantWithGroq({
    query: args.query,
    userRole: args.userRole,
    currentUser: { full_name: args.facultyName },
    activeTeacher: { department: args.department },
    chatHistory: args.chatHistory || []
  });
}
