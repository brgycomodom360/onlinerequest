import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Building2, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle,
  Calendar
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';

export const ReportsAdmin: React.FC = () => {
  const { allRequests, services, store } = useBarangayStore();
  const [dateRange, setDateRange] = useState<'30days' | '90days' | 'year' | 'all'>('30days');

  const totalCount = allRequests.length;
  const released = allRequests.filter(r => r.current_status === 'released');
  const rejected = allRequests.filter(r => r.current_status === 'rejected');
  const readyForReleaseCount = allRequests.filter(r => r.current_status === 'ready_for_release').length;
  const inProgress = allRequests.filter(r => r.current_status !== 'released' && r.current_status !== 'rejected');

  const handleExportCSV = () => {
    const csvData = store.exportRequestsCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Barangay360_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operational Reports & Analytics</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Statistical summaries derived from verified database transactions and official barangay receipts.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Download Sanitized CSV
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
            <span>Total Inflow</span>
            <FileText className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount} Applications</div>
          <span className="text-[11px] text-slate-700">Digital citizen submissions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
            <span>Completed & Released</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{released.length} Issued</div>
          <span className="text-[11px] text-slate-700">Official receipt recorded</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
            <span>Ready for Pickup</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {readyForReleaseCount} Prepared
          </div>
          <span className="text-[11px] text-slate-700">Awaiting claimant at Barangay Hall</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-center text-xs text-slate-700 font-semibold">
            <span>Declined / Incomplete</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{rejected.length} Declined</div>
          <span className="text-[11px] text-slate-700">Blotter / residency mismatch</span>
        </div>
      </div>

      {/* Breakdown by Document Service Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-sm">Document Service Volume & Processing Breakdown</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Certificate Type</th>
                <th className="py-2.5 px-3">Turnaround</th>
                <th className="py-2.5 px-3">Total Requests</th>
                <th className="py-2.5 px-3">Ready for Pickup</th>
                <th className="py-2.5 px-3">Released Count</th>
                <th className="py-2.5 px-3">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(srv => {
                const srvReqs = allRequests.filter(r => r.document_service_id === srv.id);
                const srvReady = srvReqs.filter(r => r.current_status === 'ready_for_release');
                const srvReleased = srvReqs.filter(r => r.current_status === 'released');
                const completionRate = srvReqs.length > 0 ? Math.round((srvReleased.length / srvReqs.length) * 100) : 0;

                return (
                  <tr key={srv.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-900">{srv.name}</td>
                    <td className="py-3 px-3 font-medium text-slate-700">{srv.estimated_period}</td>
                    <td className="py-3 px-3 font-bold text-slate-800">{srvReqs.length}</td>
                    <td className="py-3 px-3 text-blue-900 font-semibold">{srvReady.length}</td>
                    <td className="py-3 px-3 text-emerald-800 font-semibold">{srvReleased.length}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-blue-900 h-1.5 rounded-full" style={{ width: `${completionRate}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-700 font-mono">{completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
