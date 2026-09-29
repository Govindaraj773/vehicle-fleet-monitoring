import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Navigate, useNavigate } from "react-router-dom";

const Trips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Trips API response:", data);

        if (response.ok) {
          setTrips(data.trips);
        }
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Trips
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Monitor and manage fleet trips
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Trip ID</strong>
              </TableCell>
              <TableCell>
                <strong>Vehicle</strong>
              </TableCell>
              <TableCell>
                <strong>Driver</strong>
              </TableCell>
              <TableCell>
                <strong>Start Location</strong>
              </TableCell>
              <TableCell>
                <strong>End Location</strong>
              </TableCell>
              <TableCell>
                <strong>Start Time</strong>
              </TableCell>
              <TableCell>
                <strong>End Time</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {trips.map((trip) => (
              <TableRow key={trip.id}>
                <TableCell>{trip.id}</TableCell>

                <TableCell>{trip.vehicle_id}</TableCell>

                <TableCell>{trip.driver_id || "Not Assigned"}</TableCell>

                <TableCell>
                  {trip.start_latitude}, {trip.start_longitude}
                </TableCell>

                <TableCell>
                  {trip.end_latitude}, {trip.end_longitude}
                </TableCell>

                <TableCell>
                  {trip.start_time
                    ? new Date(trip.start_time).toLocaleString()
                    : "-"}
                </TableCell>

                <TableCell>
                  {trip.end_time
                    ? new Date(trip.end_time).toLocaleString()
                    : "-"}
                </TableCell>

                <TableCell>{trip.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Trips;
