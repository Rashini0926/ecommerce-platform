import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";


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
            <h2 className="container mt-5">
              Customer Dashboard
            </h2>
          </ProtectedRoute>
        }
      />


    </Routes>

  );

}


export default App;