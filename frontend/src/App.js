// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Dashboard from "./pages/Dashboard";
// import Prediction from "./pages/Prediction";
// import Schedule from "./pages/Schedule";
// import Monitoring from "./pages/Monitoring";
// import Forecast from "./pages/Forecast";
// import Report from "./pages/Report";
// import Register from "./pages/Register";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";
// import Notifications from "./pages/Notifications";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Login Page */}
//         <Route path="/" element={<Login />} />

//         {/* Home */}
//         <Route
//           path="/home"
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />

//         {/* Dashboard */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         {/* Prediction */}
//         <Route
//           path="/prediction"
//           element={
//             <ProtectedRoute>
//               <Prediction />
//             </ProtectedRoute>
//           }
//         />

//         {/* Schedule */}
//         <Route
//           path="/schedule"
//           element={
//             <ProtectedRoute>
//               <Schedule />
//             </ProtectedRoute>
//           }
//         />

//         {/* Monitoring */}
//         <Route
//   path="/monitoring"
//   element={
//     <AdminRoute>
//       <Monitoring />
//     </AdminRoute>
//   }
// />

//         {/* Forecast */}
//         <Route
//           path="/forecast"
//           element={
//             <ProtectedRoute>
//               <Forecast />
//             </ProtectedRoute>
//           }
//         />

//         {/* Report */}
//         <Route
//   path="/report"
//   element={
//     <AdminRoute>
//       <Report />
//     </AdminRoute>
//   }
// />
// <Route path="/register" element={<Register />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Prediction from "./pages/Prediction";
import Schedule from "./pages/Schedule";
import Monitoring from "./pages/Monitoring";
import Forecast from "./pages/Forecast";
import Report from "./pages/Report";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Announcement from "./pages/Announcement";
import Analytics from "./pages/Analytics";
import Heatmap from "./pages/Heatmap";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Register */}
        <Route path="/register" element={<Register />} />
        {/* Analytics */}
        <Route
  path="/analytics"
  element={
    <AdminRoute>
      <Analytics />
    </AdminRoute>
  }
/>
        {/* Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Prediction */}
        <Route
          path="/prediction"
          element={
            <ProtectedRoute>
              <Prediction />
            </ProtectedRoute>
          }
        />

        {/* Schedule */}
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />

        {/* Forecast */}
        <Route
          path="/forecast"
          element={
            <ProtectedRoute>
              <Forecast />
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/monitoring"
          element={
            <AdminRoute>
              <Monitoring />
            </AdminRoute>
          }
        />

        <Route
          path="/report"
          element={
            <AdminRoute>
              <Report />
            </AdminRoute>
          }
        />
        <Route
  path="/announcement"
  element={
    <ProtectedRoute>
      <Announcement />
    </ProtectedRoute>
  }
/><Route
  path="/heatmap"
  element={
    <ProtectedRoute>
      <Heatmap />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;