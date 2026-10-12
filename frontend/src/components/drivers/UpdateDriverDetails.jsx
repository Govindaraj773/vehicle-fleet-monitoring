import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";

const UpdateDriverDetails = ({ open, driver, onClose, onUpdated }) => {
  const [updatedDriver, setUpdatedDriver] = useState({
    name: "",
    phone: "",
    licence_number: "",
    status: "Busy",
  });
  const [updatingDriver, setUpdatingDriver] = useState(false);
  const [errorUpdateDriver, setErrorUpdateDriver] = useState("");

  // If we click Update for Driver, the form will show Driver's current details rather than empty fields.
  useEffect(() => {
    if (open && driver) {
      setUpdatedDriver({
        name: driver.name || "",
        phone: driver.phone || "",
        licence_number: driver.licence_number || "",
        status: driver.status || "Busy",
      });
      setErrorUpdateDriver("");
    }
  }, [open, driver]);

  // only update the field that has been changed, rather than updating all fields at once.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdatedDriver((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // This function handles the update of driver details. It validates the input fields, sends a PUT request to the server with the updated driver information, and handles any errors that may occur during the process.
  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    setErrorUpdateDriver("");

    if (!updatedDriver.name.trim()) {
      setErrorUpdateDriver("Driver name is required.");
      return;
    }

    if (!driver?.id) {
      setErrorUpdateDriver("Driver information is missing.");
      return;
    }

    try {
      setUpdatingDriver(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/drivers/${driver.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...updatedDriver,
            name: (updatedDriver.name || "").trim(),
            phone: (updatedDriver.phone || "").trim(),
            license_number: updatedDriver.license_number || "",
            // license_number: (updatedDriver.license_number || "").trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update driver.");
      }

      onUpdated(data.driver);
    } catch (error) {
      console.error("Error updating driver:", error);
      setErrorUpdateDriver(error.message || "Failed to update driver.");
    } finally {
      setUpdatingDriver(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!updatingDriver) onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Update Driver Details</DialogTitle>

      <DialogContent>
        {errorUpdateDriver && (
          <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
            {errorUpdateDriver}
          </Alert>
        )}

        <form id="update-driver-form" onSubmit={handleUpdateDriver}>
          <TextField
            label="Driver Name"
            name="name"
            value={updatedDriver.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={updatedDriver.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="License Number"
            name="license_number"
            value={updatedDriver.license_number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            select
            label="Status"
            name="status"
            value={updatedDriver.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="busy">Busy</MenuItem>
            <MenuItem value="not available">Not Available</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="not active">Not Active</MenuItem>
          </TextField>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={updatingDriver}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="update-driver-form"
          variant="contained"
          disabled={updatingDriver || !driver}
        >
          {updatingDriver ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDriverDetails;
