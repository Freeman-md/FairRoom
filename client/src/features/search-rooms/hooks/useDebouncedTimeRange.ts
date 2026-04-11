import { useEffect, useState } from "react";

type TimeRange = [number, number];

export function useDebouncedTimeRange(
  currentRange: TimeRange,
  onCommit: (nextRange: TimeRange) => void,
  delayMs = 250,
) {
  const [draftRange, setDraftRange] = useState<TimeRange>(currentRange);

  useEffect(() => {
    const [draftStart, draftEnd] = draftRange;
    const [currentStart, currentEnd] = currentRange;

    if (draftStart === currentStart && draftEnd === currentEnd) return;

    const timer = window.setTimeout(() => {
      onCommit(draftRange);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [currentRange, delayMs, draftRange, onCommit]);

  return { draftRange, setDraftRange } as const;
}
