import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  LayoutDashboard, 
  Smartphone, 
  RefreshCw,
  HelpCircle,
  PanelLeft
} from 'lucide-react';
import { useBarangayStore } from '../hooks/useBarangayStore';
import { DEMO_PROFILES } from '../services/store';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenPrivacy: () => void;
  onOpenHelp: () => void;
  onToggleSidebar: () => void;
  activeView: 'resident' | 'admin';
  onChangeView: (view: 'resident' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectTab,
  onOpenAuth,
  onOpenPrivacy,
  onOpenHelp,
  onToggleSidebar,
  activeView,
  onChangeView
}) => {
  const { currentUser, isStaff, store, systemSettings } = useBarangayStore();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handlePersonaSwitch = (userId: string) => {
    store.switchDemoUser(userId);
    setShowPersonaMenu(false);
    // If switching to staff, suggest or auto switch view
    const target = DEMO_PROFILES.find(p => p.id === userId);
    if (target && target.role !== 'resident') {
      onChangeView('admin');
    } else {
      onChangeView('resident');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs print:hidden">
      {/* Top Advisory Strip if emergency announcement exists */}
      {systemSettings.emergency_announcement && (
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-blue-900 brand-band-thin text-white text-[11px] py-1.5 px-3 sm:px-4 font-medium flex items-center gap-3">
          <span className="shrink-0 bg-amber-400 text-blue-950 font-bold px-1.5 py-0.5 rounded-sm text-[10px] uppercase">
            Official Advisory
          </span>
          <div className="marquee flex-1 overflow-hidden" aria-label={systemSettings.emergency_announcement}>
            <div
              className="marquee-track"
              style={{ animationDuration: `${Math.max(18, systemSettings.emergency_announcement.length * 0.22)}s` }}
              aria-hidden="true"
            >
              <span className="marquee-item">{systemSettings.emergency_announcement}</span>
              <span className="marquee-item">{systemSettings.emergency_announcement}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity & Sidebar Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center justify-center border border-slate-200"
            title="Expand / Collapse Modules Bar"
          >
            <PanelLeft className="w-5 h-5 text-blue-950" />
          </button>

          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-800 to-blue-950 p-0.5 shadow-xs flex items-center justify-center text-white border border-blue-700/50 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg text-blue-950 tracking-tight">BARANGAY360</span>
                <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-900 rounded-md uppercase">
                  GovPH
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-700 leading-tight">
                {systemSettings.barangay_name} • {systemSettings.city_municipality}
              </p>
            </div>
          </div>
        </div>

        {/* Center: View Switcher (for Authorized Staff) */}
        {isStaff && (
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => onChangeView('resident')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition cursor-pointer ${
                activeView === 'resident'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 mr-1.5 text-blue-800" />
              Resident App
            </button>
            <button
              onClick={() => onChangeView('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center transition cursor-pointer ${
                activeView === 'admin'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Barangay Dashboard
            </button>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center space-x-2">

          {/* Persona Switcher Dropdown (Essential for testing all roles) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPersonaMenu(!showPersonaMenu);
                setShowUserMenu(false);
              }}
              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 flex items-center space-x-1.5 transition shadow-2xs cursor-pointer"
              title="Switch user role to test Resident, Secretary, or Admin"
            >
              <RefreshCw className="w-3 h-3 text-amber-700" />
              <span className="hidden sm:inline">Role:</span>
              <span className="uppercase text-amber-950 underline decoration-amber-400">{currentUser?.role}</span>
              <ChevronDown className="w-3 h-3 text-amber-700" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-2 border-b border-slate-100 text-slate-700">
                  <strong className="text-slate-800 block text-xs">Switch Testing Persona:</strong>
                  <span className="text-[11px] text-slate-600">Instantly test workflows as any actor:</span>
                </div>
                <div className="mt-1 space-y-1">
                  {DEMO_PROFILES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePersonaSwitch(p.id)}
                      className={`w-full p-2 rounded-xl text-left transition flex items-center justify-between cursor-pointer ${
                        currentUser?.id === p.id ? 'bg-blue-50 border border-blue-200 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="text-slate-900 truncate text-xs">{p.full_name}</div>
                        <div className="text-[10px] text-slate-700">{p.sitio_purok}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase shrink-0 ${
                        p.role === 'admin' ? 'bg-purple-100 text-purple-900' :
                        p.role === 'secretary' ? 'bg-blue-100 text-blue-900' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {p.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* User Profile / Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowPersonaMenu(false);
              }}
              className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-xs border border-blue-700">
                {currentUser?.full_name ? currentUser.full_name.charAt(0) : 'U'}
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="font-semibold text-slate-900 truncate max-w-[120px]">
                  {currentUser?.full_name}
                </div>
                <div className="text-[10px] text-slate-700 capitalize">
                  {currentUser?.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser?.full_name}</div>
                  <div className="text-slate-700 text-[11px] truncate">{currentUser?.email}</div>
                  <div className="mt-1 flex items-center space-x-1">
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-md uppercase">
                      {currentUser?.role}
                    </span>
                    {currentUser?.is_verified && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-900 font-semibold rounded-md">
                        Verified Resident
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { onSelectTab('profile'); setShowUserMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg flex items-center text-slate-700"
                  >
                    <User className="w-4 h-4 mr-2 text-slate-500" />
                    Resident Profile & Settings
                  </button>

                  {isStaff && (
                    <button
                      onClick={() => {
                        onChangeView(activeView === 'resident' ? 'admin' : 'resident');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg flex items-center text-blue-900 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2 text-blue-700" />
                      Switch to {activeView === 'resident' ? 'Barangay Dashboard' : 'Resident Portal'}
                    </button>
                  )}

                  <button
                    onClick={() => { onOpenPrivacy(); setShowUserMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg flex items-center text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2 text-slate-500" />
                    Data Privacy Notice (RA 10173)
                  </button>

                  <button
                    onClick={() => { onOpenHelp(); setShowUserMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 rounded-lg flex items-center text-slate-700"
                  >
                    <HelpCircle className="w-4 h-4 mr-2 text-slate-500" />
                    Help & Hotlines
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => { onOpenAuth(); setShowUserMenu(false); }}
                    className="w-full px-3 py-2 text-left hover:bg-red-50 text-red-700 rounded-lg flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2 text-red-600" />
                    Sign In with Another Account
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
