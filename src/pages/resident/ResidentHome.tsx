import React from 'react';
import { 
  FileText, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight, 
  MapPin, 
  Phone, 
  HelpCircle,
  FileCheck2,
  Send,
  UserCheck,
  LayoutGrid,
  PanelLeft
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { DocumentService } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

interface ResidentHomeProps {
  onSelectService: (service: DocumentService) => void;
  onNavigateTab: (tab: string) => void;
  onOpenPrivacy: () => void;
  onOpenHelp: () => void;
}

export const ResidentHome: React.FC<ResidentHomeProps> = ({
  onSelectService,
  onNavigateTab,
  onOpenPrivacy,
  onOpenHelp
}) => {
  const { currentUser, systemSettings, activeServices, userRequests, unreadNotifCount } = useBarangayStore();

  const activeRequests = userRequests.filter(r => r.current_status !== 'released' && r.current_status !== 'rejected');
  const readyRequests = userRequests.filter(r => r.current_status === 'ready_for_release');
  const needsActionRequests = userRequests.filter(r => r.current_status === 'pending_requirements');
  const completedRequests = userRequests.filter(r => r.current_status === 'released');

  const firstName = currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'Resident';

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 brand-band rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-800/80 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-200">
              {systemSettings.barangay_name}
            </span>
            {currentUser?.is_verified ? (
              <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-xs font-semibold text-emerald-300 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Verified Resident
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-semibold text-amber-300 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Residency Verification Pending
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Magandang araw, {firstName}! 🇵🇭
            </h1>
            <p className="text-sm text-blue-100 mt-1 leading-relaxed">
              Welcome to the official online request and tracking portal. Apply for barangay clearances, residency certifications, and indigency documents from your phone.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('request')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-blue-950 font-black text-sm rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center cursor-pointer"
            >
              <FileText className="w-4 h-4 mr-2" />
              Request a Document Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => onNavigateTab('my-requests')}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-2xl transition flex items-center cursor-pointer"
            >
              Track Requests ({activeRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Action Banner if any request needs corrections */}
      {needsActionRequests.length > 0 && (
        <div 
          onClick={() => onNavigateTab('my-requests')}
          className="p-4 bg-orange-50 border-2 border-orange-300 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-orange-100/70 transition shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <AlertCircle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="font-bold text-orange-950 text-sm">Action Required on Your Application</div>
              <p className="text-xs text-orange-800">
                Barangay reviewer requested corrections or clearer documents for Reference #{needsActionRequests[0].reference_number}.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-700 shrink-0" />
        </div>
      )}

      {/* Ready for Release Notice */}
      {readyRequests.length > 0 && (
        <div 
          onClick={() => onNavigateTab('my-requests')}
          className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-emerald-100/70 transition shadow-xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-emerald-950 text-sm flex items-center">
                <span>Document Ready for In-Person Pickup! 🏛️</span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your {readyRequests[0].service_name_snapshot} ({readyRequests[0].reference_number}) is ready! Please proceed to the Barangay Hall with 1 valid ID to claim your document.
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-700 shrink-0" />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => onNavigateTab('my-requests')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition"
        >
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <span>Active Requests</span>
            <Clock className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{activeRequests.length}</div>
          <span className="text-[11px] text-slate-600">In review</span>
        </div>

        <div 
          onClick={() => onNavigateTab('my-requests')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition"
        >
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <span>Ready for Pickup</span>
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-2">{readyRequests.length}</div>
          <span className="text-[11px] text-emerald-700 font-medium">Claim at Hall Counter</span>
        </div>

        <div 
          onClick={() => onNavigateTab('my-requests')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition"
        >
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <span>Released</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{completedRequests.length}</div>
          <span className="text-[11px] text-slate-600">Officially claimed</span>
        </div>

        <div 
          onClick={() => onNavigateTab('request')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs cursor-pointer hover:border-blue-400 transition"
        >
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold">
            <span>Available Forms</span>
            <FileText className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl font-black text-blue-900 mt-2">{activeServices.length}</div>
          <span className="text-[11px] text-slate-600">Apply anytime online</span>
        </div>
      </div>

      {/* Available Document Services Catalog */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Available Barangay Document Services</h2>
            <p className="text-xs text-slate-700">Submit your request online and pick up the official document at the Barangay Hall</p>
          </div>
          <button
            onClick={() => onNavigateTab('request')}
            className="text-xs text-blue-900 font-bold hover:underline hidden sm:block"
          >
            View All ({activeServices.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      Online Request
                    </span>
                    <span className="block text-[10px] text-slate-600 mt-1">{service.estimated_period}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-3 group-hover:text-blue-900 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-700 mt-1 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 text-[11px]">
                  {service.requirements.length} requirement{service.requirements.length > 1 ? 's' : ''} • Pickup at Brgy
                </span>
                <span className="text-blue-900 font-bold flex items-center group-hover:translate-x-0.5 transition-transform">
                  Apply Online
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Step Official Process Explainer */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-black uppercase text-blue-900 tracking-wider">How Online Barangay Request Works</span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">Simple 6-Step Digital Public Service</h3>
          <p className="text-xs text-slate-700 mt-1">
            Skip the long waiting lines. Submit your application online, track status in real-time, and claim your approved certificate at the barangay hall.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {[
            { step: '1', title: 'Select Document', desc: 'Choose clearance or certificate needed' },
            { step: '2', title: 'Complete Form', desc: 'Enter accurate purpose & residency details' },
            { step: '3', title: 'Upload Proof', desc: 'Attach photos of valid ID & proof of address' },
            { step: '4', title: 'Get Reference', desc: 'Receive instant unique tracking number' },
            { step: '5', title: 'Verification', desc: 'Barangay officials screen blotter & RBI records' },
            { step: '6', title: 'Release', desc: 'Claim official dry-sealed document at counter' }
          ].map((item) => (
            <div key={item.step} className="bg-white p-3.5 rounded-xl border border-slate-200 text-center flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center mb-2">
                {item.step}
              </div>
              <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
              <p className="text-[10px] text-slate-700 mt-1 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-700 italic">
            * Note: Online submission does not guarantee automatic approval. Applications are verified against official Barangay Blotter and Registry of Inhabitants records.
          </p>
        </div>
      </div>

      {/* Barangay Hall Information & Hotlines Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-blue-900" />
            <span>Barangay Hall Physical Office</span>
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p><strong>Address:</strong> {systemSettings.hall_address}</p>
            <p><strong>Office Hours:</strong> {systemSettings.office_hours}</p>
            <p><strong>Punong Barangay:</strong> {systemSettings.barangay_captain}</p>
            <p><strong>Barangay Secretary:</strong> {systemSettings.barangay_secretary}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Phone className="w-4 h-4 text-emerald-800" />
            <span>Assistance Hotlines & Citizen Rights</span>
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <p><strong>Helpdesk Phone:</strong> {systemSettings.contact_phone}</p>
            <p><strong>Email:</strong> {systemSettings.contact_email}</p>
            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenPrivacy}
                className="text-[11px] text-blue-900 font-semibold underline hover:text-blue-950 flex items-center"
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Data Privacy Policy (RA 10173)
              </button>
              <button
                onClick={onOpenHelp}
                className="text-[11px] text-blue-900 font-semibold underline hover:text-blue-950 flex items-center"
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1" />
                Citizen Helpdesk & FAQs
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
