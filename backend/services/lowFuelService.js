const pool = require("../config/db");

const checkLowFuelVehicles = async () => {
  try {
    const result = await pool.query(`
        SELECT DISTINCT ON (vehicle_id)
        vehicle_id,
        fuel_level,
        recorded_at
        FROM telemetry
        ORDER BY vehicle_id, recorded_at DESC
        `);
    console.log("Latest fuel data", result.rows);

    const lowFuelVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.fuel_level) < 20;
    });
    console.log("Low Fuel Vehicles:", lowFuelVehicles);

    for (const vehicle of lowFuelVehicles) {
      const existingAlert = await pool.query(
        `SELECT * 
        FROM alerts
        WHERE vehicle_id = $1
        AND alert_type = 'low_fuel'
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
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          vehicle.vehicle_id,
          "low_fuel",
          `Vehicle fuel level is low: ${vehicle.fuel_level}%`,
          "High",
          false,
        ],
      );
    }

    const normalFuelVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.fuel_level) >= 20;
    });

    for (const vehicle of normalFuelVehicles) {
      await pool.query(
        `
            UPDATE alerts 
            SET is_resolved = true
            WHERE vehicle_id = $1
            AND alert_type = 'low_fuel'
            AND is_resolved = false
            `,
        [vehicle.vehicle_id],
      );
    }
    return lowFuelVehicles;
  } catch (error) {
    console.log("low fuel error", error);
    throw error;
  }
};

module.exports = { checkLowFuelVehicles };
