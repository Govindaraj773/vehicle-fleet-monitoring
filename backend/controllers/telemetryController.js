const {
  checkOverspeed,
  checkLowFuel,
  checkBatteryLevel,
  checkEngineTemperature,
} = require("../services/alertService");
const pool = require("../config/db");

const createTelemetry = async (req, res) => {
  try {
    const {
      vehicle_id,
      latitude,
      longitude,
      speed,
      fuel_level,
      battery_level,
      engine_temperature,
      ignition,
      odometer,
    } = req.body;

    if (!vehicle_id || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Vehicle ID, latitude and longitude are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO telemetry
       (
         vehicle_id,
         latitude,
         longitude,
         speed,
         fuel_level,
         battery_level,
         engine_temperature,
         ignition,
         odometer
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        vehicle_id,
        latitude,
        longitude,
        speed,
        fuel_level,
        battery_level,
        engine_temperature,
        ignition,
        odometer,
      ],
    );

    // check overspeed alert
    const highSpeedAlert = await checkOverspeed(vehicle_id, speed);
    const lowFuelAlert = await checkLowFuel(vehicle_id, fuel_level);
    const lowBatteryAlert = await checkBatteryLevel(vehicle_id, battery_level);
    const highTemperatureAlert = await checkEngineTemperature(
      vehicle_id,
      engine_temperature,
    );

    res.status(201).json({
      message: "Telemetry data created successfully",
      telemetry: result.rows[0],
      highSpeedAlert: highSpeedAlert,
      lowFuelAlert: lowFuelAlert,
      lowBatteryAlert: lowBatteryAlert,
      highTemperatureAlert: highTemperatureAlert,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTelemetry = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM telemetry ORDER BY id ASC");
    res.status(200).json({
      message: "Fetched all telemetry successfully!",
      telemetry: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getTelemetryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM telemetry WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Telemetry not found",
      });
    }
    res.status(201).json({
      message: "Telemetry fetched successfully",
      telemetry: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTelemetry = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      vehicle_id,
      latitude,
      longitude,
      speed,
      fuel_level,
      battery_level,
      engine_temperature,
      ignition,
      odometer,
    } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({
        message: "Telemetry id is required",
      });
    }

    const result = await pool.query(
      `UPDATE telemetry
       SET vehicle_id = $1,
           latitude = $2,
           longitude = $3,
           speed = $4,
           fuel_level = $5,
           battery_level = $6,
           engine_temperature = $7,
           ignition = $8,
           odometer = $9
       WHERE id = $10
       RETURNING *`,
      [
        vehicle_id,
        latitude,
        longitude,
        speed,
        fuel_level,
        battery_level,
        engine_temperature,
        ignition,
        odometer,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Telemetry not found!",
      });
    }

    res.status(200).json({
      message: "Telemetry updated successfully!",
      telemetry: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTelemetry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM telemetry WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Telemetry not found",
      });
    }
    res.status(200).json({
      message: "Telemetry deletd successfully!",
      telemetry: result.rows[0],
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createTelemetry,
  getTelemetry,
  getTelemetryById,
  updateTelemetry,
  deleteTelemetry,
};
