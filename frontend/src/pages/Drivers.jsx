import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchDriver, setSearchDriver] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/drivers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Fetched API drivers:", data);
        setDrivers(data.drivers || []);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  //   Status functionality
  const statusOptions = [
    "active",
    "not active",
    "busy",
    "available",
    "not available",
  ];

  //   Search functionality
  const filteredDrivers = drivers.filter((driver) => {
    const search = searchDriver.trim().toLowerCase();

    const name = String(driver.name || "").toLowerCase();
    const phone = String(driver.phone || "").toLowerCase();
    const licenseNumber = String(driver.license_number || "").toLowerCase();
    const matchesSearch =
      name.includes(search) ||
      phone.includes(search) ||
      licenseNumber.includes(search);

    const matchesStatus =
      statusFilter === "all" || driver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1f2937",
            mb: 0.5,
          }}
        >
          Drivers
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
          }}
        >
          Manage and monitor your fleet drivers
        </Typography>
      </Box>

      {/* search bar & status filter */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search drivers..."
          value={searchDriver}
          onChange={(e) => setSearchDriver(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>

          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>

            {statusOptions.map((status) => (
              <MenuItem
                key={status}
                value={status}
                sx={{ textTransform: "capitalize" }}
              >
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Drivers table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table>
          {/* Table head */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#f9fafb",
              }}
            >
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Driver Name</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>License Number</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table body */}
          <TableBody>
            {/* {drivers.map((driver) => ( */}
            {filteredDrivers.map((driver) => (
              <TableRow
                key={driver.id}
                hover
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell>{driver.id}</TableCell>

                <TableCell sx={{ fontWeight: 500 }}>
                  {driver.name || "-"}
                </TableCell>

                <TableCell>{driver.phone || "-"}</TableCell>

                <TableCell>{driver.license_number || "-"}</TableCell>

                <TableCell>
                  <Chip
                    label={driver.status || "Unknown"}
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      fontWeight: 500,
                      backgroundColor:
                        driver.status === "active" ? "#dcfce7" : "#f3f4f6",
                      color: driver.status === "active" ? "#166534" : "#4b5563",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      minWidth: 60,
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Drivers;
