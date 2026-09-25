import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/alerts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Alerts response", data);

        if (response.ok) {
          setAlerts(data.alerts || []);
        }
      } catch (error) {
        console.error("Failed to fetch alerts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);
  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Alerts
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Monitor and manage vehicle alerts
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Alert Type</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Resolved</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading Alerts...
                  </TableCell>
                </TableRow>
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Alerts
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.id}</TableCell>
                    <TableCell>{alert.vehicle_id}</TableCell>
                    <TableCell>{alert.alert_type}</TableCell>
                    <TableCell>{alert.message}</TableCell>
                    <TableCell>
                      <Chip
                        label={alert.severity}
                        size="small"
                        color={
                          alert.severity === "high"
                            ? "error"
                            : alert.severity === "medium"
                              ? "warning"
                              : "success"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.is_resolved ? "Resolved" : "Active"}
                        size="small"
                        color={alert.is_resolved ? "success" : "error"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Alerts;
