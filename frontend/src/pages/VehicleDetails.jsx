import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle = location.state?.vehicle;

  const [telemetry, setTelemetry] = useState([]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/telemetry", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Telemetry Response Fetched:", data);

        //this one line fetched all telemetry record
        //setTelemetry(data.telemetry);

        //We only need telemetry belonging to the vehicle currently being viewed.
        const vehicleTelemetry = data.telemetry.filter(
          (item) => item.vehicle_id === vehicle.id,
        );
        // setTelemetry(vehicleTelemetry); //This gives more telemtery of a single vehicles

        //most recent telemetry record of a vehicle
        const latestTelemetry = vehicleTelemetry[vehicleTelemetry.length - 1];
        setTelemetry(latestTelemetry);
        console.log("Latest telemetry:", latestTelemetry);
      } catch (error) {
        console.error("Telemetry Fetch Error", error);
      }
    };
    fetchTelemetry();
  }, []);

  if (!vehicle) {
    return (
      <Box sx={{ p: 4 }}>
        <Button variant="contained" onClick={() => navigate("/vehicles")}>
          Back to Vehicles
        </Button>
        <Typography variant="h5" gutterBottom>
          Vehicle not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Button variant="outlined" onClick={() => navigate("/vehicles")}>
          Back to Vehicles
        </Button>
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {vehicle.vehicle_number}
          </Typography>

          <Typography color="text.secondary">
            {vehicle.manufacturer} {vehicle.model}
          </Typography>
        </Box>
      </Stack> */}

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        {/* Left: Back Button */}
        <Button
          variant="outlined"
          onClick={() => navigate("/vehicles")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          ← Back to Vehicles
        </Button>

        {/* Center: Vehicle Information */}
        <Box sx={{ flex: 1, ml: 3 }}>
          <Typography variant="h4" fontWeight={700}>
            {vehicle.vehicle_number}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {vehicle.manufacturer} {vehicle.model} • {vehicle.vehicle_type}
          </Typography>
        </Box>

        {/* Right: Status */}
        <Chip
          label={vehicle.status}
          color={
            vehicle.status === "active"
              ? "success"
              : vehicle.status === "offline"
                ? "error"
                : "default"
          }
          sx={{
            textTransform: "capitalize",
            fontWeight: 600,
          }}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Vehicle Type
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.vehicle_type}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>

              <Box mt={1}>
                <Chip
                  label={vehicle.status}
                  color={
                    vehicle.status === "active"
                      ? "success"
                      : vehicle.status === "offline"
                        ? "error"
                        : "default"
                  }
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Speed Limit
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.speed_limit} km/h
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Manufacturer
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.manufacturer}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Model / Year
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.model} / {vehicle.year}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Telemetry
              </Typography>

              <Chip
                label="Live Data"
                color="success"
                size="small"
                sx={{ mb: 3 }}
              />

              {telemetry ? (
                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Speed
                    </Typography>

                    <Typography variant="h6">{telemetry.speed} km/h</Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Fuel Level
                    </Typography>

                    <Typography variant="h6">
                      {telemetry.fuel_level}%
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Battery
                    </Typography>

                    <Typography variant="h6">
                      {telemetry.battery_level} V
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Engine Temperature
                    </Typography>

                    <Typography variant="h6">
                      {telemetry.engine_temperature} °C
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Ignition
                    </Typography>

                    <Chip
                      label={
                        Number(telemetry.speed) === 0 && telemetry.ignition
                          ? "Idle"
                          : "Moving"
                      }
                      color={
                        Number(telemetry.speed) === 0 && telemetry.ignition
                          ? "warning"
                          : "success"
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Odometer
                    </Typography>

                    <Typography variant="h6">
                      {telemetry.odometer} km
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Ignition
                    </Typography>

                    <Chip
                      label={telemetry.ignition ? "ON" : "OFF"}
                      color={telemetry.ignition ? "success" : "default"}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Live Location
                    </Typography>

                    <Typography variant="h6">
                      {telemetry.latitude}, {telemetry.longitude}
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>

                    <Typography variant="h6">
                      {new Date(telemetry.recorded_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  No telemetry data available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleDetails;

// <Typography color="text.secondary">
//   Live speed, fuel, battery, engine temperature, ignition,
//   location and odometer data will be displayed here.
// </Typography>
