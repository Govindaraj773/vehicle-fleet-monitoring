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

  // View on location map
  const openLocationMap = (lat, lng) => {
    if (lat == null || lng == null) return;

    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Back to trips */}
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

        <Typography
          variant="h6"
          fontWeight={600}
          mb={1.5}
          color="text.secondary"
          backgroundColor="#e3f2fd"
          sx={{
            mt: 0.5,
            backgroundColor: "#e3f2fd",
            color: "black",
            borderRadius: 2,
          }}
        >
          View complete information for Trip :{trip?.id}
        </Typography>

        {/* Refresh button */}
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
      {/* Basic data */}
      <Card
        sx={{
          p: 1.5,
          mb: 1.5,
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1.5}>
          Basic Information
        </Typography>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#f8f9fa",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={900}
                color="text.secondary"
              >
                Trip ID
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.id}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#e3f2fd",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#1565c0">
                Vehicle ID
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.vehicle_id}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#f3e5f5",
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="#7b1fa2">
                Driver ID
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.driver_id || "Not Assigned"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Location  */}
      <Card
        sx={{
          p: 1.5,
          mb: 1.5,
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1.5}>
          Location Information
        </Typography>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#e8f5e9",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#2e7d32">
                Start Latitude
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.start_latitude}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#e8f5e9",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#2e7d32">
                End Latitude
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.end_latitude}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#fff3e0",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#ef6c00">
                Start Longitude
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.start_longitude}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#fff3e0",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#ef6c00">
                End Longitude
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.end_longitude}
              </Typography>
            </Box>
          </Grid>

          {/* live map location */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#e8f5e9",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  openLocationMap(trip?.start_latitude, trip?.start_longitude)
                }
                sx={{
                  textTransform: "none",
                  color: "#2e7d32",
                  borderColor: "#81c784",
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#f1f8e9",
                    borderColor: "#4caf50",
                  },
                }}
              >
                View Start on Map
              </Button>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#e8f5e9",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  openLocationMap(trip?.end_latitude, trip?.end_longitude)
                }
                sx={{
                  textTransform: "none",
                  color: "#ef6c00",
                  borderColor: "#ffb74d",
                  backgroundColor: "#fff",
                  "&:hover": {
                    backgroundColor: "#fff8e1",
                    borderColor: "#fb8c00",
                  },
                }}
              >
                View End on Map
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Timing */}
      <Card
        sx={{
          p: 1.5,
          mb: 1.5,
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1.5}>
          Trip Timing
        </Typography>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#e3f2fd",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#1565c0">
                Start Time
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {formatDateTime(trip?.start_time)}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#fce4ec",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#c2185b">
                End Time
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {formatDateTime(trip?.end_time)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Summary */}
      <Card
        sx={{
          p: 1.5,
          mb: 1,
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={1.5}>
          Trip Summary
        </Typography>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#fff8e1",
              }}
            >
              <Typography variant="body2" fontWeight={600} color="#f57f17">
                Distance
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mt: 0.3 }}>
                {trip?.distance_km} km
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                p: 1.2,
                borderRadius: 1,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                mb={0.5}
              >
                Status
              </Typography>

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
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default TripDetails;
