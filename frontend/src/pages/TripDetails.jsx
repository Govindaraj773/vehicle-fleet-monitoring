import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

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
        <Box>
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

          <Typography variant="body1">Trip ID: {trip?.id}</Typography>

          <Typography variant="body1">
            Vehicle ID: {trip?.vehicle_id}
          </Typography>
          <Typography variant="body1">
            Driver ID: {trip?.driver_id || "Not Assigned"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TripDetails;
