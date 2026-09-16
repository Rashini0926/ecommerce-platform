import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CartItem from "./CartItem";

describe("CartItem", () => {
  it("uses the discounted sale price for unit and subtotal values", () => {
    const item = {
      id: 10,
      quantity: 2,
      product: { name: "Headphones", price: 1000, sale_price: 800, stock: 5 },
    };
    const onIncrease = vi.fn();

    render(
      <table><tbody><CartItem item={item} isProcessing={false} onDecrease={vi.fn()} onIncrease={onIncrease} onRemove={vi.fn()} /></tbody></table>,
    );

    expect(screen.getByText("Rs. 800")).toBeInTheDocument();
    expect(screen.getByText("Rs. 1,600")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(onIncrease).toHaveBeenCalledWith(item);
  });
});
