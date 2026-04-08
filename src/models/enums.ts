export type UserRole = "super-admin" | "admin" | "operator";

export type UserStatus = "active" | "disabled";

export type LocationType = 
    | "APU_campus"
    | "accommodation_on_campus"
    | "accommodation_off_campus"
    | "accommodation_satellite_campus"
    | "storeroom";

export type AssetStatus =
    | "in_stock"
    | "deployed"
    | "under_repair"
    | "replacement"
    | "retired"
    | "archived";

export type AuditEntityType = 
    | "user"
    | "asset"
    | "location"
    | "consumable"
    | "import";

export type AuditResult = "success" | "failure";
