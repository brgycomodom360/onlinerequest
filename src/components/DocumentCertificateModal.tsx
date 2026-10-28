import React from 'react';
import { X, Printer, Download, CheckCircle, Shield, Award } from 'lucide-react';
import { BarangayRequest } from '../types';
import { useBarangayStore } from '../hooks/useBarangayStore';

interface DocumentCertificateModalProps {
  request: BarangayRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentCertificateModal: React.FC<DocumentCertificateModalProps> = ({ request, isOpen, onClose }) => {
  const { systemSettings } = useBarangayStore();

  if (!isOpen || !request) return null;

  const controlNumber = `CTRL-${new Date().getFullYear()}-${request.reference_number.slice(-5)}`;
  const formattedDate = new Date().toLocaleDateString('en-PH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:my-0">
        {/* Modal Top Bar - hidden on print */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white rounded-t-2xl print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Official Document Preview & Print</h3>
              <p className="text-xs text-slate-300">Control No: {controlNumber} | Ref: {request.reference_number}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="p-6 sm:p-12 overflow-y-auto print:overflow-visible print:p-8 bg-amber-50/20 font-serif relative">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div className="w-96 h-96 border-12 border-blue-900 rounded-full flex items-center justify-center text-center font-bold text-4xl text-blue-950 uppercase p-8">
              Official Seal of {systemSettings.barangay_name}
            </div>
          </div>

          {/* Certificate Header */}
          <div className="border-b-2 border-double border-slate-800 pb-4 mb-6 relative">
            <div className="flex items-center justify-between text-center">
              {/* Left Logo Placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-900 flex items-center justify-center text-white border-2 border-amber-400 shadow-xs shrink-0">
                <Shield className="w-10 h-10 text-amber-300" />
              </div>

              {/* Header Text */}
              <div className="px-2">
                <p className="text-xs tracking-widest text-slate-700 uppercase">Republic of the Philippines</p>
                <p className="text-xs tracking-wider text-slate-700">{systemSettings.province}</p>
                <p className="text-xs font-semibold text-slate-800 uppercase">{systemSettings.city_municipality}</p>
                <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-wide mt-1">
                  {systemSettings.barangay_name}
                </h1>
                <p className="text-xs italic text-blue-900 font-sans font-medium mt-0.5">
                  Office of the Punong Barangay & Sangguniang Barangay
                </p>
                <p className="text-[11px] text-slate-700 font-sans">{systemSettings.hall_address} • Tel: {systemSettings.contact_phone}</p>
              </div>

              {/* Right Seal Placeholder */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 flex items-center justify-center text-white border-2 border-amber-400 shadow-xs shrink-0">
                <Award className="w-10 h-10 text-amber-300" />
              </div>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="text-center my-6">
            <span className="text-xs font-sans tracking-widest uppercase text-slate-600 block mb-1">
              Control No: <strong className="font-mono text-slate-900">{controlNumber}</strong>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-blue-950 tracking-wider inline-block border-b-2 border-blue-950 pb-1">
              {request.service_name_snapshot}
            </h2>
          </div>

          {/* Greeting */}
          <div className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide mb-4">
            TO WHOM IT MAY CONCERN:
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-sm sm:text-base text-slate-800 leading-relaxed text-justify">
            <p className="indent-8">
              THIS IS TO CERTIFY that <strong className="uppercase underline underline-offset-4 font-bold text-slate-950">{request.resident_name}</strong>, 
              of legal age, Filipino citizen, is a bonafide resident of <strong>{request.resident_address || systemSettings.barangay_name}</strong>, and is known to be a person of good moral character and standing in this community.
            </p>

            {request.document_service_id === 'srv-1' && (
              <p className="indent-8">
                Based on the official records of this office, the aforementioned individual has <strong>NO DEROGATORY RECORD</strong> or pending criminal, civil, or administrative complaint filed before the Lupong Tagapamayapa of this Barangay.
              </p>
            )}

            {request.document_service_id === 'srv-3' && (
              <p className="indent-8">
                FURTHER CERTIFIES that the subject person belongs to the <strong>INDIGENT / LOW-INCOME</strong> family of this barangay and is qualified for financial, medical, or social welfare assistance in accordance with government laws and guidelines.
              </p>
            )}

            {request.document_service_id === 'srv-4' && (
              <p className="indent-8">
                THIS BARANGAY CLEARANCE is hereby granted for the commercial operation of <strong className="uppercase font-bold">{String(request.custom_fields_data.business_name || 'Commercial Establishment')}</strong>, located within this jurisdiction, subject to all existing laws, municipal ordinances, and environmental regulations.
              </p>
            )}

            <p className="indent-8">
              This certification is issued upon the request of the interested party for the specific purpose of:
            </p>

            <div className="p-3 bg-blue-50/60 border-l-4 border-blue-900 font-sans text-sm font-semibold text-blue-950 uppercase mx-4">
              "{request.purpose}"
            </div>

            <p className="indent-8">
              GIVEN and SIGNED this <strong>{formattedDate}</strong> at the Office of the Punong Barangay, {systemSettings.barangay_name}, {systemSettings.city_municipality}, Philippines.
            </p>
          </div>

          {/* Signatures & Seal Section */}
          <div className="mt-12 pt-4 grid grid-cols-2 gap-8 items-end">
            <div>
              <div className="text-xs font-sans text-slate-700 mb-6">Prepared & Verified by:</div>
              <div className="font-bold text-sm sm:text-base text-slate-950 underline underline-offset-4 uppercase">
                {request.assigned_staff_name || systemSettings.barangay_secretary}
              </div>
              <div className="text-xs text-slate-700 font-sans">Barangay Secretary / Authorized Officer</div>
              <div className="mt-3 text-[11px] font-sans text-slate-700 space-y-0.5">
                <div>Control / Tracking No.: <strong>{request.reference_number}</strong></div>
                <div>Issuance Mode: <strong>In-Person Pickup at Barangay Hall</strong></div>
                <div>Document Status: <strong>Official & Verified</strong></div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-sans text-slate-700 mb-6">Approved & Issued by:</div>
              <div className="font-bold text-sm sm:text-base text-blue-950 underline underline-offset-4 uppercase">
                {systemSettings.barangay_captain}
              </div>
              <div className="text-xs font-semibold text-slate-800 font-sans">Punong Barangay</div>

              {/* Dry Seal Box */}
              <div className="mt-4 inline-block p-3 border border-dashed border-slate-400 rounded-lg text-center font-sans">
                <div className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">[ OFFICIAL DRY SEAL ]</div>
                <div className="text-[9px] text-slate-600 italic">Not valid without official dry seal</div>
              </div>
            </div>
          </div>

          {/* QR Verification & Disclaimer Footer */}
          <div className="mt-10 pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] font-sans text-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center font-mono text-[9px] font-bold p-1 rounded-sm">
                QR-STUB
              </div>
              <div>
                <p className="font-bold text-slate-900">VERIFY AUTHENTICITY VIA BARANGAY360</p>
                <p>Tracking Reference: <span className="font-mono font-semibold">{request.reference_number}</span></p>
                <p className="text-[10px] text-slate-600">Tampering or altering this document is punishable under the Revised Penal Code.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center text-emerald-800 font-semibold text-xs">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                OFFICIAL RECORD
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between rounded-b-2xl print:hidden">
          <p className="text-xs text-slate-600">
            Tip: Press <strong>Print / Save as PDF</strong> to generate high-resolution official hard copies.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-xl transition"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl flex items-center shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Print Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
