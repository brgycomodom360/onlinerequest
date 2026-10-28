import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  FileText, 
  User, 
  Building2, 
  MapPin, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  MessageSquare, 
  Send,
  Eye,
  FileCheck
} from 'lucide-react';
import { BarangayRequest, RequestStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { useBarangayStore } from '../hooks/useBarangayStore';

interface RequestDetailModalProps {
  request: BarangayRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate?: (req: BarangayRequest) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({ 
  request, 
  isOpen, 
  onClose,
  onOpenCertificate 
}) => {
  const { isStaff, isSecretary, store, allProfiles } = useBarangayStore();

  // Local state for actions
  const [internalNoteText, setInternalNoteText] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [targetStatus, setTargetStatus] = useState<RequestStatus | ''>('');
  const [correctionFile, setCorrectionFile] = useState<File | null>(null);
  const [correctionRequirement, setCorrectionRequirement] = useState('Proof of Residency / Clarification');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Release recording form state
  const [idPresented, setIdPresented] = useState('PhilSys National ID');
  const [claimedByName, setClaimedByName] = useState(request?.resident_name || '');
  const [releaseMode, setReleaseMode] = useState<'In-person Pickup' | 'Authorized Representative' | 'Special Delivery'>('In-person Pickup');

  if (!isOpen || !request) return null;

  const staffMembers = allProfiles.filter(p => p.role === 'secretary' || p.role === 'admin');

  // Handle resident uploading requested correction
  const handleUploadCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionFile) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Simulate reading file
      const reader = new FileReader();
      reader.onload = () => {
        const res = store.uploadCorrection(request.id, {
          name: correctionFile.name,
          type: correctionFile.type || 'application/octet-stream',
          size: correctionFile.size,
          requirement_name: correctionRequirement,
          data_url: reader.result as string
        });

        setIsSubmitting(false);
        if (res.success) {
          setMessage({ text: 'Correction successfully uploaded! Your request is now returned to Under Review.', type: 'success' });
          setCorrectionFile(null);
        } else {
          setMessage({ text: res.error || 'Failed to upload correction', type: 'error' });
        }
      };
      reader.readAsDataURL(correctionFile);
    } catch {
      setIsSubmitting(false);
      setMessage({ text: 'Error uploading file', type: 'error' });
    }
  };

  // Handle staff updating status
  const handleUpdateStatus = () => {
    if (!targetStatus) return;
    if ((targetStatus === 'rejected' || targetStatus === 'pending_requirements') && !actionReason.trim()) {
      setMessage({ text: 'A detailed reason or instruction is required for rejections or corrections.', type: 'error' });
      return;
    }

    const res = store.updateRequestStatus({
      requestId: request.id,
      newStatus: targetStatus,
      reason: actionReason.trim() || `Status updated to ${targetStatus} by official`,
      correctionInstructions: targetStatus === 'pending_requirements' ? actionReason : undefined
    });

    if (res.success) {
      setMessage({ text: `Request successfully updated to ${targetStatus}!`, type: 'success' });
      setTargetStatus('');
      setActionReason('');
    } else {
      setMessage({ text: res.error || 'Failed to update status', type: 'error' });
    }
  };

  // Handle recording release
  const handleRecordRelease = () => {
    const res = store.recordRelease(request.id, {
      released_by: store.getCurrentUser().full_name,
      release_date: new Date().toISOString(),
      release_mode: releaseMode,
      claimed_by_name: claimedByName.trim() || request.resident_name,
      remarks: `Claimed in-person at Barangay Hall. ID Presented: ${idPresented.trim() || 'Verified Government ID'}`
    });

    if (res.success) {
      setMessage({ text: 'Official in-person release recorded successfully!', type: 'success' });
    } else {
      setMessage({ text: res.error || 'Failed to record release', type: 'error' });
    }
  };

  // Handle adding internal note
  const handleAddNote = () => {
    if (!internalNoteText.trim()) return;
    store.addInternalNote(request.id, internalNoteText.trim());
    setInternalNoteText('');
    setMessage({ text: 'Internal note saved.', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 gap-1">
            <span className="font-mono font-bold text-base sm:text-lg text-blue-950">
              {request.reference_number}
            </span>
            <StatusBadge status={request.current_status} size="md" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {message && (
          <div className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'
          }`}>
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-2">×</button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Prominent In-Person Pickup Notice */}
          {request.current_status === 'ready_for_release' && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-1.5 shadow-xs">
              <div className="flex items-center space-x-2 text-emerald-950 font-bold text-sm">
                <Building2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Ready for In-Person Pickup at Barangay Hall! 🏛️</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Your official document has been verified, prepared, and stamped with the Barangay dry seal. Please visit the Barangay Hall in person during regular office hours (Mon-Fri 8:00 AM - 5:00 PM). Present 1 valid government ID to receive your physical document.
              </p>
            </div>
          )}

          {/* Top Quick Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-700 block">Requested Document</span>
              <strong className="text-slate-900 font-semibold">{request.service_name_snapshot}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-700 block">Applicant</span>
              <strong className="text-slate-900 font-semibold flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-slate-600" />
                {request.resident_name}
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-700 block">Claiming Mode</span>
              <strong className="text-blue-900 font-semibold flex items-center">
                <Building2 className="w-3.5 h-3.5 mr-1 text-blue-700" />
                In-Person Pickup at Hall
              </strong>
            </div>
            <div>
              <span className="text-xs text-slate-700 block">Date Submitted</span>
              <span className="text-xs text-slate-700 flex items-center mt-0.5">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-600" />
                {new Date(request.submission_timestamp).toLocaleString('en-PH')}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-700 block">Contact Phone</span>
              <span className="text-xs text-slate-700">{request.resident_phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-700 block">Assigned Official</span>
              <span className="text-xs font-medium text-blue-900">
                {request.assigned_staff_name || 'Unassigned / Queue'}
              </span>
            </div>
          </div>

          {/* Stated Purpose & Specific Fields */}
          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Application Purpose & Details</h4>
            <p className="text-slate-800 font-medium">"{request.purpose}"</p>
            {request.custom_fields_data && Object.keys(request.custom_fields_data).length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(request.custom_fields_data).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-700 capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    <strong className="text-slate-800">{String(val)}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Needed / Correction Instructions Banner */}
          {request.current_status === 'pending_requirements' && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Barangay Official Instructions: Action Needed</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {request.correction_instructions || request.rejection_reason || 'Please supply the missing or clearer verification documents requested below.'}
              </p>

              {/* Resident Correction Upload Form */}
              <form onSubmit={handleUploadCorrection} className="mt-3 pt-3 border-t border-amber-200 space-y-3">
                <div className="text-xs font-semibold text-amber-950">Upload Corrected Document / ID:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={correctionRequirement}
                    onChange={(e) => setCorrectionRequirement(e.target.value)}
                    placeholder="Requirement Name (e.g. Valid ID Front)"
                    className="text-xs px-3 py-2 bg-white border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    required
                  />
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setCorrectionFile(e.target.files ? e.target.files[0] : null)}
                    className="text-xs px-2 py-1.5 bg-white border border-amber-300 rounded-lg file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !correctionFile}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center transition shadow-xs cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  {isSubmitting ? 'Uploading...' : 'Submit Corrected Requirement'}
                </button>
              </form>
            </div>
          )}

          {/* Submitted Attachments */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-blue-800" />
              Uploaded Supporting Requirements ({request.attachments.length})
            </h4>
            {request.attachments.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No attachments submitted for this service.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {request.attachments.map((att) => (
                  <div key={att.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div className="truncate mr-2">
                      <div className="font-semibold text-slate-800 truncate">{att.original_filename}</div>
                      <div className="text-[11px] text-slate-600">
                        {att.requirement_name || 'Requirement'} • {(att.file_size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                    {att.data_url ? (
                      <a
                        href={att.data_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-[11px] font-medium flex items-center shrink-0 transition"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Preview
                      </a>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[10px] shrink-0">
                        Encrypted RLS
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Release Voucher / Ready for Pickup Info */}
          {(request.current_status === 'ready_for_release' || request.current_status === 'released') && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>{request.current_status === 'released' ? 'Officially Released' : 'Ready for Releasing'}</span>
                </div>
                {onOpenCertificate && (
                  <button
                    onClick={() => onOpenCertificate(request)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center transition shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    Preview & Print Certificate
                  </button>
                )}
              </div>
              <p className="text-xs text-emerald-800">
                {request.release_details 
                  ? `Released on ${new Date(request.release_details.release_date).toLocaleString('en-PH')} to ${request.release_details.claimed_by_name} via ${request.release_details.release_mode}. Official Receipt No: ${request.release_details.or_number}`
                  : 'Document has been approved and prepared. Present this reference number at the Barangay Hall releasing counter.'}
              </p>
            </div>
          )}

          {/* Status Timeline History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Application Tracking Timeline</h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {request.status_history.map((hist) => (
                <div key={hist.id} className="relative group">
                  <div className="absolute -left-[1.625rem] top-1 w-3 h-3 rounded-full bg-blue-800 border-2 border-white ring-2 ring-slate-100" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-900 capitalize">
                      {hist.new_status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      {new Date(hist.created_at).toLocaleString('en-PH')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">{hist.reason}</p>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Updated by: <span className="font-medium text-slate-700">{hist.changed_by_name}</span> ({hist.changed_by_role})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes Section (Official / Secretary / Admin Only) */}
          {isStaff && (
            <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                <MessageSquare className="w-4 h-4 text-blue-800" />
                <span>Internal Official Notes & Records (Confidential)</span>
              </div>
              {request.internal_notes ? (
                <div className="p-3 bg-white rounded-lg text-xs font-mono whitespace-pre-line text-slate-700 border border-slate-200">
                  {request.internal_notes}
                </div>
              ) : (
                <p className="text-xs text-slate-600 italic">No internal notes recorded yet.</p>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={internalNoteText}
                  onChange={(e) => setInternalNoteText(e.target.value)}
                  placeholder="Add confidential officer note..."
                  className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {/* Official Workflow Actions Drawer (Secretary / Admin Only) */}
          {isStaff && (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center">
                <FileCheck className="w-4 h-4 mr-1 text-blue-800" />
                Official Processing Actions
              </h4>

              {/* Status Update Controller */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Set Request Status:</label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as RequestStatus)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Next Status...</option>
                    <option value="under_review">Under Review (Begin Screening)</option>
                    <option value="pending_requirements">Request Additional Requirements</option>
                    {isSecretary && <option value="approved">Approve Application</option>}
                    <option value="ready_for_release">Ready for Release (Document Printed)</option>
                    {isSecretary && <option value="rejected">Decline / Reject Application</option>}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Reason / Resident Instructions:</label>
                  <input
                    type="text"
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder="Enter reason or instructions for applicant..."
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {targetStatus && (
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center transition shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Confirm Status Change to {targetStatus.replace(/_/g, ' ').toUpperCase()}
                </button>
              )}

              {/* Record Release Controller if ready */}
              {request.current_status === 'ready_for_release' && (
                <div className="pt-3 border-t border-blue-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800">Record Official Document Release:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={claimedByName}
                      onChange={(e) => setClaimedByName(e.target.value)}
                      placeholder="Claimed by (Full Name)"
                      className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={idPresented}
                      onChange={(e) => setIdPresented(e.target.value)}
                      placeholder="Valid ID Presented (e.g. PhilSys ID)"
                      className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                    <select
                      value={releaseMode}
                      onChange={(e) => setReleaseMode(e.target.value as any)}
                      className="text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    >
                      <option value="In-person Pickup">In-person Pickup at Hall</option>
                      <option value="Authorized Representative">Authorized Representative</option>
                    </select>
                  </div>
                  <button
                    onClick={handleRecordRelease}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center transition shadow-xs cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Record Release & Complete Request
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <div className="text-xs text-slate-600">
            Reference: <strong className="font-mono text-slate-800">{request.reference_number}</strong>
          </div>
          <div className="flex space-x-2">
            {onOpenCertificate && (request.current_status === 'approved' || request.current_status === 'ready_for_release' || request.current_status === 'released') && (
              <button
                onClick={() => onOpenCertificate(request)}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl flex items-center transition shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                Preview Certificate
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-xl transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
