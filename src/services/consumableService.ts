import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Consumable } from "../models/Consumable";
import { AppUser } from "../models/User";
import { createAuditLog } from "./auditLogService";

const CONSUMABLES_COLLECTION = "consumables";

export const getConsumables = async (): Promise<Consumable[]> => {
  const q = query(collection(db, CONSUMABLES_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Consumable[];
};

export interface CreateConsumableInput {
  itemName: string;
  category: string;
  unit: string;
  quantity: number;
  minimumThreshold: number;
  storageLocation: string;
  supplier: string;
  remarks?: string;
}

export const createConsumable = async (
  input: CreateConsumableInput,
  currentUser: AppUser
) => {
  const docRef = await addDoc(collection(db, CONSUMABLES_COLLECTION), {
    ...input,
    remarks: input.remarks ?? "",
    createdAt: serverTimestamp(),
    createdBy: currentUser.uid,
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "CREATE_CONSUMABLE",
    entityType: "consumable",
    entityId: docRef.id,
    entityLabel: input.itemName,
    performedBy: currentUser,
    after: input,
  });

  return docRef;
};

export interface UpdateConsumableInput {
  itemName?: string;
  category?: string;
  unit?: string;
  quantity?: number;
  minimumThreshold?: number;
  storageLocation?: string;
  supplier?: string;
  remarks?: string;
}

export const updateConsumable = async (
  consumableId: string,
  updates: UpdateConsumableInput,
  currentUser: AppUser
) => {
  const consumableRef = doc(db, CONSUMABLES_COLLECTION, consumableId);

  await updateDoc(consumableRef, {
    ...updates,
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "UPDATE_CONSUMABLE",
    entityType: "consumable",
    entityId: consumableId,
    entityLabel: consumableId,
    performedBy: currentUser,
    after: updates,
  });
};