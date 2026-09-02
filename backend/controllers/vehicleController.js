
const pool = require("../config/db");

// Create vehicle
const createVehicle = async (req, res) => {
  try {
    const {
      vehicle_number,
      vehicle_type,
      manufacturer,
      model,
      year,
      driver_id,
      status,
    } = req.body;

    const vehicleNumber = vehicle_number?.trim();
    const vehicleType = vehicle_type?.trim();

    // Validate required fields
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({
        message: "Vehicle number and vehicle type are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO vehicles (
        vehicle_number,
        vehicle_type,
        manufacturer,
        model,
        year,
        driver_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        vehicleNumber,
        vehicleType,
        manufacturer,
        model,
        year,
        driver_id,
        status,
      ],
    );

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Create vehicle error:", error);

    // Duplicate vehicle number
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Vehicle number already exists",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all vehicles
const getVehicles = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vehicles ORDER BY id ASC");

    return res.status(200).json({
      message: "Vehicles fetched successfully",
      vehicles: result.rows,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Get vehicle by ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const result = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle fetched successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Get vehicle by ID error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Update vehicle
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const {
      vehicle_number,
      vehicle_type,
      manufacturer,
      model,
      year,
      driver_id,
      status,
    } = req.body;

    const vehicleNumber = vehicle_number?.trim();
    const vehicleType = vehicle_type?.trim();

    // Validate required fields
    if (!vehicleNumber || !vehicleType) {
      return res.status(400).json({
        message: "Vehicle number and vehicle type are required",
      });
    }

    const result = await pool.query(
      `UPDATE vehicles
       SET vehicle_number = $1,
           vehicle_type = $2,
           manufacturer = $3,
           model = $4,
           year = $5,
           driver_id = $6,
           status = $7
       WHERE id = $8
       RETURNING *`,
      [
        vehicleNumber,
        vehicleType,
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

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Update vehicle error:", error);

    // Duplicate vehicle number
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Vehicle number already exists",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete vehicle
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        message: "Invalid vehicle ID",
      });
    }

    const result = await pool.query(
      "DELETE FROM vehicles WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle deleted successfully",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);

    // Foreign key violation
    if (error.code === "23503") {
      return res.status(409).json({
        message:
          "Vehicle cannot be deleted because it is associated with other records",
      });
    }

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
