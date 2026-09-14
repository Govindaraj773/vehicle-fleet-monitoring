// import VehicleTable from "./components/vehicles/VehicleTable";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  const handleLogin = () => {
    console.log("User Logged In");
    setIsLoggedIn(true);
  };
  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <Routes>
          {" "}
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />{" "}
        </Routes>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </BrowserRouter>
  );
}

export default App;
