import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { facets } from "@/lib/analytics";
import { MONTH_LABELS, labelMonth, shiftMonth } from "@/lib/jalali";
import { activeFilterCount, useQuality } from "@/lib/store";
import type { Filters } from "@/lib/types";
import { faNum } from "@/lib/format";

const NAV = [
  { to: "/", label: "نمای مدیریت" },
  { to: "/quality", label: "تحلیل کیفیت" },
  { to: "/records", label: "ریز رکوردها" },
  { to: "/data", label: "کنترل داده" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const dataset = useQuality((s) => s.dataset);
  const filters = useQuality((s) => s.filters);
  const reset = useQuality((s) => s.reset);
  const [open, setOpen] = useState(false);
  const options = useMemo(() => facets(dataset), [dataset]);
  const active = activeFilterCount(filters);

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-sand">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-pine text-sand" aria-hidden="true">
              <span className="size-4 rounded-full border-2 border-sand" />
            </span>
            <div>
              <p className="text-lg font-semibold leading-tight">رصد کیفیت</p>
              <p className="text-sm text-muted">برگشتی خدمات · آرتا گستر</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-wrap gap-1" aria-label="بخش‌ها">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} label={item.label} />
            ))}
          </nav>
          <button
            type="button"
            className="h-11 rounded-full border border-line bg-paper px-4 text-sm lg:hidden"
            onClick={() => setOpen(true)}
          >
            فیلترها{active ? ` · ${faNum(active)}` : ""}
          </button>
        </div>
      </header>
      <div className="mx-auto grid min-w-0 max-w-6xl gap-4 px-4 py-4 lg:grid-cols-[17rem_1fr]">
        <aside className="hidden lg:block">
          <FilterCard options={options} active={active} onReset={reset} />
        </aside>
        <main className="min-w-0 max-w-full">{children}</main>
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="بستن فیلتر" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-paper p-4" role="dialog" aria-label="فیلترها">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold">فیلترها</p>
              <button type="button" className="h-11 rounded-full px-3 text-sm" onClick={() => setOpen(false)}>
                بستن
              </button>
            </div>
            <FilterCard options={options} active={active} onReset={reset} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavLink({ to, label }: { to: (typeof NAV)[number]["to"]; label: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={
        active ? "rounded-full bg-pine px-3 py-2 text-sm text-sand" : "rounded-full px-3 py-2 text-sm text-ink hover:bg-pine-soft"
      }
    >
      {label}
    </Link>
  );
}

type Facet = ReturnType<typeof facets>;

function FilterCard({ options, active, onReset }: { options: Facet; active: number; onReset: () => void }) {
  const filters = useQuality((s) => s.filters);
  const toggle = useQuality((s) => s.toggle);
  const setEarly = useQuality((s) => s.setEarly);
  const setRepeat = useQuality((s) => s.setRepeat);
  const setWindow = useQuality((s) => s.setWindow);

  return (
    <div className="rounded-2xl border border-line bg-sand p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-semibold">محدوده تحلیل</p>
        <button type="button" className="h-11 rounded-full px-2 text-sm text-pine disabled:text-muted" disabled={active === 0} onClick={onReset}>
          پاک کردن
        </button>
      </div>
      <div className="grid gap-2">
        <Multi label="سال" options={options.years} selected={filters.years} onToggle={(value) => toggle("years", value)} />
        <Multi
          label="ماه"
          options={options.months}
          selected={filters.months}
          render={(value) => MONTH_LABELS[Number(value) - 1] ?? value}
          onToggle={(value) => toggle("months", value)}
        />
        <Multi label="فصل" options={options.seasons} selected={filters.seasons} onToggle={(value) => toggle("seasons", value)} />
        <Multi label="خانواده" options={options.families} selected={filters.families} onToggle={(value) => toggle("families", value)} />
        <Multi label="برند" options={options.brands} selected={filters.brands} onToggle={(value) => toggle("brands", value)} />
        <Multi label="مدل" options={options.models} selected={filters.models} onToggle={(value) => toggle("models", value)} searchable />
        <Multi label="علت" options={options.causes} selected={filters.causes} onToggle={(value) => toggle("causes", value)} searchable />
        <Multi label="ریشه" options={options.roots} selected={filters.roots} onToggle={(value) => toggle("roots", value)} />
        <Multi label="منشأ" options={options.origins} selected={filters.origins} onToggle={(value) => toggle("origins", value)} />
        <Multi label="قطعه" options={options.parts} selected={filters.parts} onToggle={(value) => toggle("parts", value)} searchable />
        <Multi label="گارانتی" options={options.warranties} selected={filters.warranties} onToggle={(value) => toggle("warranties", value)} />
        <Multi label="گرید اولیه" options={options.gradesIn} selected={filters.gradesIn} onToggle={(value) => toggle("gradesIn", value)} />
        <Multi label="گرید نهایی" options={options.gradesOut} selected={filters.gradesOut} onToggle={(value) => toggle("gradesOut", value)} />
        <Choice
          label="خرابی زودهنگام"
          value={filters.early}
          options={[
            ["all", "همه"],
            ["yes", "زودهنگام"],
            ["no", "بعد از ۹۰ روز"],
            ["unknown", "نامشخص"],
          ]}
          onChange={(value) => setEarly(value as Filters["early"])}
        />
        <Choice
          label="خرابی تکراری"
          value={filters.repeat}
          options={[
            ["all", "همه"],
            ["yes", "تکراری"],
            ["no", "غیرتکراری"],
          ]}
          onChange={(value) => setRepeat(value as Filters["repeat"])}
        />
        <label className="grid gap-1 text-sm">
          <span className="text-muted">طول پنجره نصب</span>
          <select
            className="h-11 rounded-xl border border-line bg-paper px-3"
            value={filters.windowMonths}
            onChange={(event) => setWindow(Number(event.target.value))}
          >
            {[6, 12, 13, 18].map((n) => (
              <option key={n} value={n}>
                {faNum(n)} ماه، دو سر شامل
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs leading-5 text-muted">
          پنجره {faNum(filters.windowMonths)} ماهه برای فروردین ۱۴۰۵ می‌شود از {labelMonth(shiftMonth("1405-01", -(filters.windowMonths - 1)))} تا{" "}
          {labelMonth("1405-01")}. هر دو سر داخل مخرج‌اند.
        </p>
      </div>
    </div>
  );
}

function Multi({
  label,
  options,
  selected,
  onToggle,
  render,
  searchable,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  render?: (value: string) => string;
  searchable?: boolean;
}) {
  const [q, setQ] = useState("");
  const shown = options.filter((option) => (render?.(option) ?? option).includes(q.trim()));
  return (
    <details className="rounded-xl border border-line bg-paper">
      <summary className="flex h-11 items-center justify-between px-3 text-sm">
        <span>{label}</span>
        <span className="text-muted">{selected.length ? faNum(selected.length) : "همه"}</span>
      </summary>
      <div className="grid max-h-52 gap-1 overflow-auto px-2 pb-2">
        {searchable ? (
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="جستجو"
            className="h-10 rounded-lg border border-line bg-sand px-2 text-sm"
          />
        ) : null}
        {shown.map((option) => {
          const on = selected.includes(option);
          return (
            <label key={option} className="flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm">
              <input type="checkbox" checked={on} onChange={() => onToggle(option)} />
              <span>{render?.(option) ?? option}</span>
            </label>
          );
        })}
        {!shown.length ? <p className="px-1 py-2 text-sm text-muted">موردی نیست</p> : null}
      </div>
    </details>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-sm text-muted">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={
              value === id
                ? "h-10 rounded-full bg-pine px-3 text-sm text-sand"
                : "h-10 rounded-full border border-line bg-paper px-3 text-sm"
            }
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
