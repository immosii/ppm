import { ASSEMBLY_ORIGINS, EARLY_DAYS } from "./classify.ts";
import { repeatSerials } from "./dataset.ts";
import { labelMonth, seasonOf, shiftMonth } from "./jalali.ts";
import type { Dataset, Filters, InstallBucket, ReturnEvent } from "./types.ts";

export const defaultFilters: Filters = {
  years: [],
  months: [],
  seasons: [],
  families: [],
  brands: [],
  models: [],
  causes: [],
  roots: [],
  origins: [],
  parts: [],
  warranties: [],
  gradesIn: [],
  gradesOut: [],
  early: "all",
  repeat: "all",
  windowMonths: 13,
};

export type CountRow = { name: string; n: number; share: number; ppm: number | null };
export type ModelRow = {
  model: string;
  family: string;
  n: number;
  installs: number;
  ppm: number | null;
  share: number;
};
export type CauseRow = CountRow & {
  cum: number;
  earlyShare: number | null;
  repeatShare: number | null;
  trend: "صعودی" | "نزولی" | "ثابت" | "کم‌داده";
  score: number;
  models: string[];
  families: string[];
  parts: string[];
  origins: string[];
  roots: string[];
};
export type PartRow = {
  name: string;
  kind: string;
  n: number;
  events: number;
  models: string[];
  causes: string[];
};
export type MonthPoint = {
  month: string;
  label: string;
  returns: number;
  installs: number;
  ppm: number | null;
  windowStart: string;
  windowEnd: string;
};
export type MatrixCell = { a: string; b: string; n: number };

export type QualityView = {
  months: string[];
  window: { start: string; end: string; length: number } | null;
  numerator: ReturnEvent[];
  undatedRows: ReturnEvent[];
  undated: number;
  denominator: number;
  ppm: number | null;
  byMonth: MonthPoint[];
  byFamily: ModelRow[];
  byModel: ModelRow[];
  byCause: CauseRow[];
  byOrigin: CountRow[];
  byRoot: CountRow[];
  byAge: CountRow[];
  byPart: PartRow[];
  early: { yes: number; no: number; unknown: number; rate: number | null };
  repeat: { events: number; serials: number; rate: number | null; eligible: number };
  assembly: { count: number; rate: number | null };
  topCause: CauseRow | null;
  criticalModel: ModelRow | null;
  modelsWithoutBase: ModelRow[];
  topPart: PartRow | null;
  causeModel: MatrixCell[];
  causeFamily: MatrixCell[];
  priorities: CauseRow[];
  fieldFill: { label: string; filled: number; total: number; rate: number }[];
  completeness: number;
  issueCounts: { flag: string; n: number }[];
  cost: { total: number; rows: number } | null;
  hasCaDate: boolean;
  narrative: string[];
};

const FILL_FIELDS: { key: keyof ReturnEvent; label: string; empty: (row: ReturnEvent) => boolean }[] = [
  { key: "serial", label: "سریال", empty: (r) => r.serialMissing },
  { key: "model", label: "مدل", empty: (r) => r.model === "نامشخص" },
  { key: "family", label: "خانواده", empty: (r) => r.family === "نامشخص" },
  { key: "returnDate", label: "تاریخ برگشت", empty: (r) => !r.returnDate },
  { key: "installDate", label: "تاریخ نصب", empty: (r) => !r.installDate },
  { key: "prodDate", label: "تاریخ تولید", empty: (r) => !r.prodDate },
  { key: "cause", label: "علت", empty: (r) => !r.cause || r.cause === "نامشخص" },
  { key: "root", label: "ریشه احتمالی", empty: (r) => !r.root || r.root === "نامشخص" },
  { key: "origin", label: "منشأ", empty: (r) => !r.origin || r.origin === "نامشخص" },
  { key: "action", label: "اقدام", empty: (r) => !r.action },
  { key: "description", label: "شرح خرابی", empty: (r) => !r.description },
  { key: "gradeInitial", label: "گرید اولیه", empty: (r) => !r.gradeInitial || r.gradeInitial === "نامشخص" },
  { key: "gradeFinal", label: "گرید نهایی", empty: (r) => !r.gradeFinal || r.gradeFinal === "نامشخص" },
];

function selectedMonths(dataset: Dataset, filters: Filters): string[] {
  const present = [...new Set(dataset.returns.map((r) => r.returnMonth).filter((m): m is string => Boolean(m)))].sort();
  const yearsInData = [...new Set(present.map((m) => m.slice(0, 4)))];
  const timeActive = filters.years.length + filters.months.length + filters.seasons.length > 0;
  if (!timeActive) return present;
  const years = filters.years.length ? filters.years : yearsInData;
  const monthNums = filters.months.length
    ? filters.months
    : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const out: string[] = [];
  for (const year of years) {
    for (const month of monthNums) {
      if (filters.seasons.length && !filters.seasons.includes(seasonOf(month))) continue;
      const key = `${year}-${month}`;
      if (!filters.months.length && !filters.seasons.length && !present.includes(key)) continue;
      out.push(key);
    }
  }
  return [...new Set(out)].sort();
}

function productMatch(row: { family: string; brand: string; model: string }, filters: Filters): boolean {
  if (filters.families.length && !filters.families.includes(row.family)) return false;
  if (filters.brands.length && !filters.brands.includes(row.brand)) return false;
  if (filters.models.length && !filters.models.includes(row.model)) return false;
  return true;
}

function attrMatch(row: ReturnEvent, filters: Filters, repeats: Set<string>): boolean {
  if (filters.causes.length && !filters.causes.includes(row.cause)) return false;
  if (filters.roots.length && !filters.roots.includes(row.root)) return false;
  if (filters.origins.length && !filters.origins.includes(row.origin)) return false;
  if (filters.parts.length && !row.parts.some((part) => filters.parts.includes(part.name))) return false;
  if (filters.warranties.length && !filters.warranties.includes(row.warranty)) return false;
  if (filters.gradesIn.length && !filters.gradesIn.includes(row.gradeInitial)) return false;
  if (filters.gradesOut.length && !filters.gradesOut.includes(row.gradeFinal)) return false;
  if (filters.early === "yes" && row.early !== true) return false;
  if (filters.early === "no" && row.early !== false) return false;
  if (filters.early === "unknown" && row.early !== null) return false;
  const isRepeat = Boolean(row.serial) && repeats.has(row.serial);
  if (filters.repeat === "yes" && !isRepeat) return false;
  if (filters.repeat === "no" && (row.serialMissing || isRepeat)) return false;
  return true;
}

function countInstalls(
  installs: InstallBucket[],
  filters: Filters,
  start: string,
  end: string,
  extra?: { family?: string; model?: string },
): number {
  let n = 0;
  for (const bucket of installs) {
    if (bucket.month < start || bucket.month > end) continue;
    if (!productMatch(bucket, filters)) continue;
    if (extra?.family && bucket.family !== extra.family) continue;
    if (extra?.model && bucket.model !== extra.model) continue;
    n += bucket.count;
  }
  return n;
}

function ppm(n: number, d: number): number | null {
  if (d <= 0) return null;
  return (n / d) * 1_000_000;
}

function share(n: number, total: number): number {
  if (total <= 0) return 0;
  return n / total;
}

function trendOf(months: string[], rows: ReturnEvent[], cause: string): CauseRow["trend"] {
  if (months.length < 2) return "کم‌داده";
  const mid = Math.ceil(months.length / 2);
  const first = new Set(months.slice(0, mid));
  const second = new Set(months.slice(mid));
  let a = 0;
  let b = 0;
  for (const row of rows) {
    if (row.cause !== cause || !row.returnMonth) continue;
    if (first.has(row.returnMonth)) a += 1;
    if (second.has(row.returnMonth)) b += 1;
  }
  if (b > a) return "صعودی";
  if (b < a) return "نزولی";
  return "ثابت";
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function buildView(dataset: Dataset, filters: Filters): QualityView {
  const repeats = repeatSerials(dataset.returns);
  const months = selectedMonths(dataset, filters);
  const window =
    months.length === 0
      ? null
      : {
          start: shiftMonth(months[0], -(filters.windowMonths - 1)),
          end: months[months.length - 1],
          length: filters.windowMonths,
        };
  const pool = dataset.returns.filter((row) => productMatch(row, filters) && attrMatch(row, filters, repeats));
  const monthSet = new Set(months);
  const numerator = pool.filter((row) => row.returnMonth && monthSet.has(row.returnMonth));
  const undatedRows = pool.filter((row) => !row.returnMonth);
  const undated = undatedRows.length;
  const denominator = window ? countInstalls(dataset.installs, filters, window.start, window.end) : 0;
  const totalPpm = ppm(numerator.length, denominator);

  const byMonth: MonthPoint[] = months.map((month) => {
    const start = shiftMonth(month, -(filters.windowMonths - 1));
    const returns = numerator.filter((row) => row.returnMonth === month).length;
    const installs = countInstalls(dataset.installs, filters, start, month);
    return {
      month,
      label: labelMonth(month),
      returns,
      installs,
      ppm: ppm(returns, installs),
      windowStart: start,
      windowEnd: month,
    };
  });

  const familyNames = new Set<string>();
  for (const row of numerator) familyNames.add(row.family);
  if (window) {
    for (const bucket of dataset.installs) {
      if (bucket.month < window.start || bucket.month > window.end) continue;
      if (!productMatch(bucket, filters)) continue;
      if (bucket.count > 0) familyNames.add(bucket.family);
    }
  }
  const byFamily: ModelRow[] = [...familyNames]
    .map((family) => {
      const n = numerator.filter((row) => row.family === family).length;
      const installs = window ? countInstalls(dataset.installs, filters, window.start, window.end, { family }) : 0;
      return { model: family, family, n, installs, ppm: ppm(n, installs), share: share(n, numerator.length) };
    })
    .sort((a, b) => (b.ppm ?? -1) - (a.ppm ?? -1) || b.n - a.n);

  const modelNames = unique(numerator.map((row) => `${row.family}\t${row.model}`));
  const byModel: ModelRow[] = modelNames
    .map((key) => {
      const [family, model] = key.split("\t");
      const n = numerator.filter((row) => row.family === family && row.model === model).length;
      const installs = window ? countInstalls(dataset.installs, filters, window.start, window.end, { family, model }) : 0;
      return { model, family, n, installs, ppm: ppm(n, installs), share: share(n, numerator.length) };
    })
    .sort((a, b) => (b.ppm ?? -1) - (a.ppm ?? -1) || b.n - a.n);

  const causeNames = unique(numerator.map((row) => row.cause));
  const rawCauses: CauseRow[] = causeNames.map((cause) => {
    const rows = numerator.filter((row) => row.cause === cause);
    const n = rows.length;
    const dated = rows.filter((row) => row.early !== null);
    const earlyYes = rows.filter((row) => row.early === true).length;
    const withSerial = rows.filter((row) => row.serial);
    const rep = withSerial.filter((row) => repeats.has(row.serial)).length;
    return {
      name: cause,
      n,
      share: share(n, numerator.length),
      ppm: ppm(n, denominator),
      cum: 0,
      earlyShare: dated.length ? earlyYes / dated.length : null,
      repeatShare: withSerial.length ? rep / withSerial.length : null,
      trend: trendOf(months, numerator, cause),
      score: 0,
      models: unique(rows.map((row) => row.model)),
      families: unique(rows.map((row) => row.family)),
      parts: unique(rows.flatMap((row) => row.parts.map((part) => part.name))),
      origins: unique(rows.map((row) => row.origin)),
      roots: unique(rows.map((row) => row.root)),
    };
  });
  rawCauses.sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "fa"));
  let running = 0;
  for (const cause of rawCauses) {
    running += cause.n;
    cause.cum = numerator.length ? running / numerator.length : 0;
  }
  const maxN = rawCauses[0]?.n ?? 0;
  const maxPpm = Math.max(0, ...rawCauses.map((cause) => cause.ppm ?? 0));
  for (const cause of rawCauses) {
    const trendScore = cause.trend === "صعودی" ? 1 : cause.trend === "نزولی" ? 0 : 0.5;
    cause.score =
      100 *
      (0.4 * (maxN ? cause.n / maxN : 0) +
        0.25 * (maxPpm ? (cause.ppm ?? 0) / maxPpm : 0) +
        0.15 * (cause.earlyShare ?? 0) +
        0.1 * (cause.repeatShare ?? 0) +
        0.1 * trendScore);
  }
  const priorities = [...rawCauses].sort((a, b) => b.score - a.score || b.n - a.n);

  const byOrigin = countBy(numerator, (row) => row.origin, denominator);
  const byRoot = countBy(numerator, (row) => row.root, denominator);
  const byAge = countBy(numerator, (row) => row.ageBucket, denominator);

  const partMap = new Map<string, PartRow>();
  for (const row of numerator) {
    const seen = new Set<string>();
    for (const part of row.parts) {
      const key = `${part.kind}|${part.name}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const found = partMap.get(key) ?? {
        name: part.name,
        kind: part.kind === "replaced" ? "تعویض" : part.kind === "added" ? "افزودن" : "تعمیر",
        n: 0,
        events: 0,
        models: [],
        causes: [],
      };
      found.n += 1;
      found.events += 1;
      found.models = unique([...found.models, row.model]);
      found.causes = unique([...found.causes, row.cause]);
      partMap.set(key, found);
    }
  }
  const byPart = [...partMap.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "fa"));
  const replaced = byPart.filter((part) => part.kind === "تعویض");

  const earlyYes = numerator.filter((row) => row.early === true).length;
  const earlyNo = numerator.filter((row) => row.early === false).length;
  const earlyUnknown = numerator.filter((row) => row.early === null).length;
  const repeatEvents = numerator.filter((row) => row.serial && repeats.has(row.serial));
  const eligible = numerator.filter((row) => row.serial).length;
  const assemblyCount = numerator.filter((row) => (ASSEMBLY_ORIGINS as readonly string[]).includes(row.origin)).length;
  const withCost = numerator.filter((row) => row.cost !== null);

  const fieldFill = FILL_FIELDS.map((field) => {
    const filled = dataset.returns.filter((row) => !field.empty(row)).length;
    return { label: field.label, filled, total: dataset.returns.length, rate: share(filled, dataset.returns.length) };
  });
  const cells = fieldFill.reduce((sum, field) => sum + field.total, 0);
  const filledCells = fieldFill.reduce((sum, field) => sum + field.filled, 0);
  const issueMap = new Map<string, number>();
  for (const row of dataset.returns) {
    for (const flag of row.flags) issueMap.set(flag, (issueMap.get(flag) ?? 0) + 1);
  }

  const topCause = rawCauses[0] ?? null;
  const criticalModel = byModel.find((row) => row.ppm !== null && row.n > 0) ?? null;
  const modelsWithoutBase = byModel.filter((row) => row.n > 0 && row.installs === 0);
  const topPart = replaced[0] ?? byPart[0] ?? null;

  const narrative = writeNarrative({
    numerator: numerator.length,
    denominator,
    ppm: totalPpm,
    window,
    topCause,
    criticalModel,
    earlyRate: earlyYes + earlyNo ? earlyYes / (earlyYes + earlyNo) : null,
    earlyUnknown,
    repeatRate: eligible ? repeatEvents.length / eligible : null,
    assemblyRate: numerator.length ? assemblyCount / numerator.length : null,
    byMonth,
    priorities,
    undated,
  });

  return {
    months,
    window,
    numerator,
    undatedRows,
    undated,
    denominator,
    ppm: totalPpm,
    byMonth,
    byFamily,
    byModel,
    byCause: rawCauses,
    byOrigin,
    byRoot,
    byAge,
    byPart,
    early: {
      yes: earlyYes,
      no: earlyNo,
      unknown: earlyUnknown,
      rate: earlyYes + earlyNo ? earlyYes / (earlyYes + earlyNo) : null,
    },
    repeat: {
      events: repeatEvents.length,
      serials: new Set(repeatEvents.map((row) => row.serial)).size,
      rate: eligible ? repeatEvents.length / eligible : null,
      eligible,
    },
    assembly: { count: assemblyCount, rate: numerator.length ? assemblyCount / numerator.length : null },
    topCause,
    criticalModel,
    modelsWithoutBase,
    topPart,
    causeModel: matrix(numerator, (row) => row.cause, (row) => row.model),
    causeFamily: matrix(numerator, (row) => row.cause, (row) => row.family),
    priorities,
    fieldFill,
    completeness: cells ? filledCells / cells : 0,
    issueCounts: [...issueMap.entries()].map(([flag, n]) => ({ flag, n })).sort((a, b) => b.n - a.n),
    cost: withCost.length ? { total: withCost.reduce((sum, row) => sum + (row.cost ?? 0), 0), rows: withCost.length } : null,
    hasCaDate: dataset.returns.some((row) => row.caDate),
    narrative,
  };
}

function countBy(rows: ReturnEvent[], key: (row: ReturnEvent) => string, denominator: number): CountRow[] {
  const map = new Map<string, number>();
  for (const row of rows) map.set(key(row), (map.get(key(row)) ?? 0) + 1);
  return [...map.entries()]
    .map(([name, n]) => ({ name, n, share: share(n, rows.length), ppm: ppm(n, denominator) }))
    .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "fa"));
}

function matrix(rows: ReturnEvent[], aOf: (row: ReturnEvent) => string, bOf: (row: ReturnEvent) => string): MatrixCell[] {
  const map = new Map<string, MatrixCell>();
  for (const row of rows) {
    const a = aOf(row);
    const b = bOf(row);
    const k = `${a}\t${b}`;
    const found = map.get(k);
    if (found) found.n += 1;
    else map.set(k, { a, b, n: 1 });
  }
  return [...map.values()].sort((x, y) => y.n - x.n);
}

function writeNarrative(input: {
  numerator: number;
  denominator: number;
  ppm: number | null;
  window: QualityView["window"];
  topCause: CauseRow | null;
  criticalModel: ModelRow | null;
  earlyRate: number | null;
  earlyUnknown: number;
  repeatRate: number | null;
  assemblyRate: number | null;
  byMonth: MonthPoint[];
  priorities: CauseRow[];
  undated: number;
}): string[] {
  const lines: string[] = [];
  if (!input.window) {
    lines.push("در این فیلتر ماهی برای صورت کسر باقی نمانده است.");
    return lines;
  }
  lines.push(
    input.ppm === null
      ? `برگشتی ${input.numerator} است اما نصب در پنجره ${labelMonth(input.window.start)} تا ${labelMonth(input.window.end)} صفر است، پس PPM محاسبه نمی‌شود.`
      : `در ماه‌های انتخاب‌شده ${input.numerator} برگشت ثبت شده و نصب پنجره شناور ${input.denominator} دستگاه است. PPM برابر ${Math.round(input.ppm)} است.`,
  );
  if (input.topCause) {
    lines.push(`بیشترین علت «${input.topCause.name}» با ${input.topCause.n} مورد است.`);
  }
  if (input.criticalModel) {
    lines.push(
      `بالاترین PPM مدل، ${input.criticalModel.model} در ${input.criticalModel.family} است (${input.criticalModel.n} برگشت / ${input.criticalModel.installs} نصب).`,
    );
  } else if (input.numerator > 0) {
    lines.push("برای مدل‌های برگشتی این فیلتر، نصب متناظر در پنجره پیدا نشد و مدل بحرانی با PPM اعلام نمی‌شود.");
  }
  if (input.byMonth.length >= 2) {
    const first = input.byMonth[0];
    const last = input.byMonth[input.byMonth.length - 1];
    if (first.ppm !== null && last.ppm !== null) {
      const dir = last.ppm > first.ppm ? "بالاتر" : last.ppm < first.ppm ? "پایین‌تر" : "برابر";
      lines.push(`PPM ${labelMonth(last.month)} نسبت به ${labelMonth(first.month)} ${dir} است.`);
    }
  }
  if (input.priorities[0]) lines.push(`اولویت اول اقدام، علت «${input.priorities[0].name}» است. آستانه هدف در داده تعریف نشده.`);
  if (input.undated) lines.push(`${input.undated} ردیف تاریخ برگشت معتبر ندارد و داخل صورت کسر نیست.`);
  if (input.earlyUnknown) lines.push(`${input.earlyUnknown} ردیف عمر قابل‌محاسبه ندارد و از نرخ خرابی زودهنگام کنار گذاشته شده، ولی حذف نشده است.`);
  return lines;
}

export function facets(dataset: Dataset) {
  const values = (pick: (row: ReturnEvent) => string) =>
    [...new Set(dataset.returns.map(pick).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fa"));
  const months = [...new Set(dataset.returns.map((row) => row.returnMonth).filter((m): m is string => Boolean(m)))].sort();
  return {
    years: [...new Set(months.map((m) => m.slice(0, 4)))],
    months: months.map((m) => m.slice(5, 7)).filter((m, i, arr) => arr.indexOf(m) === i),
    monthKeys: months,
    seasons: ["بهار", "تابستان", "پاییز", "زمستان"].filter((season) => months.some((m) => seasonOf(m.slice(5, 7)) === season)),
    families: [...new Set([...dataset.returns.map((r) => r.family), ...dataset.installs.map((r) => r.family)])].filter(Boolean).sort((a, b) => a.localeCompare(b, "fa")),
    brands: [...new Set([...dataset.returns.map((r) => r.brand), ...dataset.installs.map((r) => r.brand)])].filter(Boolean).sort((a, b) => a.localeCompare(b, "fa")),
    models: [...new Set([...dataset.returns.map((r) => r.model), ...dataset.installs.map((r) => r.model)])].filter((m) => m && m !== "نامشخص").sort(),
    causes: values((r) => r.cause),
    roots: values((r) => r.root),
    origins: values((r) => r.origin),
    parts: [...new Set(dataset.returns.flatMap((r) => r.parts.map((p) => p.name)))].sort((a, b) => a.localeCompare(b, "fa")),
    warranties: values((r) => r.warranty),
    gradesIn: values((r) => r.gradeInitial),
    gradesOut: values((r) => r.gradeFinal),
  };
}

export { EARLY_DAYS, labelMonth };
