import { Timestamp } from "firebase/firestore";
import { UserRole } from "./enums";
import { AuditEntityType, auditResult } from "./enums";

export interface AuditLog {
  id?: string;
  action: string;
  entityType: AuditEntityType;
  entityId: string;
  entityLabel: string;

  performedByUid: string;
  performedByEmail: string;
  performedByRole: UserRole;

  before: Record<string, any> | null;
  after: Record<string, any> | null;

  result: auditResult;
  message: string | null;
  createdAt: Timestamp | null;
}