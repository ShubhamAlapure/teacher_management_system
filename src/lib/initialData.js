// Clean Production Initial Data Layer for MIT-ADT University Pune
// All arrays start empty to fetch and store real live database records via Supabase.

export const INITIAL_TEACHERS = [];
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
  { name: 'School of Engineering (SOE)', total_teachers: 0, vacancies: 0, ptr: '0:1', total_schools: 1 },
  { name: 'Institute of Design (IOD)', total_teachers: 0, vacancies: 0, ptr: '0:1', total_schools: 1 },
  { name: 'College of Food Tech (SOFT)', total_teachers: 0, vacancies: 0, ptr: '0:1', total_schools: 1 },
  { name: 'School of Fine Arts (SOFA)', total_teachers: 0, vacancies: 0, ptr: '0:1', total_schools: 1 },
  { name: 'School of Film & Media (SOFM)', total_teachers: 0, vacancies: 0, ptr: '0:1', total_schools: 1 }
];
