import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EmptyNote, Panel } from "@/components/panel";
import { faNum, faPct } from "@/lib/format";
import { ingestWorkbook } from "@/lib/ingest";
import { useQuality } from "@/lib/store";
import { useView } from "@/lib/use-view";

export const Route = createFileRoute("/data")({ component: DataPage });

function DataPage() {
  const dataset = useQuality((s) => s.dataset);
  const setDataset = useQuality((s) => s.setDataset);
  const view = useView();
  const audit = dataset.installAudit;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onFiles(list: FileList | null) {
    if (!list?.length) return;
    setBusy(true);
    setError("");
    setMessage("");
    let current = useQuality.getState().dataset;
    const notes: string[] = [];
    try {
      for (const file of list) {
        const result = await ingestWorkbook(file, current);
        current = result.dataset;
        notes.push(result.message);
      }
      setDataset(current);
      setMessage(notes.join(" "));
    } catch (err) {
      setError(err instanceof Error ? err.message : "خواندن فایل ممکن نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">کنترل داده</h1>
        <p className="mt-1 text-sm text-muted">کامل بودن، تاریخ‌های ناسازگار و منبع مخرج. ردیف مشکوک حذف نمی‌شود.</p>
      </div>

      <Panel title="به‌روزرسانی با اکسل" hint="برگشتی، صورت را جایگزین می‌کند و به همین ایندکس سریال نصب وصل می‌شود. نصب، فقط سریال تازه را به مخرج اضافه می‌کند.">
        <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-paper px-4 py-6 text-center">
          <span className="font-medium">{busy ? "در حال خواندن…" : "فایل xlsx را انتخاب کنید"}</span>
          <span className="mt-1 text-sm text-muted">می‌شود چند فایل را با هم داد</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            multiple
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              void onFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
        {message ? <p className="mt-3 text-sm">{message}</p> : null}
        {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="کامل بودن فیلدهای برگشتی" hint={`روی کل ${faNum(dataset.returns.length)} ردیف برگشتی، نه فقط فیلتر فعلی.`}>
          <p className="mb-3 text-2xl font-semibold">{faPct(view.completeness)}</p>
          <ul className="grid gap-2">
            {view.fieldFill.map((field) => (
              <li key={field.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{field.label}</span>
                  <span className="text-muted">
                    {faNum(field.filled)} / {faNum(field.total)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-paper">
                  <div className="h-2 rounded-full bg-pine" style={{ width: `${field.rate * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="پرچم‌های کیفیت داده">
          {view.issueCounts.length ? (
            <ul className="grid gap-2 text-sm">
              {view.issueCounts.map((issue) => (
                <li key={issue.flag} className="flex justify-between gap-3 rounded-xl bg-paper px-3 py-2">
                  <span>{issue.flag}</span>
                  <span className="text-muted">{faNum(issue.n)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyNote>پرچمی ثبت نشده.</EmptyNote>
          )}
        </Panel>
      </div>

      <Panel title="ممیزی نصب" hint="مخرج از این جمعیت ساخته می‌شود.">
        <dl className="grid gap-2 sm:grid-cols-2">
          {[
            ["ردیف خوانده‌شده", audit.rows],
            ["تاریخ نامعتبر", audit.invalidDate],
            ["بدون سریال، شمرده‌شده", audit.anonymousRows],
            ["سریال یکتا", audit.distinctSerials],
            ["تکراریِ کنارگذاشته از مخرج", audit.duplicateRowsExcluded],
            ["جمعیت مخرج", audit.population],
            ["بدون مدل", audit.missingModel],
            ["نصب قبل از تولید", audit.installBeforeProduction],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2 text-sm">
              <dt>{label}</dt>
              <dd className="font-medium">{faNum(Number(value))}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="هزینه">
        {view.cost ? (
          <p className="text-sm">
            جمع هزینه ردیف‌های دارای عدد در این فیلتر {faNum(view.cost.total)} است، روی {faNum(view.cost.rows)} ردیف.
          </p>
        ) : (
          <EmptyNote>ستون هزینه در فایل برگشتی نیست. عددی ساخته نشده است.</EmptyNote>
        )}
        <p className="mt-3 text-sm text-muted">
          {view.hasCaDate
            ? "حداقل یک تاریخ اقدام اصلاحی در داده هست."
            : "تاریخ اقدام اصلاحی در فایل نیست، پس پیگیری زمان اقدام نمایش داده نمی‌شود."}
        </p>
      </Panel>

      <Panel title="منطق و منابع">
        <ul className="grid gap-2 text-sm leading-6">
          {dataset.meta.notes.map((note) => (
            <li key={note} className="rounded-xl bg-paper px-3 py-2">
              {note}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-muted">منابع: {dataset.meta.sources.join(" · ")}</p>
        <p className="mt-2 text-sm text-muted">
          تعریف زودهنگام: عمر برگشت تا {faNum(dataset.meta.earlyDays)} روز. پنجره پیش‌فرض {faNum(dataset.meta.windowDefault)} ماه.
        </p>
      </Panel>
    </div>
  );
}
