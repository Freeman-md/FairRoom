import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDebouncedTimeRange } from "@/features/search-rooms/hooks/useDebouncedTimeRange";

describe("useDebouncedTimeRange", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("commits the latest range after the debounce delay", () => {
    vi.useFakeTimers();
    const onCommit = vi.fn();

    const { result } = renderHook(({ range }) => useDebouncedTimeRange(range, onCommit, 300), {
      initialProps: { range: [0, 24] as [number, number] },
    });

    act(() => {
      result.current.setDraftRange([10, 12]);
    });

    expect(onCommit).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(onCommit).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(onCommit).toHaveBeenCalledWith([10, 12]);
  });
});
