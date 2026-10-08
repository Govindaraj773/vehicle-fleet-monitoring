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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

const DriverDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const fetchDriverDetails = async () => {
    try {
      setRefresh(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/drivers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Fetched API Driver Details:", data);
      setDriver(data.driver || null);
    } catch (error) {
      console.error("Error while fetching driver details:", error);
    } finally {
      setRefresh(false);
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
      {/* Driver Details UI Header */}
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
    </Box>
  );
};

export default DriverDetails;
