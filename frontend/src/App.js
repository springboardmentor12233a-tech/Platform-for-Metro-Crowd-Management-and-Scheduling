import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Schedule from "./pages/Schedule";
import Monitoring from "./pages/Monitoring";
import Forecast from "./pages/Forecast";
import Report from "./pages/Report";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/monitor" element={<Monitoring />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;