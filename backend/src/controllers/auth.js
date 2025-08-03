const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "user created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while signing up",
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await redisClient.set(`session:${user._id}`, JSON.stringify(user), {
      EX: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("jwtToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
    });
    res.status(200).json({ token, id: user._id });
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while signing in",
    });
  }
};
const logout = async (req, res) => {
  const token =
    req.cookies.jwtToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await redisClient.del(`session:${decoded.id}`);
    res.clearCookie("jwtToken", { sameSite: NONAME, secure: true });
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};
module.exports = {
  signup,
  signin,
  logout,
};
