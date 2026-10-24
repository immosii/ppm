import { useEffect, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { faNum } from "@/lib/format";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function Frame({ height, children }: { height: number; children: ReactNode }) {
  const mounted = useMounted();
  if (!mounted) return <div className="rounded-xl bg-pine-soft" style={{ height }} />;
  return (
    <div className="w-full max-w-full overflow-hidden" style={{ height }} dir="ltr">
      {children}
    </div>
  );
}

function Tip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-sand px-3 py-2 text-sm text-ink shadow-sm" dir="rtl">
      <p className="font-semibold">{label}</p>
      {payload.map((item) => (
        <p key={String(item.name)} className="text-muted">
          {item.name}: {faNum(Number(item.value))}
        </p>
      ))}
    </div>
  );
}

const tick = { fill: "var(--color-muted)", fontSize: 12 };

export function TrendChart({
  rows,
}: {
  rows: { label: string; returns: number; ppm: number | null; installs: number }[];
}) {
  return (
    <Frame height={280}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="label" tick={tick} />
          <YAxis yAxisId="n" tick={tick} allowDecimals={false} />
          <YAxis yAxisId="p" orientation="right" tick={tick} />
          <Tooltip content={<Tip />} />
          <Bar yAxisId="n" dataKey="returns" name="برگشتی" fill="var(--color-pine)" radius={[6, 6, 0, 0]} barSize={22} />
          <Line yAxisId="p" dataKey="ppm" name="PPM" stroke="var(--color-clay)" strokeWidth={2} dot={{ r: 3 }} connectNulls={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function ParetoChart({ rows }: { rows: { name: string; n: number; cum: number }[] }) {
  const data = rows.map((row) => ({
    name: row.name.length > 16 ? `${row.name.slice(0, 15)}…` : row.name,
    full: row.name,
    n: row.n,
    cum: Math.round(row.cum * 100),
  }));
  return (
    <Frame height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="name" tick={tick} interval={0} angle={-25} textAnchor="end" height={60} />
          <YAxis yAxisId="n" tick={tick} allowDecimals={false} />
          <YAxis yAxisId="c" orientation="right" tick={tick} domain={[0, 100]} />
          <Tooltip content={<Tip />} />
          <Bar yAxisId="n" dataKey="n" name="تعداد" fill="var(--color-pine)" radius={[6, 6, 0, 0]} />
          <Line yAxisId="c" dataKey="cum" name="تجمعی٪" stroke="var(--color-clay)" strokeWidth={2} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Frame>
  );
}

export function HBars({ rows }: { rows: { name: string; n: number }[] }) {
  const data = rows.slice(0, 10).map((row) => ({
    name: row.name.length > 18 ? `${row.name.slice(0, 17)}…` : row.name,
    n: row.n,
  }));
  const height = Math.max(200, data.length * 36);
  return (
    <Frame height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={120} tick={tick} />
          <Tooltip content={<Tip />} />
          <Bar dataKey="n" name="تعداد" fill="var(--color-pine)" radius={[0, 6, 6, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </Frame>
  );
}
