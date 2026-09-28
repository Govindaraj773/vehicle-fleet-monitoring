import {
  Box,
  Button,
  Chip,
  Paper,
  FormControl,
  Pagination,
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
  const [page, setPage] = useState(1);
  const alertsPerPage = 25;
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

  // Suppose we are on page 3, then select Critical, enough critical alerts for 1 page. The table could become empty because you're still on page 3.
  useEffect(() => {
    setPage(1);
  }, [severityFilter, statusFilter]);

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

  const startIndex = (page - 1) * alertsPerPage;

  // pagination
  const paginatedAlerts = filteredAlerts.slice(
    startIndex,
    startIndex + alertsPerPage,
  );

  return (
    <div>
      <Box
        sx={{
          p: 3,
          minHeight: "100vh",
          backgroundColor: "#1b1212",
        }}
      >
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
          <Typography variant="h4" fontWeight="bold">
            Alerts
          </Typography>

          {/* severity dropdown */}
          <FormControl
            size="small"
            sx={{
              minWidth: 100,
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

          {/* status dropdown */}
          <FormControl
            size="small"
            sx={{
              minWidth: 100,
              backgroundColor: "primary.main",
              borderRadius: 1,
            }}
          >
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
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "grey.100" }}
                >
                  Created At
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
                // filteredAlerts.map((alert) => (
                paginatedAlerts.map((alert) => (
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

                    <TableCell>
                      {new Date(alert.created_at).toLocaleString()}
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
            count={Math.ceil(filteredAlerts.length / alertsPerPage)}
            page={page}
            onChange={(event, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "#f8fbfa",
              },

              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#f3ff06",
              },

              "& .MuiPaginationItem-root.MuiPaginationItem-previousNext": {
                backgroundColor: "#1306a9",
              },
            }}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Alerts;
