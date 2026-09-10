// import VehicleTable from "./components/vehicles/VehicleTable";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Vehicles from "./pages/Vehicles";

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
    <>
      {isLoggedIn ? (
        <>
          {" "}
          <Dashboard /> <Vehicles />{" "}
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
