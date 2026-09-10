import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import VehicleTable from "../components/vehicles/VehicleTable";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await fetch("http://localhost:5000/api/vehicles", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Fetched Vehicles Data:", data);

        setVehicles(data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    console.log("Fetching vehicles data...");

    fetchVehicles();
  }, []);

  return (
    <Box>
      <Typography variant="h4">Vehicles</Typography>

      <Typography variant="body2" color="text.secondary">
        Monitor and Manage Your Fleet Vehicles
      </Typography>

      <VehicleTable vehicles={vehicles} />
    </Box>
  );
};

export default Vehicles;
