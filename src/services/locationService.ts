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
import { Location } from "../models/Location";
import { AppUser } from "../models/User";
import { createAuditLog } from "./auditLogService";

const LOCATIONS_COLLECTION = "locations";

export const getLocations = async (): Promise<Location[]> => {
  const q = query(collection(db, LOCATIONS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as Location[];
};

export interface CreateLocationInput {
  locationType: Location["locationType"];
  siteName: string;
  buildingOrBlock: string;
  floor: string;
  roomOrUnit: string;
  rack?: string | null;
  label: string;
  isActive?: boolean;
}

export const createLocation = async (
  input: CreateLocationInput,
  currentUser: AppUser
) => {
  const docRef = await addDoc(collection(db, LOCATIONS_COLLECTION), {
    ...input,
    rack: input.rack ?? null,
    isActive: input.isActive ?? true,
    createdAt: serverTimestamp(),
    createdBy: currentUser.uid,
  });

  await createAuditLog({
    action: "CREATE_LOCATION",
    entityType: "location",
    entityId: docRef.id,
    entityLabel: input.label,
    performedBy: currentUser,
    after: input,
  });

  return docRef;
};

export interface UpdateLocationInput {
  locationType?: Location["locationType"];
  siteName?: string;
  buildingOrBlock?: string;
  floor?: string;
  roomOrUnit?: string;
  rack?: string | null;
  label?: string;
  isActive?: boolean;
}

export const updateLocation = async (
  locationId: string,
  updates: UpdateLocationInput,
  currentUser: AppUser
) => {
  const locationRef = doc(db, LOCATIONS_COLLECTION, locationId);

  await updateDoc(locationRef, {
    ...updates,
  });

  await createAuditLog({
    action: "UPDATE_LOCATION",
    entityType: "location",
    entityId: locationId,
    entityLabel: locationId,
    performedBy: currentUser,
    after: updates,
  });
};