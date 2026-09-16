import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Cart = lazy(() => import("./pages/Cart"));
const Notifications = lazy(() => import("./pages/Notifications"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const SellerProducts = lazy(() => import("./pages/SellerProducts"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const DemoPayment = lazy(() => import("./pages/DemoPayment"));
const NotFound = lazy(() => import("./pages/NotFound"));

const protectedPage = (roles, page) => (
  <ProtectedRoute allowedRoles={roles}>{page}</ProtectedRoute>
);

export default function App() {
  return (
    <Suspense fallback={<div className="min-vh-100 d-grid align-items-center"><LoadingSpinner size="lg" text="Loading page..." /></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

        <Route path="/dashboard" element={protectedPage(["customer"], <Dashboard />)} />
        <Route path="/profile" element={protectedPage(["customer"], <Profile />)} />
        <Route path="/wishlist" element={protectedPage(["customer"], <Wishlist />)} />
        <Route path="/cart" element={protectedPage(["customer"], <Cart />)} />
        <Route path="/notifications" element={protectedPage(undefined, <Notifications />)} />
        <Route path="/checkout" element={protectedPage(["customer"], <Checkout />)} />
        <Route path="/orders" element={protectedPage(["customer"], <MyOrders />)} />
        <Route path="/orders/:id" element={protectedPage(["customer"], <OrderDetails />)} />
        <Route path="/order-success" element={protectedPage(["customer"], <OrderSuccess />)} />
        <Route path="/orders/:id/payment" element={protectedPage(["customer"], <DemoPayment />)} />

        <Route path="/seller/dashboard" element={protectedPage(["seller"], <SellerDashboard />)} />
        <Route path="/seller/products" element={protectedPage(["seller", "admin"], <SellerProducts />)} />

        <Route path="/admin/dashboard" element={protectedPage(["admin"], <AdminDashboard />)} />
        <Route path="/admin/orders" element={protectedPage(["admin"], <AdminOrders />)} />
        <Route path="/admin/categories" element={protectedPage(["admin"], <AdminCategories />)} />
        <Route path="/admin/users" element={protectedPage(["admin"], <AdminUsers />)} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
