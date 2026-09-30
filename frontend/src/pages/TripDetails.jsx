import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Chip,
  Grid,
  Typography,
} from "@mui/material";

const formatDateTime = (dateTime) => {
  if (!dateTime) return "Not Available";

  return new Date(dateTime).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TripDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // fetching data
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

  useEffect(() => {
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/trips")}
            sx={{
              textTransform: "none",
              color: "#1976d2",
              borderColor: "#90caf9",
              backgroundColor: "#e3f2fd",
              "&:hover": {
                backgroundColor: "#bbdefb",
                borderColor: "#64b5f6",
              },
            }}
          >
            Back to Trips
          </Button>
          <Button
            variant="outlined"
            onClick={fetchTrip}
            disabled={loading}
            sx={{
              textTransform: "none",
              color: "#1976d2",
              borderColor: "#90caf9",
              backgroundColor: "#e3f2fd",
              "&:hover": {
                backgroundColor: "#bbdefb",
                borderColor: "#64b5f6",
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </Box>
        <Typography variant="h5" fontWeight={600}>
          Trip Details
        </Typography>
      </Box>
      <Box>
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
                {formatDateTime(trip?.start_time)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                End Time
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {formatDateTime(trip?.end_time)}
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
              {/* <Chip
                label={trip?.status || "Unknown"}
                size="small"
                variant="outlined"
              /> */}
              <Chip
                label={trip?.status || "Unknown"}
                size="small"
                color={
                  trip?.status === "active"
                    ? "primary"
                    : trip?.status === "completed"
                      ? "success"
                      : trip?.status === "cancelled"
                        ? "error"
                        : "default"
                }
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </Box>
  );
};

export default TripDetails;
