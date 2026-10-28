import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Printer, 
  Download, 
  UserCheck, 
  Clock, 
  CheckCircle,
  FileText
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { BarangayRequest, RequestStatus } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

interface RequestManagementProps {
  onSelectRequest: (req: BarangayRequest) => void;
  onOpenCertificate: (req: BarangayRequest) => void;
}

export const RequestManagement: React.FC<RequestManagementProps> = ({
  onSelectRequest,
  onOpenCertificate
}) => {
  const { allRequests, services, isSecretary, store } = useBarangayStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter logic
  const filtered = allRequests.filter(r => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      r.reference_number.toLowerCase().includes(q) ||
      r.resident_name.toLowerCase().includes(q) ||
      r.resident_email.toLowerCase().includes(q) ||
      r.service_name_snapshot.toLowerCase().includes(q) ||
      r.purpose.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    // Status filter
    if (selectedStatus !== 'all' && r.current_status !== selectedStatus) return false;

    // Service filter
    if (selectedService !== 'all' && r.document_service_id !== selectedService) return false;

    return true;
  });

  // Sort by date
  const sorted = [...filtered].sort((a, b) => {
    const timeA = new Date(a.submission_timestamp).getTime();
    const timeB = new Date(b.submission_timestamp).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  // Quick action: Accept for review
  const handleQuickAccept = (e: React.MouseEvent, req: BarangayRequest) => {
    e.stopPropagation();
    store.updateRequestStatus({
      requestId: req.id,
      newStatus: 'under_review',
      reason: 'Commenced documentary verification and record screening',
      assignedStaffId: store.getCurrentUser().id,
      assignedStaffName: store.getCurrentUser().full_name
    });
  };

  // Quick action: Approve (Secretary / Admin)
  const handleQuickApprove = (e: React.MouseEvent, req: BarangayRequest) => {
    e.stopPropagation();
    store.updateRequestStatus({
      requestId: req.id,
      newStatus: 'approved',
      reason: 'Approved by Barangay Secretary after satisfactory records clearance'
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvData = store.exportRequestsCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Barangay360_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      
      {/* Title & Export */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Request Management & Verification</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Process citizen certificate requests, assign screeners, request additional requirements, and record releases.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export Filtered CSV
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference #, resident name, or purpose..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            >
              <option value="all">All Request Statuses</option>
              <option value="submitted">Submitted (New)</option>
              <option value="under_review">Under Review</option>
              <option value="pending_requirements">Pending Requirements</option>
              <option value="approved">Approved</option>
              <option value="ready_for_release">Ready for Release</option>
              <option value="released">Officially Released</option>
              <option value="rejected">Declined</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
            >
              <option value="all">All Document Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Counter & Sort Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-700">
          <div>
            Showing <strong className="text-slate-900">{sorted.length}</strong> of {allRequests.length} requests
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center space-x-1 text-blue-900 font-semibold hover:underline"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Sort Date: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* Main Request Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Reference & Service</th>
                <th className="py-3 px-4">Resident Applicant</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Assigned Official</th>
                <th className="py-3 px-4">Claiming Mode</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-700 italic">
                    No requests match the selected filters.
                  </td>
                </tr>
              ) : (
                sorted.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => onSelectRequest(req)}
                    className="hover:bg-blue-50/40 transition cursor-pointer group"
                  >
                    {/* Ref & Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-blue-950">{req.reference_number}</div>
                      <div className="font-semibold text-slate-800 text-[11px] mt-0.5">{req.service_name_snapshot}</div>
                    </td>

                    {/* Resident */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{req.resident_name}</div>
                      <div className="text-[11px] text-slate-700 truncate max-w-xs">{req.resident_email}</div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{new Date(req.submission_timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-[10px] text-slate-600">{new Date(req.submission_timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={req.current_status} size="sm" />
                    </td>

                    {/* Staff */}
                    <td className="py-3.5 px-4 text-slate-700">
                      {req.assigned_staff_name ? (
                        <span className="font-medium text-slate-800">{req.assigned_staff_name}</span>
                      ) : (
                        <span className="text-slate-600 italic">Queue (Unassigned)</span>
                      )}
                    </td>

                    {/* Claiming Mode */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        In-Person Pickup
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Quick Accept button if submitted */}
                        {req.current_status === 'submitted' && (
                          <button
                            onClick={(e) => handleQuickAccept(e, req)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold flex items-center shadow-2xs transition"
                            title="Accept for review"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Review
                          </button>
                        )}

                        {/* Quick Approve button if under_review and Secretary */}
                        {req.current_status === 'under_review' && isSecretary && (
                          <button
                            onClick={(e) => handleQuickApprove(e, req)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center shadow-2xs transition"
                            title="Approve application"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                        )}

                        {/* Print preview if approved or ready or released */}
                        {(req.current_status === 'approved' || req.current_status === 'ready_for_release' || req.current_status === 'released') && (
                          <button
                            onClick={() => onOpenCertificate(req)}
                            className="p-1.5 text-blue-900 hover:bg-blue-100 rounded-lg transition"
                            title="Print Official Certificate"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}

                        {/* View Details */}
                        <button
                          onClick={() => onSelectRequest(req)}
                          className="p-1.5 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition"
                          title="Open Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
