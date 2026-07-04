export const CONSTANTS = {
  APP_NAME: "CemGuard",
  COMPANY_NAME: "Dangote Cement Plc",
  THEME: {
    DARK: "dark",
  }
};

export const EQUIPMENT_STATUS = {
  ACTIVE: "Active",
  MAINTENANCE: "Maintenance",
  INACTIVE: "Inactive",
  CRITICAL: "Critical",
} as const;

export const EQUIPMENT_CATEGORIES = {
  CRUSHER: "Crusher",
  KILN: "Kiln",
  MILL: "Mill",
  CONVEYOR: "Conveyor",
  SILO: "Silo",
  PACKER: "Packer",
} as const;

export const ALERT_LEVELS = {
  INFO: "Info",
  WARNING: "Warning",
  CRITICAL: "Critical",
} as const;

export const MAINTENANCE_STATUS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  ENDED: "Ended", // Strict requirement
} as const;

export const RISK_LEVELS = {
  LOW: "Low",
  MODERATE: "Moderate",
  HIGH: "High",
  SEVERE: "Severe",
} as const;
