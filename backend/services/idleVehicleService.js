const pool = require("../config/db");

const checkIdleVehicles = async () => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON(vehicle_id)
        vehicle_id,
        speed,
        ignition,
        recorded_at
        FROM telemetry
        ORDER BY vehicle_id, recorded_at DESC`,
    );
    console.log("Latest Vehicle Data:", result.rows);

    const idleVehicle = result.rows.filter((vehicle) => {
      return Number(vehicle.speed) === 0 && vehicle.ignition === true;
    });
    console.log("Idle Vehicles:", idleVehicle);

    for (const vehicle of idleVehicle) {
      const existingAlert = await pool.query(
        `SELECT *
            FROM alerts
            WHERE vehicle_id = $1
            AND alert_type = 'idle_vehicle'
            AND is_resolved = false
            LIMIT 1`,
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
        is_resolved)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          vehicle.vehicle_id,
          "idle_vehicle",
          "vehicle is stationary while ignition is ON",
          "medium",
          false,
        ],
      );
      console.log(
        `Idle vehicle alert created for vehicle ${vehicle.vehicle_id}`,
      );
    }

    //for normal vehicle if speed > 0 (Not idle vehicle)
    const normalVehicle = result.rows.filter((vehicle) => {
      return Number(vehicle.speed) > 0 || vehicle.ignition === false;
    });

    for (const vehicle of normalVehicle) {
      await pool.query(
        `UPDATE alerts
            SET is_resolved = true
            WHERE vehicle_id = $1
            AND alert_type = 'idle_vehicle'
            AND is_resolved = false`,
        [vehicle.vehicle_id],
      );
    }

    return idleVehicle;
  } catch (error) {
    console.log("Idle Vehicle Error:", error);
    throw error;
  }
};

module.exports = { checkIdleVehicles };
