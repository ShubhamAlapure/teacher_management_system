import React from 'react';
import { useApp, getLocalDateStr } from '../context/AppContext';
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
  Users,
  Camera,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Building2,
  GraduationCap
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab, role, transfers, leaves, documents, applications, teachers, attendance, logout } = useApp();

  // Pending Counts for Badges
  const pendingTransfers = (transfers || []).filter(t => t?.status?.includes('Pending')).length;
  const pendingLeaves = (leaves || []).filter(l => l?.status === 'Pending').length;
  const pendingDocs = (documents || []).filter(d => d?.status === 'Pending').length;
  const appointedCount = (applications || []).filter(a => a?.status === 'Appointed').length;
  const todayDateStr = getLocalDateStr();
  const todayLateCount = (attendance || []).filter(a => a?.date === todayDateStr && a?.status === 'Late').length;

  // Structured Navigation Groups
  const navigationGroups = [
    {
      group: 'MAIN WORKSPACE',
      items: [
        { 
          id: 'dashboard', 
          label: 'Dashboard', 
          icon: LayoutDashboard, 
          roles: ['applicant', 'teacher', 'principal', 'admin'], 
          locked: false 
        },
        { 
          id: 'attendance', 
          label: role === 'teacher' ? 'Mark Attendance (GPS)' : 'Faculty Geo-Attendance', 
          icon: Camera, 
          roles: ['teacher', 'principal', 'admin'], 
          locked: false,
          badge: (role === 'principal' || role === 'admin') && todayLateCount > 0 ? `${todayLateCount} Late` : null,
          isHighlight: role === 'teacher'
        }
      ]
    },
    {
      group: 'FACULTY & CAREER',
      items: [
        { 
          id: 'recruitment', 
          label: 'Recruitment & Jobs', 
          icon: UserPlus, 
          roles: ['applicant', 'principal', 'admin'],
          locked: false,
          badge: (role === 'principal' || role === 'admin') && appointedCount > 0 ? appointedCount : null
        },
        ...(role === 'principal' || role === 'admin' ? [{
          id: 'faculties',
          label: 'Faculties Directory',
          icon: Users,
          roles: ['principal', 'admin'],
          locked: false,
          badge: teachers.filter(t =>
            !['System Administrator', 'Master Administrator'].includes(t.cadre) &&
            t.emp_id !== 'MIT-MASTER-ADMIN-01'
          ).length + applications.filter(a => a.status === 'Appointed').length || null
        }] : []),
        { 
          id: 'service_book', 
          label: 'Digital Service Book', 
          icon: BookOpen, 
          roles: ['applicant', 'teacher', 'principal', 'admin'], 
          locked: role === 'applicant' 
        }
      ]
    },
    {
      group: 'GOVERNANCE & APPROVALS',
      items: [
        { 
          id: 'transfers', 
          label: 'Posting & Transfers', 
          icon: ArrowLeftRight, 
          roles: ['teacher', 'principal', 'admin'],
          badge: pendingTransfers > 0 ? pendingTransfers : null,
          locked: false
        },
        { 
          id: 'leaves', 
          label: 'Leaves & Payroll', 
          icon: Receipt, 
          roles: ['applicant', 'teacher', 'principal', 'admin'],
          badge: pendingLeaves > 0 ? pendingLeaves : null,
          locked: role === 'applicant'
        },
        { 
          id: 'training', 
          label: 'Training & APAR', 
          icon: Award, 
          roles: ['applicant', 'teacher', 'principal', 'admin'], 
          locked: false 
        }
      ]
    },
    {
      group: 'VAULT & AUDIT',
      items: [
        { 
          id: 'documents', 
          label: 'Document Vault', 
          icon: FolderLock, 
          roles: ['applicant', 'teacher', 'principal', 'admin'],
          badge: pendingDocs > 0 ? pendingDocs : null,
          locked: false 
        },
        { 
          id: 'analytics', 
          label: 'Reports & Analytics', 
          icon: BarChart3, 
          roles: ['principal', 'admin'], 
          locked: false 
        }
      ]
    }
  ];

  return (
    <aside className="no-print w-72 bg-[#FAF8F5] border-r border-[#E2DDD2] shrink-0 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-64px)] shadow-sm select-none">
      
      <div className="space-y-5">
        
        {/* Top Mini Workspace Header */}
        <div className="px-2 pt-1 pb-2 border-b border-[#E2DDD2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#E43D12]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#1A1412]">
              Academic Suite
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            v2.6 Live
          </span>
        </div>

        {/* Grouped Navigation */}
        <nav className="space-y-4">
          {navigationGroups.map((grp) => {
            // Filter visible items by role
            const visibleItems = grp.items.filter(item => item.roles.includes(role));
            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group} className="space-y-1">
                <div className="px-3 py-1 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#8C827A]">
                  <span>{grp.group}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E43D12]/40" />
                </div>

                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        disabled={item.locked}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs transition-all duration-200 ${
                          item.locked
                            ? 'text-slate-400 opacity-60 cursor-not-allowed bg-slate-100/50'
                            : isActive
                            ? 'bg-gradient-to-r from-[#E43D12] via-[#E43D12] to-[#D6536D] text-white font-black shadow-lg shadow-[#E43D12]/30 border border-[#FFA2B6]/40 scale-[1.01]'
                            : 'text-[#544C47] hover:text-[#1A1412] hover:bg-white hover:shadow-sm border border-transparent hover:border-[#E2DDD2] font-semibold group'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Icon Container Squircle */}
                          <div className={`p-1.5 rounded-xl transition-colors ${
                            isActive 
                              ? 'bg-white/20 text-white shadow-inner' 
                              : 'bg-black/[0.04] group-hover:bg-[#E43D12]/10 group-hover:text-[#E43D12] text-[#7A7067]'
                          }`}>
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className="truncate tracking-tight">{item.label}</span>
                        </div>

                        {/* Badges & Lock State */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && !item.locked && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm ${
                              isActive 
                                ? 'bg-white text-[#E43D12]' 
                                : 'bg-[#E43D12] text-white'
                            }`}>
                              {item.badge}
                            </span>
                          )}

                          {item.locked && (
                            <div className="p-1 rounded-md bg-slate-200/50 text-slate-400">
                              <Lock className="w-3 h-3" />
                            </div>
                          )}

                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Executive Governance Card (Replaces the plain yellow box) */}
        {role !== 'teacher' && (
          <div className="bg-gradient-to-br from-[#1C1210] via-[#261512] to-[#361711] text-white rounded-2xl p-4 shadow-xl border border-[#E43D12]/35 space-y-2.5 relative overflow-hidden">
            {/* Ambient Lighting Glow */}
            <div 
              className="absolute -right-10 -top-10 w-28 h-28 rounded-full pointer-events-none opacity-20"
              style={{ background: 'radial-gradient(circle, #E43D12 0%, transparent 70%)' }}
            />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#EFB11D]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#EFB11D]">
                  Role Scope
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>

            <div className="relative z-10 space-y-1">
              <h5 className="text-xs font-black text-white">
                {role === 'admin' && 'University Master Admin'}
                {role === 'principal' && 'School Dean & HOD Desk'}
                {role === 'applicant' && 'Scholar Applicant Portal'}
              </h5>
              <p className="text-[11px] leading-relaxed text-[#D8D0C9]">
                {role === 'applicant' && 'Department transfers & payslips unlock upon formal appointment order.'}
                {role === 'principal' && 'Department approvals, leave sanctions & APAR gradings active.'}
                {role === 'admin' && 'University-wide administrative authority across all faculties & live Supabase DB.'}
              </p>
            </div>

            <div className="pt-1 relative z-10">
              <button
                onClick={logout}
                className="w-full py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] font-black text-[#FFA2B6] transition-all flex items-center justify-between group"
              >
                <span>Switch Persona Scope</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Sign-out Pill Button */}
      <div className="pt-4 border-t border-[#E2DDD2]">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#E43D12] hover:bg-[#C7310B] text-white text-xs font-black shadow-lg shadow-[#E43D12]/25 hover:shadow-[#E43D12]/40 transition-all uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Change Persona</span>
        </button>
      </div>

    </aside>
  );
};
