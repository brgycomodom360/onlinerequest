import React from 'react';
import { X, ShieldCheck, FileText, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { useBarangayStore } from '../hooks/useBarangayStore';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const { systemSettings } = useBarangayStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Privacy Notice & Citizen Consent</h3>
              <p className="text-xs text-slate-700">Republic Act No. 10173 — Data Privacy Act of 2012</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-600 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
            <strong>Barangay Official Notice:</strong> {systemSettings.barangay_name}, {systemSettings.city_municipality} is committed to protecting your personal data in accordance with the <strong>Philippine Data Privacy Act of 2012 (RA 10173)</strong> and National Privacy Commission (NPC) regulations.
          </div>

          <section>
            <h4 className="font-semibold text-slate-900 flex items-center mb-1">
              <FileText className="w-4 h-4 mr-1.5 text-blue-700" />
              1. Information We Collect
            </h4>
            <p>
              When requesting barangay certificates, clearances, or permits through Barangay360, we collect necessary personal details including your full legal name, permanent residential address, length of residency, civil status, contact information, government-issued identification cards, and proof of address.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 flex items-center mb-1">
              <UserCheck className="w-4 h-4 mr-1.5 text-blue-700" />
              2. Lawful Basis and Purpose of Processing
            </h4>
            <p>
              Under Section 12 of RA 10173, personal data is processed based on compliance with legal obligations and the performance of official governmental functions pursuant to the <strong>Local Government Code of 1991 (Republic Act No. 7160)</strong>, specifically:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-0.5 text-xs text-slate-600">
              <li>Verification of residency, citizenship, and identity within the barangay.</li>
              <li>Official issuance of Barangay Clearances, Certificates of Indigency, and Business Permits.</li>
              <li>Maintenance of the official Registry of Barangay Inhabitants (RBI).</li>
              <li>Emergency public service advisories and application status tracking.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 flex items-center mb-1">
              <Lock className="w-4 h-4 mr-1.5 text-blue-700" />
              3. Security and Storage Policy
            </h4>
            <p>
              All submitted supporting documents and identification scans are stored in encrypted, private storage repositories with strict Row-Level Security (RLS). Only accredited barangay screening personnel, the Barangay Secretary, and authorized system administrators are granted role-based access. Public indexing and external access are strictly prohibited.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 flex items-center mb-1">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
              4. Data Subject Rights & Data Protection Officer (DPO)
            </h4>
            <p>
              Under RA 10173, you retain the right to be informed, right of access, right to rectify inaccuracies, and right to object or request disposal upon completion of statutory retention schedules.
            </p>
            <div className="mt-2 p-3 bg-slate-100 rounded-xl text-xs space-y-1">
              <div className="font-medium text-slate-900">Barangay Data Protection Officer Contact:</div>
              <div>Office: Secretariat & MIS Unit, {systemSettings.hall_address}</div>
              <div>Official Inquiries Email: <span className="text-blue-800 font-mono">{systemSettings.privacy_officer_email}</span></div>
              <div>Telephone: {systemSettings.contact_phone}</div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm rounded-xl transition shadow-xs cursor-pointer"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
