import React from 'react';
import { X, HelpCircle, Phone, FileQuestion, AlertCircle, Clock, MapPin } from 'lucide-react';
import { useBarangayStore } from '../hooks/useBarangayStore';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { systemSettings } = useBarangayStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-900">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Citizen Helpdesk & FAQs</h3>
              <p className="text-xs text-slate-700">Official Barangay Service Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          
          {/* Emergency & Barangay Hotlines */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-blue-950 text-sm flex items-center">
              <Phone className="w-4 h-4 mr-1.5 text-blue-800" />
              Barangay Hall Emergency & Service Hotlines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-800">
              <div>Barangay Hall Desk: <strong>{systemSettings.contact_phone}</strong></div>
              <div>Tanod Peace & Order: <strong>0917-888-SAFE (7233)</strong></div>
              <div>BHERT / Health Center: <strong>(02) 8524-7788</strong></div>
              <div>Public Inquiries Email: <strong>{systemSettings.contact_email}</strong></div>
            </div>
          </div>

          {/* Citizen FAQs */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center">
              <FileQuestion className="w-4 h-4 mr-1.5 text-blue-800" />
              Frequently Asked Questions (Citizen Charter)
            </h4>

            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  1. Can I get a free clearance under Republic Act No. 11261?
                </strong>
                <p>
                  Yes! Under the <strong>First Time Jobseekers Assistance Act (RA 11261)</strong>, first-time job applicants are exempt from paying barangay clearance fees upon presentation of an oath of undertaking executed with the barangay.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  2. What should I bring when claiming my document?
                </strong>
                <p>
                  Bring your valid government-issued photo ID (front & back original), your application Reference Number (e.g. BRGY-2026-X8K92), and the exact fee indicated on your filing summary.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  3. What happens if officials request "Additional Requirements"?
                </strong>
                <p>
                  If an attachment is blurry or incomplete, your request will be marked <strong>"Action Needed"</strong>. Simply open your request in the "My Requests" tab, upload the clearer file in the correction box, and your application will automatically re-enter the review queue!
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">
                  4. Can an authorized representative claim my certificate?
                </strong>
                <p>
                  Yes. An immediate family member may claim on your behalf provided they present a signed authorization letter, your original valid ID, and their own valid government photo ID.
                </p>
              </div>
            </div>
          </div>

          {/* Office hours and physical location */}
          <div className="p-3.5 bg-slate-100 rounded-xl flex items-start space-x-3 text-slate-800">
            <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-slate-900">{systemSettings.barangay_name} Hall</strong>
              <span>{systemSettings.hall_address}</span>
              <div className="text-[11px] text-slate-700 mt-0.5 font-medium">Hours: {systemSettings.office_hours}</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium text-xs rounded-xl transition cursor-pointer"
          >
            Close Helpdesk
          </button>
        </div>

      </div>
    </div>
  );
};
