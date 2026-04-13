# APUNOC Inventory System — OpenCode Task Context

## Project Overview
This project is an internal inventory and asset management system for APU NOC.

### Stack
- React
- TypeScript
- Firebase Authentication
- Firestore
- Firebase Cloud Functions (for backend/admin actions)

### Purpose
The system is for internal NOC operations only.
It is not public-facing.
It manages:
- assets
- consumables
- locations
- users
- audit logs

## Current Business Direction
### Authentication
- Public self-registration is removed.
- Login is internal only.
- Accounts must be created by admins, not by end users.
- If a Firebase Auth account exists but no Firestore user profile exists, access must be blocked.
- If Firestore user status is `disabled`, access must be blocked.

### Roles
There are exactly 3 roles:
- `super-admin`
- `admin`
- `operator`

### Role Intent
#### super-admin
- full access
- can manage users
- can access audit logs
- can perform all admin/system actions

#### admin
- can manage users
- can manage assets
- can manage consumables
- can manage locations
- can view audit logs
- can import inventory

#### operator
- operational inventory role
- can update stock/status/import-related fields
- can retire assets
- cannot manage users
- cannot view audit logs
- cannot hard delete assets
- cannot change deployed asset location unless explicitly allowed later

### Role Restriction
- Only `super-admin` may create another `super-admin`.
- `admin` must not be allowed to create `super-admin`.

## Firestore Collections
### users
Fields:
- uid
- username
- email
- role
- status
- createdAt
- createdBy
- lastLogin
- tempPasswordSetByAdmin

### assets
Fields include:
- assetCode
- barcode
- category
- subcategory
- brand
- model
- serialNumber
- status
- locationType
- siteName
- buildingOrBlock
- floor
- roomOrUnit
- rack
- deployedToLocation
- issuedToUser
- custodian
- purchaseDate
- warrantyExpiry
- remarks
- importedFrom
- createdAt
- createdBy
- updatedAt
- updatedBy

### consumables
Fields include:
- itemName
- category
- unit
- quantity
- minimumThreshold
- storageLocation
- supplier
- remarks
- createdAt
- createdBy
- updatedAt
- updatedBy

### locations
Fields include:
- locationType
- siteName
- buildingOrBlock
- floor
- roomOrUnit
- rack
- label
- isActive
- createdAt
- createdBy

### audit_logs
Fields include:
- action
- entityType
- entityId
- entityLabel
- performedByUid
- performedByEmail
- performedByRole
- before
- after
- result
- message
- createdAt

## Current Status
Already implemented:
- login-only auth
- public registration removed
- Firestore-backed assets/consumables/locations/users listing
- service layer exists
- asset create/edit/retire/archive exists
- Firestore role/permission helpers exist
- Firestore security rules are being tightened
- Cloud Functions folder exists but provisioning is not implemented yet

## Known Pre-Provisioning Issues
These must be respected during future changes:
- repo and deployed Firestore rules must stay aligned
- disabled-user enforcement must exist in security/backend logic, not only UI
- stale permission files have been removed and must not be recreated
- user provisioning must not use client-side `createUserWithEmailAndPassword`
- audit logging for sensitive admin actions should move toward backend ownership
- avoid broad/uncontrolled client writes

## Provisioning Direction
Admin-created provisioning must be implemented through backend code.

### Required backend behavior
A backend/admin function should:
1. verify caller is authenticated
2. load caller Firestore profile
3. verify caller is `admin` or `super-admin`
4. reject operator callers
5. reject any admin attempt to create `super-admin`
6. create Firebase Auth user
7. create Firestore `users/{uid}` document
8. write audit log
9. handle partial failure safely

### Not allowed
- no public registration
- no client-side Auth account creation for internal users
- no frontend-only permission enforcement
- no speculative role changes
- no hard delete flow unless explicitly requested later

## Coding Rules for OpenCode
- Keep changes minimal and scoped.
- Do not rewrite unrelated UI.
- Do not rename role values.
- Do not introduce new collections unless explicitly requested.
- Do not create duplicate permission helpers.
- Prefer typed DTOs/interfaces for request payloads.
- Explain file changes clearly.
- When unsure, preserve existing architecture and ask for a review-oriented output instead of broad refactors.

## Files OpenCode Should Treat Carefully
- `firestore.rules`
- `firebase.json`
- `functions/src/index.ts`
- `src/context/AuthContext.tsx`
- `src/services/userService.ts`
- `src/services/authService.ts`
- `src/services/auditLogService.ts`
- `src/permissions/roles.ts`
- `src/permissions/permissions.ts`

## Current Task Focus
The current focus is:
1. pre-provisioning cleanup and hardening
2. backend readiness
3. admin-created user provisioning after approval

OpenCode should not jump straight into full provisioning unless explicitly instructed.