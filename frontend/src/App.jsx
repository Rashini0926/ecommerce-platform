import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";

function App() {

  return (

    <Routes>

      <Route 
        path="/" 
        element={<Home />} 
      />


      <Route 
        path="/login" 
        element={<Login />} 
      />


      <Route 
        path="/register" 
        element={<Register />} 
      />


      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            
          </ProtectedRoute>
        }
      />
      <Route
 path="/dashboard"
 element={
   <ProtectedRoute>
     <Dashboard />
   </ProtectedRoute>
 }
/>
<Route 
  path="/cart" 
  element={<Cart />} 
  />
<Route 
  path="/checkout" 
  element={<Checkout />} 
/>
<Route 
 path="/order-success"
 element={<OrderSuccess/>}
/>
<Route
  path="/orders"
  element={<MyOrders />}
/>

    </Routes>

  );

}


export default App;