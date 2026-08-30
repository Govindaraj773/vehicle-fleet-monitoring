const pool = require("../config/db");

const checkHighEngineTemperature = async () => {
  try {
    const result = await pool.query(
      `
        SELECT DISTINCT ON (vehicle_id)
          vehicle_id,
          engine_temperature,
          recorded_at
        FROM telemetry
        ORDER BY vehicle_id, recorded_at DESC
      `,
    );

    console.log("Latest Engine Temperature:", result.rows);

    // Find vehicles with temperature above 100°C
    const highTemperatureVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.engine_temperature) > 100;
    });

    console.log("High Engine Temperature:", highTemperatureVehicles);

    // Create alert for high temperature
    for (const vehicle of highTemperatureVehicles) {
      const existingAlert = await pool.query(
        `
          SELECT *
          FROM alerts
          WHERE vehicle_id = $1
          AND alert_type = 'high_engine_temperature'
          AND is_resolved = false
          LIMIT 1
        `,
        [vehicle.vehicle_id],
      );

      // Don't create duplicate active alerts
      if (existingAlert.rows.length > 0) {
        continue;
      }

      // Create new alert
      await pool.query(
        `
          INSERT INTO alerts (
            vehicle_id,
            alert_type,
            message,
            severity,
            is_resolved
          )
          VALUES ($1, $2, $3, $4, $5)
        `,
        [
          vehicle.vehicle_id,
          "high_engine_temperature",
          `Vehicle engine temperature is high: ${vehicle.engine_temperature}°C`,
          "Critical",
          false,
        ],
      );

      console.log(
        `High temperature alert created for vehicle ${vehicle.vehicle_id}`,
      );
    }

    // Find vehicles with normal temperature
    const normalTemperatureVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.engine_temperature) <= 100;
    });

    // Resolve existing alerts
    for (const vehicle of normalTemperatureVehicles) {
      await pool.query(
        `
          UPDATE alerts
          SET is_resolved = true
          WHERE vehicle_id = $1
          AND alert_type = 'high_engine_temperature'
          AND is_resolved = false
        `,
        [vehicle.vehicle_id],
      );
    }

    return highTemperatureVehicles;
  } catch (error) {
    console.log("High Temperature Error:", error);
    throw error;
  }
};

module.exports = {
  checkHighEngineTemperature,
};
