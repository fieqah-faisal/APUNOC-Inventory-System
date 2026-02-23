export type AssetStatus = 'in-stock' | 'deployed' | 'under-repair' | 'replacement' | 'retired';

export type UserRole = 'super-admin' | 'admin' | 'operator';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Site {
  id: string;
  name: string;
  categoryId: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
}

export interface Location {
  id: string;
  building: string;
  floor: string;
  room: string;
  rack?: string;
  siteId?: string;
}

export interface Asset {
  id: string;
  barcode: string;
  brand: string;
  model: string;
  serialNumber: string;
  categoryId: string;
  siteId?: string;
  status: AssetStatus;
  locationId?: string;
  notes?: string;
  createdAt: Date;
  warrantyExpiry?: Date;
  retiredReason?: string;
  retiredAt?: Date;
  retiredBy?: string;
}

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  quantity: number;
  minThreshold: number;
}

export interface MovementLog {
  id: string;
  assetId: string;
  oldStatus?: AssetStatus;
  newStatus: AssetStatus;
  oldLocationId?: string;
  newLocationId?: string;
  updatedBy: string;
  timestamp: Date;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface ImportPreviewRow {
  rowNumber: number;
  data: any;
  errors: string[];
  isValid: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  timestamp: Date;
}
