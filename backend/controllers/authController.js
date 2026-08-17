const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if the user already exists in PostgreSQL
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    // Check if the user already exists
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    //Insert the new user into PostgreSQL
    const result = await pool.query(
      `INSERT INTO users (name, email, password) 
      values ($1, $2, $3) 
      RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword],
    );

    // Return the newly created user data in the response
    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });

    // console.log(name, email, hashedPassword);
    res.json({
      message: "Registration data received",
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in PostgreSQL
    const result = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { registerUser, loginUser };
