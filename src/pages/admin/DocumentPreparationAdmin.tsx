import React, { useState } from 'react';
import { 
  FileCheck, 
  Printer, 
  CheckCircle, 
  Award, 
  Send, 
  FileText, 
  ShieldCheck,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { BarangayRequest } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';

interface DocumentPreparationAdminProps {
  onOpenCertificate: (req: BarangayRequest) => void;
  onSelectRequest: (req: BarangayRequest) => void;
}

export const DocumentPreparationAdmin: React.FC<DocumentPreparationAdminProps> = ({
  onOpenCertificate,
  onSelectRequest
}) => {
  const { allRequests, store, systemSettings } = useBarangayStore();

  const [selectedReqId, setSelectedReqId] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Eligible requests: approved or ready for release
  const eligibleRequests = allRequests.filter(r => 
    r.current_status === 'approved' || r.current_status === 'ready_for_release' || r.current_status === 'under_review'
  );

  const selectedRequest = allRequests.find(r => r.id === selectedReqId) || eligibleRequests[0] || null;

  // Mark as Ready for Release
  const handleMarkReady = () => {
    if (!selectedRequest) return;

    const res = store.updateRequestStatus({
      requestId: selectedRequest.id,
      newStatus: 'ready_for_release',
      reason: `Document printed, dry-sealed, and cataloged for releasing at Counter 1 by ${store.getCurrentUser().full_name}`
    });

    if (res.success) {
      setSuccessMsg(`Document for ${selectedRequest.resident_name} (${selectedRequest.reference_number}) marked as READY FOR RELEASE.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Document Preparation & Official Releasing Studio</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Format verified application records into official Sangguniang Barangay certificates, dry seal, and stage for pickup.
          </p>
        </div>
        <div className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 font-bold text-xs flex items-center">
          <Award className="w-4 h-4 mr-1.5 text-amber-500" />
          {eligibleRequests.length} Applications in Studio
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Main Grid: Selection Sidebar + Certificate Preparation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: Eligible Applications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
          <h2 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Approved Applications Queue ({eligibleRequests.length})
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {eligibleRequests.length === 0 ? (
              <p className="text-xs text-slate-600 italic py-4 text-center">
                No approved applications awaiting document printing at this moment.
              </p>
            ) : (
              eligibleRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer text-xs space-y-1 ${
                    selectedRequest?.id === req.id
                      ? 'bg-blue-50 border-blue-400 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-950">{req.reference_number}</span>
                    <StatusBadge status={req.current_status} size="sm" />
                  </div>
                  <div className="font-bold text-slate-900">{req.service_name_snapshot}</div>
                  <div className="text-slate-700 truncate">{req.resident_name}</div>
                  <div className="text-[10px] text-blue-900 font-medium">
                    Pickup at Barangay Hall Counter
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 2 Columns: Preparation & Sign-off Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          {selectedRequest ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-semibold text-blue-900 uppercase">Preparation Canvas</span>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedRequest.service_name_snapshot}
                  </h2>
                  <p className="text-xs text-slate-700 font-mono">
                    Reference: {selectedRequest.reference_number} • Applicant: {selectedRequest.resident_name}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenCertificate(selectedRequest)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center shadow-xs transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 mr-1.5" />
                    Open Print Preview
                  </button>
                  <button
                    onClick={() => onSelectRequest(selectedRequest)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Certificate Pre-fill Data Verification */}
              <div className="space-y-3 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Verified Certification Clauses
                </h3>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-700 block text-[11px]">Signatory Official:</span>
                      <strong className="text-slate-900 font-medium">{systemSettings.barangay_captain} (Punong Barangay)</strong>
                    </div>
                    <div>
                      <span className="text-slate-700 block text-[11px]">Attesting Officer:</span>
                      <strong className="text-slate-900 font-medium">{systemSettings.barangay_secretary} (Barangay Secretary)</strong>
                    </div>
                    <div>
                      <span className="text-slate-700 block text-[11px]">Verified Citizen Address:</span>
                      <strong className="text-slate-900 font-medium">{selectedRequest.resident_address || systemSettings.barangay_name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-700 block text-[11px]">Certified Legal Purpose:</span>
                      <strong className="text-slate-900 font-medium">"{selectedRequest.purpose}"</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dry Seal & Control Number Checklist */}
              <div className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-950">
                <div className="font-bold flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-700" />
                  Standard Operating Procedure (SOP) Protocol:
                </div>
                <ul className="list-disc pl-5 space-y-1 text-amber-900 text-[11px]">
                  <li>Verify applicant identity and check blotter registry for any outstanding disputes.</li>
                  <li>Click <strong>Open Print Preview</strong> to generate the formatted document and send to printer.</li>
                  <li>Affix the official embossed dry seal over the Punong Barangay signature block.</li>
                  <li>Mark application as <strong>"Ready for Release"</strong> to automatically notify the citizen.</li>
                </ul>
              </div>

              {/* Staging Actions */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  Current Status: <StatusBadge status={selectedRequest.current_status} size="sm" />
                </div>

                {selectedRequest.current_status !== 'ready_for_release' && selectedRequest.current_status !== 'released' && (
                  <button
                    onClick={handleMarkReady}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center shadow-md transition cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5" />
                    Sign Off & Mark Ready for Release
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-700 text-xs">
              Select an application from the left queue to prepare official documents.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
