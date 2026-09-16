import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderProtectedRoute(allowedRoles) {
  return render(
    <MemoryRouter initialEntries={["/secure"]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/dashboard" element={<div>Customer dashboard</div>} />
        <Route path="/seller/dashboard" element={<div>Seller dashboard</div>} />
        <Route path="/admin/dashboard" element={<div>Admin dashboard</div>} />
        <Route
          path="/secure"
          element={(
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Protected content</div>
            </ProtectedRoute>
          )}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects guests to login", () => {
    useAuth.mockReturnValue({ token: null, user: null });

    renderProtectedRoute(["admin"]);

    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("redirects authenticated users to their own dashboard when the role is not allowed", () => {
    useAuth.mockReturnValue({ token: "token", user: { role: "CUSTOMER" } });

    renderProtectedRoute(["seller"]);

    expect(screen.getByText("Customer dashboard")).toBeInTheDocument();
  });

  it("renders the page for an allowed role regardless of role casing", () => {
    useAuth.mockReturnValue({ token: "token", user: { role: "ADMIN" } });

    renderProtectedRoute(["admin"]);

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("allows every authenticated role when no role list is supplied", () => {
    useAuth.mockReturnValue({ token: "token", user: { role: "SELLER" } });

    renderProtectedRoute(undefined);

    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });
});
