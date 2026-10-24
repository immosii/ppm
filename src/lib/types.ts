export type PartKind = "replaced" | "repaired" | "added";

export type PartUse = {
  kind: PartKind;
  name: string;
};

export type ReturnEvent = {
  id: string;
  serial: string;
  serialMissing: boolean;
  doc: string;
  model: string;
  modelRaw: string;
  family: string;
  brand: string;
  returnDate: string | null;
  returnMonth: string | null;
  prodDate: string | null;
  installDate: string | null;
  installDateSource: "return" | "install-file" | "missing";
  description: string;
  cause: string;
  action: string;
  parts: PartUse[];
  root: string;
  origin: string;
  gradeInitial: string;
  gradeFinal: string;
  warehouse: string;
  costCenter: string;
  note: string;
  warranty: string;
  serviceResult: string;
  cost: number | null;
  caDate: string | null;
  ageDays: number | null;
  ageBucket: string;
  early: boolean | null;
  flags: string[];
};

export type InstallBucket = {
  month: string;
  family: string;
  model: string;
  brand: string;
  count: number;
};

export type InstallAudit = {
  rows: number;
  emptyRows: number;
  invalidDate: number;
  missingSerial: number;
  duplicateRowsExcluded: number;
  missingModel: number;
  installBeforeProduction: number;
  distinctSerials: number;
  anonymousRows: number;
  population: number;
};

export type DatasetMeta = {
  returnRows: number;
  windowDefault: number;
  earlyDays: number;
  sources: string[];
  notes: string[];
};

export type Dataset = {
  returns: ReturnEvent[];
  installs: InstallBucket[];
  /** serial, install iso, production iso. Used to join later return uploads. */
  installIndex: [string, string, string | null][];
  installAudit: InstallAudit;
  meta: DatasetMeta;
};

export type Filters = {
  years: string[];
  months: string[];
  seasons: string[];
  families: string[];
  brands: string[];
  models: string[];
  causes: string[];
  roots: string[];
  origins: string[];
  parts: string[];
  warranties: string[];
  gradesIn: string[];
  gradesOut: string[];
  early: "all" | "yes" | "no" | "unknown";
  repeat: "all" | "yes" | "no";
  windowMonths: number;
};
