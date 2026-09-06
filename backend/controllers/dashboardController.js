const pool = require("../config/db");

const getDashboardSummary = async (req, res) => {
  try {
    const totalVehicleResult = await pool.query(
      "SELECT COUNT(*) FROM vehicles",
    );

    const activeVehicleResult = await pool.query(
      "SELECT COUNT(*) FROM vehicles WHERE status = 'active'",
    );

    const offlineVehicleResult = await pool.query(
      "SELECT COUNT(*) FROM vehicles WHERE status = 'offline'",
    );

    // Total drivers
    const totalDriversResult = await pool.query("SELECT COUNT(*) FROM drivers");

    // Available drivers
    const availableDriversResult = await pool.query(
      "SELECT COUNT(*) FROM drivers WHERE status = 'available'",
    );

    // Active trips
    const activeTripsResult = await pool.query(
      "SELECT COUNT(*) FROM trips WHERE status = 'active'",
    );

    // Completed trips
    const completedTripsResult = await pool.query(
      "SELECT COUNT(*) FROM trips WHERE status = 'completed'",
    );

    // Unresolved alerts
    const activeAlertsResult = await pool.query(
      "SELECT COUNT(*) FROM alerts WHERE is_resolved = false",
    );

    res.status(200).json({
      totalVehicles: Number(totalVehicleResult.rows[0].count),
      activeVehicles: Number(activeVehicleResult.rows[0].count),
      offlineVehicles: Number(offlineVehicleResult.rows[0].count),

      totalDrivers: Number(totalDriversResult.rows[0].count),
      availableDrivers: Number(availableDriversResult.rows[0].count),

      activeTrips: Number(activeTripsResult.rows[0].count),
      completedTrips: Number(completedTripsResult.rows[0].count),

      activeAlerts: Number(activeAlertsResult.rows[0].count),
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

const getVehicleDashboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        v.id AS vehicle_id,
        v.vehicle_number,
        v.vehicle_type,
        v.manufacturer,
        v.model,
        v.status,
        d.name AS driver_name,
        t.latitude,
        t.longitude,
        t.speed,
        t.fuel_level,
        t.battery_level,
        t.engine_temperature,
        t.ignition,
        t.odometer,
        t.recorded_at
      FROM vehicles v
      LEFT JOIN drivers d
        ON v.driver_id = d.id
      LEFT JOIN LATERAL (
        SELECT
          latitude,
          longitude,
          speed,
          fuel_level,
          battery_level,
          engine_temperature,
          ignition,
          odometer,
          recorded_at
        FROM telemetry
        WHERE telemetry.vehicle_id = v.id
        ORDER BY recorded_at DESC
        LIMIT 1
      ) t ON true
      ORDER BY v.id;
    `);

    res.status(200).json({
      vehicles: result.rows,
    });
  } catch (error) {
    console.error("Vehicle Dashboard Error", error);

    res.status(500).json({
      message: "Failed to fetch vehicle dashboard data",
      error: error.message,
    });
  }
};

const getAlertsDashboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
      a.id,
      a.vehicle_id,
      v.vehicle_number,
      a.alert_type,
      a.message,
      a.severity,
      a.is_resolved,
      a.created_at
      FROM alerts a
      LEFT JOIN vehicles v 
      ON a.vehicle_id = v.id
      ORDER BY a.created_at DESC
      `);

    res.status(200).json({
      alerts: result.rows,
    });
  } catch (error) {
    console.error("Alerts Dashboard Error", error);

    res.status(500).json({
      message: "Failed to fetch alerts dashboard data",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
  getVehicleDashboard,
  getAlertsDashboard,
};
