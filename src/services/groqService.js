// MIT Art, Design and Technology University (MIT-ADT) Pune
// Groq AI Inference Engine & Service Layer

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
  return (import.meta.env.VITE_GROQ_API_KEY || '').trim();
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
 * Execute a completion call to Groq Cloud with automatic model fallback.
 */
export async function callGroqChat({
  messages = [],
  systemPrompt = '',
  temperature = 0.6,
  maxTokens = 600,
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
      console.warn(`Groq model ${model} failed, attempting next candidate:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to obtain completion from Groq AI service.');
}

/**
 * AI Assistant for University Policies, Shifts, Attendance, and Faculty Workflows.
 */
export async function askTLMSAssistant({
  query,
  userRole = 'teacher',
  facultyName = 'Faculty Member',
  department = 'Engineering',
  chatHistory = []
}) {
  const systemPrompt = `You are the Official AI Copilot for MIT Art, Design and Technology University (MIT-ADT) Pune's Teacher Lifecycle Management System (TLMS).
University Ground Truth:
- Location: Rajbaug Educational Complex, Loni Kalbhor, Pune - 412201.
- Campus Coordinates: 18.492590° N, 74.025480° E (Radius: 850m).
- Daily Shift Timings: 08:45 AM - 03:30 PM (Grace arrival permitted until 09:00 AM; departures prior to 03:30 PM are flagged as Early Left).
- Attendance: Requires GPS Map Cam with tamper-proof watermarking, altitude ASL (~564m), and coordinate validation within the 850m perimeter.
- Roles: Teacher (e-Service Book, Punch IN/OUT, Leaves, APAR self-score), HOD/Principal (Surveillance Desk, Leave & Transfer approvals, APAR review), Master Admin (VC Office, Registrar, Recruitment & Vacancy management).
- Pay Matrix: 7th Central Pay Commission with Academic Level 10 (Asst Prof) through Level 14 (Professor/Dean).

Guidelines:
- Provide clear, professional, concise, university-tailored advice.
- Address the user as ${facultyName} (${userRole.toUpperCase()} in ${department}).
- Use formatting (bullet points, bold text) where beneficial.`;

  const messages = [
    ...chatHistory.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: query }
  ];

  return await callGroqChat({
    messages,
    systemPrompt,
    temperature: 0.5,
    maxTokens: 500
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
