import { Timestamp } from "firebase/firestore";
import { LocationType } from "./enums";
import { AssetStatus } from "./enums";

export interface Asset {
  id?: string;
  assetCode: string;
  barcode: string;

  category: string;
  subcategory: string;
  brand: string;
  model: string;
  serialNumber: string;

  status: AssetStatus;

  locationType: LocationType;
  siteName: string;
  buildingOrBlock: string;
  floor: string;
  roomOrUnit: string;
  rack: string | null;

  deployedToLocation: string | null;
  issuedToUser: string | null;
  custodian: string | null;

  purchaseDate: Timestamp | null;
  warrantyExpiry: Timestamp | null;
  remarks: string;

  importedFrom: string | null;

  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
}