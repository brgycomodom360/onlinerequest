import React from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileCheck, 
  TrendingUp, 
  Building2, 
  XCircle,
  Calendar,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { BarangayRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

interface AdminDashboardProps {
  onSelectRequest: (req: BarangayRequest) => void;
  onNavigateSection: (section: string) => void;
  onOpenCertificate: (req: BarangayRequest) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectRequest,
  onNavigateSection,
  onOpenCertificate
}) => {
  const { allRequests, allProfiles, services, systemSettings } = useBarangayStore();

  const totalCount = allRequests.length;
  const newSubmissions = allRequests.filter(r => r.current_status === 'submitted');
  const underReview = allRequests.filter(r => r.current_status === 'under_review');
  const pendingReqs = allRequests.filter(r => r.current_status === 'pending_requirements');
  const approved = allRequests.filter(r => r.current_status === 'approved');
  const readyForRelease = allRequests.filter(r => r.current_status === 'ready_for_release');
  const released = allRequests.filter(r => r.current_status === 'released');
  const rejected = allRequests.filter(r => r.current_status === 'rejected');

  const totalResidents = allProfiles.filter(p => p.role === 'resident').length;

  // Group by document service
  const serviceCounts = services.map(s => ({
    name: s.name,
    count: allRequests.filter(r => r.document_service_id === s.id).length
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 brand-band rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-blue-950 font-bold text-[10px] rounded-md uppercase">
              Operations Center
            </span>
            <span className="text-xs text-blue-200">
              {systemSettings.barangay_name} • Sangguniang Barangay
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Administrative Workflow & Tracking Dashboard
          </h1>
          <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
            Real-time tracking of resident certificate applications, blotter screening, document generation, and official fee releases.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => onNavigateSection('requests')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center cursor-pointer"
          >
            Review Queue ({newSubmissions.length + underReview.length})
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </button>
          <button
            onClick={() => onNavigateSection('reports')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Generate Reports
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {[
          { label: 'Total Requests', val: totalCount, icon: FileText, color: 'text-slate-900', bg: 'bg-white', border: 'border-slate-200' },
          { label: 'New Submitted', val: newSubmissions.length, icon: Clock, color: 'text-blue-700', bg: 'bg-blue-50/60', border: 'border-blue-200' },
          { label: 'Under Review', val: underReview.length, icon: Clock, color: 'text-amber-700', bg: 'bg-amber-50/60', border: 'border-amber-200' },
          { label: 'Needs Action', val: pendingReqs.length, icon: AlertCircle, color: 'text-orange-700', bg: 'bg-orange-50/60', border: 'border-orange-200' },
          { label: 'Approved', val: approved.length, icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50/60', border: 'border-emerald-200' },
          { label: 'Ready for Pickup', val: readyForRelease.length, icon: FileCheck, color: 'text-blue-900', bg: 'bg-blue-100/60', border: 'border-blue-300' },
          { label: 'Released', val: released.length, icon: ShieldCheck, color: 'text-green-800', bg: 'bg-green-50/60', border: 'border-green-300' },
          { label: 'Declined', val: rejected.length, icon: XCircle, color: 'text-red-700', bg: 'bg-red-50/60', border: 'border-red-200' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              onClick={() => onNavigateSection('requests')}
              className={`${kpi.bg} ${kpi.border} p-3 rounded-2xl border shadow-2xs hover:shadow-xs transition cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider">{kpi.label}</span>
                <Icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
              <div className={`text-xl font-black mt-2 ${kpi.color}`}>
                {kpi.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Highlights: Fees & Residents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 uppercase">Ready for Pickup</span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {readyForRelease.length} Documents
            </div>
            <span className="text-[11px] text-slate-700">Awaiting claimant at Barangay Hall</span>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 uppercase">Registered Citizens</span>
            <div className="text-2xl font-black text-blue-900 mt-1">
              {totalResidents} Residents
            </div>
            <span className="text-[11px] text-slate-700">Inhabitants Registry Database</span>
          </div>
          <div className="p-3 bg-blue-100 text-blue-900 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-700 uppercase">Average Turnaround</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              1.2 Days
            </div>
            <span className="text-[11px] text-slate-700">Faster than 3-day statutory target</span>
          </div>
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Review Queue + Service Volume Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Urgent Processing Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Urgent Applications Queue</h2>
              <p className="text-xs text-slate-700 mt-0.5">Requests currently awaiting screener or secretary action</p>
            </div>
            <button
              onClick={() => onNavigateSection('requests')}
              className="text-xs font-bold text-blue-900 hover:underline flex items-center cursor-pointer"
            >
              View Full Table ({allRequests.length})
              <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {allRequests.slice(0, 5).map((req) => (
              <div
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-950 bg-slate-100 px-2 py-0.5 rounded-md">
                      {req.reference_number}
                    </span>
                    <StatusBadge status={req.current_status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-900">{req.service_name_snapshot}</div>
                  <div className="text-slate-700 flex items-center">
                    <span>{req.resident_name}</span>
                    <span className="mx-1.5">•</span>
                    <span className="italic truncate max-w-xs">"{req.purpose}"</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 justify-between sm:justify-end">
                  <div className="text-right sm:mr-2">
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 block">
                      Pickup at Hall
                    </span>
                    <div className="text-[10px] text-slate-600 mt-0.5">
                      {new Date(req.submission_timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  {(req.current_status === 'approved' || req.current_status === 'ready_for_release' || req.current_status === 'released') && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCertificate(req);
                      }}
                      className="px-2.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-[11px] font-semibold transition"
                      title="Preview Official Certificate"
                    >
                      Print
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Volume by Document Service */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Request Volume by Document</h2>
            <p className="text-xs text-slate-700 mt-0.5">Application share per certificate type</p>
          </div>

          <div className="space-y-3 pt-1">
            {serviceCounts.map((srv, idx) => {
              const pct = totalCount > 0 ? Math.round((srv.count / totalCount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{srv.name}</span>
                    <span className="text-slate-700 font-mono">
                      {srv.count} reqs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-700 space-y-2">
            <div className="flex justify-between">
              <span>Standard Barangay Hall Releasing:</span>
              <strong className="text-slate-900">Counter 1 & 2</strong>
            </div>
            <div className="flex justify-between">
              <span>Blotter Screening In-charge:</span>
              <strong className="text-slate-900">Desk Officer / Tanod</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
