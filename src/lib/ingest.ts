import { appendInstalls, replaceReturns, sheetKind, type RawRow } from "@/lib/dataset";
import type { Dataset } from "@/lib/types";

export async function ingestWorkbook(file: File, dataset: Dataset): Promise<{ dataset: Dataset; message: string }> {
  const XLSX = await import("xlsx");
  const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
  const name = book.SheetNames[0];
  if (!name) throw new Error("برگه‌ای در فایل نیست.");
  const rows = XLSX.utils.sheet_to_json<RawRow>(book.Sheets[name], { defval: "", raw: false });
  if (!rows.length) throw new Error("این فایل ردیف داده ندارد.");
  const kind = sheetKind(Object.keys(rows[0] ?? {}));
  if (kind === "returns") {
    const next = replaceReturns(dataset, rows, file.name);
    return { dataset: next, message: `فایل برگشتی جایگزین شد. ${next.returns.length.toLocaleString("fa-IR")} ردیف خوانده شد و ردیف‌های نامعتبر حذف نشدند.` };
  }
  if (kind === "installs") {
    const before = dataset.installAudit.population;
    const next = appendInstalls(dataset, rows, file.name);
    return {
      dataset: next,
      message: `فایل نصب به مخرج اضافه شد. جمعیت از ${before.toLocaleString("fa-IR")} به ${next.installAudit.population.toLocaleString("fa-IR")} رسید. سریال‌هایی که از قبل بودند دوباره شمرده نشدند.`,
    };
  }
  throw new Error("سرستون‌ها نه برگشتی است و نه نصب. ستون علت یا مدل/سریال/تاریخ نصب لازم است.");
}
