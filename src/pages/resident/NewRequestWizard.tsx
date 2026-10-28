import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Printer, 
  FileCheck2,
  CheckSquare
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { DocumentService, BarangayRequest } from '../../types';

interface NewRequestWizardProps {
  initialService?: DocumentService | null;
  onFinish: (req: BarangayRequest) => void;
  onCancel: () => void;
  onOpenPrivacy: () => void;
}

export const NewRequestWizard: React.FC<NewRequestWizardProps> = ({
  initialService,
  onFinish,
  onCancel,
  onOpenPrivacy
}) => {
  const { currentUser, activeServices, store, systemSettings } = useBarangayStore();

  const [step, setStep] = useState<number>(initialService ? 2 : 1);
  const [selectedService, setSelectedService] = useState<DocumentService | null>(initialService || activeServices[0] || null);

  // Form Fields State
  const [purpose, setPurpose] = useState('');
  const [customFields, setCustomFields] = useState<Record<string, string | number | boolean>>({
    residency_duration: currentUser?.residency_years || 3,
    sitio_street: currentUser?.sitio_purok || '',
    complete_address: currentUser?.complete_address || ''
  });

  // Attachments State
  interface UploadItem {
    id: string;
    requirement_name: string;
    file: File;
    data_url?: string;
  }
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalDeclarationAgreed, setLegalDeclarationAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Final Submitted Request
  const [submittedRequest, setSubmittedRequest] = useState<BarangayRequest | null>(null);

  // File Upload Handler
  const handleFileSelect = (requirementName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(`File ${file.name} is too large. Maximum allowed size is 10MB.`);
      return;
    }

    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = () => {
      const newItem: UploadItem = {
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        requirement_name: requirementName,
        file,
        data_url: reader.result as string
      };

      // Replace if same requirement or add
      setUploads(prev => [...prev.filter(u => u.requirement_name !== requirementName), newItem]);
    };
    reader.readAsDataURL(file);
  };

  const removeUpload = (requirementName: string) => {
    setUploads(prev => prev.filter(u => u.requirement_name !== requirementName));
  };

  // Submit Request Handler
  const handleSubmitRequest = () => {
    if (!selectedService) return;
    if (!legalDeclarationAgreed) {
      setErrorMessage('Please confirm the legal declaration before submitting your application.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const created = store.createRequest({
        service: selectedService,
        purpose: purpose || 'Official Barangay Requirement',
        customFields: customFields,
        attachments: uploads.map(u => ({
          name: u.file.name,
          type: u.file.type || 'application/octet-stream',
          size: u.file.size,
          requirement_name: u.requirement_name,
          data_url: u.data_url
        }))
      });

      setSubmittedRequest(created);
      setStep(5); // Success step
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to submit request. Please try again.');
    }
  };

  // SUCCESS STEP VIEW
  if (step === 5 && submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Request Received Successfully
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Application Reference Number
            </h2>
          </div>

          {/* Reference Number Card */}
          <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl max-w-md mx-auto">
            <div className="text-xs text-blue-800 uppercase tracking-widest font-semibold">Keep this reference code:</div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-blue-950 mt-1 tracking-wider selection:bg-amber-300">
              {submittedRequest.reference_number}
            </div>
            <p className="text-[11px] text-blue-800 mt-1">
              A confirmation notification has been sent to your account.
            </p>
          </div>

          {/* Quick Summary */}
          <div className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl max-w-md mx-auto text-left space-y-1.5 border border-slate-200">
            <div><strong>Service:</strong> {submittedRequest.service_name_snapshot}</div>
            <div><strong>Applicant:</strong> {submittedRequest.resident_name}</div>
            <div><strong>Filing Method:</strong> Online Submission</div>
            <div><strong>Claiming Method:</strong> In-Person Pickup at Barangay Hall</div>
            <div><strong>Estimated Turnaround:</strong> {selectedService?.estimated_period}</div>
            <div><strong>Initial Status:</strong> <span className="font-semibold text-slate-900">Submitted (Awaiting Official Review)</span></div>
          </div>

          {/* Next Steps */}
          <div className="text-left bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5">
            <h4 className="font-bold flex items-center text-emerald-900 text-sm">
              <AlertCircle className="w-4 h-4 mr-1.5 text-emerald-700" />
              In-Person Pickup Instructions
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-emerald-900">
              <li>Our screener will verify your residency records and supporting attachments.</li>
              <li>Track your application anytime in <strong>My Requests</strong> on your phone.</li>
              <li>Once marked <strong className="bg-emerald-200 px-1.5 py-0.5 rounded text-emerald-950 font-bold">"Ready for Pickup"</strong>, visit the Barangay Hall in person with your valid ID to claim your official physical document.</li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onFinish(submittedRequest)}
              className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center"
            >
              <FileCheck2 className="w-4 h-4 mr-2" />
              View Application in My Requests
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition flex items-center justify-center cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Filing Slip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-8">
      
      {/* Wizard Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onCancel}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Online Barangay Document Request</h1>
              <p className="text-xs text-slate-700">Official e-Governance Service Portal</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-900 rounded-lg">
            Step {step} of 4
          </span>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Document' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Upload' },
            { num: 4, label: 'Review' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                step === s.num
                  ? 'bg-blue-900 text-white ring-2 ring-blue-200'
                  : step > s.num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {step > s.num ? <CheckSquare className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[11px] mt-1 hidden sm:block ${step === s.num ? 'font-bold text-blue-950' : 'text-slate-700'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="font-bold text-slate-400 hover:text-slate-600">×</button>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: SELECT DOCUMENT SERVICE */}
      {/* ======================================================== */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">Select the Barangay Document You Need</h2>
            <p className="text-xs text-slate-700 mt-0.5">Fees and processing times are set according to local barangay tax ordinance.</p>
          </div>

          <div className="space-y-3">
            {activeServices.map((srv) => {
              const isSelected = selectedService?.id === srv.id;
              return (
                <div
                  key={srv.id}
                  onClick={() => setSelectedService(srv)}
                  className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-900 text-base">{srv.name}</h3>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{srv.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 pt-1">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-700" />
                        Turnaround: {srv.estimated_period}
                      </span>
                      <span>•</span>
                      <span>{srv.requirements.length} required attachment{srv.requirements.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 block">
                        Online Request
                      </span>
                      <span className="text-[10px] text-slate-600 block mt-0.5">Pickup at Brgy</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedService(srv);
                        setStep(2);
                      }}
                      className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center cursor-pointer ${
                        isSelected
                          ? 'bg-blue-900 text-white hover:bg-blue-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Choose This
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              disabled={!selectedService}
              onClick={() => setStep(2)}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center shadow-xs cursor-pointer"
            >
              Continue to Information Form
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: ENTER REQUEST INFORMATION */}
      {/* ======================================================== */}
      {step === 2 && selectedService && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <span className="text-xs font-semibold text-blue-900 uppercase">Selected Service</span>
              <h2 className="text-lg font-bold text-slate-900">{selectedService.name}</h2>
              <p className="text-xs text-slate-700 mt-0.5">{selectedService.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-4 text-xs">
              {/* Prefilled Profile Information */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="font-semibold text-slate-700 block">Applicant Profile Data (Prefilled):</span>
                <div className="text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>Name: <strong>{currentUser?.full_name}</strong></div>
                  <div>Contact: <strong>{currentUser?.mobile_number}</strong></div>
                  <div>Address: <strong>{currentUser?.complete_address}</strong></div>
                  <div>Purok: <strong>{currentUser?.sitio_purok}</strong></div>
                </div>
              </div>

              {/* Specific Purpose */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Specific Purpose / Reason for Request <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Local Employment, Postal ID, Hospital Assistance"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  required
                />
              </div>

              {/* Service-Specific Dynamic Form Fields */}
              {selectedService.form_fields.map((field) => (
                <div key={field.name}>
                  <label className="font-semibold text-slate-800 block mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>

                  {field.type === 'select' && field.options ? (
                    <select
                      value={String(customFields[field.name] || '')}
                      onChange={(e) => setCustomFields({ ...customFields, [field.name]: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                      required={field.required}
                    >
                      <option value="">Select option...</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'number' ? (
                    <input
                      type="number"
                      value={String(customFields[field.name] || '')}
                      onChange={(e) => setCustomFields({ ...customFields, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                      required={field.required}
                    />
                  ) : (
                    <input
                      type="text"
                      value={String(customFields[field.name] || '')}
                      onChange={(e) => setCustomFields({ ...customFields, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white"
                      required={field.required}
                    />
                  )}
                  {field.helperText && <p className="text-[11px] text-slate-700 mt-1">{field.helperText}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Back
            </button>
            <button
              disabled={!purpose.trim()}
              onClick={() => {
                if (!purpose.trim()) {
                  setErrorMessage('Please state the purpose for this request.');
                  return;
                }
                setErrorMessage(null);
                setStep(3);
              }}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center shadow-xs cursor-pointer"
            >
              Continue to Upload Requirements
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: UPLOAD REQUIREMENTS */}
      {/* ======================================================== */}
      {step === 3 && selectedService && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <h2 className="font-bold text-slate-900 text-base">Supporting Documents & Identification</h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              Upload clear photographs or PDF scans of the following requirements. Files are encrypted and protected under Philippine RA 10173.
            </p>
          </div>

          <div className="space-y-3">
            {selectedService.requirements.map((reqName, idx) => {
              const uploaded = uploads.find(u => u.requirement_name === reqName);

              return (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-xs flex items-center">
                        <CheckSquare className="w-4 h-4 mr-1.5 text-blue-900" />
                        Requirement #{idx + 1}: {reqName}
                      </span>
                      <span className="text-[11px] text-slate-700 block mt-0.5">
                        Acceptable formats: JPG, PNG, PDF (Up to 10MB)
                      </span>
                    </div>

                    {uploaded ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-md text-[10px] flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-medium rounded-md text-[10px]">
                        Required
                      </span>
                    )}
                  </div>

                  {uploaded ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div className="truncate mr-2">
                        <span className="font-semibold text-slate-800 truncate block">{uploaded.file.name}</span>
                        <span className="text-[11px] text-slate-700">{(uploaded.file.size / 1024).toFixed(0)} KB</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeUpload(reqName)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Remove attachment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <label className="flex items-center justify-center border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition">
                        <Upload className="w-4 h-4 mr-2 text-blue-900" />
                        <span className="text-xs font-semibold text-slate-700">Choose File or Take Photo</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileSelect(reqName, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Back
            </button>
            <button
              onClick={() => {
                setErrorMessage(null);
                setStep(4);
              }}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center shadow-xs cursor-pointer"
            >
              Continue to Review & Confirm
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: REVIEW AND SUBMIT */}
      {/* ======================================================== */}
      {step === 4 && selectedService && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-blue-900 uppercase">Step 4 of 4: Final Verification</span>
              <h2 className="text-lg font-black text-slate-900">Review Application Summary</h2>
              <p className="text-xs text-slate-700 mt-0.5">
                Please verify all submitted information. Upon submission, a unique tracking reference number will be generated.
              </p>
            </div>

            {/* Document & Service Summary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Document Type:</span>
                <strong className="text-slate-900 text-sm">{selectedService.name}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Claiming Mode:</span>
                <strong className="text-blue-900 text-xs font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  In-Person Pickup at Barangay Hall
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Estimated Turnaround:</span>
                <span className="text-slate-800">{selectedService.estimated_period}</span>
              </div>
            </div>

            {/* Applicant & Purpose Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Submitted Details:</h4>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <div>Applicant Legal Name: <strong>{currentUser?.full_name}</strong></div>
                <div>Contact Phone: <strong>{currentUser?.mobile_number}</strong></div>
                <div>Complete Address: <strong>{currentUser?.complete_address}</strong></div>
                <div>Purpose: <strong className="text-blue-950">"{purpose}"</strong></div>
              </div>
            </div>

            {/* Attachments List */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Attached Files ({uploads.length}):
              </h4>
              {uploads.length === 0 ? (
                <p className="text-slate-600 italic">No attachments uploaded (applicant must present physical IDs at counter).</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {uploads.map(u => (
                    <li key={u.id}>
                      <strong>{u.requirement_name}:</strong> {u.file.name} ({(u.file.size / 1024).toFixed(0)} KB)
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pickup & Release Notice */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs leading-relaxed space-y-1">
              <strong className="font-bold flex items-center text-emerald-900">
                🏛️ In-Person Pickup Notice:
              </strong>
              <p>
                Online submission is strictly for application processing and status tracking. When your status is updated to <strong>"Ready for Pickup"</strong>, proceed in person to the Barangay Hall with your valid ID to claim your physical document.
              </p>
            </div>

            {/* Legal Oath & Consent */}
            <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalDeclarationAgreed}
                  onChange={(e) => setLegalDeclarationAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-blue-900 focus:ring-blue-500"
                  required
                />
                <span className="text-[11px] text-amber-950 leading-snug">
                  <strong>CITIZEN DECLARATION UNDER OATH:</strong> I hereby certify under penalty of perjury and falsification of public documents under Article 171/172 of the Revised Penal Code that all information submitted herein is true, accurate, and correct. I authorize the Barangay Government to verify my records against the official blotter and RBI registry pursuant to{' '}
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="underline text-blue-800 font-bold hover:text-blue-950"
                  >
                    RA 10173 (Data Privacy Act)
                  </button>.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Back
            </button>
            <button
              disabled={isSubmitting || !legalDeclarationAgreed}
              onClick={handleSubmitRequest}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black rounded-xl flex items-center shadow-lg transition active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting to Barangay...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Confirm & Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
