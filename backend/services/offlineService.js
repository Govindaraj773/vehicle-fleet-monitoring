const pool = require("../config/db");

const checkOfflineVehicles = async () => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT ON (vehicle_id)
        vehicle_id,
        recorded_at
      FROM telemetry
      ORDER BY vehicle_id, recorded_at DESC
    `);

    const currentTime = new Date();

    const offlineVehicles = result.rows.filter((vehicle) => {
      const lastTelemetryTime = new Date(vehicle.recorded_at);

      const differenceInMilliseconds = currentTime - lastTelemetryTime;

      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

      return differenceInMinutes > 5;
    });

    const onlineVehicles = result.rows.filter((vehicle) => {
      const lastTelemetryTime = new Date(vehicle.recorded_at);

      const differenceInMilliseconds = currentTime - lastTelemetryTime;

      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

      return differenceInMinutes <= 5;
    });

    for (const vehicle of onlineVehicles) {
      await pool.query(
        `
    UPDATE alerts
    SET is_resolved = true
    WHERE vehicle_id = $1
    AND alert_type = 'vehicle_offline'
    AND is_resolved = false
    `,
        [vehicle.vehicle_id],
      );
    }

    for (const vehicle of offlineVehicles) {
      const existingAlert = await pool.query(
        `SELECT *
         FROM alerts
         WHERE vehicle_id = $1
         AND alert_type = 'vehicle_offline'
         AND is_resolved = false
         LIMIT 1`,
        [vehicle.vehicle_id],
      );

      if (existingAlert.rows.length > 0) {
        continue;
      }

      await pool.query(
        `INSERT INTO alerts (
          vehicle_id,
          alert_type,
          message,
          severity,
          is_resolved
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
          vehicle.vehicle_id,
          "vehicle_offline",
          "Vehicle has stopped sending telemetry",
          "critical",
          false,
        ],
      );
    }

    return offlineVehicles;
  } catch (error) {
    console.log("Offline vehicle check error:", error);
    throw error;
  }
};

module.exports = {
  checkOfflineVehicles,
};
