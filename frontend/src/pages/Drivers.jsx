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
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import UpdateDriverDetails from "../components/drivers/UpdateDriverDetails";

const Drivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [searchDriver, setSearchDriver] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);
  // // CRUD Drivers states
  const [openAddDriver, setOpenAddDriver] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: "",
    phone: "",
    licence_number: "",
    status: "active",
  });
  const [errorDriverForm, setErrorDriverForm] = useState("");
  const [addingNewDriver, setAddingNewDriver] = useState(false);

  // Update Driver states
  const [openUpdateDriver, setOpenUpdateDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [updatingSelectedDriver, setUpdatingSelectedDriver] = useState(false);

  const driversPerPage = 10;

  const fetchDrivers = async () => {
    try {
      setRefresh(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/drivers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched API drivers:", data);
      console.table(data.drivers);
      setDrivers(data.drivers || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Failed to fetch drivers. Please try again later.");
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  // Update Driver functionality
  const handleOpenUpdateDriver = (driver) => {
    setSelectedDriver(driver);
    setOpenUpdateDriver(true);
  };

  // This function is called after a driver has been updated successfully
  const handleDriverUpdated = async () => {
    setUpdatingSelectedDriver(true);

    try {
      await fetchDrivers();
      setOpenUpdateDriver(false);
      setSelectedDriver(null);
    } finally {
      setUpdatingSelectedDriver(false);
    }
  };

  useEffect(() => {
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

  // Pagination functionality
  const startIndex = (page - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const paginatedDrivers = filteredDrivers.slice(startIndex, endIndex);

  useEffect(
    () => {
      setPage(1);
    },
    [searchDriver],
    [statusFilter],
  );

  // Creating New Driver Handler
  const handleAddDriver = async (e) => {
    e.preventDefault();
    setErrorDriverForm("");

    const name = newDriver.name.trim();
    if (!name) {
      setErrorDriverForm("Driver name is must required.");
      return;
    }
    try {
      setAddingNewDriver(true);

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newDriver,
          name,
          phone: newDriver.phone.trim(),
          licence_number: newDriver.licence_number.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add driver.");
      }

      setNewDriver({
        name: "",
        phone: "",
        licence_number: "",
        status: "active",
      });
      setOpenAddDriver(false);
      fetchDrivers();
    } catch (error) {
      console.error("Error adding driver:", error);
      setErrorDriverForm(
        error.message || "Failed to add driver. Please try again later.",
      );
    } finally {
      setAddingNewDriver();
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Header */}
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
          onClick={() => navigate("/")}
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
          Back to Home
        </Button>
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
          Manage and monitor fleet drivers
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchDrivers}
          disabled={refresh}
          sx={{
            textTransform: "none",
          }}
        >
          {refresh ? "Refreshing..." : "Refresh"}
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenAddDriver(true);
            setErrorDriverForm("");
          }}
        >
          Add Driver
        </Button>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading Drivers...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {error}
                </TableCell>
              </TableRow>
            ) : paginatedDrivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Drivers Found...
                </TableCell>
              </TableRow>
            ) : (
              paginatedDrivers.map((driver) => (
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
                        color:
                          driver.status === "active" ? "#166534" : "#4b5563",
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{ display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/drivers/${driver.id}`)}
                      sx={{
                        textTransform: "none",
                        minWidth: 76,
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        fontWeight: 600,
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": {
                          backgroundColor: "action.hover",
                          borderColor: "primary.dark",
                        },
                      }}
                    >
                      View
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenUpdateDriver(driver)}
                      sx={{
                        textTransform: "none",
                        minWidth: 80,
                        px: 2,
                        py: 0.75,
                        borderRadius: 2,
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: 1,
                        },
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Pagination
          count={Math.ceil(filteredDrivers.length / driversPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
        />
      </Box>

      {/* Creating New Driver Dialog */}
      <Dialog
        open={openAddDriver}
        onClose={() => {
          if (!addingNewDriver) {
            setOpenAddDriver(false);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Driver</DialogTitle>

        <DialogContent>
          {errorDriverForm && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorDriverForm}
            </Alert>
          )}

          <Box
            component="form"
            id="add-driver-form"
            onSubmit={handleAddDriver}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Driver Name"
              value={newDriver.name}
              onChange={(e) =>
                setNewDriver({ ...newDriver, name: e.target.value })
              }
              required
              fullWidth
            />

            <TextField
              label="Phone Number"
              value={newDriver.phone}
              onChange={(e) =>
                setNewDriver({ ...newDriver, phone: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="License Number"
              value={newDriver.license_number}
              onChange={(e) =>
                setNewDriver({
                  ...newDriver,
                  license_number: e.target.value,
                })
              }
              fullWidth
            />

            <TextField
              select
              label="Status"
              value={newDriver.status}
              onChange={(e) =>
                setNewDriver({ ...newDriver, status: e.target.value })
              }
              fullWidth
            >
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="busy">Busy</MenuItem>
              <MenuItem value="not available">Not Available</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="not active">Not Active</MenuItem>
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenAddDriver(false)}
            disabled={addingNewDriver}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            type="submit"
            form="add-driver-form"
            disabled={addingNewDriver}
          >
            Add Driver
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Driver Details Dialog */}
      <UpdateDriverDetails
        open={openUpdateDriver}
        driver={selectedDriver}
        onClose={() => {
          setOpenUpdateDriver(false);
          setSelectedDriver(null);
        }}
        onUpdated={handleDriverUpdated}
      />
    </Box>
  );
};

export default Drivers;
