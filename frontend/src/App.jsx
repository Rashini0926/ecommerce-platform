import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";


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


    </Routes>

  );

}


export default App;