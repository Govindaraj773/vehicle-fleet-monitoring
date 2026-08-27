const pool = require("../config/db");

const checkLowBatteryVehicles = async () => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (vehicle_id)
        vehicle_id,
        battery_level,
        recorded_at
        FROM telemetry
        ORDER BY vehicle_id, recorded_at DESC
        `,
    );
    console.log("Latest Battery data:", result.rows);

    const lowBatteryVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.battery_level) < 20;
    });
    console.log("Low Battery Vehicles:", lowBatteryVehicles);

    for (const vehicle of lowBatteryVehicles) {
      const existingAlert = await pool.query(
        `SELECT *
            FROM alerts
            WHERE vehicle_id = $1
            AND alert_type = 'low_battery'
            AND is_resolved = false
            LIMIT 1
            `,
        [vehicle.vehicle_id],
      );
      if (existingAlert.rows.length > 0) {
        continue;
      }
      await pool.query(
        `INSERT INTO alerts(
        vehicle_id,
        alert_type,
        message,
        severity,
        is_resolved
        )
        VALUES ($1, $2, $3, $4, $5)`,
        [
          vehicle.vehicle_id,
          "low_battery",
          `Vehicle battery level is low : ${vehicle.battery_level}%`,
          "High",
          false,
        ],
      );
    }

    const normalBatteryVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.battery_level) >= 20;
    });

    for (const vehicle of normalBatteryVehicles) {
      const existingAlert = await pool.query(
        `UPDATE alerts
        SET is_resolved = true
        WHERE vehicle_id = $1
        AND alert_type = 'low_battery'
        AND is_resolved = false
        `,
        [vehicle.vehicle_id],
      );
    }
    return lowBatteryVehicles;
  } catch (error) {
    console.log("Low Battery Error", error);
    throw error;
  }
};

module.exports = { checkLowBatteryVehicles };
