import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Button, Card, Grid, Typography } from "@mui/material";

const TripDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/trips/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Trip Response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch trip");
        }
        setTrip(data.trip?.[0] || null);
      } catch (error) {
        console.error("Failed to Fetch Trip", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  // loading and error code
  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading trip details...</Typography>;
  }
  if (error) {
    return <Typography sx={{ p: 3 }}>{error}</Typography>;
  }
  if (!trip) {
    return <Typography sx={{ p: 3 }}>Trip not found!</Typography>;
  }
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/trips")}
          sx={{
            textTransform: "none",
          }}
        >
          Back to Trips
        </Button>
        <Typography variant="h5" fontWeight={600}>
          Trip Details
        </Typography>
      </Box>
      <Box>
        {/* <Typography variant="body1">Trip ID: {trip?.id}</Typography>

        <Typography variant="body1">Vehicle ID: {trip?.vehicle_id}</Typography>
        <Typography variant="body1">
          Driver ID: {trip?.driver_id || "Not Assigned"}
        </Typography> */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Basic Information
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Trip ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.id}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Vehicle ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.vehicle_id}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Driver ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.driver_id || "Not Assigned"}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* <Typography variant="body1">
          Start Latitude: {trip?.start_latitude}
        </Typography>
        <Typography variant="body1">
          Start Longitude: {trip?.start_longitude}
        </Typography>
        <Typography variant="body1">
          End Latitude: {trip?.end_latitude}
        </Typography>
        <Typography variant="body1">
          End Longitude: {trip?.end_longitude}
        </Typography> */}

        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Location Information
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Start Latitude
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.start_latitude}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Start Longitude
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.start_longitude}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                End Latitude
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.end_latitude}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                End Longitude
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.end_longitude}
              </Typography>
            </Grid>
          </Grid>
        </Card>
        {/* <Typography variant="body1">Start Time: {trip?.start_time}</Typography>

        <Typography variant="body1">End Time: {trip?.end_time}</Typography> */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Trip Timing
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Start Time
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.start_time}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                End Time
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.end_time}
              </Typography>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Trip Summary
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Distance
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.distance_km} km
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {trip?.status}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default TripDetails;
