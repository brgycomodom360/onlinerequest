import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  ChevronRight, 
  PlusCircle, 
  Calendar,
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { BarangayRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

interface MyRequestsViewProps {
  onSelectRequest: (req: BarangayRequest) => void;
  onNewRequest: () => void;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  onSelectRequest,
  onNewRequest
}) => {
  const { userRequests } = useBarangayStore();
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'action_needed' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = userRequests.filter(r => {
    // Search match
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      r.reference_number.toLowerCase().includes(q) ||
      r.service_name_snapshot.toLowerCase().includes(q) ||
      r.purpose.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Filter tab
    if (filterTab === 'active') {
      return r.current_status !== 'released' && r.current_status !== 'rejected';
    }
    if (filterTab === 'action_needed') {
      return r.current_status === 'pending_requirements';
    }
    if (filterTab === 'ready') {
      return r.current_status === 'ready_for_release';
    }
    if (filterTab === 'completed') {
      return r.current_status === 'released' || r.current_status === 'rejected';
    }
    return true;
  });

  const actionNeededCount = userRequests.filter(r => r.current_status === 'pending_requirements').length;
  const readyCount = userRequests.filter(r => r.current_status === 'ready_for_release').length;

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      
      {/* View Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">My Requests & Document Tracking</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Monitor real-time status, official review notes, and pickup notices for your applications.
          </p>
        </div>
        <button
          onClick={onNewRequest}
          className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" />
          New Request
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference number (e.g. BRGY-2026-X8K92) or document name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { id: 'all', label: `All (${userRequests.length})` },
            { id: 'active', label: 'In Progress' },
            { id: 'action_needed', label: `Action Needed`, badge: actionNeededCount > 0 ? actionNeededCount : null, color: 'text-orange-700 bg-orange-100' },
            { id: 'ready', label: `Ready for Release`, badge: readyCount > 0 ? readyCount : null, color: 'text-blue-900 bg-blue-100' },
            { id: 'completed', label: 'Completed' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center cursor-pointer ${
                filterTab === t.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{t.label}</span>
              {t.badge && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${filterTab === t.id ? 'bg-white text-blue-900' : t.color}`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">No applications found</h3>
            <p className="text-xs text-slate-700 mt-1 max-w-sm mx-auto">
              {searchQuery ? 'No request records match your search criteria.' : 'You have not submitted any barangay requests in this category yet.'}
            </p>
          </div>
          <button
            onClick={onNewRequest}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Apply for a Document
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelectRequest(req)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                req.current_status === 'pending_requirements'
                  ? 'bg-orange-50/70 border-orange-300 hover:bg-orange-100/50'
                  : req.current_status === 'ready_for_release'
                  ? 'bg-blue-50/70 border-blue-300 hover:bg-blue-100/50'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black text-blue-950 bg-blue-100/80 px-2 py-0.5 rounded-md">
                    {req.reference_number}
                  </span>
                  <StatusBadge status={req.current_status} size="sm" />
                  <span className="text-[11px] text-slate-700 flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-slate-600" />
                    {new Date(req.submission_timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors">
                    {req.service_name_snapshot}
                  </h3>
                  <p className="text-xs text-slate-700 line-clamp-1 italic">
                    "{req.purpose}"
                  </p>
                </div>

                {/* Status Notice snippet */}
                {req.current_status === 'pending_requirements' && (
                  <div className="text-[11px] text-orange-900 font-medium flex items-center bg-orange-100/80 p-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-orange-600 shrink-0" />
                    <span className="truncate">Action Needed: Tap to upload requested corrections.</span>
                  </div>
                )}

                {req.current_status === 'ready_for_release' && (
                  <div className="text-xs text-emerald-950 font-bold flex items-center bg-emerald-100 p-2.5 rounded-xl border border-emerald-300">
                    <FileCheck2 className="w-4 h-4 mr-1.5 text-emerald-700 shrink-0" />
                    <span>🏛️ Ready for Pickup! Visit the Barangay Hall with 1 valid ID.</span>
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 shrink-0">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 block">
                    Online Tracking
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">In-Person Pickup</span>
                </div>

                <button
                  type="button"
                  className="mt-2 text-xs font-bold text-blue-900 flex items-center group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  View Details & History
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
