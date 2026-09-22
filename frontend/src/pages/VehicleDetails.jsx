import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3774/3774278.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  TextField,
} from "@mui/material";

const MapUpdater = ({ latitude, longitude }) => {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([Number(latitude), Number(longitude)]);
    }
  }, [latitude, longitude, map]);

  return null;
};

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle = location.state?.vehicle;
  const editMode = location.state?.editMode;
  console.log("Edit Mode:", editMode);

  const [telemetry, setTelemetry] = useState([]);
  const [formData, setFormData] = useState({
    vehicle_number: "",
    vehicle_type: "",
    manufacturer: "",
    model: "",
    year: "",
    driver_id: "",
    status: "",
  });

  useEffect(() => {
    if (editMode && vehicle) {
      setFormData({
        vehicle_number: vehicle.vehicle_number || "",
        vehicle_type: vehicle.vehicle_type || "",
        manufacturer: vehicle.manufacturer || "",
        model: vehicle.model || "",
        year: vehicle.year || "",
        driver_id: vehicle.driver_id || "",
        status: vehicle.status || "",
      });
    }
  }, [editMode, vehicle]);

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

    //every 10 seconds gives the data
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
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
    <>
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

          {/* edit the vehicle details */}
          {editMode && (
            <Grid item xs={12}>
              <Card
                sx={{
                  mb: 4,
                  borderRadius: 3,
                  boxShadow: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Edit Vehicle
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Update the vehicle information below.
                  </Typography>

                  {/* All textfields */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Vehicle Number"
                        value={formData.vehicle_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicle_number: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Vehicle Type"
                        value={formData.vehicle_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            vehicle_type: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Manufacturer"
                        value={formData.manufacturer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            manufacturer: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Model"
                        value={formData.model}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            model: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Year"
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            year: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Driver ID"
                        value={formData.driver_id}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            driver_id: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Status"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ mt: 3 }}
                  >
                    {/* <Button
                      variant="contained"
                      sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");
                          const response = await fetch(
                            `http://localhost:5000/api/vehicles/${vehicle.id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify(formData),
                            },
                          );
                          const data = await response.json();
                          console.log("Update Vehicle Response", data);

                          if (!response.ok) {
                            alert(data.message || "Failed to update vehicle");
                            return;
                          }
                          alert("Vehicle Updated Successfully!");
                          navigate("/vehicles");
                        } catch (error) {
                          console.error("Update Vehicle Error...", error);
                          alert(
                            "Something went wrong while updating vehicles!",
                          );
                        }
                      }}
                    >
                      Update Vehicle
                    </Button> */}
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                      }}
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem("token");

                          const response = await fetch(
                            `http://localhost:5000/api/vehicles/${vehicle.id}`,
                            {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify(formData),
                            },
                          );

                          const data = await response.json();

                          console.log("Update Vehicle Response:", data);

                          if (!response.ok) {
                            alert(data.message || "Failed to update vehicle");
                            return;
                          }

                          alert("Vehicle updated successfully");

                          navigate("/vehicles");
                        } catch (error) {
                          console.error("Update Vehicle Error:", error);
                          alert(error.message);
                          // alert(
                          //   "Something went wrong while updating the vehicle",
                          // );
                        }
                      }}
                    >
                      Update Vehicle
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* live telemetry */}
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

                      <Typography variant="h6">
                        {telemetry.speed} km/h
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
                        {new Date(telemetry.recorded_at).toLocaleString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
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

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Vehicle Location
        </Typography>

        {telemetry?.latitude && telemetry?.longitude ? (
          <MapContainer
            center={[Number(telemetry.latitude), Number(telemetry.longitude)]}
            zoom={13}
            style={{
              height: "400px",
              width: "100%",
              borderRadius: "12px",
            }}
          >
            <MapUpdater
              latitude={telemetry.latitude}
              longitude={telemetry.longitude}
            />

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[
                Number(telemetry.latitude),
                Number(telemetry.longitude),
              ]}
              icon={vehicleIcon}
            >
              <Popup>
                <strong>{vehicle.vehicle_number}</strong>
                <br />
                {vehicle.manufacturer} {vehicle.model}
                <br />
                Speed: {telemetry.speed} km/h
                <br />
                Fuel: {telemetry.fuel_level}%
                <br />
                Status:{" "}
                {Number(telemetry.speed) === 0 && telemetry.ignition
                  ? "Idle"
                  : "Moving"}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <Typography color="text.secondary">
            Location data is not available.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default VehicleDetails;

// <Typography color="text.secondary">
//   Live speed, fuel, battery, engine temperature, ignition,
//   location and odometer data will be displayed here.
// </Typography>
