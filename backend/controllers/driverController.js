const pool = require("../config/db");

const createDriver = async (req, res) => {
  try {
    const { name, phone, license_number, status } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Driver name must required!",
      });
    }

    const result = await pool.query(
      `INSERT INTO drivers (name, phone, license_number, status)
       VALUES ($1,$2,$3,$4) 
       RETURNING *`,
      [name, phone, license_number, status],
    );

    res.status(201).json({
      message: "Driver created successfully",
      driver: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    // driver can't use same license
    if (error.code === "23505") {
      return res.status(409).json({
        message: "Driver with this number already exists!",
      });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getDrivers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM drivers ORDER BY id ASC");
    return res.status(201).json({
      message: "Drivers fetched successfully",
      drivers: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM drivers WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Driver not found!",
      });
    }
    res.status(201).json({
      message: "Driver fetched successfully!",
      driver: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, license_number, status } = req.body;
    if (!name && !phone && !license_number && !status) {
      // if (!name) {
      return res.status(400).json({
        message: "Driver name must required!",
      });
    }
    const result = await pool.query(
      `UPDATE drivers SET name= $1, phone= $2, license_number= $3, status= $4
      WHERE id = $5
      RETURNING *`,
      [name, phone, license_number, status, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Driver not found!",
      });
    }
    res.status(200).json({
      message: "Driver updated successfully!",
      driver: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM drivers WHERE id = $1 RETURNING * ",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Driver not found",
      });
    }
    res.status(201).json({
      message: "Driver delete successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
};
