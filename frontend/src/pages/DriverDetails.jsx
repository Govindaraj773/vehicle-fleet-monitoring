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
} from "@mui/material";
3;

const DriverDetails = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/drivers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        console.log("Fetched API Driver Details:", data);
        setDriver(data.driver || null);
      } catch (error) {
        console.error("Error while fetching driver details:", error);
      }
    };
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
      {/* Driver Information */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Driver Details UI Header */}
        <Box
          sx={{
            px: { xs: 2, md: 2.5 },
            py: 2,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Driver Information
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#6b7280",
              mt: 0.5,
            }}
          >
            Basic information and current driver status
          </Typography>
        </Box>

        {/* Driver Details Table */}
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
