import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  UserPlus, 
  BookOpen, 
  ArrowLeftRight, 
  Receipt, 
  Award, 
  FolderLock, 
  BarChart3,
  Lock,
  LogOut,
  Users
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, role, transfers, leaves, documents, applications, teachers, logout } = useApp();

  // Pending Counts for Badges
  const pendingTransfers = transfers.filter(t => t.status.includes('Pending')).length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const pendingDocs = documents.filter(d => d.status === 'Pending').length;
  const appointedCount = applications.filter(a => a.status === 'Appointed').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['applicant', 'teacher', 'principal', 'admin'], locked: false },
    { 
      id: 'recruitment', 
      label: 'Recruitment & Job Repository', 
      icon: UserPlus, 
      roles: ['applicant', 'teacher', 'principal', 'admin'], 
      locked: false,
      badge: (role === 'principal' || role === 'admin') && appointedCount > 0 ? appointedCount : null
    },
    // Faculties tab — HOD & Admin only
    ...(role === 'principal' || role === 'admin' ? [{
      id: 'faculties',
      label: `Faculties`,
      icon: Users,
      roles: ['principal', 'admin'],
      locked: false,
      badge: teachers.filter(t =>
        !['System Administrator', 'Master Administrator'].includes(t.cadre) &&
        t.emp_id !== 'MIT-MASTER-ADMIN-01'
      ).length + applications.filter(a => a.status === 'Appointed').length || null
    }] : []),
    { id: 'service_book', label: 'Digital Service Book', icon: BookOpen, roles: ['applicant', 'teacher', 'principal', 'admin'], locked: role === 'applicant' },
    { 
      id: 'transfers', 
      label: 'Posting & Transfers', 
      icon: ArrowLeftRight, 
      roles: ['applicant', 'teacher', 'principal', 'admin'],
      badge: pendingTransfers > 0 ? pendingTransfers : null,
      locked: role === 'applicant'
    },
    { 
      id: 'leaves', 
      label: 'Leaves & Payroll', 
      icon: Receipt, 
      roles: ['applicant', 'teacher', 'principal', 'admin'],
      badge: pendingLeaves > 0 ? pendingLeaves : null,
      locked: role === 'applicant'
    },
    { id: 'training', label: 'Training & APAR', icon: Award, roles: ['applicant', 'teacher', 'principal', 'admin'], locked: false },
    { 
      id: 'documents', 
      label: 'Document Vault', 
      icon: FolderLock, 
      roles: ['applicant', 'teacher', 'principal', 'admin'],
      badge: pendingDocs > 0 ? pendingDocs : null,
      locked: false 
    },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3, roles: ['applicant', 'teacher', 'principal', 'admin'], locked: role === 'applicant' || role === 'teacher' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-purple-100 shrink-0 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-65px)] shadow-sm">
      <div className="space-y-6">
        
        {/* Sidebar Navigation (Matching screenshot menu styling) */}
        <div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  disabled={item.locked}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    item.locked
                      ? 'text-slate-400 opacity-60 cursor-not-allowed bg-slate-50'
                      : isActive
                      ? 'bg-purple-100/80 text-purple-900 font-bold border-l-4 border-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    {item.badge && !item.locked && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-600 text-white">
                        {item.badge}
                      </span>
                    )}

                    {item.locked && (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lock Info Box (Matching screenshot yellow alert box in sidebar) */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>Role-Based Access</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800">
            {role === 'applicant' && 'Department transfers & payslips unlock after faculty appointment.'}
            {role === 'teacher' && 'University Analytics unlock for HOD/Dean & Registrar roles.'}
            {role === 'principal' && 'Department-level HOD approvals active.'}
            {role === 'admin' && 'University-wide Registrar administrative access unlocked.'}
          </p>
        </div>

      </div>

      {/* Bottom Purple Logout / Switch Role Pill Button (Matching screenshot bottom button) */}
      <div className="pt-4 border-t border-purple-100">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 transition-all uppercase tracking-wide"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Change Persona</span>
        </button>
      </div>

    </aside>
  );
};
