import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard/dashboard")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dashboard Summary:", data);
        setSummary(data);
      })
      .catch((error) => {
        console.log("dashboard API Error:", error);
      });
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
      style={{ padding: "24px" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#ffffff",
          background: "linear-gradient(135deg, #1565c0, #283593)",
          p: 2.5,
          pb: 3,
          mb: 3,
          borderRadius: 2,
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(21, 101, 192, 0.2)",
        }}
      >
        Vehicle Fleet Monitoring System
      </Typography>
      {summary && (
        <div>
          <Grid container spacing={2}>
            {/* Total Vehicles */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #bfdbfe",
                  borderLeft: "4px solid #2563eb",
                  bgcolor: "#eff6ff",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#1d4ed8" fontWeight={600}>
                    Total Vehicles
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#1e3a8a"
                    sx={{ mt: 1 }}
                  >
                    {summary.totalVehicles}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Vehicles */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #bbf7d0",
                  borderLeft: "4px solid #16a34a",
                  bgcolor: "#f0fdf4",
                  boxShadow: "0 2px 8px rgba(22, 163, 74, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(22, 163, 74, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#15803d" fontWeight={600}>
                    Active Vehicles
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#14532d"
                    sx={{ mt: 1 }}
                  >
                    {summary.activeVehicles}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Offline Vehicles */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #fecaca",
                  borderLeft: "4px solid #dc2626",
                  bgcolor: "#fef2f2",
                  boxShadow: "0 2px 8px rgba(220, 38, 38, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(220, 38, 38, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#b91c1c" fontWeight={600}>
                    Offline Vehicles
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#7f1d1d"
                    sx={{ mt: 1 }}
                  >
                    {summary.offlineVehicles}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Total Drivers */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #ddd6fe",
                  borderLeft: "4px solid #7c3aed",
                  bgcolor: "#f5f3ff",
                  boxShadow: "0 2px 8px rgba(124, 58, 237, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(124, 58, 237, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#6d28d9" fontWeight={600}>
                    Total Drivers
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#4c1d95"
                    sx={{ mt: 1 }}
                  >
                    {summary.totalDrivers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Available Drivers */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #a5f3fc",
                  borderLeft: "4px solid #0891b2",
                  bgcolor: "#ecfeff",
                  boxShadow: "0 2px 8px rgba(8, 145, 178, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(8, 145, 178, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#0e7490" fontWeight={600}>
                    Available Drivers
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#164e63"
                    sx={{ mt: 1 }}
                  >
                    {summary.availableDrivers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Trips */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #fde68a",
                  borderLeft: "4px solid #d97706",
                  bgcolor: "#fffbeb",
                  boxShadow: "0 2px 8px rgba(217, 119, 6, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(217, 119, 6, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#b45309" fontWeight={600}>
                    Active Trips
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#78350f"
                    sx={{ mt: 1 }}
                  >
                    {summary.activeTrips}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Completed Trips */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #99f6e4",
                  borderLeft: "4px solid #0d9488",
                  bgcolor: "#f0fdfa",
                  boxShadow: "0 2px 8px rgba(13, 148, 136, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(13, 148, 136, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#0f766e" fontWeight={600}>
                    Completed Trips
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#134e4a"
                    sx={{ mt: 1 }}
                  >
                    {summary.completedTrips}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Active Alerts */}
            <Grid size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2.5,
                  border: "1px solid #fbcfe8",
                  borderLeft: "4px solid #db2777",
                  bgcolor: "#fdf2f8",
                  boxShadow: "0 2px 8px rgba(219, 39, 119, 0.06)",
                  transition: "0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(219, 39, 119, 0.12)",
                  },
                }}
              >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Typography variant="body2" color="#be185d" fontWeight={600}>
                    Active Alerts
                  </Typography>
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    color="#831843"
                    sx={{ mt: 1 }}
                  >
                    {summary.activeAlerts}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      )}

      {/* Navigation buttons */}
      <Box
        sx={{
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#f4f7fb",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 3,
          alignContent: "start",
        }}
      >
        <Box
          sx={{
            p: 3,
            flex: "1 1 220px",
            borderRadius: 3,
            // backgroundColor: "#e3f2fd",
            border: "1px solid #bbdefb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/vehicles")}
            sx={{
              backgroundColor: "#1976d2",
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            View All Vehicles
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            flex: "1 1 220px",
            borderRadius: 3,
            backgroundColor: "#ffebee",
            border: "1px solid #ffcdd2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/alerts")}
            sx={{
              backgroundColor: "#d32f2f",
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#b71c1c" },
            }}
          >
            View All Alerts
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            flex: "1 1 220px",
            borderRadius: 3,
            backgroundColor: "#e8f5e9",
            border: "1px solid #c8e6c9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/trips")}
            sx={{
              backgroundColor: "#2e7d32",
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#1b5e20" },
            }}
          >
            View All Trips
          </Button>
        </Box>

        <Box
          sx={{
            p: 3,
            flex: "1 1 220px",
            borderRadius: 3,
            backgroundColor: "#f3e5f5",
            border: "1px solid #e1bee7",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/drivers")}
            sx={{
              backgroundColor: "#7b1fa2",
              py: 1.2,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#6a1b9a" },
            }}
          >
            View All Drivers
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
