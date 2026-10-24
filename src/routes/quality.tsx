import { createFileRoute } from "@tanstack/react-router";
import { HBars, ParetoChart } from "@/components/charts";
import { EmptyNote, Panel } from "@/components/panel";
import { AGE_ORDER } from "@/lib/classify";
import { faNum, faPct, faPpm } from "@/lib/format";
import { useView } from "@/lib/use-view";
import type { ReturnEvent } from "@/lib/types";

export const Route = createFileRoute("/quality")({ component: QualityPage });

function QualityPage() {
  const view = useView();
  const ages = AGE_ORDER.map((name) => view.byAge.find((row) => row.name === name)).filter((row) => row && row.n > 0) as {
    name: string;
    n: number;
  }[];
  const families = [...new Set(view.causeFamily.map((cell) => cell.b))];
  const causes = view.byCause.slice(0, 8);
  const maxCell = Math.max(1, ...view.causeFamily.map((cell) => cell.n));

  return (
    <div className="grid min-w-0 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">تحلیل کیفیت</h1>
        <p className="mt-1 text-sm text-muted">علت، منشأ، عمر، مدل و قطعه. ردیف «فاقد ایراد» حذف نشده چون در فایل هست.</p>
      </div>

      <Panel title="پارتو علت" hint="خط تجمعی فقط برای دیدن تمرکز است. عدد ۸۰ هدف کیفی نیست و در داده تعریف نشده.">
        {view.byCause.length ? (
          <>
            <ParetoChart rows={view.byCause.slice(0, 12).map((row) => ({ name: row.name, n: row.n, cum: row.cum }))} />
            <div className="mt-3 min-w-0 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="px-2 py-2 text-right font-medium">علت</th>
                    <th className="px-2 py-2 text-right font-medium">تعداد</th>
                    <th className="px-2 py-2 text-right font-medium">سهم</th>
                    <th className="px-2 py-2 text-right font-medium">تجمعی</th>
                    <th className="px-2 py-2 text-right font-medium">PPM</th>
                  </tr>
                </thead>
                <tbody>
                  {view.byCause.map((row) => (
                    <tr key={row.name} className="border-b border-line">
                      <td className="px-2 py-2">{row.name}</td>
                      <td className="px-2 py-2">{faNum(row.n)}</td>
                      <td className="px-2 py-2">{faPct(row.share)}</td>
                      <td className="px-2 py-2">{faPct(row.cum)}</td>
                      <td className="px-2 py-2">{faPpm(row.ppm)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyNote>علتی در این فیلتر نیست.</EmptyNote>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="منشأ خرابی" hint="از ستون ریشه احتمالی نرمال شده. مقدار نامشخص حذف نشده.">
          {view.byOrigin.length ? <HBars rows={view.byOrigin} /> : <EmptyNote>منشائی نیست.</EmptyNote>}
        </Panel>
        <Panel title="ریشه احتمالی">
          {view.byRoot.length ? <HBars rows={view.byRoot} /> : <EmptyNote>ریشه‌ای نیست.</EmptyNote>}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="عمر تا برگشت" hint="فاصله تاریخ برگشت تا تاریخ نصب. سطل‌های خالی نشان داده نمی‌شوند چون تعدادشان صفر است، نه چون حذف شده‌اند.">
          {ages.length ? <HBars rows={ages} /> : <EmptyNote>عمر قابل نمایش نیست.</EmptyNote>}
        </Panel>
        <Panel title="قطعه در متن اقدام">
          {view.byPart.length ? (
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-muted">
                    <th className="px-2 py-2 text-right font-medium">قطعه</th>
                    <th className="px-2 py-2 text-right font-medium">نوع</th>
                    <th className="px-2 py-2 text-right font-medium">تعداد</th>
                  </tr>
                </thead>
                <tbody>
                  {view.byPart.slice(0, 12).map((row) => (
                    <tr key={`${row.kind}-${row.name}`} className="border-b border-line">
                      <td className="px-2 py-2">{row.name}</td>
                      <td className="px-2 py-2">{row.kind}</td>
                      <td className="px-2 py-2">{faNum(row.n)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyNote>در اقدامات این فیلتر قطعه‌ای استخراج نشد.</EmptyNote>
          )}
        </Panel>
      </div>

      <Panel title="مدل‌ها" hint="مرتب بر PPM. اگر نصب پنجره صفر باشد PPM اعلام نمی‌شود. پایه کوچک را کنار تعداد بخوانید.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="px-2 py-2 text-right font-medium">مدل</th>
                <th className="px-2 py-2 text-right font-medium">خانواده</th>
                <th className="px-2 py-2 text-right font-medium">برگشت</th>
                <th className="px-2 py-2 text-right font-medium">نصب پنجره</th>
                <th className="px-2 py-2 text-right font-medium">PPM</th>
              </tr>
            </thead>
            <tbody>
              {view.byModel.map((row) => (
                <tr key={`${row.family}-${row.model}`} className="border-b border-line">
                  <td className="px-2 py-2">{row.model}</td>
                  <td className="px-2 py-2">{row.family}</td>
                  <td className="px-2 py-2">{faNum(row.n)}</td>
                  <td className="px-2 py-2">{faNum(row.installs)}</td>
                  <td className="px-2 py-2">{faPpm(row.ppm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {view.modelsWithoutBase.length ? (
          <p className="mt-3 text-sm text-muted">
            بدون پایه نصب: {view.modelsWithoutBase.map((row) => row.model).join("، ")}
          </p>
        ) : null}
      </Panel>

      <Panel title="خانواده محصول">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="px-2 py-2 text-right font-medium">خانواده</th>
                <th className="px-2 py-2 text-right font-medium">برگشت</th>
                <th className="px-2 py-2 text-right font-medium">نصب</th>
                <th className="px-2 py-2 text-right font-medium">PPM</th>
              </tr>
            </thead>
            <tbody>
              {view.byFamily.map((row) => (
                <tr key={row.family} className="border-b border-line">
                  <td className="px-2 py-2">{row.family}</td>
                  <td className="px-2 py-2">{faNum(row.n)}</td>
                  <td className="px-2 py-2">{faNum(row.installs)}</td>
                  <td className="px-2 py-2">{faPpm(row.ppm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="علت در خانواده" hint="هشت علت پرتعداد. بقیه علت‌ها در جدول پارتو هستند.">
        {causes.length && families.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="px-2 py-2 text-right font-medium">علت</th>
                  {families.map((family) => (
                    <th key={family} className="px-2 py-2 text-right font-medium">
                      {family}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {causes.map((cause) => (
                  <tr key={cause.name} className="border-b border-line">
                    <td className="px-2 py-2">{cause.name}</td>
                    {families.map((family) => {
                      const n = view.causeFamily.find((cell) => cell.a === cause.name && cell.b === family)?.n ?? 0;
                      return (
                        <td key={family} className="px-2 py-2">
                          <span
                            className="inline-flex min-w-8 justify-center rounded-lg px-2 py-1"
                            style={{ background: `color-mix(in srgb, var(--color-pine) ${Math.round((n / maxCell) * 100)}%, var(--color-paper))` }}
                          >
                            {n ? faNum(n) : "—"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyNote>ماتریسی ساخته نشد.</EmptyNote>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-3">
        <CountPanel title="نتیجه خدمت" rows={tally(view.numerator, (row) => row.serviceResult)} />
        <CountPanel title="گرید اولیه" rows={tally(view.numerator, (row) => row.gradeInitial)} />
        <CountPanel title="گرید نهایی" rows={tally(view.numerator, (row) => row.gradeFinal)} />
      </div>
    </div>
  );
}

function tally(rows: ReturnEvent[], pick: (row: ReturnEvent) => string) {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = pick(row) || "نامشخص";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()].map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n);
}

function CountPanel({ title, rows }: { title: string; rows: { name: string; n: number }[] }) {
  const total = rows.reduce((sum, row) => sum + row.n, 0);
  return (
    <Panel title={title}>
      <ul className="grid gap-2">
        {rows.map((row) => (
          <li key={row.name}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{row.name}</span>
              <span className="text-muted">
                {faNum(row.n)} · {faPct(total ? row.n / total : 0)}
              </span>
            </div>
            <div className="h-2 rounded-full bg-paper">
              <div className="h-2 rounded-full bg-pine" style={{ width: `${total ? (row.n / total) * 100 : 0}%` }} />
            </div>
          </li>
        ))}
        {!rows.length ? <li className="text-sm text-muted">ردیفی نیست.</li> : null}
      </ul>
    </Panel>
  );
}
