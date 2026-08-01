# Initial architecture

## System flow

```text
Office staff → React web application → Express API → MySQL database
```

Excel is an import/export format. MySQL remains the system of record.

## Navigation

1. Dashboard
2. Master Data: Talukas, Villages, TFC Centers, Categories, Benefit Types
3. Applications
4. Import Excel
5. Reports
6. Users (Admin only)
7. Settings (Admin only)
8. Logout

## Data model

```text
users ───────< audit_logs
talukas ─────< villages
talukas ─────< tfc_centers
categories ──< applications >──── benefit_types
villages ────< applications >──── tfc_centers
```

| Table | Purpose |
| --- | --- |
| `users` | Secure login accounts and roles |
| `applications` | Scheme applications, applicant details, and current status |
| `talukas` | Taluka master data |
| `villages` | Village master data linked to a taluka |
| `tfc_centers` | TFC center master data |
| `categories` | Applicant category master data |
| `benefit_types` | Benefit type master data |
| `audit_logs` | Important changes, timestamp, and user |

## Initial API areas

| Area | Example endpoint | Purpose |
| --- | --- | --- |
| Health | `GET /api/health` | Confirm that the server is running |
| Authentication | `POST /api/auth/login` | Sign in and receive access token |
| Applications | `GET /api/applications` | List and filter applications |
| Applications | `POST /api/applications` | Add an application |
| Master data | `GET /api/talukas` | List talukas |
| Reports | `GET /api/reports/dashboard` | Dashboard totals |

## Application fields for Excel import

`SR No`, `Name`, `Mobile`, `Aadhaar`, `Category`, `Village`, `Taluka`, `Form Type`, `Form Filled Date`, `Verification Date`, `Attendance`, `TFC`, `Reference`, `Registration No`, `Registration Date`, `Benefit Type`, `Status`, and `Remarks`.

## Fixed roadmap

1. Foundation — complete.
2. Database — create `bandhkam_kamgar_db`, tables, and the MySQL connection.
3. Authentication — login plus Admin, Operator, and Viewer access.
4. Master Data — CRUD, search, and filters.
5. Excel Integration — import, export, and validation.
6. Dashboard & Reports — live totals, charts, and filters.
7. AI Features — insights, duplicate detection, natural-language search, and summaries.
8. Deployment — office release, training, and final documentation.
