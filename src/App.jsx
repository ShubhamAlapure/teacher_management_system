import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { RecruitmentModule } from './components/Recruitment/RecruitmentModule';
import { FacultiesModule } from './components/Faculties/FacultiesModule';
import { ServiceBookModule } from './components/ServiceBook/ServiceBookModule';
import { TransferPromotionModule } from './components/TransferPromotion/TransferPromotionModule';
import { LeavePayrollModule } from './components/LeavePayroll/LeavePayrollModule';
import { TrainingAppraisalModule } from './components/TrainingAppraisal/TrainingAppraisalModule';
import { DocumentVaultModule } from './components/DocumentVault/DocumentVaultModule';
import { AnalyticsModule } from './components/Analytics/AnalyticsModule';
import { AttendanceModule } from './components/Attendance/AttendanceModule';
import { NotificationsModal } from './components/NotificationsModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { ShortlistProfileModal } from './components/ShortlistProfileModal';
import { GroqAssistantModal } from './components/AI/GroqAssistantModal';
import { AiAttendanceAnomalyModule } from './components/AI/AiAttendanceAnomalyModule';
import { AiWorkforceAnalyticsModule } from './components/AI/AiWorkforceAnalyticsModule';
import { AiAssistantChatModule } from './components/AI/AiAssistantChatModule';
import { AiTrainingRecommendationsModule } from './components/AI/AiTrainingRecommendationsModule';

class ModuleErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Module Error Boundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-white rounded-3xl border border-[#E2DDD2] shadow-sm text-center max-w-xl mx-auto my-12 space-y-4 font-sans">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#E43D12] mx-auto flex items-center justify-center font-bold text-2xl">
            !
          </div>
          <h2 className="text-xl font-black text-[#1A1412]">Module View Temporarily Unavailable</h2>
          <p className="text-xs text-[#5A524D] leading-relaxed">
            The requested module encountered an issue while loading. You can reload this view or switch to another module using the sidebar.
          </p>
          <div className="pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2.5 rounded-xl bg-[#E43D12] hover:bg-[#C7310B] text-white font-bold text-xs transition-all shadow-sm"
            >
              Reload View
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainContent = () => {
  const { activeTab } = useApp();

  const renderTab = () => {
    switch (activeTab) {
      case 'recruitment': return <RecruitmentModule />;
      case 'faculties':   return <FacultiesModule />;
      case 'attendance':  return <AttendanceModule />;
      case 'service_book': return <ServiceBookModule />;
      case 'transfers':   return <TransferPromotionModule />;
      case 'leaves':      return <LeavePayrollModule />;
      case 'training':    
      case 'apar':        return <TrainingAppraisalModule />;
      case 'documents':   return <DocumentVaultModule />;
      case 'analytics':   return <AnalyticsModule />;
      case 'ai_attendance': return <AiAttendanceAnomalyModule />;
      case 'ai_workforce':  return <AiWorkforceAnalyticsModule />;
      case 'ai_assistant':  return <AiAssistantChatModule />;
      case 'ai_training':   return <AiTrainingRecommendationsModule />;
      case 'dashboard':
      default:            return <OverviewDashboard />;
    }
  };

  return (
    <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      <ModuleErrorBoundary key={activeTab}>
        {renderTab()}
      </ModuleErrorBoundary>
    </main>
  );
};

const AppShell = () => {
  const { isAuthenticated } = useApp();
  const [viewMode, setViewMode] = useState('landing'); // 'landing' | 'login'
  const [authRole, setAuthRole] = useState('teacher');

  const handleOpenAuth = (role = 'teacher') => {
    setAuthRole(role);
    setViewMode('login');
  };

  if (!isAuthenticated) {
    if (viewMode === 'login') {
      return (
        <LoginPage 
          onBackToLanding={() => setViewMode('landing')} 
          defaultRole={authRole}
        />
      );
    }

    return (
      <LandingPage 
        onOpenAuth={handleOpenAuth} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EBE9E1] text-[#1A1412] flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent />
      </div>
      <NotificationsModal />
      <SupabaseConfigModal />
      <ShortlistProfileModal />
      <GroqAssistantModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
