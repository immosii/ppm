import { isValidJalaaliDate, toGregorian } from "jalaali-js";

export const MONTH_LABELS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

export type JDate = { y: number; m: number; d: number; month: string; iso: string };

const DIGITS: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

export function normFa(input: unknown): string {
  let s = String(input ?? "");
  s = s.replace(/[۰-۹٠-٩]/g, (ch) => DIGITS[ch] ?? ch);
  s = s.replace(/[\u200c\u200d\u200e\u200f\u202a-\u202e\ufeff]/g, "");
  s = s.replace(/[يى]/g, "ی").replace(/ك/g, "ک");
  s = s.replace(/\u0640/g, "");
  s = s.replace(/[\u064b-\u0652]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function normHeader(input: unknown): string {
  return normFa(input).replace(/[_]/g, " ").replace(/\s+/g, " ").trim();
}

/** Valid Jalali date, or null when empty/invalid. Does not invent a replacement. */
export function parseJalali(input: unknown): JDate | null {
  const raw = normFa(input);
  if (!raw || raw === "-" || raw === "." || raw === "null" || raw === ".NULL." || raw === "ندارد") {
    return null;
  }
  const m = raw.match(/(\d{4})\D(\d{1,2})\D(\d{1,2})/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!isValidJalaaliDate(y, mo, d)) return null;
  return {
    y,
    m: mo,
    d,
    month: `${y}-${String(mo).padStart(2, "0")}`,
    iso: `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
  };
}

export function hasDateToken(input: unknown): boolean {
  const raw = normFa(input);
  return Boolean(raw && raw !== "-" && raw !== "." && raw !== "null" && raw !== ".NULL." && raw !== "ندارد");
}

export function diffDays(later: JDate, earlier: JDate): number {
  const a = toGregorian(later.y, later.m, later.d);
  const b = toGregorian(earlier.y, earlier.m, earlier.d);
  const da = Date.UTC(a.gy, a.gm - 1, a.gd);
  const db = Date.UTC(b.gy, b.gm - 1, b.gd);
  return Math.round((da - db) / 86400000);
}

export function shiftMonth(month: string, delta: number): string {
  const y = Number(month.slice(0, 4));
  const m = Number(month.slice(5, 7));
  const idx = y * 12 + (m - 1) + delta;
  const ny = Math.floor(idx / 12);
  const nm = idx - ny * 12 + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

export function seasonOf(monthNum: string): string {
  const m = Number(monthNum);
  if (m <= 3) return "بهار";
  if (m <= 6) return "تابستان";
  if (m <= 9) return "پاییز";
  return "زمستان";
}

export function labelMonth(month: string): string {
  const m = Number(month.slice(5, 7));
  const y = month.slice(0, 4).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit);
  return `${MONTH_LABELS[m - 1] ?? month} ${y}`;
}
