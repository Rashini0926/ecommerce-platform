import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ReportDateFilter,
  RevenueTrendChart,
  StatusBreakdown,
  TopProducts,
} from "./AnalyticsWidgets";

describe("analytics widgets", () => {
  it("submits a custom date range and supports presets", () => {
    const onApply = vi.fn((event) => event.preventDefault());
    const onChange = vi.fn();
    const onPreset = vi.fn();

    render(
      <ReportDateFilter
        loading={false}
        onApply={onApply}
        onChange={onChange}
        onPreset={onPreset}
        range={{ from: "2026-09-01", to: "2026-09-16" }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "7 days" }));
    fireEvent.change(screen.getByLabelText("From"), { target: { value: "2026-09-05" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(onPreset).toHaveBeenCalledWith(7);
    expect(onChange).toHaveBeenCalledWith({ from: "2026-09-05", to: "2026-09-16" });
    expect(onApply).toHaveBeenCalledOnce();
  });

  it("renders order status counts with accessible progress bars", () => {
    render(<StatusBreakdown statuses={{ PROCESSING: 3, DELIVERED: 1 }} />);

    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Processing orders" })).toHaveAttribute("aria-valuenow", "75");
  });

  it("renders ranked products and their paid sales", () => {
    render(<TopProducts products={[{ product_name: "Laptop", units_sold: 2, revenue: 250000 }]} />);

    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("2 units sold")).toBeInTheDocument();
    expect(screen.getByText(/250,000/)).toBeInTheDocument();
  });

  it("shows revenue totals and an empty message when no paid sales exist", () => {
    const { rerender } = render(<RevenueTrendChart data={[{ date: "2026-09-01", orders: 2, revenue: 1500 }]} />);

    expect(screen.getAllByText(/1,500/).length).toBeGreaterThan(0);
    expect(screen.getByText("2")).toBeInTheDocument();

    rerender(<RevenueTrendChart data={[]} />);
    expect(screen.getByText("No paid sales in this period")).toBeInTheDocument();
  });
});
