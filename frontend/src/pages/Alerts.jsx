import {
  Box,
  Button,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/alerts", {
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

  useEffect(() => {
    fetchAlerts();
  }, []);

  //filtered alerts
  // const filteredAlerts =
  //   severityFilter === "all"
  //     ? alerts
  //     : alerts.filter((alert) => alert.severity === severityFilter);

  //filter based on severity and status
  const filteredAlerts = alerts.filter((alert) => {
    const severityMatch =
      severityFilter === "all" || alert.severity === severityFilter;

    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && !alert.is_resolved) ||
      (statusFilter === "resolved" && alert.is_resolved);

    return severityMatch && statusMatch;
  });

  return (
    <div>
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
            Back to Dashboard
          </Button>
          <Typography variant="h4" fontWeight="bold">
            Alerts
          </Typography>

          {/* dropdown button */}
          <FormControl
            size="small"
            sx={{
              minWidth: 180,
              backgroundColor: "primary.main",
              borderRadius: 1,
            }}
          >
            <InputLabel>Severity</InputLabel>
            <Select
              value={severityFilter}
              label="Severity"
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <MenuItem value="all">All Severities</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
            </Select>
          </FormControl>

          {/* Status dropdown */}

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </Select>
          </FormControl>

          {/* refresh button */}
          <Button
            variant="contained"
            onClick={fetchAlerts}
            disabled={loading}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
          Monitor and manage vehicle alerts
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  Vehicle
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  Alert Type
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  Message
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  Severity
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  Resolved
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading Alerts...
                  </TableCell>
                </TableRow>
              ) : filteredAlerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Alerts
                  </TableCell>
                </TableRow>
              ) : (
                filteredAlerts.map((alert) => (
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
