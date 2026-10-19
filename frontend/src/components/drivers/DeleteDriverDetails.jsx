import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";

const DeleteDriverDetails = ({ open, driver, onClose, onDeleted }) => {
  const [deletingDriver, setDeletingDriver] = useState(false);
  const [errorDeleteDriver, setErrorDeleteDriver] = useState("");

  const handleDeleteDriver = async () => {
    if (!driver?.id) return;

    try {
      setDeletingDriver(true);
      setErrorDeleteDriver("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/drivers/${driver.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete driver.");
      }

      await onDeleted();
    } catch (error) {
      console.error("Error deleting driver:", error);
      setErrorDeleteDriver(error.message || "Failed to delete driver.");
    } finally {
      setDeletingDriver(false);
    }
  };

  const handleClose = () => {
    if (!deletingDriver) {
      setErrorDeleteDriver("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Driver</DialogTitle>

      <DialogContent>
        {errorDeleteDriver && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorDeleteDriver}
          </Alert>
        )}

        <Typography>
          Are you sure you want to delete <strong>{driver?.name}</strong>? This
          action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={deletingDriver}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteDriver}
          disabled={deletingDriver || !driver}
        >
          {deletingDriver ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDriverDetails;
