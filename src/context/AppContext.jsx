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
  const [notifications, setNotifications] = useState([]);

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
        // Ensure Master Admin exists in Supabase DB
        const { data: adminExists } = await supabase.from('teachers').select('*').eq('emp_id', 'MIT-MASTER-ADMIN-01');
        if (!adminExists || adminExists.length === 0) {
          await supabase.from('teachers').insert([{
            emp_id: 'MIT-MASTER-ADMIN-01',
            full_name: 'MIT-ADT System Administrator',
            email: 'shubham.alapure@mituniversity.edu.in',
            joining_date: '2015-01-01',
            cadre: 'System Administrator',
            subject: 'Master Administration & VC Office',
            current_school: 'MIT-ADT University Secretariat',
            district: 'Rajbaug Campus',
            block: 'Loni Kalbhor',
            gpf_nps_no: 'PF-MIT-ADMIN-001',
            service_status: 'Active'
          }]);
        } else if (adminExists[0].cadre === 'Principal') {
          await supabase.from('teachers').update({ cadre: 'System Administrator' }).eq('emp_id', 'MIT-MASTER-ADMIN-01');
        }

        // Ensure HOD/Dean exists in Supabase DB
        const { data: deanExists } = await supabase.from('teachers').select('*').eq('emp_id', 'MIT-DEAN-2012-0056');
        if (!deanExists || deanExists.length === 0) {
          await supabase.from('teachers').insert([{
            emp_id: 'MIT-DEAN-2012-0056',
            full_name: 'Dr. Rajesh Kumar (School Dean)',
            email: 'dean.soe@mituniversity.edu.in',
            joining_date: '2018-06-01',
            cadre: 'School Dean',
            subject: 'School of Engineering & Technology',
            current_school: 'School of Engineering (SOE)',
            district: 'Rajbaug Campus',
            block: 'Loni Kalbhor',
            gpf_nps_no: 'PF-MIT-DEAN-056',
            service_status: 'Active'
          }]);
        } else if (deanExists[0].cadre === 'Principal') {
          await supabase.from('teachers').update({ cadre: 'School Dean' }).eq('emp_id', 'MIT-DEAN-2012-0056');
        }

        const { data: tData } = await supabase.from('teachers').select('*');
        if (tData && tData.length > 0) {
          // Exclude admin from faculty list in state
          const cleanTeachers = tData.map(t => {
            if (t.emp_id === 'MIT-MASTER-ADMIN-01' && t.cadre === 'Principal') return { ...t, cadre: 'System Administrator' };
            if (t.emp_id === 'MIT-DEAN-2012-0056' && t.cadre === 'Principal') return { ...t, cadre: 'School Dean' };
            return t;
          });
          setTeachers(cleanTeachers);
        }

        const { data: aData } = await supabase.from('recruitment_applications').select('*');
        if (aData && aData.length > 0) setApplications(aData);

        const { data: trData } = await supabase.from('transfer_requests').select('*');
        if (trData && trData.length > 0) setTransfers(trData);

        const { data: lData } = await supabase.from('leave_requests').select('*');
        if (lData && lData.length > 0) setLeaves(lData);

        const { data: apData } = await supabase.from('apar_evaluations').select('*');
        if (apData && apData.length > 0) setApars(apData);

        const { data: dData } = await supabase.from('teacher_documents').select('*');
        if (dData && dData.length > 0) {
          const docsWithNames = dData.map(doc => {
            const matchedTeacher = (tData || []).find(t => t.id === doc.teacher_id || t.emp_id === doc.teacher_id);
            let rawName = doc.teacher_name || matchedTeacher?.full_name;
            if (!rawName || rawName.includes('SHUBHAM') || rawName.includes('System Administrator') || rawName.includes('MASTER-ADMIN')) {
              rawName = 'Dr. SS Reddy (Faculty Applicant)';
            }
            return {
              ...doc,
              teacher_name: rawName
            };
          });
          setDocuments(docsWithNames);
        }
      } catch (err) {
        console.warn('Supabase fetch query fallback:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Current Active Teacher / Admin Profile based on persona role
  // Priority: currentUser (logged-in) > role-based lookup > fallback
  const resolvedName = currentUser?.full_name;
  const resolvedEmail = currentUser?.email;

  const activeTeacher = role === 'admin'
    ? {
        id: 'admin-master',
        emp_id: 'MIT-MASTER-ADMIN-01',
        full_name: 'MIT-ADT System Administrator',
        email: 'admin@mituniversity.edu.in',
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
    : role === 'principal'
      ? teachers.find(t => t.cadre && (t.cadre.includes('Dean') || t.cadre.includes('Principal'))) || {
          id: 'dean-01',
          emp_id: 'MIT-DEAN-2012-0056',
          full_name: 'Dr. Rajesh Kumar',
          email: 'dean.soe@mituniversity.edu.in',
          cadre: 'School Dean',
          current_school: 'School of Engineering & Technology (SOE)',
          service_status: 'Active'
        }
      : role === 'applicant'
        // For applicant/candidate, ALWAYS use currentUser data
        ? {
            id: currentUser?.id || 'applicant-pending',
            emp_id: currentUser?.emp_id || 'MIT-APP-PENDING',
            full_name: resolvedName || 'Applicant',
            email: resolvedEmail || '',
            phone: currentUser?.phone || '-',
            gender: currentUser?.gender || '-',
            dob: currentUser?.dob || '-',
            qualification: currentUser?.qualification || 'B.Ed / Ph.D.',
            cadre: 'TGT',
            subject: currentUser?.specialization || 'Applied Faculty',
            current_school: 'School of Engineering & Technology (SOE)',
            district: 'Rajbaug Campus',
            block: 'Loni Kalbhor',
            service_status: 'Active',
            basic_pay: 57700,
            seniority_rank: 99
          }
        : (teachers && teachers.length > 0)
          // For teacher role, find by currentUser email/emp_id first, else teachers[0]
          ? (resolvedEmail
              ? teachers.find(t => t.email?.toLowerCase() === resolvedEmail.toLowerCase()) || teachers[0]
              : teachers[0])
          : {
              id: 'faculty-new',
              emp_id: 'MIT-FAC-2026-0001',
              full_name: resolvedName || 'Faculty Member',
              email: resolvedEmail || 'faculty@mituniversity.edu.in',
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
    // Find the application before updating so we have the name/email
    const targetApp = applications.find(a => a.id === appId);

    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, remarks } : a));

    // When HOD appoints a candidate, add them to the faculty roster
    if (status === 'Appointed' && targetApp) {
      const newFaculty = {
        id: `tch-${Date.now()}`,
        emp_id: targetApp.applicant_id || `MIT-FAC-${Date.now().toString().slice(-6)}`,
        full_name: targetApp.applicant_name,
        email: targetApp.email || '',
        phone: targetApp.phone || '-',
        cadre: targetApp.applied_post || 'Assistant Professor',
        subject: targetApp.department || 'School of Engineering & Technology (SOE)',
        current_school: 'School of Engineering & Technology (SOE)',
        district: 'Rajbaug Campus',
        block: 'Loni Kalbhor',
        joining_date: new Date().toISOString().split('T')[0],
        seniority_rank: teachers.length + 1,
        basic_pay: 57700,
        gpf_nps_no: `PF-MIT-${Date.now().toString().slice(-4)}`,
        service_status: 'Active',
        qualification: 'Ph.D. / M.Tech',
        source: 'Appointed via Recruitment Drive',
        drive_code: targetApp.drive_code || ''
      };

      // Only add if not already in teachers list
      setTeachers(prev => {
        const exists = prev.some(t => t.emp_id === newFaculty.emp_id || (newFaculty.email && t.email === newFaculty.email));
        return exists ? prev : [newFaculty, ...prev];
      });

      // Push appointment notification to faculty
      pushNotification(
        '🎉 Appointment Letter Issued!',
        `Congratulations ${targetApp.applicant_name}! You have been officially APPOINTED as ${targetApp.applied_post || 'Faculty Member'} at MIT-ADT University. Welcome to the team! Report to HR for onboarding.`,
        'success'
      );

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('recruitment_applications').update({ status, remarks }).eq('id', appId);
          await supabase.from('teachers').insert([{
            emp_id: newFaculty.emp_id,
            full_name: newFaculty.full_name,
            email: newFaculty.email,
            joining_date: newFaculty.joining_date,
            cadre: 'TGT',
            subject: 'General Faculty',
            current_school: 'School of Engineering & Technology (SOE)',
            district: 'Rajbaug Campus',
            block: 'Loni Kalbhor',
            service_status: 'Active'
          }]);
        } catch (err) {
          console.error('Supabase appoint error:', err);
        }
      }
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('recruitment_applications').update({ status, remarks }).eq('id', appId);
      } catch (err) {
        console.error('Supabase update status error:', err);
      }
    }

    if (status === 'Shortlisted' && targetApp) {
      pushNotification(
        '📋 Candidate Shortlisted',
        `${targetApp.applicant_name} has been shortlisted by HOD for ${targetApp.drive_code || 'Faculty Drive'}. Awaiting appointment decision.`,
        'info'
      );
    } else {
      pushNotification('Recruitment Updated', `Application status updated to ${status}.`, 'info');
    }
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
    const teacherName = activeTeacher.full_name || currentUser?.full_name || 'Faculty Member';
    const newLeave = {
      id: `lv-${Date.now()}`,
      teacher_id: activeTeacher.id || currentUser?.emp_id,
      teacher_name: teacherName,
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

  // 9. Upload Document — uploads actual file to Supabase Storage and stores public URL
  const uploadDocument = async (docData) => {
    let publicUrl = null;

    // Step 1: Upload actual file binary to Supabase Storage
    if (isSupabaseConfigured && supabase && docData.file_object) {
      try {
        const file = docData.file_object;
        const ext = file.name.split('.').pop();
        const filePath = `documents/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

        const { data: storageData, error: storageErr } = await supabase.storage
          .from('teacher-docs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (storageErr) {
          console.warn('Storage upload note:', storageErr.message);
        } else {
          const { data: urlData } = supabase.storage
            .from('teacher-docs')
            .getPublicUrl(filePath);
          publicUrl = urlData?.publicUrl || null;
        }
      } catch (err) {
        console.warn('Supabase storage error:', err);
      }
    }

    // Step 2: Fallback to Base64 Data URL for local preview if Storage failed
    const fileUrlToStore = publicUrl || docData.file_data || docData.file_name || 'document.pdf';

    let uploaderName = docData.teacher_name || currentUser?.full_name || 'Dr. SS Reddy (Faculty Applicant)';
    if (uploaderName.includes('SHUBHAM') || uploaderName.includes('System Administrator') || uploaderName.includes('MASTER-ADMIN')) {
      uploaderName = 'Dr. SS Reddy (Faculty Applicant)';
    }
    const uploaderId = docData.teacher_id || currentUser?.emp_id || 'MIT-APP-4616';

    const newDoc = {
      id: `doc-${Date.now()}`,
      teacher_id: uploaderId,
      teacher_name: uploaderName,
      status: 'Pending',
      verified_by: 'Pending Audit',
      uploaded_at: new Date().toISOString().split('T')[0],
      file_url: fileUrlToStore,
      file_data: docData.file_data || null,
      ...docData
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Step 3: Store file_url (public URL or filename) in teacher_documents table
    if (isSupabaseConfigured && supabase) {
      try {
        const { error: insertErr } = await supabase.from('teacher_documents').insert([{
          teacher_id: activeTeacher.id,
          doc_name: docData.doc_name,
          doc_category: docData.doc_category,
          file_url: fileUrlToStore,
          status: 'Pending'
        }]);
        if (insertErr) console.warn('teacher_documents insert:', insertErr.message);
      } catch (err) {
        console.error('Supabase document insert error:', err);
      }
    }

    pushNotification(
      'Document Uploaded',
      publicUrl
        ? `${docData.doc_name} uploaded to Supabase Storage — preview available!`
        : `${docData.doc_name} saved locally — preview in this session.`,
      'info'
    );
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

  // 11. Delete Document (Candidate only, Pending docs)
  const deleteDocument = async (doc) => {
    // Remove from local state immediately
    setDocuments(prev => prev.filter(d => d.id !== doc.id));

    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Delete from teacher_documents table (try both UUID and string id)
        await supabase.from('teacher_documents').delete().eq('id', doc.id);

        // 2. If file was in Supabase Storage (URL contains supabase.co/storage), delete file too
        if (doc.file_url && doc.file_url.includes('/storage/v1/object/public/teacher-docs/')) {
          const filePath = doc.file_url.split('/storage/v1/object/public/teacher-docs/')[1];
          if (filePath) {
            await supabase.storage.from('teacher-docs').remove([filePath]);
          }
        }
      } catch (err) {
        console.warn('Supabase doc delete error:', err);
      }
    }

    pushNotification('Document Removed', `"${doc.doc_name}" deleted from vault.`, 'info');
  };


  const updateApplicantProfile = async (empId, profileDetails) => {
    const targetEmail = profileDetails.email || currentUser?.email || 'shubhamreddy5003@gmail.com';
    const targetId = empId || currentUser?.emp_id || 'MIT-APP-4616';

    setTeachers(prev => prev.map(t => {
      if (t.emp_id === targetId || (targetEmail && t.email && t.email.toLowerCase() === targetEmail.toLowerCase())) {
        return { ...t, ...profileDetails, profileCompleted: true };
      }
      return t;
    }));

    if (currentUser) {
      const updatedUser = { ...currentUser, ...profileDetails, profileCompleted: true };
      setCurrentUser(updatedUser);
      localStorage.setItem('shikshak_current_user', JSON.stringify(updatedUser));
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const todayDate = new Date().toISOString().split('T')[0];
        const upsertPayload = {
          emp_id: targetId,
          email: targetEmail,
          full_name: profileDetails.full_name || currentUser?.full_name || 'Dr. SS Reddy',
          phone: profileDetails.phone || '+91 9876543210',
          gender: profileDetails.gender || 'Male',
          dob: profileDetails.dob || '1992-05-15',
          qualification: profileDetails.qualification || 'Ph.D. in Computer Science',
          experience_years: Number(profileDetails.experience_years || 3),
          joining_date: todayDate,
          cadre: 'TGT',
          subject: 'General Faculty',
          current_school: 'School of Engineering & Technology (SOE)',
          district: 'Rajbaug Campus',
          block: 'Loni Kalbhor',
          service_status: 'Active'
        };

        // Execute Supabase Upsert on conflict email to force overwrite NULL columns
        const { data: upsertData, error: upsertErr } = await supabase
          .from('teachers')
          .upsert([upsertPayload], { onConflict: 'email' })
          .select();

        if (upsertErr) {
          console.warn('Upsert note:', upsertErr.message, 'Trying update fallback...');
          await supabase.from('teachers').update({
            phone: upsertPayload.phone,
            gender: upsertPayload.gender,
            dob: upsertPayload.dob,
            qualification: upsertPayload.qualification,
            experience_years: upsertPayload.experience_years
          }).eq('email', targetEmail);
        }

        pushNotification('Supabase PostgreSQL Updated', `Saved Phone: ${upsertPayload.phone}, Gender: ${upsertPayload.gender}, DOB: ${upsertPayload.dob} in Live DB!`, 'success');
      } catch (err) {
        console.warn('Supabase profile update error:', err);
      }
    } else {
      pushNotification('Profile Updated', 'Saved profile details to local service book.', 'success');
    }
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

      const adminUser = { full_name: 'MIT-ADT System Administrator', emp_id: 'MIT-MASTER-ADMIN-01', role: 'admin' };
      setRole('admin');
      setIsAuthenticated(true);
      setCurrentUser(adminUser);
      localStorage.setItem('shikshak_current_user', JSON.stringify(adminUser));
      localStorage.setItem('shikshak_role', 'admin');
      localStorage.setItem('shikshak_authenticated', 'true');
      pushNotification('Master Admin Access Granted', 'Logged in as MIT-ADT System Administrator', 'success');
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

    // STRICT ROLE AUTHORIZATION GUARD
    let actualRole = 'teacher';
    if (dbTeacherRecord.emp_id.startsWith('MIT-APP-') || dbTeacherRecord.cadre === 'Applicant') {
      actualRole = 'applicant';
    } else if (dbTeacherRecord.emp_id.startsWith('MIT-DEAN-') || dbTeacherRecord.cadre === 'Dean' || dbTeacherRecord.cadre === 'Principal' || dbTeacherRecord.cadre === 'Headmaster') {
      actualRole = 'principal';
    } else if (dbTeacherRecord.emp_id === 'MIT-MASTER-ADMIN-01') {
      actualRole = 'admin';
    }

    if (roleId !== actualRole) {
      const roleLabels = {
        applicant: 'Faculty / Scholar Applicant',
        teacher: 'Faculty Member',
        principal: 'Head of Department (HOD) / Dean',
        admin: 'Master Admin'
      };
      return {
        success: false,
        message: `Role Mismatch Alert: User ID "${trimmedId}" belongs to a ${roleLabels[actualRole]} account. You cannot sign in under ${roleLabels[roleId]} persona. Please select ${roleLabels[actualRole]}.`
      };
    }

    const userInfo = {
      full_name: dbTeacherRecord.full_name || userFullName || 'Faculty Member',
      emp_id: dbTeacherRecord.emp_id,
      role: actualRole
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

        // 1. Separate Storage for Applicants in recruitment_applications Table
        if (userData.role === 'applicant') {
          const newApp = {
            id: `app-${Date.now()}`,
            applicant_id: userData.emp_id,
            applicant_name: userData.full_name,
            email: userData.email,
            applied_post: 'Assistant Professor / Research Scholar',
            department: 'School of Engineering & Technology (SOE)',
            qualification: 'Ph.D. / M.Tech',
            experience_years: 2,
            status: 'Submitted',
            applied_date: todayDate
          };
          setApplications(prev => [newApp, ...prev]);

          await supabase.from('recruitment_applications').insert([{
            applicant_id: userData.emp_id,
            applicant_name: userData.full_name,
            email: userData.email,
            applied_post: 'Assistant Professor',
            department: 'School of Engineering & Technology (SOE)',
            status: 'Submitted'
          }]);
        }

        // 2. Primary Insert into teachers Table
        let { error } = await supabase.from('teachers').insert([{
          emp_id: userData.emp_id,
          full_name: userData.full_name,
          email: userData.email,
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
          console.warn('Primary insert note:', error.message, 'Attempting schema-compatible insert...');
          const fallbackRes = await supabase.from('teachers').insert([{
            emp_id: userData.emp_id,
            full_name: userData.full_name,
            email: userData.email,
            joining_date: todayDate,
            subject: 'General Faculty',
            current_school: 'School of Engineering (SOE)',
            district: 'Rajbaug Campus'
          }]);
          error = fallbackRes.error;
        }

        if (error) {
          console.error('Supabase DB registration insert error:', error.message);
          pushNotification('Supabase DB Notice', `DB Note: ${error.message}`, 'warning');
        } else {
          pushNotification('Account Saved to Supabase DB', `Stored ${userData.full_name} (${userData.emp_id}) in Live PostgreSQL DB!`, 'success');
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
        deleteDocument,
        updateApplicantProfile,
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
