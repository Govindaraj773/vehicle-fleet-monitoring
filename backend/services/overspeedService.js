const pool = require("../config/db");

const checkOverSpeedVehicles = async () => {
  try {
    const result = await pool.query(`
        SELECT DISTINCT ON (t.vehicle_id)
        t.vehicle_id,
        t.speed,
        t.recorded_at,
        v.speed_limit
        FROM telemetry t
        JOIN vehicles v
        ON t.vehicle_id = v.id
        ORDER BY t.vehicle_id, t.recorded_at DESC
        `);

    const overspeedVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.speed) > Number(vehicle.speed_limit);
    });

    const normalVehicles = result.rows.filter((vehicle) => {
      return Number(vehicle.speed) <= Number(vehicle.speed_limit);
    });

    for (const vehicle of normalVehicles) {
      await pool.query(
        `
    UPDATE alerts
    SET is_resolved = true
    WHERE vehicle_id = $1
    AND alert_type = 'overspeed'
    AND is_resolved = false
    `,
        [vehicle.vehicle_id],
      );
    }

    console.log("Overspeed vehicles:", overspeedVehicles);

    for (const vehicle of overspeedVehicles) {
      const existingAlert = await pool.query(
        `
    SELECT *
    FROM alerts
    WHERE vehicle_id = $1
    AND alert_type = 'overspeed'
    AND is_resolved = false
    LIMIT 1
    `,
        [vehicle.vehicle_id],
      );

      if (existingAlert.rows.length > 0) {
        continue;
      }
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
          "overspeed",
          `Vehicle speed ${vehicle.speed} km/h exceeded limit of ${vehicle.speed_limit} km/h`,
          "high",
          false,
        ],
      );
    }
    return overspeedVehicles;
  } catch (error) {
    console.log("Over Speed Error", error);
    throw error;
  }
};

module.exports = { checkOverSpeedVehicles };
