export type UserRole = "super_admin" | "admin" | "operator";

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
    | "replacemeent"
    | "retired"
    | "archived";

export type AuditEntityType = 
    | "user"
    | "asset"
    | "location"
    | "consumable"
    | "import";

export type auditResult = "success" | "failure";
