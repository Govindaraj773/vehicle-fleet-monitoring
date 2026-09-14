import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
const VehicleTable = ({ vehicles }) => {
  const navigate = useNavigate();
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        mt: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {" "}
      <Table>
        {" "}
        <TableHead>
          {" "}
          <TableRow sx={{ backgroundColor: "background.default" }}>
            {" "}
            <TableCell>
              {" "}
              <Typography variant="subtitle2" fontWeight={600}>
                {" "}
                Vehicle{" "}
              </Typography>{" "}
            </TableCell>{" "}
            <TableCell>
              {" "}
              <Typography variant="subtitle2" fontWeight={600}>
                {" "}
                Type{" "}
              </Typography>{" "}
            </TableCell>{" "}
            <TableCell>
              {" "}
              <Typography variant="subtitle2" fontWeight={600}>
                {" "}
                Status{" "}
              </Typography>{" "}
            </TableCell>{" "}
            <TableCell>
              {" "}
              <Typography variant="subtitle2" fontWeight={600}>
                {" "}
                Speed Limit{" "}
              </Typography>{" "}
            </TableCell>{" "}
            <TableCell>
              {" "}
              <Typography variant="subtitle2" fontWeight={600}>
                {" "}
                Driver{" "}
              </Typography>{" "}
            </TableCell>{" "}
            <TableCell>
              {" "}
              <Typography variant="subtitle2" fontWeight={600}>
                {" "}
                Actions{" "}
              </Typography>{" "}
            </TableCell>{" "}
          </TableRow>{" "}
        </TableHead>{" "}
        <TableBody>
          {" "}
          {vehicles.length === 0 ? (
            <TableRow>
              {" "}
              <TableCell colSpan={6} align="center">
                {" "}
                <Box sx={{ py: 5 }}>
                  {" "}
                  <Typography variant="body1" color="text.secondary">
                    {" "}
                    No vehicles found{" "}
                  </Typography>{" "}
                </Box>{" "}
              </TableCell>{" "}
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow
                key={vehicle.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {" "}
                {/* Vehicle */}{" "}
                <TableCell>
                  {" "}
                  <Stack spacing={0.5}>
                    {" "}
                    <Typography variant="body1" fontWeight={600}>
                      {" "}
                      {vehicle.vehicle_number}{" "}
                    </Typography>{" "}
                    <Typography variant="body2" color="text.secondary">
                      {" "}
                      {vehicle.manufacturer} {vehicle.model}{" "}
                    </Typography>{" "}
                    <Typography variant="caption" color="text.secondary">
                      {" "}
                      {vehicle.year}{" "}
                    </Typography>{" "}
                  </Stack>{" "}
                </TableCell>{" "}
                {/* Type */}{" "}
                <TableCell>
                  {" "}
                  <Typography variant="body2">
                    {" "}
                    {vehicle.vehicle_type}{" "}
                  </Typography>{" "}
                </TableCell>{" "}
                {/* Status */}{" "}
                <TableCell>
                  {" "}
                  <Chip
                    label={vehicle.status}
                    color={
                      vehicle.status === "active"
                        ? "success"
                        : vehicle.status === "offline"
                          ? "error"
                          : "default"
                    }
                    size="small"
                    sx={{ textTransform: "capitalize", fontWeight: 500 }}
                  />{" "}
                </TableCell>{" "}
                {/* Speed Limit */}{" "}
                <TableCell>
                  {" "}
                  <Chip
                    label={`${vehicle.speed_limit} km/h`}
                    variant="outlined"
                    size="small"
                  />{" "}
                </TableCell>{" "}
                {/* Driver */}{" "}
                <TableCell>
                  {" "}
                  <Typography
                    variant="body2"
                    color={
                      vehicle.driver_id ? "text.primary" : "text.secondary"
                    }
                  >
                    {" "}
                    {vehicle.driver_id
                      ? `Driver #${vehicle.driver_id}`
                      : "Unassigned"}{" "}
                  </Typography>{" "}
                </TableCell>{" "}
                {/* Actions */}{" "}
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      navigate(`/vehicles/${vehicle.id}`, {
                        state: { vehicle },
                      })
                    }
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}{" "}
        </TableBody>{" "}
      </Table>{" "}
    </TableContainer>
  );
};
export default VehicleTable;
