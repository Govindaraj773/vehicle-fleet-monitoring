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

module.exports = {
  getDashboardSummary,
};
