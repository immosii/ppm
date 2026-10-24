import type { ReactNode } from "react";

export function Panel({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 max-w-full rounded-2xl border border-line bg-sand p-4 sm:p-5">
      <header className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {hint ? <p className="mt-1 text-sm leading-6 text-muted">{hint}</p> : null}
      </header>
      {children}
    </section>
  );
}

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <article className="rounded-2xl border border-line bg-sand p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold leading-tight">{value}</p>
      {hint ? <p className="mt-2 text-xs leading-5 text-muted">{hint}</p> : null}
    </article>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl bg-paper px-3 py-3 text-sm text-muted">{children}</p>;
}
