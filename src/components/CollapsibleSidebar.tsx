import React, { useState } from 'react';
import { 
  Home, 
  PlusCircle, 
  FileText, 
  User, 
  LayoutDashboard, 
  FileCheck2, 
  Printer, 
  Users, 
  Sliders, 
  BarChart3, 
  Megaphone, 
  ShieldAlert, 
  Lock, 
  Settings, 
  HelpCircle, 
  ShieldCheck, 
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Shield,
  Building2,
  ChevronRight
} from 'lucide-react';
import { useBarangayStore } from '../hooks/useBarangayStore';

interface CollapsibleSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activeView: 'resident' | 'admin';
  currentResidentTab: string;
  activeAdminSection: string;
  onNavigateResidentTab: (tab: string) => void;
  onNavigateAdminSection: (section: string) => void;
  onOpenPrivacy: () => void;
  onOpenHelp: () => void;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  activeView,
  currentResidentTab,
  activeAdminSection,
  onNavigateResidentTab,
  onNavigateAdminSection,
  onOpenPrivacy,
  onOpenHelp
}) => {
  const { currentUser, isStaff, allRequests, unreadNotifCount } = useBarangayStore();
  const [searchQuery, setSearchQuery] = useState('');

  const pendingRequestsCount = allRequests.filter(r => r.current_status === 'submitted' || r.current_status === 'under_review').length;

  interface SidebarModule {
    id: string;
    label: string;
    shortLabel: string;
    icon: React.ElementType;
    action: () => void;
    isActive: boolean;
    badge?: number | string | null;
    badgeColor?: string;
  }

  // Citizen Modules
  const citizenModules: SidebarModule[] = [
    {
      id: 'home',
      label: 'Resident Portal',
      shortLabel: 'Home',
      icon: Home,
      action: () => { onNavigateResidentTab('home'); onCloseMobile(); },
      isActive: activeView === 'resident' && currentResidentTab === 'home'
    },
    {
      id: 'request',
      label: 'Apply for Document',
      shortLabel: 'Apply',
      icon: PlusCircle,
      action: () => { onNavigateResidentTab('request'); onCloseMobile(); },
      isActive: activeView === 'resident' && currentResidentTab === 'request',
      badge: 'New',
      badgeColor: 'bg-amber-400 text-blue-950'
    },
    {
      id: 'my-requests',
      label: 'My Requests & Tracking',
      shortLabel: 'Requests',
      icon: FileText,
      action: () => { onNavigateResidentTab('my-requests'); onCloseMobile(); },
      isActive: activeView === 'resident' && currentResidentTab === 'my-requests'
    },
    {
      id: 'profile',
      label: 'Citizen Profile & RBI',
      shortLabel: 'Profile',
      icon: User,
      action: () => { onNavigateResidentTab('profile'); onCloseMobile(); },
      isActive: activeView === 'resident' && currentResidentTab === 'profile'
    }
  ];

  // Administrative Operations Modules
  const adminModules: SidebarModule[] = [
    {
      id: 'dashboard',
      label: 'Operations Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      action: () => { onNavigateAdminSection('dashboard'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'dashboard'
    },
    {
      id: 'requests',
      label: 'Request Management',
      shortLabel: 'Requests',
      icon: FileCheck2,
      action: () => { onNavigateAdminSection('requests'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'requests',
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : null,
      badgeColor: 'bg-amber-400 text-blue-950'
    },
    {
      id: 'preparation',
      label: 'Document Preparation',
      shortLabel: 'Prep',
      icon: Printer,
      action: () => { onNavigateAdminSection('preparation'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'preparation'
    },
    {
      id: 'residents',
      label: 'Inhabitants Registry (RBI)',
      shortLabel: 'RBI',
      icon: Users,
      action: () => { onNavigateAdminSection('residents'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'residents'
    },
    {
      id: 'services',
      label: 'Document Services',
      shortLabel: 'Services',
      icon: Sliders,
      action: () => { onNavigateAdminSection('services'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'services'
    },
    {
      id: 'reports',
      label: 'Reports & CSV Export',
      shortLabel: 'Reports',
      icon: BarChart3,
      action: () => { onNavigateAdminSection('reports'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'reports'
    },
    {
      id: 'broadcast',
      label: 'Citizen Broadcast',
      shortLabel: 'Broadcast',
      icon: Megaphone,
      action: () => { onNavigateAdminSection('broadcast'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'broadcast'
    },
    {
      id: 'permissions',
      label: 'Roles & Permissions',
      shortLabel: 'Roles',
      icon: ShieldAlert,
      action: () => { onNavigateAdminSection('permissions'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'permissions'
    },
    {
      id: 'audit_logs',
      label: 'Immutable Audit Logs',
      shortLabel: 'Audit',
      icon: Lock,
      action: () => { onNavigateAdminSection('audit_logs'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'audit_logs'
    },
    {
      id: 'settings',
      label: 'System Settings',
      shortLabel: 'Settings',
      icon: Settings,
      action: () => { onNavigateAdminSection('settings'); onCloseMobile(); },
      isActive: activeView === 'admin' && activeAdminSection === 'settings'
    }
  ];

  // Public & Informational Modules
  const publicModules: SidebarModule[] = [
    {
      id: 'help',
      label: 'Citizen Charter & FAQs',
      shortLabel: 'Help',
      icon: HelpCircle,
      action: () => { onOpenHelp(); onCloseMobile(); },
      isActive: false
    },
    {
      id: 'privacy',
      label: 'Data Privacy Policy',
      shortLabel: 'Privacy',
      icon: ShieldCheck,
      action: () => { onOpenPrivacy(); onCloseMobile(); },
      isActive: false
    }
  ];

  // The single active module list based on current active view
  const activeModules = activeView === 'admin' ? adminModules : citizenModules;

  // Filtering modules with search
  const filteredModules = !searchQuery.trim()
    ? activeModules
    : activeModules.filter(m => 
        m.label.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
        m.shortLabel.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );

  const filteredPublic = !searchQuery.trim()
    ? publicModules
    : publicModules.filter(m => 
        m.label.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
        m.shortLabel.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Single Collapsible Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-slate-900 text-white flex flex-col border-r border-slate-800 shadow-xl transition-all duration-300 ease-in-out
        md:static md:z-30 print:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-18' : 'md:w-64 lg:w-72'}
        w-72
      `}>
        
        {/* Top Header & Collapse Toggle */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2.5 truncate mr-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-950 border border-amber-400/60 flex items-center justify-center shrink-0 text-white shadow-xs">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div className="truncate">
                <div className="font-black text-xs text-white uppercase tracking-tight truncate">
                  Barangay Comod-om
                </div>
                <div className="text-[10px] text-blue-300 font-medium truncate">
                  Alcantara, Romblon
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <button 
                onClick={onToggleCollapse}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-950 border border-amber-400/60 flex items-center justify-center text-white shadow-xs cursor-pointer hover:border-amber-400 transition"
                title="Expand Modules Bar (Ctrl+B)"
              >
                <Shield className="w-5 h-5 text-amber-400" />
              </button>
            </div>
          )}

          {/* Toggle Button */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* Desktop Collapse/Expand Button */}
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
              title={isCollapsed ? 'Expand Modules Bar (Ctrl+B)' : 'Collapse Modules Bar (Ctrl+B)'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-amber-400" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Context Indicator Header (only when expanded) */}
        {!isCollapsed && (
          <div className="px-3.5 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between shrink-0 text-[10px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center">
              {activeView === 'admin' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
                  Barangay Operations
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
                  Citizen Portal
                </>
              )}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-800 text-slate-300">
              {activeModules.length} Modules
            </span>
          </div>
        )}

        {/* Search Bar (only when expanded) */}
        {!isCollapsed && (
          <div className="p-3 border-b border-slate-800/80 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter modules..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* The Single Unified Modules Navigation List */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 text-xs">
          
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            const isItemActive = mod.isActive;
            const activeColorClass = activeView === 'admin' ? 'bg-emerald-800' : 'bg-blue-800';

            return (
              <button
                key={mod.id}
                onClick={mod.action}
                className={`w-full rounded-xl transition flex items-center group cursor-pointer ${
                  isCollapsed 
                    ? 'p-2.5 justify-center relative' 
                    : 'px-3 py-2 justify-between'
                } ${
                  isItemActive
                    ? `${activeColorClass} text-white font-bold shadow-xs`
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={isCollapsed ? `${mod.label} (${mod.shortLabel})` : undefined}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isItemActive ? 'text-amber-400' : 'text-slate-400'
                  }`} />
                  {!isCollapsed && <span className="truncate">{mod.label}</span>}
                </div>

                {!isCollapsed && mod.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${mod.badgeColor || 'bg-blue-600 text-white'}`}>
                    {mod.badge}
                  </span>
                )}

                {isCollapsed && mod.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900" />
                )}

                {/* Floating Tooltip in Collapsed Mode */}
                {isCollapsed && (
                  <div className="hidden md:group-hover:flex absolute left-full ml-3 z-50 px-2.5 py-1 bg-slate-950 text-white text-[11px] font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap items-center space-x-1.5 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                    <span>{mod.label}</span>
                    {mod.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-blue-600 text-white">
                        {mod.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Public & Legal Modules */}
          {filteredPublic.length > 0 && (
            <div className="space-y-1 pt-3 mt-3 border-t border-slate-800/80">
              {!isCollapsed && (
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Public & Info
                </div>
              )}

              {filteredPublic.map((mod) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={mod.id}
                    onClick={mod.action}
                    className={`w-full rounded-xl transition flex items-center group cursor-pointer ${
                      isCollapsed 
                        ? 'p-2.5 justify-center relative' 
                        : 'px-3 py-2 justify-between'
                    } text-slate-400 hover:bg-slate-800 hover:text-white`}
                    title={isCollapsed ? mod.label : undefined}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className="w-4 h-4 text-slate-400 shrink-0 group-hover:scale-110" />
                      {!isCollapsed && <span className="truncate">{mod.label}</span>}
                    </div>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {isCollapsed && (
                      <div className="hidden md:group-hover:flex absolute left-full ml-3 z-50 px-2.5 py-1 bg-slate-950 text-white text-[11px] font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap items-center pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                        <span>{mod.label}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* Bottom User Card & Status */}
        <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <div className="truncate mr-1">
                  <div className="font-bold text-white truncate">{currentUser?.full_name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{currentUser?.email}</div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-md font-bold uppercase shrink-0 bg-blue-900 text-blue-200">
                  {currentUser?.role}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                <span>Barangay Comod-om</span>
                <span className="text-emerald-400 font-mono">Online</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={onToggleCollapse}
                className="w-8 h-8 mx-auto rounded-full bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center justify-center text-xs transition cursor-pointer hover:ring-2 hover:ring-amber-400"
                title={`User: ${currentUser?.full_name} (${currentUser?.role}) — Click to expand modules bar`}
              >
                {currentUser?.full_name?.charAt(0) || 'U'}
              </button>
            </div>
          )}
        </div>

      </aside>
    </>
  );
};
