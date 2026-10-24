import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { buildDataset, type RawRow } from "../src/lib/dataset.ts";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx") as {
  readFile: (path: string, opts?: object) => { SheetNames: string[]; Sheets: Record<string, object> };
  utils: { sheet_to_json: (sheet: object, opts?: object) => RawRow[] };
};

function readSheet(path: string): RawRow[] {
  const book = XLSX.readFile(path, { cellDates: false });
  const name = book.SheetNames[0];
  return XLSX.utils.sheet_to_json(book.Sheets[name], { defval: "", raw: false });
}

const returns = readSheet("/workspace/attachments/دوباره کاری-اصلاح.xlsx");
const i1403 = readSheet("/workspace/attachments/نصب 1403.XLSX");
const i1404 = readSheet("/workspace/attachments/نصب 1404 (1).XLSX");
const i1405 = readSheet("/workspace/attachments/نصب 1405.XLSX");

const dataset = buildDataset(returns, [...i1403, ...i1404, ...i1405], [
  "برگشتی: دوباره کاری-اصلاح",
  "نصب ۱۴۰۳: تاریخ شمسی پذیرش",
  "نصب ۱۴۰۴: تاریخ شمسی نصب",
  "نصب ۱۴۰۵: تاریخ شمسی پذیرش، فقط ردیف‌های نصب",
]);

writeFileSync("/workspace/src/data/quality.json", JSON.stringify(dataset));

const months = new Map<string, number>();
for (const row of dataset.returns) months.set(row.returnMonth ?? "—", (months.get(row.returnMonth ?? "—") ?? 0) + 1);
console.log("returns", dataset.returns.length, [...months.entries()]);
console.log("install audit", dataset.installAudit);
console.log("buckets", dataset.installs.length);
const fam = new Map<string, number>();
for (const b of dataset.installs) fam.set(b.family, (fam.get(b.family) ?? 0) + b.count);
console.log("install families", [...fam.entries()]);
console.log(
  "sample return",
  dataset.returns[0] && {
    model: dataset.returns[0].model,
    cause: dataset.returns[0].cause,
    origin: dataset.returns[0].origin,
    root: dataset.returns[0].root,
    parts: dataset.returns[0].parts,
    flags: dataset.returns[0].flags,
    age: dataset.returns[0].ageDays,
    bucket: dataset.returns[0].ageBucket,
  },
);
