import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatReportCurrency, getDefaultReportRange, toDateInput } from "./reportUtils";

describe("reportUtils", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 16, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates inclusive report ranges using local calendar dates", () => {
    expect(getDefaultReportRange(7)).toEqual({
      from: "2026-09-10",
      to: "2026-09-16",
    });
  });

  it("formats dates without UTC timezone shifts", () => {
    expect(toDateInput(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });

  it("formats report totals as Sri Lankan rupees", () => {
    expect(formatReportCurrency(12500)).toMatch(/12,500/);
    expect(formatReportCurrency(null)).toMatch(/0/);
  });
});
