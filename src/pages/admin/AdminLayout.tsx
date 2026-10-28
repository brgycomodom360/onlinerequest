import React from 'react';
import { BarangayRequest } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { RequestManagement } from './RequestManagement';
import { DocumentServicesAdmin } from './DocumentServicesAdmin';
import { ResidentsAdmin } from './ResidentsAdmin';
import { DocumentPreparationAdmin } from './DocumentPreparationAdmin';
import { ReportsAdmin } from './ReportsAdmin';
import { BroadcastAdmin } from './BroadcastAdmin';
import { StaffPermissionsAdmin } from './StaffPermissionsAdmin';
import { AuditLogsAdmin } from './AuditLogsAdmin';
import { SystemSettingsAdmin } from './SystemSettingsAdmin';

interface AdminLayoutProps {
  onSelectRequest: (req: BarangayRequest) => void;
  onOpenCertificate: (req: BarangayRequest) => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  onSelectRequest,
  onOpenCertificate,
  activeSection,
  onSelectSection
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-100">
      {/* Main Administrative Workspace */}
      <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {activeSection === 'dashboard' && (
          <AdminDashboard
            onSelectRequest={onSelectRequest}
            onNavigateSection={onSelectSection}
            onOpenCertificate={onOpenCertificate}
          />
        )}

        {activeSection === 'requests' && (
          <RequestManagement
            onSelectRequest={onSelectRequest}
            onOpenCertificate={onOpenCertificate}
          />
        )}

        {activeSection === 'services' && (
          <DocumentServicesAdmin />
        )}

        {activeSection === 'residents' && (
          <ResidentsAdmin />
        )}

        {activeSection === 'preparation' && (
          <DocumentPreparationAdmin
            onOpenCertificate={onOpenCertificate}
            onSelectRequest={onSelectRequest}
          />
        )}

        {activeSection === 'reports' && (
          <ReportsAdmin />
        )}

        {activeSection === 'broadcast' && (
          <BroadcastAdmin />
        )}

        {activeSection === 'permissions' && (
          <StaffPermissionsAdmin />
        )}

        {activeSection === 'audit_logs' && (
          <AuditLogsAdmin />
        )}

        {activeSection === 'settings' && (
          <SystemSettingsAdmin />
        )}
      </div>
    </div>
  );
};
