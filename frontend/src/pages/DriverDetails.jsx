import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableContainer,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

const DriverDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDriverDetails = async () => {
    try {
      setRefresh(true);
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch driver details. Please try again later.",
        );
      }
      const data = await response.json();
      console.log("Fetched API Driver Details:", data);
      setDriver(data.driver || null);
      // setDriver(data);
    } catch (error) {
      console.error("Error while fetching driver details:", error);
    } finally {
      setRefresh(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDriverDetails();
  }, [id]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {loading ? (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <CircularProgress size={32} />

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
            }}
          >
            Loading driver details...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 1.5,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Unable to load the driver details at this time. Please try again
            later.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              maxWidth: 400,
            }}
          >
            {error}
          </Typography>
          <Button
            variant="outlined"
            onClick={fetchDriverDetails}
            sx={{
              mt: 1,
              textTransform: "none",
            }}
          >
            Try Again
          </Button>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: "relative",
              mb: 3,
              textAlign: "center",
            }}
          >
            {/* Left Side Button */}
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/drivers")}
              sx={{
                position: "absolute",
                left: 0,
                top: 0,
                textTransform: "none",
              }}
            >
              Back to Drivers
            </Button>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Driver Details
            </Typography>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchDriverDetails}
              disabled={refresh}
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
                textTransform: "none",
              }}
            >
              {refresh ? "Refreshing..." : "Refresh"}
            </Button>
          </Box>

          {/* Driver Details Table */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{
                        width: { xs: "40%", md: "50%" },
                        fontWeight: 500,
                        color: "#6b7280",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Driver ID
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {driver?.id || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        color: "#6b7280",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Driver Name
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {driver?.name || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        color: "#6b7280",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      Phone
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {driver?.phone || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        color: "#6b7280",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      License Number
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#1f2937",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {driver?.license_number || "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        color: "#6b7280",
                        borderBottom: "none",
                      }}
                    >
                      Status
                    </TableCell>

                    <TableCell
                      sx={{
                        borderBottom: "none",
                      }}
                    >
                      <Chip
                        label={driver?.status || "Unknown"}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DriverDetails;
