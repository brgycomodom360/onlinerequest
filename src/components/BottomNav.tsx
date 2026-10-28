import React from 'react';
import { Home, PlusCircle, FileText, User } from 'lucide-react';
import { useBarangayStore } from '../hooks/useBarangayStore';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { userRequests } = useBarangayStore();

  const activeCount = userRequests.filter(r => r.current_status !== 'released' && r.current_status !== 'rejected').length;
  const readyPickupCount = userRequests.filter(r => r.current_status === 'ready_for_release').length;
  const pendingActionCount = userRequests.filter(r => r.current_status === 'pending_requirements').length;

  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { 
      id: 'my-requests', 
      label: 'Requests', 
      icon: FileText, 
      badge: readyPickupCount > 0 ? `${readyPickupCount}` : (pendingActionCount > 0 ? '!' : (activeCount > 0 ? activeCount : null)), 
      badgeColor: readyPickupCount > 0 ? 'bg-emerald-600' : (pendingActionCount > 0 ? 'bg-orange-500' : 'bg-blue-600') 
    },
    { id: 'request', label: 'Apply', icon: PlusCircle, isPrimary: true },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 md:hidden shadow-lg print:hidden safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="relative -top-3 flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-active:scale-95 ${
                  isActive ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-blue-900 ring-4 ring-blue-100'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-[10px] font-bold mt-0.5 ${isActive ? 'text-blue-950' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 py-1 px-1 flex flex-col items-center justify-center relative transition cursor-pointer ${
                isActive ? 'text-blue-900 font-bold' : 'text-slate-700 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-2 text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
