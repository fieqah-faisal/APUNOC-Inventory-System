import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Asset } from "../models/Asset";
import { AssetStatus } from "../models/enums";
import { AppUser } from "../models/User";
import { createAuditLog } from "./auditLogService";

const ASSETS_COLLECTION = "assets";

export interface CreateAssetInput {
  assetCode: string;
  barcode: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: AssetStatus;
  locationType: Asset["locationType"];
  siteName: string;
  buildingOrBlock: string;
  floor: string;
  roomOrUnit: string;
  rack?: string | null;
  deployedToLocation?: string | null;
  issuedToUser?: string | null;
  custodian?: string | null;
  purchaseDate?: Asset["purchaseDate"];
  warrantyExpiry?: Asset["warrantyExpiry"];
  remarks?: string;
  importedFrom?: string | null;
}

export const createAsset = async (
  input: CreateAssetInput,
  currentUser: AppUser
) => {
  const docRef = await addDoc(collection(db, ASSETS_COLLECTION), {
    ...input,
    rack: input.rack ?? null,
    deployedToLocation: input.deployedToLocation ?? null,
    issuedToUser: input.issuedToUser ?? null,
    custodian: input.custodian ?? null,
    purchaseDate: input.purchaseDate ?? null,
    warrantyExpiry: input.warrantyExpiry ?? null,
    remarks: input.remarks ?? "",
    importedFrom: input.importedFrom ?? null,
    createdAt: serverTimestamp(),
    createdBy: currentUser.uid,
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "CREATE_ASSET",
    entityType: "asset",
    entityId: docRef.id,
    entityLabel: input.assetCode,
    performedBy: currentUser,
    after: input,
  });

  return docRef;
};

export interface UpdateAssetOperationalInput {
  status?: AssetStatus;
  remarks?: string;
  issuedToUser?: string | null;
  custodian?: string | null;
}

export const updateAssetOperationalFields = async (
  assetId: string,
  updates: UpdateAssetOperationalInput,
  currentUser: AppUser
) => {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);

  await updateDoc(assetRef, {
    ...updates,
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "UPDATE_ASSET_OPERATIONAL_FIELDS",
    entityType: "asset",
    entityId: assetId,
    entityLabel: assetId,
    performedBy: currentUser,
    after: updates,
  });
};

export interface UpdateAssetAdminInput {
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  status?: AssetStatus;
  locationType?: Asset["locationType"];
  siteName?: string;
  buildingOrBlock?: string;
  floor?: string;
  roomOrUnit?: string;
  rack?: string | null;
  deployedToLocation?: string | null;
  issuedToUser?: string | null;
  custodian?: string | null;
  purchaseDate?: Asset["purchaseDate"];
  warrantyExpiry?: Asset["warrantyExpiry"];
  remarks?: string;
}

export const updateAssetAdminFields = async (
  assetId: string,
  updates: UpdateAssetAdminInput,
  currentUser: AppUser
) => {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);

  await updateDoc(assetRef, {
    ...updates,
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "UPDATE_ASSET_ADMIN_FIELDS",
    entityType: "asset",
    entityId: assetId,
    entityLabel: assetId,
    performedBy: currentUser,
    after: updates,
  });
};

export const retireAsset = async (
  assetId: string,
  currentUser: AppUser,
  remarks?: string
) => {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);

  await updateDoc(assetRef, {
    status: "retired",
    remarks: remarks ?? "",
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "RETIRE_ASSET",
    entityType: "asset",
    entityId: assetId,
    entityLabel: assetId,
    performedBy: currentUser,
    after: {
      status: "retired",
      remarks: remarks ?? "",
    },
  });
};

export const archiveAsset = async (
  assetId: string,
  currentUser: AppUser,
  remarks?: string
) => {
  const assetRef = doc(db, ASSETS_COLLECTION, assetId);

  await updateDoc(assetRef, {
    status: "archived",
    remarks: remarks ?? "",
    updatedAt: serverTimestamp(),
    updatedBy: currentUser.uid,
  });

  await createAuditLog({
    action: "ARCHIVE_ASSET",
    entityType: "asset",
    entityId: assetId,
    entityLabel: assetId,
    performedBy: currentUser,
    after: {
      status: "archived",
      remarks: remarks ?? "",
    },
  });
};