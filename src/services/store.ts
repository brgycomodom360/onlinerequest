import { 
  Profile, 
  DocumentService, 
  BarangayRequest, 
  RequestAttachment, 
  RequestStatusHistory, 
  InAppNotification, 
  AuditLog, 
  DocumentRecord, 
  SystemSettings, 
  RequestStatus, 
  ReleaseDetails 
} from '../types';

const STORAGE_KEY_PREFIX = 'barangay360_data_';

// Initial Demo Document Services
const DEFAULT_SERVICES: DocumentService[] = [
  {
    id: 'srv-1',
    code: 'CLR-BRGY',
    name: 'Barangay Clearance',
    description: 'Official clearance certifying good citizenship, residency, and no derogatory record. Required for local employment, postal ID, police clearance, and bank accounts.',
    requirements: [
      'Valid Government Issued ID (Front & Back)',
      'Proof of Residency (Utility Bill or Barangay Voter stub)',
      'Recent 2x2 colored photograph with white background'
    ],
    form_fields: [
      { name: 'purpose', label: 'Specific Purpose of Clearance', type: 'select', required: true, options: ['Local Employment', 'Postal ID Application', 'Bank Account Opening', 'Police Clearance Requirement', 'NBI Clearance Requirement', 'Senior Citizen ID', 'Other Personal Transaction'] },
      { name: 'residency_duration', label: 'Length of Stay in Barangay (Years)', type: 'number', required: true, placeholder: 'e.g. 5' }
    ],
    fee: 0,
    estimated_period: '1 to 2 working days',
    release_instructions: 'Claimable in person at Counter 1, Barangay Hall once status is Ready for Pickup. Bring 1 valid ID.',
    is_active: true,
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'srv-2',
    code: 'CERT-RES',
    name: 'Certificate of Residency',
    description: 'Certifies that the applicant is a bona fide resident living at the specified address within the barangay jurisdiction.',
    requirements: [
      'Valid Government-Issued ID with current address',
      'Proof of billing or notarized certification from house owner / landlord'
    ],
    form_fields: [
      { name: 'purpose', label: 'Purpose of Certificate', type: 'select', required: true, options: ['School Admission / Enrollment', 'Driver License Application', 'Water / Electric Service Connection', 'Solo Parent Application', 'Affidavit Requirement', 'Other'] },
      { name: 'sitio_street', label: 'Sitio / Street / Purok', type: 'text', required: true, placeholder: 'e.g. Purok 3, Mabini Street' },
      { name: 'living_with', label: 'Living with (Head of Household)', type: 'text', required: false, placeholder: 'e.g. Self, Parents, Landlord' }
    ],
    fee: 0,
    estimated_period: '1 working day',
    release_instructions: 'Claimable in person at Counter 2, Barangay Hall once status is Ready for Pickup. Bring 1 valid ID.',
    is_active: true,
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'srv-3',
    code: 'CERT-IND',
    name: 'Certificate of Indigency',
    description: 'Document certifying low-income or indigent resident status for social welfare assistance and medical services.',
    requirements: [
      'Valid ID or Community Endorsement',
      'Certificate of No Fixed Income / MSWD Referral (if applicable)'
    ],
    form_fields: [
      { name: 'purpose', label: 'Assistance Purpose', type: 'select', required: true, options: ['Medical / Hospitalization Assistance', 'Burial Assistance', 'Financial Assistance (AICS / DSWD)', 'Public Attorney Office (PAO) Legal Aid', 'Scholarship / Educational Assistance', 'PCSO Medical Assistance'] },
      { name: 'patient_or_beneficiary', label: 'Beneficiary Name (if different from applicant)', type: 'text', required: false, placeholder: 'e.g. Maria Santos (Mother)' },
      { name: 'monthly_household_income', label: 'Estimated Monthly Household Income', type: 'number', required: true, placeholder: 'e.g. 8000' }
    ],
    fee: 0,
    estimated_period: 'Same day to 1 working day',
    release_instructions: 'Claimable in person at Counter 1, Barangay Hall once status is Ready for Pickup. Bring 1 valid ID.',
    is_active: true,
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'srv-4',
    code: 'BUS-CLR',
    name: 'Barangay Business Clearance',
    description: 'Mandatory clearance for operating a micro, small, medium or commercial business enterprise within the barangay territory.',
    requirements: [
      'DTI Business Name Registration or SEC Certificate',
      'Contract of Lease or Property Title',
      'Previous Barangay Business Clearance (for renewals)'
    ],
    form_fields: [
      { name: 'business_name', label: 'Registered Business Name', type: 'text', required: true, placeholder: 'e.g. San Isidro Mini Mart' },
      { name: 'business_type', label: 'Nature of Business', type: 'select', required: true, options: ['Sari-Sari Store / Retail', 'Food Stall / Eatery', 'Services / Repair Shop', 'Wholesale / Distribution', 'Online Commerce Hub', 'Manufacturing / Processing'] },
      { name: 'business_address', label: 'Exact Business Location', type: 'text', required: true, placeholder: 'e.g. Unit 2B, 150 Rizal Avenue' },
      { name: 'dti_sec_number', label: 'DTI / SEC Registration Number', type: 'text', required: true, placeholder: 'e.g. DTI-NCR-0928174' }
    ],
    fee: 0,
    estimated_period: '2 to 3 working days',
    release_instructions: 'Claimable in person at Counter 3, Barangay Hall once status is Ready for Pickup. Bring 1 valid ID.',
    is_active: true,
    created_at: '2026-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z'
  }
];

// Initial Synthetic Profiles for All Roles
export const DEMO_PROFILES: Profile[] = [
  {
    id: 'user-resident-1',
    auth_user_id: 'auth-res-1',
    full_name: 'Juan Carlos Dela Cruz',
    email: 'juan.delacruz@gmail.com',
    mobile_number: '+63 917 555 0192',
    sitio_purok: 'Sitio Centro',
    complete_address: 'Sitio Centro, Barangay Comod-om, Alcantara, Romblon',
    date_of_birth: '1992-06-15',
    civil_status: 'Married',
    residency_years: 7,
    is_verified: true,
    verified_at: '2025-11-10T10:00:00Z',
    verified_by: 'user-sec-1',
    role: 'resident',
    created_at: '2025-10-01T08:00:00Z',
    updated_at: '2026-01-15T09:00:00Z'
  },
  {
    id: 'user-resident-2',
    auth_user_id: 'auth-res-2',
    full_name: 'Maria Cristina Ramos',
    email: 'cristina.ramos@yahoo.com',
    mobile_number: '+63 928 444 8821',
    sitio_purok: 'Sitio Baybay',
    complete_address: 'Sitio Baybay, Barangay Comod-om, Alcantara, Romblon',
    date_of_birth: '1998-11-23',
    civil_status: 'Single',
    residency_years: 2,
    is_verified: false,
    role: 'resident',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-02-01T08:00:00Z'
  },
  {
    id: 'user-sec-1',
    auth_user_id: 'auth-sec-1',
    full_name: 'Hon. Maria Elena D. Cruz',
    email: 'sec.elena@barangay.gov.ph',
    mobile_number: '+63 920 111 7733',
    sitio_purok: 'Office of the Barangay Secretary',
    complete_address: 'Executive Wing, Barangay Hall, Comod-om, Alcantara, Romblon',
    is_verified: true,
    role: 'secretary',
    created_at: '2024-07-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z'
  },
  {
    id: 'user-admin-1',
    auth_user_id: 'auth-admin-1',
    full_name: 'Engr. Ramon V. Bautista',
    email: 'admin@barangay.gov.ph',
    mobile_number: '+63 917 888 1234',
    sitio_purok: 'Management Information System (MIS)',
    complete_address: 'Barangay Hall, Comod-om, Alcantara, Romblon',
    is_verified: true,
    role: 'admin',
    created_at: '2024-01-01T08:00:00Z',
    updated_at: '2026-01-01T08:00:00Z'
  }
];

const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  barangay_name: 'Barangay Comod-om',
  city_municipality: 'Alcantara',
  province: 'Romblon',
  barangay_captain: 'Hon. Roberto M. Galicia',
  barangay_secretary: 'Hon. Maria Elena D. Cruz',
  contact_phone: '+63 917 555 4210 / (042) 567-1234',
  contact_email: 'comodom.alcantara@gmail.com',
  office_hours: 'Monday to Friday: 8:00 AM – 5:00 PM (No Noon Break)',
  hall_address: 'Barangay Hall, Comod-om, Alcantara, Romblon',
  privacy_officer_email: 'dpo.comodom@gmail.com',
  allow_walkin_pickup: true,
  emergency_announcement: 'OFFICE ADVISORY: Welcome to Barangay Comod-om, Alcantara, Romblon. Online requests are processed daily by the Barangay Secretariat.',
  updated_at: '2026-10-25T12:00:00Z'
};

// Initial Requests showing every status
const DEFAULT_REQUESTS: BarangayRequest[] = [
  {
    id: 'req-1',
    reference_number: 'BRGY-2026-8K92X',
    resident_id: 'user-resident-1',
    resident_name: 'Juan Carlos Dela Cruz',
    resident_email: 'juan.delacruz@gmail.com',
    resident_phone: '+63 917 555 0192',
    resident_address: 'Sitio Centro, Barangay Comod-om, Alcantara, Romblon',
    document_service_id: 'srv-1',
    service_name_snapshot: 'Barangay Clearance',
    applicable_fee_snapshot: 50.00,
    current_status: 'ready_for_release',
    purpose: 'Local Employment - Technical Support Specialist Application',
    custom_fields_data: {
      residency_duration: 7
    },
    assigned_staff_id: 'user-sec-1',
    assigned_staff_name: 'Hon. Maria Elena D. Cruz',
    internal_notes: 'Residency verified against 2025 barangay census records. No derogatory record on blotter book.',
    submission_timestamp: '2026-10-24T09:15:00Z',
    updated_at: '2026-10-25T14:30:00Z',
    attachments: [
      {
        id: 'att-1',
        request_id: 'req-1',
        uploaded_by: 'user-resident-1',
        private_storage_path: 'attachments/req-1/valid_id_delacruz.jpg',
        original_filename: 'Philippine_Passport_ID.jpg',
        file_type: 'image/jpeg',
        file_size: 1420000,
        requirement_name: 'Valid Government Issued ID',
        uploaded_at: '2026-10-24T09:12:00Z'
      },
      {
        id: 'att-2',
        request_id: 'req-1',
        uploaded_by: 'user-resident-1',
        private_storage_path: 'attachments/req-1/meralco_bill.pdf',
        original_filename: 'Meralco_Sept2026.pdf',
        file_type: 'application/pdf',
        file_size: 850000,
        requirement_name: 'Proof of Residency',
        uploaded_at: '2026-10-24T09:14:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-1',
        request_id: 'req-1',
        new_status: 'submitted',
        changed_by: 'user-resident-1',
        changed_by_name: 'Juan Carlos Dela Cruz',
        changed_by_role: 'resident',
        reason: 'Online request submitted via Barangay360 Mobile portal',
        created_at: '2026-10-24T09:15:00Z'
      },
      {
        id: 'hist-2',
        request_id: 'req-1',
        previous_status: 'submitted',
        new_status: 'under_review',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Screening submitted documents against barangay records',
        created_at: '2026-10-24T11:00:00Z'
      },
      {
        id: 'hist-3',
        request_id: 'req-1',
        previous_status: 'under_review',
        new_status: 'approved',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Verified and approved for document preparation',
        created_at: '2026-10-25T10:00:00Z'
      },
      {
        id: 'hist-4',
        request_id: 'req-1',
        previous_status: 'approved',
        new_status: 'ready_for_release',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Official document prepared, dry-sealed, and ready for pickup at Counter 1',
        created_at: '2026-10-25T14:30:00Z'
      }
    ]
  },
  {
    id: 'req-2',
    reference_number: 'BRGY-2026-4B71C',
    resident_id: 'user-resident-1',
    resident_name: 'Juan Carlos Dela Cruz',
    resident_email: 'juan.delacruz@gmail.com',
    resident_phone: '+63 917 555 0192',
    resident_address: 'Sitio Centro, Barangay Comod-om, Alcantara, Romblon',
    document_service_id: 'srv-3',
    service_name_snapshot: 'Certificate of Indigency',
    applicable_fee_snapshot: 0.00,
    current_status: 'pending_requirements',
    purpose: 'Medical / Hospitalization Assistance (Romblon Provincial Hospital)',
    custom_fields_data: {
      patient_or_beneficiary: 'Corazon Dela Cruz (Dependent Mother)',
      monthly_household_income: 9500
    },
    assigned_staff_id: 'user-sec-1',
    assigned_staff_name: 'Hon. Maria Elena D. Cruz',
    correction_instructions: 'The submitted Medical Abstract is blurry and the patient name is partially cropped. Please upload a clear photo or PDF scan of the doctor clinical abstract so we can expedite approval.',
    submission_timestamp: '2026-10-25T08:00:00Z',
    updated_at: '2026-10-25T11:20:00Z',
    attachments: [
      {
        id: 'att-3',
        request_id: 'req-2',
        uploaded_by: 'user-resident-1',
        private_storage_path: 'attachments/req-2/medical_doc_lowres.jpg',
        original_filename: 'Hospital_Abstract_Camera.jpg',
        file_type: 'image/jpeg',
        file_size: 450000,
        requirement_name: 'Medical / MSWD Referral',
        uploaded_at: '2026-10-25T07:58:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-20',
        request_id: 'req-2',
        new_status: 'submitted',
        changed_by: 'user-resident-1',
        changed_by_name: 'Juan Carlos Dela Cruz',
        changed_by_role: 'resident',
        reason: 'Indigency assistance request submitted',
        created_at: '2026-10-25T08:00:00Z'
      },
      {
        id: 'hist-21',
        request_id: 'req-2',
        previous_status: 'submitted',
        new_status: 'pending_requirements',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Missing clear doctor clinical abstract / endorsement',
        created_at: '2026-10-25T11:20:00Z'
      }
    ]
  },
  {
    id: 'req-3',
    reference_number: 'BRGY-2026-9M14F',
    resident_id: 'user-resident-2',
    resident_name: 'Maria Cristina Ramos',
    resident_email: 'cristina.ramos@yahoo.com',
    resident_phone: '+63 928 444 8821',
    resident_address: 'Sitio Baybay, Barangay Comod-om, Alcantara, Romblon',
    document_service_id: 'srv-2',
    service_name_snapshot: 'Certificate of Residency',
    applicable_fee_snapshot: 50.00,
    current_status: 'under_review',
    purpose: 'School Admission / Enrollment - Romblon State University',
    custom_fields_data: {
      sitio_street: 'Sitio Baybay',
      living_with: 'Parents (Mr. & Mrs. Ramos)'
    },
    assigned_staff_id: 'user-sec-1',
    assigned_staff_name: 'Hon. Maria Elena D. Cruz',
    submission_timestamp: '2026-10-25T13:40:00Z',
    updated_at: '2026-10-25T15:00:00Z',
    attachments: [
      {
        id: 'att-4',
        request_id: 'req-3',
        uploaded_by: 'user-resident-2',
        private_storage_path: 'attachments/req-3/school_id.jpg',
        original_filename: 'School_ID_Front.jpg',
        file_type: 'image/jpeg',
        file_size: 980000,
        requirement_name: 'Valid Government-Issued ID',
        uploaded_at: '2026-10-25T13:38:00Z'
      }
    ],
    status_history: [
      {
        id: 'hist-30',
        request_id: 'req-3',
        new_status: 'submitted',
        changed_by: 'user-resident-2',
        changed_by_name: 'Maria Cristina Ramos',
        changed_by_role: 'resident',
        reason: 'Submitted online',
        created_at: '2026-10-25T13:40:00Z'
      },
      {
        id: 'hist-31',
        request_id: 'req-3',
        previous_status: 'submitted',
        new_status: 'under_review',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Evaluating student identification and residency duration',
        created_at: '2026-10-25T15:00:00Z'
      }
    ]
  },
  {
    id: 'req-4',
    reference_number: 'BRGY-2026-2D58R',
    resident_id: 'user-resident-1',
    resident_name: 'Juan Carlos Dela Cruz',
    resident_email: 'juan.delacruz@gmail.com',
    resident_phone: '+63 917 555 0192',
    resident_address: 'Sitio Centro, Barangay Comod-om, Alcantara, Romblon',
    document_service_id: 'srv-4',
    service_name_snapshot: 'Barangay Business Clearance',
    applicable_fee_snapshot: 250.00,
    current_status: 'released',
    purpose: 'New Business Permit for Sari-Sari & E-loading Store',
    custom_fields_data: {
      business_name: 'Dela Cruz Sari-Sari Store',
      business_type: 'Sari-Sari Store / Retail',
      business_address: 'Sitio Centro, Comod-om',
      dti_sec_number: 'DTI-MIMAROPA-0982314'
    },
    submission_timestamp: '2026-10-18T10:00:00Z',
    updated_at: '2026-10-20T16:00:00Z',
    completion_timestamp: '2026-10-20T16:00:00Z',
    release_details: {
      released_by: 'Hon. Maria Elena D. Cruz',
      release_date: '2026-10-20T16:00:00Z',
      release_mode: 'In-person Pickup',
      claimed_by_name: 'Juan Carlos Dela Cruz',
      remarks: 'Original DTI presented and verified at Barangay Hall counter.'
    },
    attachments: [],
    status_history: [
      {
        id: 'hist-40',
        request_id: 'req-4',
        new_status: 'submitted',
        changed_by: 'user-resident-1',
        changed_by_name: 'Juan Carlos Dela Cruz',
        changed_by_role: 'resident',
        reason: 'Business clearance request submitted online',
        created_at: '2026-10-18T10:00:00Z'
      },
      {
        id: 'hist-41',
        request_id: 'req-4',
        previous_status: 'submitted',
        new_status: 'approved',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Inspection cleared by Tanod, approved by Secretary',
        created_at: '2026-10-19T14:00:00Z'
      },
      {
        id: 'hist-42',
        request_id: 'req-4',
        previous_status: 'approved',
        new_status: 'released',
        changed_by: 'user-sec-1',
        changed_by_name: 'Hon. Maria Elena D. Cruz',
        changed_by_role: 'secretary',
        reason: 'Official clearance claimed in-person by applicant at Barangay Hall',
        created_at: '2026-10-20T16:00:00Z'
      }
    ]
  }
];

const DEFAULT_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    recipient_id: 'user-resident-1',
    request_id: 'req-1',
    reference_number: 'BRGY-2026-8K92X',
    title: 'Document Ready for Pickup! 🏛️',
    message: 'Your Barangay Clearance is now ready for in-person pickup. Please visit Counter 1 at the Barangay Hall with your valid ID.',
    is_read: false,
    created_at: '2026-10-25T14:30:00Z'
  },
  {
    id: 'notif-2',
    recipient_id: 'user-resident-1',
    request_id: 'req-2',
    reference_number: 'BRGY-2026-4B71C',
    title: 'Additional Requirement Requested ⚠️',
    message: 'Your Indigency request requires a clearer photo of the Medical Abstract. Tap here to upload the correction.',
    is_read: false,
    created_at: '2026-10-25T11:20:00Z'
  },
  {
    id: 'notif-3',
    recipient_id: 'user-resident-1',
    request_id: 'req-4',
    reference_number: 'BRGY-2026-2D58R',
    title: 'Document Officially Released ✅',
    message: 'Your Barangay Business Clearance has been claimed in person and officially released at the Barangay Hall.',
    is_read: true,
    created_at: '2026-10-20T16:01:00Z'
  }
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actor_id: 'user-sec-1',
    actor_name: 'Hon. Maria Elena D. Cruz',
    actor_role: 'secretary',
    action: 'STATUS_UPDATE_READY_FOR_RELEASE',
    entity_type: 'request',
    entity_id: 'req-1',
    metadata: { reference_number: 'BRGY-2026-8K92X', service: 'Barangay Clearance' },
    ip_address: '192.168.1.104',
    timestamp: '2026-10-25T14:30:00Z'
  },
  {
    id: 'log-2',
    actor_id: 'user-sec-1',
    actor_name: 'Hon. Maria Elena D. Cruz',
    actor_role: 'secretary',
    action: 'REQUEST_APPROVED',
    entity_type: 'request',
    entity_id: 'req-1',
    metadata: { reference_number: 'BRGY-2026-8K92X', approver: 'Barangay Secretary' },
    ip_address: '192.168.1.101',
    timestamp: '2026-10-25T10:00:00Z'
  },
  {
    id: 'log-3',
    actor_id: 'user-sec-1',
    actor_name: 'Hon. Maria Elena D. Cruz',
    actor_role: 'secretary',
    action: 'STATUS_UPDATE_PENDING_REQUIREMENTS',
    entity_type: 'request',
    entity_id: 'req-2',
    metadata: { reference_number: 'BRGY-2026-4B71C', reason: 'Unreadable medical abstract' },
    ip_address: '192.168.1.104',
    timestamp: '2026-10-25T11:20:00Z'
  }
];

// Helper: load from localStorage with fallback
function loadData<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultValue;
}

// Helper: save to localStorage
function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch {
    // storage might be full or private browsing
  }
}

// Generate unique non-sequential reference number: e.g. "BRGY-2026-X8K92"
export function generateReferenceNumber(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BRGY-${new Date().getFullYear()}-${rand}`;
}

// Generate official document control number: e.g. "CTRL-2026-00482"
export function generateControlNumber(): string {
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `CTRL-${new Date().getFullYear()}-${seq}`;
}

// Main In-Memory & LocalStorage Reactive Store
type Listener = () => void;

class BarangayStore {
  private currentUser: Profile = DEMO_PROFILES[0]; // defaults to Juan Dela Cruz (Resident)
  private profiles: Profile[] = loadData('profiles', DEMO_PROFILES);
  private services: DocumentService[] = loadData<DocumentService[]>('services', DEFAULT_SERVICES)
    .filter(srv => srv.id !== 'srv-5' && srv.code !== 'CERT-GMC')
    .map(srv => ({ ...srv, form_fields: srv.form_fields.filter(f => f.name !== 'precinct_number') }));
  private requests: BarangayRequest[] = loadData('requests', DEFAULT_REQUESTS);
  private notifications: InAppNotification[] = loadData('notifications', DEFAULT_NOTIFICATIONS);
  private auditLogs: AuditLog[] = loadData('audit_logs', DEFAULT_AUDIT_LOGS);
  private systemSettings: SystemSettings = loadData('system_settings', DEFAULT_SYSTEM_SETTINGS);
  private listeners: Set<Listener> = new Set();

  constructor() {
    // Ensure system settings reflects Barangay Comod-om, Alcantara, Romblon
    if (this.systemSettings.barangay_name !== 'Barangay Comod-om') {
      this.systemSettings = {
        ...DEFAULT_SYSTEM_SETTINGS,
        ...this.systemSettings,
        barangay_name: 'Barangay Comod-om',
        city_municipality: 'Alcantara',
        province: 'Romblon',
        hall_address: 'Barangay Hall, Comod-om, Alcantara, Romblon',
        contact_email: 'comodom.alcantara@gmail.com'
      };
      saveData('system_settings', this.systemSettings);
    }

    // Clean up any stale staff profile or user session
    this.profiles = this.profiles.filter(p => p.id !== 'user-staff-1' && (p.role as string) !== 'staff');
    saveData('profiles', this.profiles);

    // Check saved user session
    const savedUserId = localStorage.getItem('barangay360_current_user_id');
    if (savedUserId && savedUserId !== 'user-staff-1') {
      const match = this.profiles.find(p => p.id === savedUserId);
      if (match) this.currentUser = match;
    } else {
      this.currentUser = DEMO_PROFILES[0];
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(fn => fn());
  }

  // --- Auth & Session ---
  public getCurrentUser(): Profile {
    return this.currentUser;
  }

  public setCurrentUser(user: Profile): void {
    this.currentUser = user;
    localStorage.setItem('barangay360_current_user_id', user.id);
    this.notify();
  }

  public getAllProfiles(): Profile[] {
    return this.profiles;
  }

  public switchDemoUser(userId: string): void {
    const user = this.profiles.find(p => p.id === userId);
    if (user) {
      this.setCurrentUser(user);
      this.logAudit(user, 'USER_SWITCH_PERSONA', 'user', user.id, { new_role: user.role });
    }
  }

  public login(email: string, _password?: string): { success: boolean; error?: string } {
    const user = this.profiles.find(p => p.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, error: 'No account found with this email. Please check your credentials or register.' };
    }
    this.setCurrentUser(user);
    this.logAudit(user, 'USER_LOGIN', 'auth', user.id, { email: user.email });
    return { success: true };
  }

  public register(data: {
    fullName: string;
    email: string;
    mobileNumber: string;
    sitioPurok: string;
    completeAddress: string;
    civilStatus?: 'Single' | 'Married' | 'Widowed' | 'Separated';
    residencyYears?: number;
    dateOfBirth?: string;
  }): { success: boolean; user?: Profile; error?: string } {
    const existing = this.profiles.find(p => p.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existing) {
      return { success: false, error: 'An account with this email address already exists. Please log in.' };
    }

    const newProfile: Profile = {
      id: `user-${Date.now()}`,
      auth_user_id: `auth-${Date.now()}`,
      full_name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      mobile_number: data.mobileNumber.trim(),
      sitio_purok: data.sitioPurok,
      complete_address: data.completeAddress.trim(),
      civil_status: data.civilStatus || 'Single',
      residency_years: data.residencyYears || 1,
      date_of_birth: data.dateOfBirth,
      is_verified: false, // New registrations must be verified by staff
      role: 'resident', // Public registration ALWAYS yields 'resident' role!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.profiles = [newProfile, ...this.profiles];
    saveData('profiles', this.profiles);
    this.setCurrentUser(newProfile);

    // Initial welcome notification
    this.createNotification({
      recipient_id: newProfile.id,
      title: 'Welcome to Barangay360! 🇵🇭',
      message: 'Your resident account has been registered. You can now request barangay clearances, residency certifications, and indigency documents anytime.'
    });

    this.logAudit(newProfile, 'USER_REGISTER', 'user', newProfile.id, { email: newProfile.email });
    return { success: true, user: newProfile };
  }

  public updateProfile(updates: Partial<Profile>): void {
    if (!this.currentUser) return;
    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.profiles = this.profiles.map(p => p.id === this.currentUser.id ? this.currentUser : p);
    saveData('profiles', this.profiles);
    this.logAudit(this.currentUser, 'PROFILE_UPDATED', 'user', this.currentUser.id, updates);
    this.notify();
  }

  // --- Document Services ---
  public getDocumentServices(includeInactive = false): DocumentService[] {
    if (includeInactive) return this.services;
    return this.services.filter(s => s.is_active);
  }

  public getServiceById(id: string): DocumentService | undefined {
    return this.services.find(s => s.id === id);
  }

  public saveDocumentService(service: DocumentService): void {
    const idx = this.services.findIndex(s => s.id === service.id);
    const updated = { ...service, updated_at: new Date().toISOString() };
    if (idx >= 0) {
      this.services[idx] = updated;
    } else {
      this.services.push(updated);
    }
    saveData('services', this.services);
    this.logAudit(this.currentUser, 'SERVICE_CONFIG_SAVED', 'document_service', service.id, { service_name: service.name });
    this.notify();
  }

  // --- Requests ---
  public getAllRequests(): BarangayRequest[] {
    return this.requests;
  }

  public getRequestsForUser(userId: string): BarangayRequest[] {
    return this.requests.filter(r => r.resident_id === userId);
  }

  public getRequestById(id: string): BarangayRequest | undefined {
    return this.requests.find(r => r.id === id || r.reference_number === id);
  }

  public createRequest(data: {
    service: DocumentService;
    purpose: string;
    customFields: Record<string, string | number | boolean>;
    attachments: { name: string; type: string; size: number; requirement_name: string; data_url?: string }[];
  }): BarangayRequest {
    const user = this.currentUser;
    const refNumber = generateReferenceNumber();
    const reqId = `req-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const attachments: RequestAttachment[] = data.attachments.map((att, i) => ({
      id: `att-${Date.now()}-${i}`,
      request_id: reqId,
      uploaded_by: user.id,
      private_storage_path: `attachments/${reqId}/${att.name.replace(/\s+/g, '_')}`,
      original_filename: att.name,
      file_type: att.type,
      file_size: att.size,
      requirement_name: att.requirement_name,
      uploaded_at: timestamp,
      data_url: att.data_url
    }));

    const statusHistory: RequestStatusHistory[] = [
      {
        id: `hist-${Date.now()}-0`,
        request_id: reqId,
        new_status: 'submitted',
        changed_by: user.id,
        changed_by_name: user.full_name,
        changed_by_role: user.role,
        reason: 'Online application submitted via resident portal',
        created_at: timestamp
      }
    ];

    const newRequest: BarangayRequest = {
      id: reqId,
      reference_number: refNumber,
      resident_id: user.id,
      resident_name: user.full_name,
      resident_email: user.email,
      resident_phone: user.mobile_number,
      resident_address: user.complete_address,
      document_service_id: data.service.id,
      service_name_snapshot: data.service.name,
      applicable_fee_snapshot: data.service.fee,
      current_status: 'submitted',
      purpose: data.purpose,
      custom_fields_data: data.customFields,
      submission_timestamp: timestamp,
      updated_at: timestamp,
      attachments,
      status_history: statusHistory
    };

    this.requests = [newRequest, ...this.requests];
    saveData('requests', this.requests);

    // Create confirmation in-app notification for resident
    this.createNotification({
      recipient_id: user.id,
      request_id: reqId,
      reference_number: refNumber,
      title: 'Request Received! 📋',
      message: `Your request for ${data.service.name} (Ref: ${refNumber}) has been submitted. Our personnel will review your application.`
    });

    this.logAudit(user, 'REQUEST_SUBMITTED', 'request', reqId, {
      reference_number: refNumber,
      service: data.service.name,
      fee: data.service.fee
    });

    this.notify();
    return newRequest;
  }

  public updateRequestStatus(params: {
    requestId: string;
    newStatus: RequestStatus;
    reason: string;
    internalNotes?: string;
    correctionInstructions?: string;
    assignedStaffId?: string;
    assignedStaffName?: string;
  }): { success: boolean; error?: string } {
    const req = this.requests.find(r => r.id === params.requestId);
    if (!req) return { success: false, error: 'Request record not found' };

    // Security check: only staff, secretary, or admin can change statuses!
    if (this.currentUser.role === 'resident') {
      return { success: false, error: 'Permission denied: Residents cannot update request statuses directly.' };
    }

    const previousStatus = req.current_status;
    const now = new Date().toISOString();

    const historyItem: RequestStatusHistory = {
      id: `hist-${Date.now()}`,
      request_id: req.id,
      previous_status: previousStatus,
      new_status: params.newStatus,
      changed_by: this.currentUser.id,
      changed_by_name: this.currentUser.full_name,
      changed_by_role: this.currentUser.role,
      reason: params.reason,
      created_at: now
    };

    req.current_status = params.newStatus;
    req.updated_at = now;
    if (params.internalNotes !== undefined) req.internal_notes = params.internalNotes;
    if (params.correctionInstructions !== undefined) req.correction_instructions = params.correctionInstructions;
    if (params.assignedStaffId) {
      req.assigned_staff_id = params.assignedStaffId;
      req.assigned_staff_name = params.assignedStaffName;
    }
    if (params.newStatus === 'rejected') {
      req.rejection_reason = params.reason;
    }
    if (params.newStatus === 'released') {
      req.completion_timestamp = now;
    }

    req.status_history = [...req.status_history, historyItem];
    saveData('requests', this.requests);

    // Send corresponding status update notification to the resident
    let notifTitle = 'Request Update';
    let notifMsg = `Your request ${req.reference_number} is now ${params.newStatus}.`;

    if (params.newStatus === 'under_review') {
      notifTitle = 'Application Under Review 🔍';
      notifMsg = `Your request for ${req.service_name_snapshot} (${req.reference_number}) is currently being reviewed by barangay personnel.`;
    } else if (params.newStatus === 'pending_requirements') {
      notifTitle = 'Action Needed: Additional Requirements ⚠️';
      notifMsg = `Instructions from reviewer: ${params.correctionInstructions || params.reason}. Please upload the missing items in your request portal.`;
    } else if (params.newStatus === 'approved') {
      notifTitle = 'Application Approved! 🎉';
      notifMsg = `Your request for ${req.service_name_snapshot} has been approved. The official certificate is being prepared.`;
    } else if (params.newStatus === 'ready_for_release') {
      notifTitle = 'Document Ready for Pickup! 📄';
      notifMsg = `Your document is printed, sealed, and ready for pickup at the Barangay Hall. Please bring reference #${req.reference_number}.`;
    } else if (params.newStatus === 'released') {
      notifTitle = 'Document Officially Released ✅';
      notifMsg = `Your requested document (${req.service_name_snapshot}) has been officially released. Thank you!`;
    } else if (params.newStatus === 'rejected') {
      notifTitle = 'Request Declined ❌';
      notifMsg = `Reason: ${params.reason}. Contact the barangay office if you have inquiries.`;
    }

    this.createNotification({
      recipient_id: req.resident_id,
      request_id: req.id,
      reference_number: req.reference_number,
      title: notifTitle,
      message: notifMsg
    });

    this.logAudit(this.currentUser, `STATUS_CHANGE_TO_${params.newStatus.toUpperCase()}`, 'request', req.id, {
      reference_number: req.reference_number,
      previous_status: previousStatus,
      new_status: params.newStatus,
      reason: params.reason
    });

    this.notify();
    return { success: true };
  }

  // Resident submits correction attachments
  public uploadCorrection(requestId: string, attachment: { name: string; type: string; size: number; requirement_name: string; data_url?: string }): { success: boolean; error?: string } {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found' };

    const newAtt: RequestAttachment = {
      id: `att-corr-${Date.now()}`,
      request_id: req.id,
      uploaded_by: this.currentUser.id,
      private_storage_path: `attachments/${req.id}/correction_${attachment.name.replace(/\s+/g, '_')}`,
      original_filename: attachment.name,
      file_type: attachment.type,
      file_size: attachment.size,
      requirement_name: attachment.requirement_name || 'Corrected Requirement',
      uploaded_at: new Date().toISOString(),
      data_url: attachment.data_url
    };

    req.attachments = [...req.attachments, newAtt];
    req.current_status = 'under_review'; // Automatically transitions back to review!
    req.updated_at = new Date().toISOString();

    const historyItem: RequestStatusHistory = {
      id: `hist-${Date.now()}`,
      request_id: req.id,
      previous_status: 'pending_requirements',
      new_status: 'under_review',
      changed_by: this.currentUser.id,
      changed_by_name: this.currentUser.full_name,
      changed_by_role: this.currentUser.role,
      reason: `Resident submitted corrected requirement: ${attachment.name}`,
      created_at: new Date().toISOString()
    };
    req.status_history = [...req.status_history, historyItem];
    saveData('requests', this.requests);

    this.logAudit(this.currentUser, 'CORRECTION_UPLOADED', 'request', req.id, { filename: attachment.name });
    this.notify();
    return { success: true };
  }

  // Staff records official release
  public recordRelease(requestId: string, details: ReleaseDetails): { success: boolean; error?: string } {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return { success: false, error: 'Request not found' };

    req.release_details = details;
    return this.updateRequestStatus({
      requestId,
      newStatus: 'released',
      reason: `Official document released to ${details.claimed_by_name || req.resident_name} via ${details.release_mode}. OR #${details.or_number || 'N/A'}`
    });
  }

  // Staff adds internal note
  public addInternalNote(requestId: string, note: string): void {
    const req = this.requests.find(r => r.id === requestId);
    if (!req) return;
    const now = new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const formatted = `[${now} by ${this.currentUser.full_name} (${this.currentUser.role})]: ${note}`;
    req.internal_notes = req.internal_notes ? `${req.internal_notes}\n\n${formatted}` : formatted;
    req.updated_at = new Date().toISOString();
    saveData('requests', this.requests);
    this.logAudit(this.currentUser, 'INTERNAL_NOTE_ADDED', 'request', req.id, { note_length: note.length });
    this.notify();
  }

  // --- Notifications ---
  public getNotificationsForUser(userId: string): InAppNotification[] {
    return this.notifications.filter(n => n.recipient_id === userId);
  }

  public getUnreadNotificationCount(userId: string): number {
    return this.notifications.filter(n => n.recipient_id === userId && !n.is_read).length;
  }

  public markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
    saveData('notifications', this.notifications);
    this.notify();
  }

  public markAllNotificationsAsRead(userId: string): void {
    this.notifications = this.notifications.map(n => n.recipient_id === userId ? { ...n, is_read: true } : n);
    saveData('notifications', this.notifications);
    this.notify();
  }

  public createNotification(data: { recipient_id: string; title: string; message: string; request_id?: string; reference_number?: string }): void {
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      recipient_id: data.recipient_id,
      request_id: data.request_id,
      reference_number: data.reference_number,
      title: data.title,
      message: data.message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.notifications = [newNotif, ...this.notifications];
    saveData('notifications', this.notifications);
    this.notify();
  }

  // Broadcast announcement to all registered residents
  public broadcastNotification(title: string, message: string): void {
    const residents = this.profiles.filter(p => p.role === 'resident');
    const newNotifs: InAppNotification[] = residents.map(r => ({
      id: `notif-${Date.now()}-${r.id}`,
      recipient_id: r.id,
      title: title,
      message: message,
      is_read: false,
      created_at: new Date().toISOString()
    }));
    this.notifications = [...newNotifs, ...this.notifications];
    saveData('notifications', this.notifications);
    this.logAudit(this.currentUser, 'NOTIFICATION_BROADCAST', 'system', undefined, { title, count: residents.length });
    this.notify();
  }

  // --- Residents Management ---
  public verifyResident(residentId: string, isVerified: boolean): void {
    const res = this.profiles.find(p => p.id === residentId);
    if (!res) return;
    res.is_verified = isVerified;
    res.verified_at = isVerified ? new Date().toISOString() : undefined;
    res.verified_by = isVerified ? this.currentUser.id : undefined;
    res.updated_at = new Date().toISOString();
    saveData('profiles', this.profiles);
    this.logAudit(this.currentUser, isVerified ? 'RESIDENT_VERIFIED' : 'RESIDENT_UNVERIFIED', 'user', res.id, { resident_name: res.full_name });
    this.notify();
  }

  public updateUserRole(targetUserId: string, newRole: Profile['role']): { success: boolean; error?: string } {
    if (this.currentUser.role !== 'admin') {
      return { success: false, error: 'Only System Administrators can change user roles.' };
    }
    const target = this.profiles.find(p => p.id === targetUserId);
    if (!target) return { success: false, error: 'User not found' };
    target.role = newRole;
    target.updated_at = new Date().toISOString();
    saveData('profiles', this.profiles);
    this.logAudit(this.currentUser, 'USER_ROLE_CHANGED', 'user', target.id, { new_role: newRole, user_name: target.full_name });
    this.notify();
    return { success: true };
  }

  // --- System Settings ---
  public getSystemSettings(): SystemSettings {
    return this.systemSettings;
  }

  public updateSystemSettings(settings: Partial<SystemSettings>): void {
    this.systemSettings = {
      ...this.systemSettings,
      ...settings,
      updated_at: new Date().toISOString()
    };
    saveData('system_settings', this.systemSettings);
    this.logAudit(this.currentUser, 'SYSTEM_SETTINGS_UPDATED', 'settings', '1', settings);
    this.notify();
  }

  // --- Audit Logs ---
  public getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  private logAudit(actor: Profile, action: string, entity_type: string, entity_id?: string, metadata?: Record<string, unknown>): void {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      actor_id: actor.id,
      actor_name: actor.full_name,
      actor_role: actor.role,
      action,
      entity_type,
      entity_id,
      metadata,
      ip_address: '127.0.0.1 (Local Session)',
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [newLog, ...this.auditLogs].slice(0, 500); // retain last 500
    saveData('audit_logs', this.auditLogs);
  }

  // --- CSV Export with formula injection sanitization ---
  public exportRequestsCSV(): string {
    const sanitize = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      // Anti formula injection: prepend single quote if starts with dangerous chars =, +, -, @, \t, \r
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      return `"${str}"`;
    };

    const headers = [
      'Reference Number',
      'Document Service',
      'Resident Name',
      'Email',
      'Mobile Number',
      'Current Status',
      'Claiming Method',
      'Purpose',
      'Assigned Official',
      'Submission Date',
      'Last Updated',
      'Completion Date'
    ];

    const rows = this.requests.map(r => [
      sanitize(r.reference_number),
      sanitize(r.service_name_snapshot),
      sanitize(r.resident_name),
      sanitize(r.resident_email),
      sanitize(r.resident_phone || 'N/A'),
      sanitize(r.current_status.toUpperCase()),
      sanitize('In-Person Pickup at Barangay Hall'),
      sanitize(r.purpose),
      sanitize(r.assigned_staff_name || 'Unassigned'),
      sanitize(new Date(r.submission_timestamp).toLocaleString('en-PH')),
      sanitize(new Date(r.updated_at).toLocaleString('en-PH')),
      sanitize(r.completion_timestamp ? new Date(r.completion_timestamp).toLocaleString('en-PH') : 'Pending')
    ]);

    this.logAudit(this.currentUser, 'EXPORTED_REQUESTS_CSV', 'report', undefined, { record_count: rows.length });
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Reset to initial demo state
  public resetToDefaultData(): void {
    this.profiles = [...DEMO_PROFILES];
    this.services = [...DEFAULT_SERVICES];
    this.requests = [...DEFAULT_REQUESTS];
    this.notifications = [...DEFAULT_NOTIFICATIONS];
    this.auditLogs = [...DEFAULT_AUDIT_LOGS];
    this.systemSettings = { ...DEFAULT_SYSTEM_SETTINGS };
    saveData('profiles', this.profiles);
    saveData('services', this.services);
    saveData('requests', this.requests);
    saveData('notifications', this.notifications);
    saveData('audit_logs', this.auditLogs);
    saveData('system_settings', this.systemSettings);
    this.currentUser = this.profiles[0];
    localStorage.setItem('barangay360_current_user_id', this.currentUser.id);
    this.notify();
  }
}

export const store = new BarangayStore();
