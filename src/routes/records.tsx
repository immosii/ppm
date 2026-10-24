import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { EmptyNote, Panel } from "@/components/panel";
import { faDate, faNum } from "@/lib/format";
import { useView } from "@/lib/use-view";
import type { ReturnEvent } from "@/lib/types";

export const Route = createFileRoute("/records")({ component: RecordsPage });

const PAGE = 12;

function RecordsPage() {
  const view = useView();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => {
    const query = q.trim();
    if (!query) return view.numerator;
    return view.numerator.filter((row) =>
      [row.serial, row.model, row.family, row.cause, row.root, row.origin, row.description, row.action, row.warehouse]
        .join(" ")
        .includes(query),
    );
  }, [q, view.numerator]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE, safePage * PAGE + PAGE);

  return (
    <div className="grid min-w-0 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">ریز رکوردها</h1>
        <p className="mt-1 text-sm text-muted">همان ردیف‌هایی که در صورت کسر این فیلتر هستند. چیزی به‌خاطر نامشخص بودن حذف نشده.</p>
      </div>
      <Panel title={`${faNum(filtered.length)} ردیف تاریخ‌دار`}>
        <input
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setPage(0);
          }}
          placeholder="سریال، مدل، علت، شرح"
          className="mb-3 h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm"
        />
        {slice.length ? <RecordTable rows={slice} /> : <EmptyNote>ردیفی با این جستجو نیست.</EmptyNote>}
        <div className="mt-3 flex items-center justify-between text-sm">
          <button type="button" className="h-11 rounded-full border border-line px-4 disabled:text-muted" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
            قبلی
          </button>
          <span className="text-muted">
            {faNum(safePage + 1)} از {faNum(pages)}
          </span>
          <button
            type="button"
            className="h-11 rounded-full border border-line px-4 disabled:text-muted"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(safePage + 1)}
          >
            بعدی
          </button>
        </div>
      </Panel>
      <Panel title="بدون تاریخ برگشت معتبر" hint="داخل صورت ماهانه نیستند، ولی از فایل حذف نشده‌اند.">
        {view.undatedRows.length ? <RecordTable rows={view.undatedRows} /> : <EmptyNote>در این فیلتر ردیف بدون تاریخ برگشت نیست.</EmptyNote>}
      </Panel>
    </div>
  );
}

function RecordTable({ rows }: { rows: ReturnEvent[] }) {
  return (
    <div className="min-w-0 overflow-x-auto">
      <table className="w-full min-w-[64rem] text-sm">
        <thead>
          <tr className="border-b border-line text-muted">
            {["سریال", "مدل", "خانواده", "برگشت", "نصب", "عمر", "علت", "منشأ", "ریشه", "اقدام", "قطعه", "گرید", "پرچم"].map((label) => (
              <th key={label} className="px-2 py-2 text-right font-medium whitespace-nowrap">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line align-top">
              <td className="px-2 py-2 whitespace-nowrap">{row.serial || "—"}</td>
              <td className="px-2 py-2 whitespace-nowrap">{row.model}</td>
              <td className="px-2 py-2 whitespace-nowrap">{row.family}</td>
              <td className="px-2 py-2 whitespace-nowrap">{faDate(row.returnDate)}</td>
              <td className="px-2 py-2 whitespace-nowrap">{faDate(row.installDate)}</td>
              <td className="px-2 py-2 whitespace-nowrap">{row.ageDays === null ? row.ageBucket : `${faNum(row.ageDays)} روز`}</td>
              <td className="px-2 py-2">{row.cause}</td>
              <td className="px-2 py-2 whitespace-nowrap">{row.origin}</td>
              <td className="px-2 py-2">{row.root}</td>
              <td className="px-2 py-2 min-w-48">{row.action || "—"}</td>
              <td className="px-2 py-2">{row.parts.map((part) => part.name).join("، ") || "—"}</td>
              <td className="px-2 py-2 whitespace-nowrap">
                {row.gradeInitial} ← {row.gradeFinal}
              </td>
              <td className="px-2 py-2 min-w-40 text-xs text-muted">{row.flags.join(" · ") || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
