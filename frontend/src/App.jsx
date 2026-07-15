import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";


function App() {

  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/products" element={<Products />} />

      <Route path="/cart" element={<Cart />} />

      <Route path="/wishlist" element={<Wishlist />} />

    </Routes>
  );
}


export default App;