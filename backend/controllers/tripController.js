const pool = require("../config/db");

const createTrip = async (req, res) => {
  try {
    const {
      vehicle_id,
      driver_id,
      start_latitude,
      start_longitude,
      end_latitude,
      end_longitude,
      start_time,
      end_time,
      distance_km,
      status,
    } = req.body;
    if (!vehicle_id) {
      return res.status(404).json({
        message: "Vehicle ID is must required",
      });
    }
    const result = await pool.query(
      `INSERT INTO trips
       (vehicle_id, 
       driver_id, 
       start_latitude, 
       start_longitude, 
       end_latitude, 
       end_longitude, 
       start_time, 
       end_time, 
       distance_km, 
       status) 
       VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
      [
        vehicle_id,
        driver_id,
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
        start_time,
        end_time,
        distance_km,
        status,
      ],
    );
    res.status(201).json({
      message: "Trip created successfully!",
      trip: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trips ORDER BY id ASC");
    res.status(200).json({
      message: "Fetched all trips details successfully!",
      trips: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const tripGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM trips WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trip not found!",
      });
    }
    res.status(200).json({
      message: "Trip fetched successfully",
      trip: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// const updateTrip = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       vehicle_id,
//       driver_id,
//       start_latitude,
//       start_longitude,
//       end_latitude,
//       end_longitude,
//       start_time,
//       end_time,
//       distance_km,
//       status,
//     } = req.body;
//     if (!vehicle_id && !driver_id) {
//       return res.status(400).json({
//         message: "Vehicle ID and Driver ID is must rtequired!",
//       });
//     }
//     const result = await pool.query(
//       `UPDATE trips SET vehicle_id = $1,
//       driver_id = $2,
//       start_latitude = $3,
//       start_longitude = $4,
//       end_latitude = $5,
//       end_longitude = $6,
//       start_time = $7,
//       end_time = $8,
//       distance_km = $9,
//       status = $10 WHERE id = $11
//       RETURNING *`,
//       [
//         vehicle_id,
//         driver_id,
//         start_latitude,
//         start_longitude,
//         end_latitude,
//         end_longitude,
//         start_time,
//         end_time,
//         distance_km,
//         status,
//         id,
//       ],
//     );

//     if (result.rows.length === 0) {
//       return res.status(404).json({
//         message: "Trip not found!",
//       });
//     }
//     res.status(200).json({
//       message: "Trip fetched successfully!",
//       trip: result.rows[0],
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

const updateTrip = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { id } = req.params;

    const {
      vehicle_id,
      driver_id,
      start_latitude,
      start_longitude,
      end_latitude,
      end_longitude,
      start_time,
      end_time,
      distance_km,
      status,
    } = req.body || {};

    if (!vehicle_id) {
      return res.status(400).json({
        message: "Vehicle ID is required!",
      });
    }

    const result = await pool.query(
      `UPDATE trips
       SET vehicle_id = $1,
           driver_id = $2,
           start_latitude = $3,
           start_longitude = $4,
           end_latitude = $5,
           end_longitude = $6,
           start_time = $7,
           end_time = $8,
           distance_km = $9,
           status = $10
       WHERE id = $11
       RETURNING *`,
      [
        vehicle_id,
        driver_id,
        start_latitude,
        start_longitude,
        end_latitude,
        end_longitude,
        start_time,
        end_time,
        distance_km,
        status,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trip not found!",
      });
    }

    res.status(200).json({
      message: "Trip updated successfully!",
      trip: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM trips WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }
    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createTrip,
  getAllTrips,
  updateTrip,
  tripGetById,
  deleteTrip,
};
