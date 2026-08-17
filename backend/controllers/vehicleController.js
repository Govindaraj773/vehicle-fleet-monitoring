const pool = require("../config/db");

const createVehicle = async (req, res) => {
  try {
    // console.log("Request body:", req.body); // Log the request body for debugging
    const {
      vehicle_number,
      vehicle_type,
      manufacturer,
      model,
      year,
      driver_id,
      status,
    } = req.body;

    if (!vehicle_number || !vehicle_type) {
      return res.status(400).json({
        message: "Vehicle number and vehicle type are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (vehicle_number, vehicle_type, manufacturer, model, year, driver_id, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        vehicle_number,
        vehicle_type,
        manufacturer,
        model,
        year,
        driver_id,
        status,
      ],
    );

    res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");
    res.status(200).json({
      message: "Vehicles fetched successfully",
      vehicles: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      vehicle_number,
      vehicle_type,
      manufacturer,
      model,
      year,
      driver_id,
      status,
    } = req.body;

    if (!vehicle_number || !vehicle_type) {
      return res.status(400).json({
        message: "Vehicle number and vehicle type are required",
      });
    }

    const result = await pool.query(
      `UPDATE vehicles SET vehicle_number = $1, vehicle_type = $2, manufacturer = $3, model = $4, 
      year = $5, driver_id= $6, status = $7 WHERE id = $8 RETURNING *`,
      [
        vehicle_number,
        vehicle_type,
        manufacturer,
        model,
        year,
        driver_id,
        status,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }
    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM vehicles WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found!",
      });
    }
    res.status(200).json({
      message: "Vehicle deleted successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
