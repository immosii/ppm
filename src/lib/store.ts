import { create } from "zustand";
import { defaultFilters } from "@/lib/analytics";
import { bundled } from "@/data/bundled";
import type { Dataset, Filters } from "@/lib/types";

type MultiKey = {
  [K in keyof Filters]: Filters[K] extends string[] ? K : never;
}[keyof Filters];

type QualityState = {
  dataset: Dataset;
  filters: Filters;
  setDataset: (dataset: Dataset) => void;
  toggle: (key: MultiKey, value: string) => void;
  setEarly: (early: Filters["early"]) => void;
  setRepeat: (repeat: Filters["repeat"]) => void;
  setWindow: (windowMonths: number) => void;
  reset: () => void;
};

export const useQuality = create<QualityState>((set) => ({
  dataset: bundled,
  filters: defaultFilters,
  setDataset: (dataset) => set({ dataset }),
  toggle: (key, value) =>
    set((state) => {
      const current = state.filters[key];
      const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
      return { filters: { ...state.filters, [key]: next } };
    }),
  setEarly: (early) => set((state) => ({ filters: { ...state.filters, early } })),
  setRepeat: (repeat) => set((state) => ({ filters: { ...state.filters, repeat } })),
  setWindow: (windowMonths) => set((state) => ({ filters: { ...state.filters, windowMonths } })),
  reset: () => set({ filters: defaultFilters }),
}));

export function activeFilterCount(filters: Filters): number {
  const lists =
    filters.years.length +
    filters.months.length +
    filters.seasons.length +
    filters.families.length +
    filters.brands.length +
    filters.models.length +
    filters.causes.length +
    filters.roots.length +
    filters.origins.length +
    filters.parts.length +
    filters.warranties.length +
    filters.gradesIn.length +
    filters.gradesOut.length;
  return lists + (filters.early === "all" ? 0 : 1) + (filters.repeat === "all" ? 0 : 1) + (filters.windowMonths === 13 ? 0 : 1);
}
