import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
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
    <div style={{ padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Vehicle Fleet Monitoring
      </Typography>
      {summary && (
        <div>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Total Vehicles</Typography>
                  <Typography variant="h4">{summary.totalVehicles}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Active Vehicles</Typography>
                  <Typography variant="h4">{summary.activeVehicles}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Offline Vehicles</Typography>
                  <Typography variant="h4">
                    {summary.offlineVehicles}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Total Drivers</Typography>
                  <Typography variant="h4">{summary.totalDrivers}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Available Drivers</Typography>
                  <Typography variant="h4">
                    {summary.availableDrivers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Active Trips</Typography>
                  <Typography variant="h4">{summary.activeTrips}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Completed Trips</Typography>
                  <Typography variant="h4">{summary.completedTrips}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6">Active Alerts</Typography>
                  <Typography variant="h4">{summary.activeAlerts}</Typography>
                </CardContent>
              </Card>{" "}
            </Grid>
          </Grid>
        </div>
      )}
      <Button onClick={() => navigate("/vehicles")}>View All Vehicles</Button>
    </div>
  );
}

export default Dashboard;
