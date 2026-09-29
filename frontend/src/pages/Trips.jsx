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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Trips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/trips", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Trips API response:", data);

        // if (response.ok) {
        //   setTrips(data.trips);
        // }

        if (!response.ok) {
          throw new Error(data.mesage || "Failed to fetch response");
        }
        setTrips(data.trips || []);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
        setError(error.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // filter and search
  const filteredTrips = trips.filter((trip) => {
    const searchValue = search.toLowerCase();

    const matchsSearch =
      String(trip.id).toLowerCase().includes(searchValue) ||
      String(trip.vehicle_id).toLowerCase().includes(searchValue) ||
      String(trip.driver_id || "")
        .toLowerCase()
        .includes(searchValue);

    const matchsStatus =
      statusFilter === "all" ||
      String(trip.status).toLowerCase() === statusFilter;

    return matchsSearch && matchsStatus;
  });
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

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Search trips"
          placeholder="Search by Trip ID, Vehicle ID or Driver ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ mb: 2, width: 350 }}
        />

        <FormControl size="small" sx={{ width: 180, ml: 2 }}>
          <InputLabel>Status</InputLabel>

          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="in_progress">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* loading, error conditions */}
      {loading && <Typography sx={{ mb: 2 }}>Loading trips...</Typography>}
      {error && <Typography sx={{ mb: 2 }}>{error}</Typography>}
      {!loading && !error && trips.length === 0 && (
        <Typography sx={{ mb: 2 }}>No trips found.</Typography>
      )}
      {!loading && !error && trips.length > 0 && (
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
              {/* if no trips found for search */}
              {filteredTrips.length === 0 ? (
                <TableRow>
                  <TableCell>Trips not found</TableCell>
                </TableRow>
              ) : (
                filteredTrips.map((trip) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Trips;
