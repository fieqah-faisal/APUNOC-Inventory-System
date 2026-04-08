import { Timestamp } from "firebase/firestore";
import { LocationType } from "./enums";

export interface Location {
    id?: string;
    locationType: LocationType;
    siteName: string;
    buildingOrBlock: string;
    floor: string;
    roomOrUnit: string;
    rack: string | null;
    label: string;
    isActive: boolean;
    createdAt: Timestamp | null;
    createdBy: string;
}
