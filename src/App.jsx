import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginPage } from './components/Auth/LoginPage';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { RecruitmentModule } from './components/Recruitment/RecruitmentModule';
import { ServiceBookModule } from './components/ServiceBook/ServiceBookModule';
import { TransferPromotionModule } from './components/TransferPromotion/TransferPromotionModule';
import { LeavePayrollModule } from './components/LeavePayroll/LeavePayrollModule';
import { TrainingAppraisalModule } from './components/TrainingAppraisal/TrainingAppraisalModule';
import { DocumentVaultModule } from './components/DocumentVault/DocumentVaultModule';
import { AnalyticsModule } from './components/Analytics/AnalyticsModule';
import { NotificationsModal } from './components/NotificationsModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { ShortlistProfileModal } from './components/ShortlistProfileModal';

const MainContent = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
      {activeTab === 'dashboard' && <OverviewDashboard />}
      {activeTab === 'recruitment' && <RecruitmentModule />}
      {activeTab === 'service_book' && <ServiceBookModule />}
      {activeTab === 'transfers' && <TransferPromotionModule />}
      {activeTab === 'leaves' && <LeavePayrollModule />}
      {activeTab === 'training' && <TrainingAppraisalModule />}
      {activeTab === 'documents' && <DocumentVaultModule />}
      {activeTab === 'analytics' && <AnalyticsModule />}
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
    <div className="min-h-screen bg-[#f4f3f8] text-slate-900 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent />
      </div>
      <NotificationsModal />
      <SupabaseConfigModal />
      <ShortlistProfileModal />
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
