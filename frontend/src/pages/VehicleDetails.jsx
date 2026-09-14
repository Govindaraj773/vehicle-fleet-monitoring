import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const VehicleDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicle = location.state?.vehicle;

  if (!vehicle) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Vehicle not found
        </Typography>

        <Button variant="contained" onClick={() => navigate("/vehicles")}>
          Back to Vehicles
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            {vehicle.vehicle_number}
          </Typography>

          <Typography color="text.secondary">
            {vehicle.manufacturer} {vehicle.model}
          </Typography>
        </Box>

        <Button variant="outlined" onClick={() => navigate("/vehicles")}>
          Back to Vehicles
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Vehicle Type
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.vehicle_type}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>

              <Box mt={1}>
                <Chip
                  label={vehicle.status}
                  color={
                    vehicle.status === "active"
                      ? "success"
                      : vehicle.status === "offline"
                        ? "error"
                        : "default"
                  }
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Speed Limit
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.speed_limit} km/h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Manufacturer
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.manufacturer}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Model / Year
              </Typography>

              <Typography variant="h6" mt={1}>
                {vehicle.model} / {vehicle.year}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Telemetry
              </Typography>

              <Typography color="text.secondary">
                Live speed, fuel, battery, engine temperature, ignition,
                location and odometer data will be displayed here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehicleDetails;
