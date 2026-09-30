import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Button, Typography } from "@mui/material";

const TripDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
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
        console.error("Trip Response Error", error);
      }
    };
    fetchTrip();
  }, [id]);
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
          <Typography variant="h5" fontWeight={600}>
            Trip Details
          </Typography>

          <Typography variant="body1">Trip ID: {trip?.id}</Typography>

          <Typography variant="body1">
            Vehicle ID: {trip?.vehicle_id}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/trips")}
          sx={{
            textTransform: "none",
          }}
        >
          Back to Trips
        </Button>
      </Box>
    </Box>
  );
};

export default TripDetails;
