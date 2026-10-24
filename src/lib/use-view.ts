import { useMemo } from "react";
import { buildView } from "@/lib/analytics";
import { useQuality } from "@/lib/store";

export function useView() {
  const dataset = useQuality((s) => s.dataset);
  const filters = useQuality((s) => s.filters);
  return useMemo(() => buildView(dataset, filters), [dataset, filters]);
}
