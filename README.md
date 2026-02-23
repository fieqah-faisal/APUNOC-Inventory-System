# APU Internal NOC Inventory & Asset Management System

Internal NOC Inventory & Asset Management System for Asia Pacific University of Technology & Innovation (APU).
This system provides centralized inventory visibility, barcode-based asset tracking, role-based access control,
and structured project/site tracking for NOC operations.

## Features (MVP)
- Dashboard overview (inventory by status, category breakdown)
- Asset tracking (unique barcode/QR per asset)
- Consumables tracking (quantity-based)
- Sites/Projects hierarchy (Category → Site/Project → Unit)
- Movement logs (who changed what, when, where)
- Excel import (bulk asset/consumable onboarding)
- Role-based access control:
  - **Super Admin**: full access + user management
  - **Admin**: full inventory control
  - **Operator**: add/update inventory operations

## Tech Stack
- Frontend: React + TypeScript (Vite) + TailwindCSS
- Charts: Recharts
- Icons: lucide-react
- Excel parsing: xlsx
- Backend (planned): Firebase (Auth, Firestore, Functions, Hosting, Storage)

## Getting Started (Frontend)
### Prerequisites
- Node.js (LTS recommended)

### Install & run
```bash
npm install
npm run dev
