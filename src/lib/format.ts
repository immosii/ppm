const FA = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
const FA1 = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

export function faNum(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "—";
  if (digits === 0) return FA.format(Math.round(value));
  return FA1.format(value);
}

export function faPct(rate: number | null): string {
  if (rate === null || !Number.isFinite(rate)) return "—";
  return `${faNum(rate * 100, 1)}٪`;
}

export function faPpm(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "غیرقابل‌محاسبه";
  return faNum(value, value < 100 ? 1 : 0);
}

export function faDate(iso: string | null): string {
  if (!iso) return "—";
  return iso.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit);
}
