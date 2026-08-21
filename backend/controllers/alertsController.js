const pool = require("../config/db");

const createAlert = async (req, res) => {
  try {
    const { vehicle_id, alert_type, message, severity, is_resolved } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({
        message: "Vehicle ID is required!",
      });
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
      [vehicle_id, alert_type, message, severity, is_resolved],
    );

    res.status(201).json({
      message: "Alert created successfully!",
      alert: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllAlerts = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM alerts ORDER BY id ASC`);
    res.status(200).json({
      message: "Alerts fetched successfully!",
      alerts: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getAlertById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`SELECT * FROM alerts WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Alert not found!",
      });
    }
    res.status(200).json({
      message: "All alerts fetched successfully!",
      alerts: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { alert_type, message, severity, is_resolved } = req.body;

    const result = await pool.query(
      `UPDATE alerts
       SET alert_type = $1,
           message = $2,
           severity = $3,
           is_resolved = $4
       WHERE id = $5
       RETURNING *`,
      [alert_type, message, severity, is_resolved, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Alert not found!",
      });
    }

    return res.status(200).json({
      message: "Alert updated successfully!",
      alert: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      DELETE FROM alerts WHERE id =$1 RETURNING *`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Alert not found!",
      });
    }
    res.status(200).json({
      message: "Alert deleted successfully!",
      alerts: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
};
