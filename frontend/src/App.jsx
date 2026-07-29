import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/UserDashboard";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Ananlytics";
import MyPredictions from "./pages/MyPrediction";

function App(){

  return(

    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Register />} />


        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* User Routes */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/my-prediction" element={<MyPredictions />} />



        {/* Common Prediction Page */}
        <Route path="/prediction" element={<Prediction />} />


      </Routes>

    </BrowserRouter>

  );

}

export default App;