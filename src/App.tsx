import React, { useState } from 'react';
import { useBarangayStore } from './hooks/useBarangayStore';
import { BarangayRequest, DocumentService } from './types';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CollapsibleSidebar } from './components/CollapsibleSidebar';
import { RequestDetailModal } from './components/RequestDetailModal';
import { DocumentCertificateModal } from './components/DocumentCertificateModal';
import { PrivacyModal } from './components/PrivacyModal';
import { HelpModal } from './components/HelpModal';
import { AuthModal } from './components/AuthModal';

// Resident Pages
import { ResidentHome } from './pages/resident/ResidentHome';
import { NewRequestWizard } from './pages/resident/NewRequestWizard';
import { MyRequestsView } from './pages/resident/MyRequestsView';
import { NotificationsView } from './pages/resident/NotificationsView';
import { ResidentProfileView } from './pages/resident/ResidentProfileView';

// Admin Page
import { AdminLayout } from './pages/admin/AdminLayout';

export function App() {
  const { currentUser, isStaff, allRequests, store } = useBarangayStore();

  // Primary navigation views
  const [activeView, setActiveView] = useState<'resident' | 'admin'>(
    currentUser && currentUser.role !== 'resident' ? 'admin' : 'resident'
  );
  const [residentTab, setResidentTab] = useState<string>('home');
  const [adminSection, setAdminSection] = useState<string>('dashboard');
  const [selectedServiceForWizard, setSelectedServiceForWizard] = useState<DocumentService | null>(null);

  // Collapsible sidebar state with local storage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('barangay360_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [activeRequestDetail, setActiveRequestDetail] = useState<BarangayRequest | null>(null);
  const [activeCertificateRequest, setActiveCertificateRequest] = useState<BarangayRequest | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Toggle handler for collapsible bar
  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileSidebarOpen(prev => !prev);
    } else {
      setIsSidebarCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem('barangay360_sidebar_collapsed', String(next));
        } catch {
          // ignore
        }
        return next;
      });
    }
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle collapsible modules bar
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if not currently typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for switching modules
  const handleNavigateResidentTab = (tab: string) => {
    setActiveView('resident');
    setResidentTab(tab);
    if (tab !== 'request') setSelectedServiceForWizard(null);
  };

  const handleNavigateAdminSection = (section: string) => {
    // If current persona is resident, auto switch to barangay official (Secretary) so user can test the admin module
    if (!isStaff) {
      store.switchDemoUser('user-sec-1');
    }
    setActiveView('admin');
    setAdminSection(section);
  };

  const handleSelectServiceFromHome = (service: DocumentService) => {
    setSelectedServiceForWizard(service);
    setResidentTab('request');
  };

  const handleOpenRequestByRef = (refNumber: string) => {
    const found = allRequests.find(r => r.reference_number === refNumber || r.id === refNumber);
    if (found) {
      setActiveRequestDetail(found);
    }
  };

  const handleRequestCreated = (req: BarangayRequest) => {
    // Navigate to My Requests and open detail
    setResidentTab('my-requests');
    setSelectedServiceForWizard(null);
    setActiveRequestDetail(req);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Universal Top Navigation Header */}
      <Navbar
        currentTab={residentTab}
        onSelectTab={(tab) => {
          setResidentTab(tab);
          if (tab !== 'request') setSelectedServiceForWizard(null);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onToggleSidebar={handleToggleSidebar}
        activeView={activeView}
        onChangeView={setActiveView}
      />

      {/* Main Container with Collapsible Modules Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Modules Sidebar Bar */}
        <CollapsibleSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          mobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          activeView={activeView}
          currentResidentTab={residentTab}
          activeAdminSection={adminSection}
          onNavigateResidentTab={handleNavigateResidentTab}
          onNavigateAdminSection={handleNavigateAdminSection}
          onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
          onOpenHelp={() => setIsHelpModalOpen(true)}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-slate-50 transition-all duration-300">
          {activeView === 'admin' && isStaff ? (
            <AdminLayout
              activeSection={adminSection}
              onSelectSection={setAdminSection}
              onSelectRequest={(req) => setActiveRequestDetail(req)}
              onOpenCertificate={(req) => setActiveCertificateRequest(req)}
            />
          ) : (
            <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-28 sm:pb-12">
              
              {/* RESIDENT TAB: HOME */}
              {residentTab === 'home' && (
                <ResidentHome
                  onSelectService={handleSelectServiceFromHome}
                  onNavigateTab={(tab) => {
                    setResidentTab(tab);
                    if (tab !== 'request') setSelectedServiceForWizard(null);
                  }}
                  onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                  onOpenHelp={() => setIsHelpModalOpen(true)}
                />
              )}

              {/* RESIDENT TAB: NEW REQUEST WIZARD */}
              {residentTab === 'request' && (
                <NewRequestWizard
                  initialService={selectedServiceForWizard}
                  onFinish={handleRequestCreated}
                  onCancel={() => {
                    setResidentTab('home');
                    setSelectedServiceForWizard(null);
                  }}
                  onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                />
              )}

              {/* RESIDENT TAB: MY REQUESTS */}
              {residentTab === 'my-requests' && (
                <MyRequestsView
                  onSelectRequest={(req) => setActiveRequestDetail(req)}
                  onNewRequest={() => {
                    setSelectedServiceForWizard(null);
                    setResidentTab('request');
                  }}
                />
              )}

              {/* RESIDENT TAB: NOTIFICATIONS */}
              {residentTab === 'notifications' && (
                <NotificationsView
                  onOpenRequestByRef={handleOpenRequestByRef}
                />
              )}

              {/* RESIDENT TAB: PROFILE */}
              {residentTab === 'profile' && (
                <ResidentProfileView
                  onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
                  onOpenHelp={() => setIsHelpModalOpen(true)}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                />
              )}

            </div>
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation (only visible in resident view on mobile devices) */}
      {activeView === 'resident' && (
        <BottomNav
          currentTab={residentTab}
          onSelectTab={(tab) => {
            setResidentTab(tab);
            if (tab !== 'request') setSelectedServiceForWizard(null);
          }}
        />
      )}

      {/* Reusable Modals */}
      <RequestDetailModal
        request={activeRequestDetail}
        isOpen={Boolean(activeRequestDetail)}
        onClose={() => setActiveRequestDetail(null)}
        onOpenCertificate={(req) => setActiveCertificateRequest(req)}
      />

      <DocumentCertificateModal
        request={activeCertificateRequest}
        isOpen={Boolean(activeCertificateRequest)}
        onClose={() => setActiveCertificateRequest(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onOpenPrivacy={() => {
          setIsAuthModalOpen(false);
          setIsPrivacyModalOpen(true);
        }}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

    </div>
  );
}

export default App;
