const pool = require("../config/db");

const checkOverspeed = async (vehicle_id, speed) => {
  try {
    if (speed > 80) {
      //1.check existing alert
      const existingAlert = await pool.query(
        `SELECT *
         FROM alerts
         WHERE vehicle_id = $1
         AND alert_type = 'overspeed'
         AND is_resolved = false
         LIMIT 1`,
        [vehicle_id],
      );
      //   console.log("Existing alert:", existingAlert.rows);

      //2.if alert aleready exist
      if (existingAlert.rows.length > 0) {
        return existingAlert.rows[0];
      }

      //3. otherwise create new alert
      const result = await pool.query(
        `INSERT INTO alerts (
          vehicle_id,
          alert_type,
          message,
          severity,
          is_resolved
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          vehicle_id,
          "overspeed",
          "Vehicle exceeded the speed limit",
          "high",
          false,
        ],
      );

      return result.rows[0];
    }

    return null;
  } catch (error) {
    console.log("Overspeed alert error:", error);
    throw error;
  }
};

const checkLowFuel = async (vehicle_id, fuel_level) => {
  try {
    if (fuel_level < 10) {
      const existingAlert = await pool.query(
        `SELECT *
         FROM alerts
         WHERE vehicle_id = $1
         AND alert_type = 'low_fuel'
         AND is_resolved = false
         LIMIT 1`,
        [vehicle_id],
      );

      if (existingAlert.rows.length > 0) {
        return existingAlert.rows[0];
      }
      const result = await pool.query(
        `INSERT INTO alerts (
          vehicle_id,
          alert_type,
          message,
          severity,
          is_resolved
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [vehicle_id, "low_fuel", "Vehicle fuel level is low", "high", false],
      );

      return result.rows[0];
    }

    return null;
  } catch (error) {
    console.log("Low fuel alert error:", error);
    throw error;
  }
};

const checkBatteryLevel = async (vehicle_id, battery_level) => {
  try {
    if (battery_level < 20) {
      const existingAlert = await pool.query(
        `SELECT *
         FROM alerts
         WHERE vehicle_id = $1
         AND alert_type = 'low_battery'
         AND is_resolved = false
         LIMIT 1`,
        [vehicle_id],
      );

      if (existingAlert.rows.length > 0) {
        return existingAlert.rows[0];
      }

      const result = await pool.query(
        `INSERT INTO alerts (
          vehicle_id,
          alert_type,
          message,
          severity,
          is_resolved
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          vehicle_id,
          "low_battery",
          "Vehicle battery level is low",
          "high",
          false,
        ],
      );

      return result.rows[0];
    }

    return null;
  } catch (error) {
    console.log("Low battery level error:", error);
    throw error;
  }
};

const checkEngineTemperature = async (vehicle_id, engine_temperature) => {
  try {
    if (engine_temperature > 90) {
      const existingAlert = await pool.query(
        `SELECT * FROM alerts 
        WHERE vehicle_id = $1 
        AND alert_type = 'high_temperature' 
        AND is_resolved = false 
        LIMIT 1`,
        [vehicle_id],
      );
      if (existingAlert.rows.length > 0) {
        return existingAlert.rows[0];
      }
      const result = await pool.query(
        `INSERT INTO alerts(
        vehicle_id,
        alert_type,
        message,
        severity,
        is_resolved)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`,
        [
          vehicle_id,
          "high_temperature",
          "Critical Engine Temperature!",
          "Critical",
          false,
        ],
      );
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.log("Engine critical temperature!", error);
  }
};

module.exports = {
  checkOverspeed,
  checkLowFuel,
  checkBatteryLevel,
  checkEngineTemperature,
};
