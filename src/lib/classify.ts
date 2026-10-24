import { normFa } from "./jalali.ts";
import type { PartUse } from "./types.ts";

export const BRAND = "آرتا گستر";
export const EARLY_DAYS = 90;
export const ASSEMBLY_ORIGINS = ["مونتاژ", "کنترل کیفیت"] as const;

export const AGE_ORDER = [
  "کمتر از ۷ روز",
  "۷ تا ۳۰ روز",
  "۳۱ تا ۹۰ روز",
  "۳ تا ۶ ماه",
  "۶ تا ۱۲ ماه",
  "بالای ۱۲ ماه",
  "برگشت قبل از نصب",
  "تاریخ نصب ناموجود",
  "تاریخ برگشت ناموجود",
] as const;

export function modelKey(raw: unknown): string {
  let s = normFa(raw);
  if (!s || s === "-" || s === "ندارد") return "";
  s = s.replace(/[a-z]/g, (c) => c.toUpperCase());
  const coded = s.match(/^(CDW|CWM|CTV|C2S|CM)-[A-Z0-9.]+/);
  if (coded) return coded[0];
  return s;
}

export function familyFromModel(model: string): string {
  const m = model.toUpperCase();
  if (m.startsWith("CDW")) return "ماشین ظرفشویی";
  if (m.startsWith("CWM")) return "ماشین لباسشویی";
  if (m.startsWith("CTV")) return "تلویزیون";
  if (m.startsWith("C2S") || m.startsWith("SBS")) return "یخچال سایدبای‌ساید";
  if (m.startsWith("CM-") || m.startsWith("MINI")) return "یخچال مینی";
  return "";
}

export function familyFromType(raw: unknown): string {
  const s = normFa(raw);
  if (!s) return "";
  if (s.includes("تلویزیون")) return "تلویزیون";
  if (s.includes("لباسشویی")) return "ماشین لباسشویی";
  if (s.includes("ظرفشویی")) return "ماشین ظرفشویی";
  if (s.includes("ساید")) return "یخچال سایدبای‌ساید";
  if (s.includes("مینی")) return "یخچال مینی";
  if (s.includes("یخچال")) return "یخچال";
  return s;
}

export function normSerial(raw: unknown): string {
  const s = normFa(raw).replace(/\s+/g, "").toUpperCase();
  if (!s || s === "-" || s === "." || s.includes("ندارد") || s === "NULL" || /^0+$/.test(s)) return "";
  if (s.length < 6) return "";
  return s;
}

export function classifyOrigin(root: string): string {
  const s = normFa(root);
  if (!s) return "نامشخص";
  if (s.includes("فاقد ایراد")) return "فاقد ایراد";
  if (s.includes("شرایط محیطی")) return "قطعه (شرایط محیطی)";
  if (s.includes("قطعه") && s.includes("کیفیت")) return "قطعه (کیفیت)";
  if (s.includes("گارانتی")) return "خارج از گارانتی";
  if (s.includes("حمل")) return "حمل و نقل";
  if (s.includes("مونتاژ")) return "مونتاژ";
  if (s.includes("کنترل کیفیت")) return "کنترل کیفیت";
  if (s.includes("مدیریت")) return "دستور مدیریتی";
  if (s.includes("مشتری")) return "مشتری";
  if (s.includes("نماینده") || s.includes("خدمات")) return "نماینده خدمات";
  return s;
}

export function serviceResult(action: string): string {
  const a = normFa(action);
  if (!a) return "نامشخص";
  if (/فاقد ایراد|ایرادی مشاهده/.test(a)) return "فاقد ایراد";
  if (/مدل بالاتر/.test(a)) return "تعویض محصول";
  const replaced = a.includes("تعویض");
  const repaired = /تعمیر|اصلاح|پرچ/.test(a);
  if (replaced && repaired) return "تعویض و تعمیر";
  if (replaced) return "تعویض";
  if (repaired) return "تعمیر";
  return "سایر";
}

export function warrantyOf(explicit: string, blob: string): string {
  const exp = normFa(explicit);
  const text = `${exp} ${normFa(blob)}`;
  if (/خارج\s*از?\s*گارانتی|غیر\s*گارانتی/.test(text)) return "خارج از گارانتی";
  if (exp && !/گارانتی بعد از فروش/.test(exp)) return exp;
  return "ذکر نشده";
}

export function extractParts(action: string): PartUse[] {
  const text = normFa(action);
  if (!text) return [];
  const cleaned = text.replace(/\s*[-–]\s*(خارج از گارانتی|خارج گارانتی|حمل و نقل)\s*/g, " ").trim();
  const out: PartUse[] = [];
  const re = /(تعویض|تعمیر|افزودن|اصلاح)\s+(.+?)(?=\s+(?:تعویض|تعمیر|افزودن|اصلاح)\s+|$)/g;
  for (const match of cleaned.matchAll(re)) {
    const name = match[2].trim();
    if (!name || /مدل بالاتر/.test(name) || /فاقد ایراد|ایرادی مشاهده/.test(name)) continue;
    const verb = match[1];
    out.push({
      kind: verb === "تعویض" ? "replaced" : verb === "افزودن" ? "added" : "repaired",
      name,
    });
  }
  if (!out.length && cleaned.includes("پرچ")) out.push({ kind: "repaired", name: "پرچ" });
  return out;
}

export function ageBucket(age: number | null, returnMissing: boolean, installMissing: boolean, negative: boolean): string {
  if (returnMissing) return "تاریخ برگشت ناموجود";
  if (installMissing) return "تاریخ نصب ناموجود";
  if (negative || age === null) return "برگشت قبل از نصب";
  if (age < 7) return "کمتر از ۷ روز";
  if (age <= 30) return "۷ تا ۳۰ روز";
  if (age <= 90) return "۳۱ تا ۹۰ روز";
  if (age <= 180) return "۳ تا ۶ ماه";
  if (age <= 365) return "۶ تا ۱۲ ماه";
  return "بالای ۱۲ ماه";
}

export function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  return normFa(value);
}
