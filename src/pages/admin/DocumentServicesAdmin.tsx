import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Clock, 
  Shield, 
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useBarangayStore } from '../../hooks/useBarangayStore';
import { DocumentService } from '../../types';

export const DocumentServicesAdmin: React.FC = () => {
  const { services, store } = useBarangayStore();
  const [editingService, setEditingService] = useState<DocumentService | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedPeriod, setEstimatedPeriod] = useState('1 to 2 working days');
  const [releaseInstructions, setReleaseInstructions] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [requirementsText, setRequirementsText] = useState('');

  const startEdit = (srv: DocumentService) => {
    setEditingService(srv);
    setIsCreating(false);
    setName(srv.name);
    setCode(srv.code);
    setDescription(srv.description);
    setEstimatedPeriod(srv.estimated_period);
    setReleaseInstructions(srv.release_instructions);
    setIsActive(srv.is_active);
    setRequirementsText(srv.requirements.join('\n'));
  };

  const startCreate = () => {
    setEditingService(null);
    setIsCreating(true);
    setName('');
    setCode(`SRV-${Date.now().toString().slice(-4)}`);
    setDescription('');
    setEstimatedPeriod('1 to 2 working days');
    setReleaseInstructions('Claimable at Barangay Hall releasing counter upon presenting valid ID.');
    setIsActive(true);
    setRequirementsText('Valid Government ID\nProof of Residency');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = requirementsText.split('\n').map(s => s.trim()).filter(Boolean);

    const srv: DocumentService = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      requirements: requirements.length > 0 ? requirements : ['Valid Government Issued ID'],
      form_fields: editingService?.form_fields || [
        { name: 'purpose', label: 'Purpose of Request', type: 'text', required: true, placeholder: 'e.g. Employment, Identification' }
      ],
      fee: 0,
      estimated_period: estimatedPeriod.trim(),
      release_instructions: releaseInstructions.trim(),
      is_active: isActive,
      created_at: editingService ? editingService.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.saveDocumentService(srv);
    setEditingService(null);
    setIsCreating(false);
    setSuccessMsg(`Document service "${srv.name}" saved successfully.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleToggleActive = (srv: DocumentService) => {
    store.saveDocumentService({
      ...srv,
      is_active: !srv.is_active
    });
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Document Services Configuration</h1>
          <p className="text-xs text-slate-700 mt-0.5">
            Configure certificate types, approved legal fees, documentary requirements, and turnaround periods.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs rounded-xl flex items-center transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Certificate Service
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Editor Modal / Card if editing or creating */}
      {(editingService || isCreating) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border-2 border-blue-400 shadow-lg space-y-4 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm">
              {isCreating ? 'Create New Barangay Document Service' : `Edit Service: ${editingService?.name}`}
            </h2>
            <button
              type="button"
              onClick={() => { setEditingService(null); setIsCreating(false); }}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Service Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Certificate of Residency"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Service Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CERT-RES"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white uppercase font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Description & Legal Purpose</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the certificate and what legal transactions require it..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estimated Turnaround</label>
              <input
                type="text"
                value={estimatedPeriod}
                onChange={(e) => setEstimatedPeriod(e.target.value)}
                placeholder="e.g. 1 to 2 working days"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Availability Status</label>
              <select
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              >
                <option value="active">Active & Available Online</option>
                <option value="inactive">Temporarily Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Required Attachments (Enter one requirement per line)
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="Valid Government ID&#10;Proof of Residency&#10;2x2 Photograph"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white font-mono text-[11px]"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Releasing & Pickup Instructions</label>
            <input
              type="text"
              value={releaseInstructions}
              onChange={(e) => setReleaseInstructions(e.target.value)}
              placeholder="e.g. Claimable at Counter 1. Bring exact fee and valid ID."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setEditingService(null); setIsCreating(false); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs"
            >
              Save Service Configuration
            </button>
          </div>
        </form>
      )}

      {/* Services List Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`p-5 rounded-2xl border transition shadow-xs flex flex-col justify-between ${
              srv.is_active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-300 opacity-75'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md">
                      {srv.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      srv.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {srv.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1.5">{srv.name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 block">
                    Online Request
                  </span>
                  <span className="text-[10px] text-slate-600 block mt-0.5">{srv.estimated_period}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {srv.description}
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                <strong className="text-slate-800 block">Requirements ({srv.requirements.length}):</strong>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                  {srv.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggleActive(srv)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                  srv.is_active
                    ? 'text-amber-800 hover:bg-amber-50'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {srv.is_active ? 'Disable Service' : 'Enable Service'}
              </button>

              <button
                type="button"
                onClick={() => startEdit(srv)}
                className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center transition shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                Edit Settings
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
