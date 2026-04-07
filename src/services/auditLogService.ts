import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuditEntityType, AuditResult } from "../models/enums";
import { AppUser } from "../models/User";

const AUDIT_LOGS_COLLECTION = "audit_logs";

interface CreateAuditLogParams {
  action: string;
  entityType: AuditEntityType;
  entityId: string;
  entityLabel: string;
  performedBy: AppUser;
  before?: Record<string, any> | null;
  after?: Record<string, any> | null;
  result?: AuditResult;
  message?: string | null;
}

export const createAuditLog = async ({
  action,
  entityType,
  entityId,
  entityLabel,
  performedBy,
  before = null,
  after = null,
  result = "success",
  message = null,
}: CreateAuditLogParams) => {
  await addDoc(collection(db, AUDIT_LOGS_COLLECTION), {
    action,
    entityType,
    entityId,
    entityLabel,
    performedByUid: performedBy.uid,
    performedByEmail: performedBy.email,
    performedByRole: performedBy.role,
    before,
    after,
    result,
    message,
    createdAt: serverTimestamp(),
  });
};