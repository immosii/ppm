import {
  ageBucket,
  cell,
  classifyOrigin,
  extractParts,
  familyFromModel,
  familyFromType,
  modelKey,
  normSerial,
  serviceResult,
  warrantyOf,
} from "./classify.ts";
import { EARLY_DAYS } from "./classify.ts";
import { diffDays, hasDateToken, normHeader, parseJalali } from "./jalali.ts";
import type { Dataset, InstallAudit, InstallBucket, ReturnEvent } from "./types.ts";

export type RawRow = Record<string, unknown>;

function entries(row: RawRow): [string, unknown][] {
  return Object.entries(row).map(([k, v]) => [normHeader(k), v]);
}

function pick(row: RawRow, preds: ((header: string) => boolean)[]): string {
  const list = entries(row);
  for (const pred of preds) {
    const hit = list.find(([h]) => pred(h));
    if (hit && cell(hit[1])) return cell(hit[1]);
  }
  return "";
}

function isEmptyRow(row: RawRow): boolean {
  return Object.values(row).every((v) => cell(v) === "");
}

export function sheetKind(headers: string[]): "returns" | "installs" | "unknown" {
  const h = headers.map((x) => normHeader(x)).join(" | ");
  if (/علت|ریشه|سند انبار/.test(h)) return "returns";
  if (/مدل/.test(h) && /سریال/.test(h) && /نصب|پذیرش/.test(h)) return "installs";
  return "unknown";
}

type Inst = {
  serial: string;
  month: string;
  iso: string;
  prodIso: string | null;
  family: string;
  model: string;
  brand: string;
  missingModel: boolean;
  installBeforeProd: boolean;
};

function mapInstall(row: RawRow): Inst | "empty" | "bad-date" {
  if (isEmptyRow(row)) return "empty";
  const dateRaw = pick(row, [
    (h) => h.includes("تاریخ") && h.includes("نصب"),
    (h) => h.includes("تاریخ") && h.includes("پذیرش"),
  ]);
  const date = parseJalali(dateRaw);
  if (!date) return "bad-date";
  const modelRaw = pick(row, [(h) => h.includes("مدل")]);
  const model = modelKey(modelRaw) || "نامشخص";
  const typeFamily = familyFromType(pick(row, [(h) => h.includes("نوع") && h.includes("دستگاه")]));
  const family = typeFamily || familyFromModel(model) || "نامشخص";
  const prod = parseJalali(pick(row, [(h) => h.includes("تاریخ") && h.includes("تولید")]));
  return {
    serial: normSerial(pick(row, [(h) => h.includes("سریال")])),
    month: date.month,
    iso: date.iso,
    prodIso: prod?.iso ?? null,
    family,
    model,
    brand: family === "نامشخص" && model === "نامشخص" ? "نامشخص" : "آرتا گستر",
    missingModel: !modelKey(modelRaw),
    installBeforeProd: Boolean(prod && date.iso < prod.iso),
  };
}

function blankReturn(partial: Omit<ReturnEvent, "ageDays" | "ageBucket" | "early">): ReturnEvent {
  return { ...partial, ageDays: null, ageBucket: "تاریخ نصب ناموجود", early: null };
}

function mapReturn(row: RawRow, index: number): ReturnEvent | null {
  if (isEmptyRow(row)) return null;
  const modelRaw = pick(row, [(h) => h.includes("مدل")]);
  const model = modelKey(modelRaw) || "نامشخص";
  const family = familyFromModel(model) || familyFromType(pick(row, [(h) => h.includes("تفضیلی") || h.includes("مرکز")])) || "نامشخص";
  const returnRaw = pick(row, [
    (h) => h.includes("تاریخ") && (h.includes("سند") || h.includes("انبار")) && !h.includes("توضیح"),
    (h) => h.includes("تاریخ") && h.includes("برگشت"),
  ]);
  const prodRaw = pick(row, [(h) => h.includes("تاریخ") && h.includes("تولید")]);
  const installRaw = pick(row, [(h) => h.includes("تاریخ") && h.includes("نصب")]);
  const description = pick(row, [(h) => h.includes("توضیح") || h.includes("شرح") || h.includes("ایراد اعلامی")]);
  const cause = pick(row, [(h) => h === "علت" || h.startsWith("علت ")]) || "نامشخص";
  const action = pick(row, [(h) => h.includes("اقدام") && !h.includes("تاریخ")]);
  const root = pick(row, [(h) => h.includes("ریشه")]) || "نامشخص";
  const costRaw = pick(row, [(h) => h.includes("هزینه")]);
  const costNum = costRaw ? Number(costRaw.replace(/,/g, "")) : NaN;
  const ca = parseJalali(pick(row, [(h) => h.includes("تاریخ") && h.includes("اقدام")]));
  const serial = normSerial(pick(row, [(h) => h.includes("سریال")]));
  const ret = parseJalali(returnRaw);
  const prod = parseJalali(prodRaw);
  const inst = parseJalali(installRaw);
  const flags: string[] = [];
  if (!serial) flags.push("سریال ناموجود");
  if (!modelKey(modelRaw)) flags.push("مدل ناموجود");
  if (!ret) flags.push(hasDateToken(returnRaw) ? "تاریخ برگشت نامعتبر" : "تاریخ برگشت ناموجود");
  if (!prod) flags.push(hasDateToken(prodRaw) ? "تاریخ تولید نامعتبر" : "تاریخ تولید ناموجود");
  if (!inst) flags.push(hasDateToken(installRaw) ? "تاریخ نصب نامعتبر" : "تاریخ نصب ناموجود");
  if (!cause || cause === "نامشخص") flags.push("علت نامشخص");
  if (!root || root === "نامشخص") flags.push("ریشه نامشخص");
  return blankReturn({
    id: `r-${index}`,
    serial,
    serialMissing: !serial,
    doc: pick(row, [(h) => h.includes("سند") && !h.includes("تاریخ") && !h.includes("توضیح")]),
    model,
    modelRaw: modelRaw || "نامشخص",
    family,
    brand: family === "نامشخص" ? "نامشخص" : "آرتا گستر",
    returnDate: ret?.iso ?? null,
    returnMonth: ret?.month ?? null,
    prodDate: prod?.iso ?? null,
    installDate: inst?.iso ?? null,
    installDateSource: inst ? "return" : "missing",
    description,
    cause,
    action,
    parts: extractParts(action),
    root,
    origin: classifyOrigin(root),
    gradeInitial: pick(row, [(h) => h.includes("گرید") && h.includes("اول")]) || "نامشخص",
    gradeFinal: pick(row, [(h) => h.includes("گرید") && (h.includes("ثانویه") || h.includes("نهایی") || h.includes("دوم"))]) || "نامشخص",
    warehouse: pick(row, [(h) => h.includes("انبار") && !h.includes("تاریخ") && !h.includes("سند") && !h.includes("توضیح")]),
    costCenter: pick(row, [(h) => h.includes("تفضیلی") || h.includes("مرکز هزینه")]),
    note: pick(row, [(h) => h === "column2" || h.includes("یادداشت")]),
    warranty: warrantyOf(pick(row, [(h) => h.includes("گارانتی") && !h.includes("تاریخ")]), `${description} ${action} ${root}`),
    serviceResult: serviceResult(action),
    cost: Number.isFinite(costNum) ? costNum : null,
    caDate: ca?.iso ?? null,
    flags,
  });
}

function applyAge(row: ReturnEvent) {
  const flags = row.flags.filter(
    (flag) =>
      flag !== "تاریخ نصب ناموجود" &&
      flag !== "تاریخ نصب نامعتبر" &&
      flag !== "تاریخ تولید ناموجود" &&
      flag !== "تاریخ تولید نامعتبر" &&
      flag !== "نصب قبل از تولید" &&
      flag !== "برگشت قبل از نصب",
  );
  if (!row.installDate) flags.push("تاریخ نصب ناموجود یا نامعتبر");
  if (!row.prodDate) flags.push("تاریخ تولید ناموجود یا نامعتبر");
  if (row.prodDate && row.installDate && row.installDate < row.prodDate) flags.push("نصب قبل از تولید");
  if (row.returnDate && row.installDate && row.returnDate < row.installDate) flags.push("برگشت قبل از نصب");

  const ret = row.returnDate ? parseJalali(row.returnDate.replaceAll("-", "/")) : null;
  const inst = row.installDate ? parseJalali(row.installDate.replaceAll("-", "/")) : null;
  if (ret && inst) {
    const age = diffDays(ret, inst);
    row.ageDays = age;
    row.ageBucket = ageBucket(age, false, false, age < 0);
    row.early = age < 0 ? null : age <= EARLY_DAYS;
  } else {
    row.ageDays = null;
    row.ageBucket = ageBucket(null, !ret, !inst, false);
    row.early = null;
  }
  row.flags = flags;
}

type DateHit = { iso: string; prodIso: string | null };

const ENRICHED_FLAGS = new Set([
  "تاریخ نصب ناموجود",
  "تاریخ نصب نامعتبر",
  "تاریخ نصب ناموجود یا نامعتبر",
  "تاریخ تولید ناموجود",
  "تاریخ تولید نامعتبر",
  "تاریخ تولید ناموجود یا نامعتبر",
  "نصب قبل از تولید",
  "برگشت قبل از نصب",
  "تاریخ نصب از پرونده نصب",
  "تاریخ تولید از پرونده نصب",
  "تاریخ نصب با پرونده نصب متفاوت است",
  "سریال تکراری",
  "رکورد تکراری",
]);

function finalizeReturns(returns: ReturnEvent[], lookup: Map<string, DateHit>) {
  for (const row of returns) {
    row.flags = row.flags.filter((flag) => !ENRICHED_FLAGS.has(flag));
    if (row.installDateSource === "install-file") {
      row.installDate = null;
      row.installDateSource = "missing";
    }
    if (!row.serial) continue;
    const inst = lookup.get(row.serial);
    if (!inst) continue;
    if (!row.installDate) {
      row.installDate = inst.iso;
      row.installDateSource = "install-file";
      row.flags.push("تاریخ نصب از پرونده نصب");
    } else if (row.installDate !== inst.iso) {
      row.flags.push("تاریخ نصب با پرونده نصب متفاوت است");
    }
    if (!row.prodDate && inst.prodIso) {
      row.prodDate = inst.prodIso;
      row.flags.push("تاریخ تولید از پرونده نصب");
    }
  }

  const keyCount = new Map<string, number>();
  const serialCount = new Map<string, number>();
  for (const row of returns) {
    if (row.serial) serialCount.set(row.serial, (serialCount.get(row.serial) ?? 0) + 1);
    const key = [row.serial, row.doc, row.returnDate ?? "", row.model, row.description].join("|");
    keyCount.set(key, (keyCount.get(key) ?? 0) + 1);
  }
  for (const row of returns) {
    applyAge(row);
    if (row.serial && (serialCount.get(row.serial) ?? 0) > 1) row.flags.push("سریال تکراری");
    const key = [row.serial, row.doc, row.returnDate ?? "", row.model, row.description].join("|");
    if ((keyCount.get(key) ?? 0) > 1) row.flags.push("رکورد تکراری");
  }
}

function lookupFromIndex(index: Dataset["installIndex"]): Map<string, DateHit> {
  return new Map(index.map(([serial, iso, prodIso]) => [serial, { iso, prodIso }]));
}

export function buildDataset(returnRows: RawRow[], installRows: RawRow[], sources: string[]): Dataset {
  const returns: ReturnEvent[] = [];
  returnRows.forEach((row, i) => {
    const mapped = mapReturn(row, i);
    if (mapped) returns.push(mapped);
  });

  const audit: InstallAudit = {
    rows: 0,
    emptyRows: 0,
    invalidDate: 0,
    missingSerial: 0,
    duplicateRowsExcluded: 0,
    missingModel: 0,
    installBeforeProduction: 0,
    distinctSerials: 0,
    anonymousRows: 0,
    population: 0,
  };
  const bySerial = new Map<string, Inst>();
  const anonymous: Inst[] = [];
  for (const row of installRows) {
    const mapped = mapInstall(row);
    if (mapped === "empty") {
      audit.emptyRows += 1;
      continue;
    }
    audit.rows += 1;
    if (mapped === "bad-date") {
      audit.invalidDate += 1;
      continue;
    }
    if (mapped.missingModel) audit.missingModel += 1;
    if (mapped.installBeforeProd) audit.installBeforeProduction += 1;
    if (!mapped.serial) {
      audit.missingSerial += 1;
      anonymous.push(mapped);
      continue;
    }
    const prev = bySerial.get(mapped.serial);
    if (!prev) bySerial.set(mapped.serial, mapped);
    else {
      audit.duplicateRowsExcluded += 1;
      if (mapped.iso < prev.iso) bySerial.set(mapped.serial, mapped);
    }
  }

  const lookup = new Map<string, DateHit>();
  for (const inst of bySerial.values()) lookup.set(inst.serial, { iso: inst.iso, prodIso: inst.prodIso });
  finalizeReturns(returns, lookup);

  const bucketMap = new Map<string, InstallBucket>();
  const add = (inst: Inst) => {
    const k = `${inst.month}|${inst.family}|${inst.model}|${inst.brand}`;
    const found = bucketMap.get(k);
    if (found) found.count += 1;
    else bucketMap.set(k, { month: inst.month, family: inst.family, model: inst.model, brand: inst.brand, count: 1 });
  };
  for (const inst of bySerial.values()) add(inst);
  for (const inst of anonymous) add(inst);

  audit.distinctSerials = bySerial.size;
  audit.anonymousRows = anonymous.length;
  audit.population = bySerial.size + anonymous.length;
  const installIndex: [string, string, string | null][] = [...bySerial.values()].map((inst) => [inst.serial, inst.iso, inst.prodIso]);

  const notes = [
    "صورت کسر: تعداد ردیف‌های برگشتی دارای تاریخ سند انبار معتبر در ماه‌های انتخاب‌شده. ردیف حذف نمی‌شود؛ اگر تاریخ برگشت نامعتبر باشد فقط از صورتِ ماهانه کنار می‌رود و در کنترل داده می‌ماند.",
    "مخرج کسر: دستگاه‌های نصب‌شده با سریال یکتا. از هر سریال تکراری فقط زودترین تاریخ نصب/پذیرش در مخرج می‌ماند و بقیه در کنترل داده شمرده می‌شوند. ردیف بدون سریال قابل‌قبول حذف نشده و هر کدام یک نصب شمرده می‌شود.",
    "پنجره پیش‌فرض ۱۳ ماه است: از ماه مشابه سال قبل تا ماه برگشت، هر دو سر شامل. برای چند ماه، پنجره از (اولین ماه − ۱۲ ماه) تا آخرین ماه است.",
    "تاریخ نصب خالیِ برگشتی، فقط با تطبیق دقیق سریال از پرونده نصب پر می‌شود و روی همان ردیف برچسب می‌خورد.",
    "هزینه و تاریخ اقدام اصلاحی فقط اگر ستونشان در فایل باشد خوانده می‌شود.",
  ];

  return {
    returns,
    installs: [...bucketMap.values()].sort(
      (a, b) => a.month.localeCompare(b.month) || a.family.localeCompare(b.family, "fa") || a.model.localeCompare(b.model),
    ),
    installIndex,
    installAudit: audit,
    meta: {
      returnRows: returns.length,
      windowDefault: 13,
      earlyDays: EARLY_DAYS,
      sources,
      notes,
    },
  };
}

export function replaceReturns(dataset: Dataset, returnRows: RawRow[], source: string): Dataset {
  const returns: ReturnEvent[] = [];
  returnRows.forEach((row, index) => {
    const mapped = mapReturn(row, index);
    if (mapped) returns.push(mapped);
  });
  finalizeReturns(returns, lookupFromIndex(dataset.installIndex));
  return {
    ...dataset,
    returns,
    meta: {
      ...dataset.meta,
      returnRows: returns.length,
      sources: [`برگشتی: ${source}`, ...dataset.meta.sources.filter((item) => !item.startsWith("برگشتی:"))],
    },
  };
}

export function appendInstalls(dataset: Dataset, installRows: RawRow[], source: string): Dataset {
  const known = new Set(dataset.installIndex.map((row) => row[0]));
  const index: Dataset["installIndex"] = [...dataset.installIndex];
  const bucketMap = new Map<string, InstallBucket>();
  for (const bucket of dataset.installs) {
    bucketMap.set(`${bucket.month}|${bucket.family}|${bucket.model}|${bucket.brand}`, { ...bucket });
  }
  let added = 0;
  let dup = 0;
  let bad = 0;
  let seen = 0;
  let anonymous = 0;
  for (const row of installRows) {
    const mapped = mapInstall(row);
    if (mapped === "empty") continue;
    seen += 1;
    if (mapped === "bad-date") {
      bad += 1;
      continue;
    }
    if (mapped.serial && known.has(mapped.serial)) {
      dup += 1;
      continue;
    }
    if (mapped.serial) {
      known.add(mapped.serial);
      index.push([mapped.serial, mapped.iso, mapped.prodIso]);
    } else {
      anonymous += 1;
    }
    const key = `${mapped.month}|${mapped.family}|${mapped.model}|${mapped.brand}`;
    const found = bucketMap.get(key);
    if (found) found.count += 1;
    else bucketMap.set(key, { month: mapped.month, family: mapped.family, model: mapped.model, brand: mapped.brand, count: 1 });
    added += 1;
  }
  const returns = dataset.returns.map((row) => ({ ...row, flags: [...row.flags], parts: [...row.parts] }));
  finalizeReturns(returns, lookupFromIndex(index));
  return {
    ...dataset,
    returns,
    installs: [...bucketMap.values()].sort(
      (a, b) => a.month.localeCompare(b.month) || a.family.localeCompare(b.family, "fa") || a.model.localeCompare(b.model),
    ),
    installIndex: index,
    installAudit: {
      ...dataset.installAudit,
      rows: dataset.installAudit.rows + seen,
      invalidDate: dataset.installAudit.invalidDate + bad,
      duplicateRowsExcluded: dataset.installAudit.duplicateRowsExcluded + dup,
      missingSerial: dataset.installAudit.missingSerial + anonymous,
      anonymousRows: dataset.installAudit.anonymousRows + anonymous,
      distinctSerials: index.length,
      population: index.length + dataset.installAudit.anonymousRows + anonymous,
    },
    meta: {
      ...dataset.meta,
      returnRows: returns.length,
      sources: [...dataset.meta.sources, `نصب افزوده‌شده: ${source} (${added} ردیف تازه، ${dup} سریال تکراری نادیده)`],
    },
  };
}

export function repeatSerials(returns: ReturnEvent[]): Set<string> {
  const count = new Map<string, number>();
  for (const row of returns) {
    if (!row.serial) continue;
    count.set(row.serial, (count.get(row.serial) ?? 0) + 1);
  }
  const set = new Set<string>();
  for (const [serial, n] of count) if (n > 1) set.add(serial);
  return set;
}
