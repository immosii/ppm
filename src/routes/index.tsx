import { createFileRoute } from "@tanstack/react-router";
import { TrendChart } from "@/components/charts";
import { Kpi, Panel } from "@/components/panel";
import { faNum, faPct, faPpm } from "@/lib/format";
import { labelMonth } from "@/lib/jalali";
import { useView } from "@/lib/use-view";
import { useQuality } from "@/lib/store";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const view = useView();
  const windowMonths = useQuality((s) => s.filters.windowMonths);
  const earlyDays = useQuality((s) => s.dataset.meta.earlyDays);
  const tied = view.topCause ? view.byCause.filter((row) => row.n === view.topCause?.n && row.n > 0) : [];
  const monthRows = view.byMonth.map((row) => ({
    label: row.label.replace(/ \d{4}$/, ""),
    returns: row.returns,
    ppm: row.ppm === null ? null : Math.round(row.ppm),
    installs: row.installs,
  }));

  return (
    <div className="grid min-w-0 gap-4">
      <div>
        <h1 className="text-2xl font-semibold">نمای مدیریت</h1>
        <p className="mt-1 text-sm text-muted">
          هدف : تحلیل و شناسایی علت برگشت محصولات و کاهش آمار
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi
          label="PPM تجمیعی"
          value={faPpm(view.ppm)}
          hint={
            view.window
              ? `صورت ${faNum(view.numerator.length)} · مخرج ${faNum(view.denominator)} · پنجره ${labelMonth(view.window.start)} تا ${labelMonth(view.window.end)}`
              : "ماهی در فیلتر نمانده است"
          }
        />
        <Kpi label="تعداد برگشتی" value={faNum(view.numerator.length)} hint="ردیف دارای تاریخ برگشت معتبر در ماه‌های انتخاب‌شده" />
        <Kpi label="نصب پنجره" value={faNum(view.denominator)} hint="سریال یکتا، به‌علاوه ردیف بی‌سریال که حذف نشده" />
        <Kpi
          label="نرخ خرابی زودهنگام"
          value={faPct(view.early.rate)}
          hint={`${faNum(view.early.yes)} از ${faNum(view.early.yes + view.early.no)} ردیف با عمر معلوم · تعریف: تا ${faNum(earlyDays)} روز · ${faNum(view.early.unknown)} نامشخص کنار نرخ، نه حذف`}
        />
        <Kpi
          label="نرخ خرابی تکراری"
          value={faPct(view.repeat.rate)}
          hint={`${faNum(view.repeat.events)} رخداد روی ${faNum(view.repeat.serials)} سریال · از ${faNum(view.repeat.eligible)} سریال‌دار`}
        />
        <Kpi
          label="سهم منشأ مونتاژ و کنترل کیفیت"
          value={faPct(view.assembly.rate)}
          hint={`${faNum(view.assembly.count)} ردیف از صورت همین فیلتر`}
        />
        <Kpi
          label="مهم‌ترین علت"
          value={tied.length > 1 ? `${faNum(tied.length)} علت هم‌رتبه` : (view.topCause?.name ?? "—")}
          hint={tied.length ? tied.map((row) => `${row.name} (${faNum(row.n)})`).join(" · ") : "علتی در صورت کسر نیست"}
        />
        <Kpi
          label="بحرانی‌ترین مدل"
          value={view.criticalModel?.model ?? "قابل اعلام نیست"}
          hint={
            view.criticalModel
              ? `${view.criticalModel.family} · ${faNum(view.criticalModel.n)} برگشت / ${faNum(view.criticalModel.installs)} نصب · PPM ${faPpm(view.criticalModel.ppm)}`
              : "مدلی با پایه نصب در این پنجره پیدا نشد"
          }
        />
        <Kpi
          label="پرتکرارترین قطعه"
          value={view.topPart ? `${view.topPart.name}` : "در اقدام‌ها قطعه نیست"}
          hint={view.topPart ? `${view.topPart.kind} · ${faNum(view.topPart.n)} مورد` : "از متن اقدامات استخراج می‌شود"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
        <Panel title="جمع‌بندی" hint="از روی همین فیلتر، بدون حدس آستانه.">
          <ul className="grid gap-2 text-sm leading-6">
            {view.narrative.map((line) => (
              <li key={line} className="rounded-xl bg-paper px-3 py-2">
                {line}
              </li>
            ))}
          </ul>
        </Panel>
        </div>
        <div className="lg:col-span-3">
          <Panel
            title="اولویت اقدام اصلاحی"
            hint="امتیاز = ۴۰٪ تعداد + ۲۵٪ PPM علت + ۱۵٪ سهم زودهنگام + ۱۰٪ سهم تکرار + ۱۰٪ روند. تاریخ اقدام اصلاحی در داده نیست."
          >
            <ol className="grid gap-2">
              {view.priorities.slice(0, 6).map((row, index) => (
                <li key={row.name} className="rounded-xl bg-paper px-3 py-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">
                      {faNum(index + 1)}. {row.name}
                    </p>
                    <p className="text-sm text-muted">امتیاز {faNum(row.score, 1)}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {faNum(row.n)} مورد · PPM {faPpm(row.ppm)} · روند {row.trend} · زودهنگام {faPct(row.earlyShare)} · تکرار {faPct(row.repeatShare)}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    مدل: {row.models.slice(0, 4).join("، ") || "—"} · قطعه: {row.parts.slice(0, 3).join("، ") || "ذکر نشده"} · منشأ:{" "}
                    {row.origins.join("، ")}
                  </p>
                </li>
              ))}
              {!view.priorities.length ? <li className="text-sm text-muted">با این فیلتر برگشتیِ تاریخ‌دار نیست.</li> : null}
            </ol>
          </Panel>
        </div>
      </div>

      <Panel
        title="روند ماهانه"
        hint={`ستون، تعداد برگشت همان ماه است. خط، PPM همان ماه با پنجره ${faNum(windowMonths)} ماهه خودش است، نه PPM تجمیعی بالا.`}
      >
        {monthRows.length ? <TrendChart rows={monthRows} /> : <p className="text-sm text-muted">ماهی برای نمودار نمانده است.</p>}
      </Panel>

      <Panel
        title="ردیابی صورت و مخرج هر ماه"
        hint="برای چند ماه با هم، PPM بالای صفحه یک پنجره پیوسته از ابتدای پنجره اولین ماه تا آخرین ماه است. جدول زیر فرمول هر ماه را جدا نشان می‌دهد."
      >
        <div className="min-w-0 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="px-2 py-2 text-right font-medium">ماه برگشت</th>
                <th className="px-2 py-2 text-right font-medium">صورت</th>
                <th className="px-2 py-2 text-right font-medium">شروع مخرج</th>
                <th className="px-2 py-2 text-right font-medium">پایان مخرج</th>
                <th className="px-2 py-2 text-right font-medium">نصب</th>
                <th className="px-2 py-2 text-right font-medium">PPM</th>
              </tr>
            </thead>
            <tbody>
              {view.byMonth.map((row) => (
                <tr key={row.month} className="border-b border-line">
                  <td className="px-2 py-2">{row.label}</td>
                  <td className="px-2 py-2">{faNum(row.returns)}</td>
                  <td className="px-2 py-2">{labelMonth(row.windowStart)}</td>
                  <td className="px-2 py-2">{labelMonth(row.windowEnd)}</td>
                  <td className="px-2 py-2">{faNum(row.installs)}</td>
                  <td className="px-2 py-2">{faPpm(row.ppm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
