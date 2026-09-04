const axios = require("axios");
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6IlRlc3QgVXNlciAyIiwiZW1haWwiOiJ0ZXN0MkBleGFtcGxlLmNvbSIsInJvbGUiOiJmbGVldF9tYW5hZ2VyIiwiaWF0IjoxNzg4NTA4NTUyLCJleHAiOjE3ODg1OTQ5NTJ9.GovxZs9_uK0vGpdxKDelh9NL7yPg_fxBzQM1FDD8fkU";

const vehicleTelemetry = {
  vehicle_id: 1,
  latitude: 12.9716,
  longitude: 77.5946,
  speed: 90,
  fuel_level: 75,
  battery_level: 12.5,
  engine_temperature: 85,
  ignition: true,
  odometer: 12500,
};

console.log("Vehicle Telemetry Data:", vehicleTelemetry);

axios
  .post("http://localhost:5000/api/telemetry", vehicleTelemetry, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    console.log("Telemetry send data successfully:", response.data);
  })
  .catch((error) => {
    console.log("Telemetry send failed");
    console.log(error.response?.data || error.message);
  });
