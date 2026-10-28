export type UserRole = 'resident' | 'secretary' | 'admin';

export type RequestStatus = 
  | 'submitted'
  | 'under_review'
  | 'pending_requirements'
  | 'approved'
  | 'ready_for_release'
  | 'released'
  | 'rejected';

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  sitio_purok: string;
  complete_address: string;
  date_of_birth?: string;
  civil_status?: 'Single' | 'Married' | 'Widowed' | 'Separated';
  residency_years?: number;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface ServiceFormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface DocumentService {
  id: string;
  code: string;
  name: string;
  description: string;
  requirements: string[];
  form_fields: ServiceFormField[];
  fee: number;
  estimated_period: string;
  release_instructions: string;
  is_active: boolean;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface RequestAttachment {
  id: string;
  request_id: string;
  uploaded_by: string;
  private_storage_path: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  requirement_name?: string;
  uploaded_at: string;
  data_url?: string;
}

export interface RequestStatusHistory {
  id: string;
  request_id: string;
  previous_status?: RequestStatus;
  new_status: RequestStatus;
  changed_by: string;
  changed_by_name: string;
  changed_by_role: string;
  reason?: string;
  created_at: string;
}

export interface ReleaseDetails {
  released_by: string;
  release_date: string;
  release_mode: 'In-person Pickup' | 'Authorized Representative' | 'Special Delivery';
  or_number?: string;
  claimed_by_name?: string;
  remarks?: string;
}

export interface BarangayRequest {
  id: string;
  reference_number: string;
  resident_id: string;
  resident_name: string;
  resident_email: string;
  resident_phone?: string;
  resident_address?: string;
  document_service_id: string;
  service_name_snapshot: string;
  applicable_fee_snapshot: number;
  current_status: RequestStatus;
  purpose: string;
  custom_fields_data: Record<string, string | number | boolean>;
  assigned_staff_id?: string;
  assigned_staff_name?: string;
  internal_notes?: string;
  rejection_reason?: string;
  correction_instructions?: string;
  submission_timestamp: string;
  updated_at: string;
  completion_timestamp?: string;
  release_details?: ReleaseDetails;
  attachments: RequestAttachment[];
  status_history: RequestStatusHistory[];
}

export interface InAppNotification {
  id: string;
  recipient_id: string;
  request_id?: string;
  reference_number?: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  timestamp: string;
}

export interface DocumentRecord {
  id: string;
  request_id: string;
  reference_number: string;
  control_number: string;
  document_title: string;
  resident_name: string;
  issued_date: string;
  valid_until?: string;
  prepared_by?: string;
  approved_by?: string;
  released_by?: string;
  release_timestamp?: string;
  status: 'draft' | 'prepared' | 'ready' | 'released';
  printable_content: {
    official_header?: string;
    body_paragraphs: string[];
    certification_clause: string;
    signatory_captain: string;
    signatory_secretary: string;
    ctc_number?: string;
    ctc_issued_date?: string;
    ctc_issued_at?: string;
    or_number?: string;
    amount_paid?: number;
  };
}

export interface SystemSettings {
  barangay_name: string;
  city_municipality: string;
  province: string;
  barangay_captain: string;
  barangay_secretary: string;
  contact_phone: string;
  contact_email: string;
  office_hours: string;
  hall_address: string;
  privacy_officer_email: string;
  allow_walkin_pickup: boolean;
  emergency_announcement?: string;
  updated_at: string;
}
