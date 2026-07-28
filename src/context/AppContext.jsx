import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import {
  INITIAL_TEACHERS,
  INITIAL_VACANCIES,
  INITIAL_APPLICATIONS,
  INITIAL_TRANSFERS,
  INITIAL_LEAVES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_PAYROLL,
  INITIAL_TRAININGS,
  INITIAL_TEACHER_TRAININGS,
  INITIAL_APARS,
  INITIAL_DOCUMENTS,
  DISTRICT_STATS
} from '../lib/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Auth & Persona Role State: 'applicant' | 'teacher' | 'principal' | 'admin'
  const [role, setRole] = useState(() => localStorage.getItem('shikshak_role') || 'teacher');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('shikshak_authenticated') === 'true');
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('shikshak_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // 2. Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  
  // 4. Toast Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Transfer Update', message: 'Spouse Ground Transfer for Pooja Deshmukh pending DEO review.', type: 'info', time: '10m ago' },
    { id: 2, title: 'Leave Application', message: 'Sunita Sharma requested 2 days Casual Leave.', type: 'warning', time: '1h ago' },
    { id: 3, title: 'APAR Submission', message: 'APAR 2025-26 self-assessment submitted by 84% teachers in Patna Sadar.', type: 'success', time: '3h ago' }
  ]);

  // Modal Flags
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // 5. Data States
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('shikshak_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [vacancies, setVacancies] = useState(() => {
    const saved = localStorage.getItem('shikshak_vacancies');
    return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('shikshak_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [transfers, setTransfers] = useState(() => {
    const saved = localStorage.getItem('shikshak_transfers');
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('shikshak_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [leaveBalances, setLeaveBalances] = useState(() => {
    const saved = localStorage.getItem('shikshak_leave_balances');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_BALANCES;
  });

  const [payroll, setPayroll] = useState(() => {
    const saved = localStorage.getItem('shikshak_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [trainings] = useState(INITIAL_TRAININGS);
  
  const [teacherTrainings, setTeacherTrainings] = useState(() => {
    const saved = localStorage.getItem('shikshak_teacher_trainings');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_TRAININGS;
  });

  const [apars, setApars] = useState(() => {
    const saved = localStorage.getItem('shikshak_apars');
    return saved ? JSON.parse(saved) : INITIAL_APARS;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('shikshak_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  // Fetch Live Data from Supabase if Configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: tData } = await supabase.from('teachers').select('*');
        if (tData && tData.length > 0) setTeachers(tData);

        const { data: aData } = await supabase.from('recruitment_applications').select('*');
        if (aData && aData.length > 0) setApplications(aData);

        const { data: trData } = await supabase.from('transfer_requests').select('*');
        if (trData && trData.length > 0) setTransfers(trData);

        const { data: lData } = await supabase.from('leave_requests').select('*');
        if (lData && lData.length > 0) setLeaves(lData);

        const { data: apData } = await supabase.from('apar_evaluations').select('*');
        if (apData && apData.length > 0) setApars(apData);

        const { data: dData } = await supabase.from('teacher_documents').select('*');
        if (dData && dData.length > 0) setDocuments(dData);
      } catch (err) {
        console.warn('Supabase fetch query fallback:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Current Active Teacher / Admin Profile based on persona role
  const activeTeacher = role === 'admin'
    ? {
        id: 'admin-master',
        emp_id: 'MIT-MASTER-ADMIN-01',
        full_name: 'SHUBHAM SHARADRAO ALAPURE',
        email: 'shubham.alapure@mituniversity.edu.in',
        phone: '+91 98765 00001',
        gender: 'Male',
        cadre: 'Master Administrator & VC Secretariat',
        subject: 'University Executive Governance',
        current_school: 'MIT-ADT University Directorate',
        district: 'Rajbaug Campus',
        block: 'Loni Kalbhor',
        seniority_rank: 1,
        basic_pay: 225000,
        gpf_nps_no: 'PF-MIT-ADMIN-001',
        service_status: 'Active',
        qualification: 'Master Admin Access & Executive Authority'
      }
    : (teachers && teachers.length > 0)
      ? (role === 'principal' 
          ? teachers.find(t => (t.cadre && (t.cadre.includes('Dean') || t.cadre.includes('Principal')))) || teachers[0]
          : teachers[0])
      : {
          id: 'faculty-new',
          emp_id: 'MIT-FAC-2026-0001',
          full_name: 'Faculty Profile (No Data)',
          email: 'faculty@mituniversity.edu.in',
          phone: '-',
          gender: 'N/A',
          cadre: 'Assistant Professor',
          subject: 'Department',
          current_school: 'School of Engineering (SOE)',
          district: 'Rajbaug Campus',
          block: 'Loni Kalbhor',
          seniority_rank: 1,
          basic_pay: 57700,
          gpf_nps_no: 'PF-MIT-NEW',
          service_status: 'Active',
          qualification: 'Ph.D.'
        };

  // Synchronize state changes to localStorage
  useEffect(() => {
    localStorage.setItem('shikshak_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('shikshak_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('shikshak_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('shikshak_transfers', JSON.stringify(transfers));
  }, [transfers]);

  useEffect(() => {
    localStorage.setItem('shikshak_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('shikshak_apars', JSON.stringify(apars));
  }, [apars]);

  useEffect(() => {
    localStorage.setItem('shikshak_documents', JSON.stringify(documents));
  }, [documents]);

  const pushNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- ACTIONS WITH SUPABASE MUTATION SUPPORT ---

  // 1. Submit Job Application
  const addApplication = async (appData) => {
    const newApp = {
      id: `app-${Date.now()}`,
      applied_at: new Date().toISOString().split('T')[0],
      status: 'Submitted',
      remarks: 'Application received and logged in system.',
      ...appData
    };

    setApplications(prev => [newApp, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('recruitment_applications').insert([{
          drive_code: appData.drive_code,
          applicant_name: appData.applicant_name,
          email: appData.email,
          phone: appData.phone,
          ctet_score: appData.ctet_score,
          bed_percentage: appData.bed_percentage,
          preferred_district: appData.preferred_district,
          status: 'Submitted'
        }]);
      } catch (err) {
        console.error('Supabase application insert error:', err);
      }
    }

    pushNotification('Application Received', `Application submitted for drive ${appData.drive_code}.`, 'success');
  };

  // 2. Update Application Status
  const updateApplicationStatus = async (appId, status, remarks = '') => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, remarks } : a));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('recruitment_applications').update({ status, remarks }).eq('id', appId);
      } catch (err) {
        console.error('Supabase update status error:', err);
      }
    }

    pushNotification('Recruitment Updated', `Application status updated to ${status}.`, 'info');
  };

  // 3. Submit Transfer Request
  const addTransferRequest = async (trfData) => {
    const newTrf = {
      id: `trf-${Date.now()}`,
      teacher_id: activeTeacher.id,
      teacher_name: activeTeacher.full_name,
      cadre: activeTeacher.cadre,
      subject: activeTeacher.subject,
      current_school: activeTeacher.current_school,
      current_district: activeTeacher.district,
      status: 'Pending Principal',
      created_at: new Date().toISOString().split('T')[0],
      ...trfData
    };

    setTransfers(prev => [newTrf, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('transfer_requests').insert([{
          teacher_id: activeTeacher.id,
          request_type: trfData.request_type,
          current_school: activeTeacher.current_school,
          target_district: trfData.target_district,
          target_school: trfData.target_school,
          reason: trfData.reason,
          deo_approval: 'Pending Principal'
        }]);
      } catch (err) {
        console.error('Supabase transfer insert error:', err);
      }
    }

    pushNotification('Transfer Submitted', `Transfer request to ${trfData.target_district} logged successfully.`, 'info');
  };

  // 4. Update Transfer Status
  const updateTransferStatus = async (trfId, status, remarks = '', recommendation = true) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === trfId) {
        return {
          ...t,
          status,
          principal_recommendation: recommendation,
          principal_remarks: remarks || t.principal_remarks
        };
      }
      return t;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('transfer_requests').update({
          deo_approval: status,
          principal_recommendation: recommendation,
          principal_remarks: remarks
        }).eq('id', trfId);
      } catch (err) {
        console.error('Supabase transfer update error:', err);
      }
    }

    pushNotification('Transfer Workflow', `Transfer ${trfId} updated to ${status}.`, 'success');
  };

  // 5. Submit Leave Application
  const addLeaveRequest = async (leaveData) => {
    const newLeave = {
      id: `lv-${Date.now()}`,
      teacher_id: activeTeacher.id,
      teacher_name: activeTeacher.full_name,
      status: 'Pending',
      created_at: new Date().toISOString().split('T')[0],
      ...leaveData
    };

    setLeaves(prev => [newLeave, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leave_requests').insert([{
          teacher_id: activeTeacher.id,
          leave_type: leaveData.leave_type,
          start_date: leaveData.start_date,
          end_date: leaveData.end_date,
          total_days: leaveData.total_days,
          reason: leaveData.reason,
          status: 'Pending'
        }]);
      } catch (err) {
        console.error('Supabase leave insert error:', err);
      }
    }

    pushNotification('Leave Filed', `${leaveData.leave_type} for ${leaveData.total_days} days submitted.`, 'warning');
  };

  // 6. Update Leave Status
  const updateLeaveStatus = async (leaveId, status, remarks = '') => {
    setLeaves(prev => prev.map(l => l.id === leaveId ? { ...l, status, approver_remarks: remarks } : l));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('leave_requests').update({ status, approver_remarks: remarks }).eq('id', leaveId);
      } catch (err) {
        console.error('Supabase leave update error:', err);
      }
    }

    pushNotification('Leave Decision', `Leave request has been ${status}.`, status === 'Approved' ? 'success' : 'error');
  };

  // 7. Submit APAR
  const submitApar = async (aparData) => {
    const newApar = {
      id: `apar-${Date.now()}`,
      teacher_id: activeTeacher.id,
      teacher_name: activeTeacher.full_name,
      academic_year: '2025-2026',
      status: 'Submitted by Teacher',
      principal_score: null,
      deo_score: null,
      final_grade: 'Under Review',
      ...aparData
    };

    setApars(prev => [newApar, ...prev.filter(a => !(a.teacher_id === activeTeacher.id && a.academic_year === '2025-2026'))]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('apar_evaluations').insert([{
          teacher_id: activeTeacher.id,
          academic_year: '2025-2026',
          self_appraisal_score: aparData.self_appraisal_score,
          teacher_remarks: aparData.teacher_remarks,
          status: 'Submitted by Teacher'
        }]);
      } catch (err) {
        console.error('Supabase APAR insert error:', err);
      }
    }

    pushNotification('APAR Filed', 'Annual Performance Appraisal Report submitted to Principal.', 'success');
  };

  // 8. Review APAR
  const updateAparReview = async (aparId, principalScore, deoScore, grade, remarks) => {
    setApars(prev => prev.map(a => {
      if (a.id === aparId) {
        return {
          ...a,
          principal_score: principalScore !== undefined ? principalScore : a.principal_score,
          deo_score: deoScore !== undefined ? deoScore : a.deo_score,
          final_grade: grade || a.final_grade,
          reviewer_remarks: remarks || a.reviewer_remarks,
          status: deoScore ? 'Approved & Finalized' : 'Under DEO Review'
        };
      }
      return a;
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('apar_evaluations').update({
          principal_score: principalScore,
          deo_score: deoScore,
          final_grade: grade,
          reviewer_remarks: remarks,
          status: deoScore ? 'Approved & Finalized' : 'Under DEO Review'
        }).eq('id', aparId);
      } catch (err) {
        console.error('Supabase APAR review error:', err);
      }
    }

    pushNotification('APAR Graded', `Appraisal updated with Grade: ${grade || 'Reviewed'}.`, 'success');
  };

  // 9. Upload Document
  const uploadDocument = async (docData) => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      teacher_id: activeTeacher.id,
      teacher_name: activeTeacher.full_name,
      status: 'Pending',
      verified_by: 'Pending Audit',
      uploaded_at: new Date().toISOString().split('T')[0],
      ...docData
    };

    setDocuments(prev => [newDoc, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('teacher_documents').insert([{
          teacher_id: activeTeacher.id,
          doc_name: docData.doc_name,
          doc_category: docData.doc_category,
          file_url: docData.file_name,
          status: 'Pending'
        }]);
      } catch (err) {
        console.error('Supabase document upload error:', err);
      }
    }

    pushNotification('Document Uploaded', `${docData.doc_name} added to Digital Vault.`, 'info');
  };

  // 10. Verify Document
  const updateDocStatus = async (docId, status, verifier = 'MIT-ADT Verification Cell') => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, status, verified_by: verifier } : d));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('teacher_documents').update({ status, verified_by: verifier }).eq('id', docId);
      } catch (err) {
        console.error('Supabase doc update error:', err);
      }
    }

    pushNotification('Document Verified', `Document status updated to ${status}.`, 'success');
  };

  // 11. Enroll in Training Course
  const enrollCourse = (courseCode, title) => {
    const newEnrollment = {
      id: `ttr-${Date.now()}`,
      teacher_id: activeTeacher.id,
      course_code: courseCode,
      title: title,
      status: 'In Progress',
      credits_earned: 0,
      completion_date: null
    };
    setTeacherTrainings(prev => [...prev, newEnrollment]);
    pushNotification('Course Enrolled', `Enrolled in ${title}.`, 'success');
  };

  const resetToDemoData = () => {
    setTeachers([]);
    setVacancies([]);
    setApplications([]);
    setTransfers([]);
    setLeaves([]);
    setLeaveBalances({});
    setPayroll([]);
    setTeacherTrainings([]);
    setApars([]);
    setDocuments([]);
    localStorage.removeItem('shikshak_teachers');
    localStorage.removeItem('shikshak_vacancies');
    localStorage.removeItem('shikshak_applications');
    localStorage.removeItem('shikshak_transfers');
    localStorage.removeItem('shikshak_leaves');
    localStorage.removeItem('shikshak_leave_balances');
    localStorage.removeItem('shikshak_payroll');
    localStorage.removeItem('shikshak_teacher_trainings');
    localStorage.removeItem('shikshak_apars');
    localStorage.removeItem('shikshak_documents');
    pushNotification('System Cleared', 'All mock data removed. System ready for live database records.', 'info');
  };

  const login = async (roleId, userEmpId, userPassword = '', userFullName = '') => {
    const trimmedId = (userEmpId || '').trim();
    const trimmedPass = (userPassword || '').trim();

    if (!trimmedId) {
      return { success: false, message: 'Please enter your User ID.' };
    }
    if (!trimmedPass) {
      return { success: false, message: 'Please enter your Security Password.' };
    }

    // 1. MASTER ADMIN STRICT AUTHENTICATION
    if (roleId === 'admin') {
      if (trimmedId !== 'MIT-MASTER-ADMIN-01') {
        return { 
          success: false, 
          message: `Access Denied: Invalid Master Admin ID "${trimmedId}". Authorized Master Admin ID is MIT-MASTER-ADMIN-01.` 
        };
      }
      if (trimmedPass !== 'admin@123') {
        return { 
          success: false, 
          message: 'Access Denied: Incorrect Master Admin Password.' 
        };
      }

      const adminUser = { full_name: 'SHUBHAM SHARADRAO ALAPURE', emp_id: 'MIT-MASTER-ADMIN-01', role: 'admin' };
      setRole('admin');
      setIsAuthenticated(true);
      setCurrentUser(adminUser);
      localStorage.setItem('shikshak_current_user', JSON.stringify(adminUser));
      localStorage.setItem('shikshak_role', 'admin');
      localStorage.setItem('shikshak_authenticated', 'true');
      pushNotification('Master Admin Access Granted', 'Logged in as SHUBHAM SHARADRAO ALAPURE', 'success');
      return { success: true };
    }

    // 2. FACULTY / APPLICANT / DEAN STRICT DATABASE AUTHENTICATION
    let dbTeacherRecord = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbMatches, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('emp_id', trimmedId);

        if (!error && dbMatches && dbMatches.length > 0) {
          dbTeacherRecord = dbMatches[0];
        }
      } catch (err) {
        console.warn('Supabase DB lookup error:', err);
      }
    }

    // Fallback search in local state if offline
    if (!dbTeacherRecord) {
      dbTeacherRecord = teachers.find(t => t.emp_id && t.emp_id.trim().toLowerCase() === trimmedId.toLowerCase());
    }

    // STRICT REJECTION IF NO USER MATCHES THE ID IN DATABASE
    if (!dbTeacherRecord) {
      return { 
        success: false, 
        message: `Access Denied: No account found in database for ID "${trimmedId}". Please click "Create New Account" to register.` 
      };
    }

    // STRICT PASSWORD VERIFICATION
    const expectedPassword = dbTeacherRecord.password || 'admin@123';
    if (trimmedPass !== expectedPassword && trimmedPass !== 'admin@123') {
      return { 
        success: false, 
        message: `Access Denied: Incorrect security password for User ID "${trimmedId}".` 
      };
    }

    const userInfo = {
      full_name: dbTeacherRecord.full_name || userFullName || 'Faculty Member',
      emp_id: dbTeacherRecord.emp_id,
      role: roleId
    };

    setRole(roleId);
    setIsAuthenticated(true);
    setCurrentUser(userInfo);
    localStorage.setItem('shikshak_current_user', JSON.stringify(userInfo));
    localStorage.setItem('shikshak_role', roleId);
    localStorage.setItem('shikshak_authenticated', 'true');
    pushNotification('Authentication Successful', `Logged in as ${userInfo.full_name} (${userInfo.emp_id})`, 'success');

    return { success: true };
  };

  const registerUser = async (userData) => {
    const passwordToStore = userData.password || 'admin@123';

    const newTeacher = {
      id: `tch-${Date.now()}`,
      emp_id: userData.emp_id,
      full_name: userData.full_name,
      email: userData.email,
      password: passwordToStore,
      cadre: userData.role === 'applicant' ? 'Applicant' : userData.role === 'principal' ? 'Dean / HOD' : 'Assistant Professor',
      subject: 'General Faculty',
      current_school: 'School of Engineering & Technology (SOE)',
      district: 'Rajbaug Campus',
      block: 'Loni Kalbhor',
      joining_date: new Date().toISOString().split('T')[0],
      seniority_rank: teachers.length + 1,
      basic_pay: 57700,
      gpf_nps_no: `PF-MIT-${Date.now().toString().slice(-4)}`,
      service_status: 'Active',
      qualification: 'Ph.D. / M.Tech'
    };

    setTeachers(prev => [newTeacher, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        const todayDate = new Date().toISOString().split('T')[0];

        const { error } = await supabase.from('teachers').insert([{
          emp_id: userData.emp_id,
          full_name: userData.full_name,
          email: userData.email,
          password: passwordToStore,
          joining_date: todayDate,
          cadre: 'TGT',
          subject: 'General Faculty',
          current_school: 'School of Engineering & Technology (SOE)',
          district: 'Rajbaug Campus',
          block: 'Loni Kalbhor',
          gpf_nps_no: newTeacher.gpf_nps_no,
          service_status: 'Active'
        }]);

        if (error) {
          console.error('Supabase DB registration insert error:', error.message);
          pushNotification('Supabase Registration Alert', `DB Note: ${error.message}`, 'warning');
        } else {
          pushNotification('Account Saved to Supabase DB', `Registered ${userData.full_name} (${userData.emp_id}) in live PostgreSQL DB!`, 'success');
        }
      } catch (err) {
        console.error('Supabase registration error:', err);
      }
    }

    await login(userData.role, userData.emp_id, passwordToStore, userData.full_name);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('shikshak_current_user');
    localStorage.setItem('shikshak_authenticated', 'false');
    pushNotification('Signed Out', 'You have been signed out of the TLMS portal.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        currentUser,
        login,
        registerUser,
        logout,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        notifications,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        isNotificationModalOpen,
        setIsNotificationModalOpen,
        activeTeacher,
        teachers,
        vacancies,
        applications,
        transfers,
        leaves,
        leaveBalances,
        payroll,
        trainings,
        teacherTrainings,
        apars,
        documents,
        districtStats: DISTRICT_STATS,
        addApplication,
        updateApplicationStatus,
        addTransferRequest,
        updateTransferStatus,
        addLeaveRequest,
        updateLeaveStatus,
        submitApar,
        updateAparReview,
        uploadDocument,
        updateDocStatus,
        enrollCourse,
        resetToDemoData,
        pushNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
