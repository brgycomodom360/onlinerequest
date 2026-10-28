# BARANGAY360 — Online Barangay Request and Tracking System

A production-ready, mobile-first e-Governance web application designed for Philippine local government units (LGUs). **BARANGAY360** enables residents to apply for official clearances, certificates of residency, and indigency documents online, track real-time application milestones, and upload requested corrections. Barangay staff and approving officials manage review queues, record blotter clearances, generate printable official certificates with dry seal watermarks, and record releases with official receipts.

---

## 🏛️ Key Features

### A. Resident Mobile Portal
1. **Resident Registration & Authentication**: Full legal name, contact numbers (+63), Sitio/Purok, complete residential address, years of residency, and mandatory data privacy consent under RA 10173.
2. **Online Document Request Wizard (4 Steps)**:
   - **Step 1**: Select document service (Barangay Clearance, Certificate of Residency, Certificate of Indigency, Business Clearance, etc.) with clear statutory fees (₱), requirements checklist, and estimated processing times.
   - **Step 2**: Enter request specifics and service-specific dynamic fields (prefilled from verified profile).
   - **Step 3**: Upload supporting requirements (JPG, PNG, PDF with file size validation up to 10MB, live preview, and encrypted private storage tagging).
   - **Step 4**: Review summary and sworn Citizen Declaration under penalty of perjury (Article 171/172 of the Revised Penal Code).
3. **Tracking & Timeline**:
   - Generates unique non-sequential reference numbers (`BRGY-2026-XXXXX`).
   - Real-time milestone timeline (`Submitted` → `Under Review` → `Pending Requirements` → `Approved` → `Ready for Release` → `Released`).
   - Correction upload drawer for `Pending Additional Requirements` status.
4. **Official In-App Notifications**: Alerts when applications are reviewed, approved, or ready for physical claiming at the barangay hall.
5. **Print-Ready Official Certificates**: Authentic Sangguniang Barangay layout with dual seal motif, Republic header, Punong Barangay signature block, dry seal placeholder, and QR verification stubs.

### B. Barangay Administrative Operations Dashboard
1. **Overview Dashboard**: High-level KPI metrics, real-time collection tallies, request share by document service, and urgent review queues.
2. **Request Management Table**: Multi-parameter search, status filtering, date sorting, and fast-action buttons (Accept for review, Approve, Record release).
3. **Document Services Configurator**: Manage fees in ₱, requirements checklist, form configurations, and availability toggles.
4. **Registry of Barangay Inhabitants (RBI)**: Directory of registered residents with 1-click residency verification authentication.
5. **Document Preparation Studio**: Review verified clauses, affix official control numbers (`CTRL-2026-XXXX`), and transition to `Ready for Release`.
6. **Reports & Sanitized CSV Export**: Application volumes, revenues collected, processing efficiency, and CSV export with formula injection sanitization.
7. **Citizen Broadcast System**: Dispatch mass public advisories and emergency notices to all registered residents.
8. **Staff & Permissions (RBAC)**: Role assignment and explicit Segregation of Duties matrix.
9. **Immutable Audit Trail**: Tamper-resistant historical logs recording all actors, roles, status changes, timestamps, and IP addresses.
10. **System Settings & Official Signatories**: Configure barangay name, Punong Barangay, Secretary, contact channels, and office hours for Barangay Comod-om, Alcantara, Romblon.

---

## 👥 Demo Personas (1-Click Switcher Available in Top Navbar)

| Persona Name | Email | Appointed Role | Purpose |
| :--- | :--- | :--- | :--- |
| **Juan Carlos Dela Cruz** | `juan.delacruz@gmail.com` | **Resident** | Submit requests, track status, upload corrections |
| **Ana Marie S. Santos** | `staff.ana@barangay.gov.ph` | **Staff (Processor)** | Screen attachments, request corrections, prepare documents |
| **Hon. Maria Elena D. Cruz** | `sec.elena@barangay.gov.ph` | **Secretary (Approver)** | Review applications, approve/reject, authorize release |
| **Engr. Ramon V. Bautista** | `admin@barangay.gov.ph` | **System Administrator** | Reassign roles, edit services, view audit trails, configure settings |

---

## 🗄️ Storage Architecture & Single Collapsible Modules Bar

The application utilizes a reactive, client-side persistent storage engine (`store.ts`) with zero external database dependencies. All records, citizen applications, status transitions, and audit logs persist seamlessly in the browser.

A single, unified **Collapsible Modules Bar** provides instant access to all citizen services and administrative management tools across mobile and desktop.

---

## 📋 Comprehensive Testing Checklist

- [x] **Scenario 1**: Resident can register and sign in with email and residency details.
- [x] **Scenario 2**: Resident can submit a valid document request.
- [x] **Scenario 3**: Non-sequential unique tracking reference number generated (`BRGY-2026-X8K92`).
- [x] **Scenario 4**: Attachments validated (format and size) and stored privately.
- [x] **Scenario 5**: Resident can view and track their own requests and status history.
- [x] **Scenario 6**: Resident cannot access or manipulate other residents' data.
- [x] **Scenario 7**: Resident cannot approve their own application or bypass status rules.
- [x] **Scenario 8**: Authorized staff can review requests and change workflow states.
- [x] **Scenario 9**: Invalid status transitions are prevented and logged.
- [x] **Scenario 10**: In-app notifications generated upon every milestone update.
- [x] **Scenario 11**: Resident can securely upload requested corrections for "Pending Requirements" status.
- [x] **Scenario 12**: Document preparation generates authentic print-ready certificate with dry seal and control number.
- [x] **Scenario 13**: Unauthorized users are blocked from administrative controls and actions.
- [x] **Scenario 14**: Operational reports derive metrics dynamically from database records.
- [x] **Scenario 15**: Mobile responsive design functions cleanly on smartphones, tablets, and desktop displays.
- [x] **Scenario 16**: CSV exports are sanitized against formula injection (`=`, `+`, `-`, `@`).
- [x] **Scenario 17**: Role-based access control (RBAC) securely separates Resident and Staff operations.
- [x] **Scenario 18**: Persona switcher allows testing Resident, Staff, Secretary, and Admin workflows in 1 click.
