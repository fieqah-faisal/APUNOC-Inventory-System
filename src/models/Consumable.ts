import { Timestamp } from "firebase/firestore";

export interface Consumable {
  id?: string;
  itemName: string;
  category: string;
  unit: string;
  quantity: number;
  minimumThreshold: number;
  storageLocation: string;
  supplier: string;
  remarks: string;

  createdAt: Timestamp | null;
  createdBy: string;
  updatedAt: Timestamp | null;
  updatedBy: string;
}