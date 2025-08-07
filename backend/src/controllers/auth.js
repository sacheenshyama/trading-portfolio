const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { redisClient } = require("../config/redis");
const { sendMail } = require("../utils/nodeMailer");
const generateOtp = require("../utils/generateOtp");
const sendOtp = require("../utils/sendOtp");

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
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
      isVerified: false,
    });
    await sendOtp(email);
    res.status(200).json({
      message: "User created and OTP sent on given email",
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
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (!user.isVerified) {
      await sendOtp(email);
      return res.status(444).json({
        message: "OTP sent, Please verify your email. ",
        requiresOtpVerification: true,
      });
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
      EX: 7 * 24 * 60 * 60,
    });
    res.cookie("jwtToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ token, id: user._id });
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while signing in",
    });
  }
};

const oAuthLogin = async (req, res) => {
  const email_verified = req.body.profile.email_verified;
  const email = req.body.profile.email;

  if (!email_verified || !email) {
    return res.status(400).json({ error: "Email not verified" });
  }
  try {
    const existingUser = await User.findOne({ email }).lean();
    if (!existingUser) {
      const saltRounds = 10;
      const pass = "172940";
      const password = await bcrypt.hash(pass, saltRounds);

      const newUser = await User.create({
        email,
        password,
        isVerified: true,
      });
      sendMail(
        email,
        "Welcome to our Platform",
        `<h3>Welcome ${email} to our Algo&Stock</h3><p>Your account has been created successfully and this is your passkey do not share it with other ${pass}.</p>`
      );
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      await redisClient.set(`session:${newUser._id}`, JSON.stringify(newUser), {
        EX: 7 * 24 * 60 * 60,
      });

      res.cookie("jwtToken", token, {
        httpOnly: false,
        secure: true,
        sameSite: "None",
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(201).json({
        token,
        id: newUser._id,
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    await redisClient.set(
      `session:${existingUser._id}`,
      JSON.stringify(existingUser),
      {
        EX: 7 * 24 * 60 * 60,
      }
    );

    res.cookie("jwtToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ token, id: existingUser._id });
  } catch (error) {
    console.error("OAuth login error:", error);
    res.status(500).json({
      error: error.message || "An error occurred during OAuth login",
    });
  }
};

async function requestOtp(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(404).json({ message: "email not provided" });
  }
  const otp = generateOtp();

  await redisClient.setEx(`otp:${email}`, 300, otp);

  sendMail(
    email,
    "Your OTP Code",
    `<p> Your OTP is ${otp}. It expires in 5 minute</p>`
  );

  res.json({ message: "OTP sent" });
}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "email or otp not provided" });
  }
  try {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp) return res.status(400).json({ error: "OTP expired" });
    if (storedOtp !== otp)
      return res.status(401).json({ error: "Invalid OTP" });
    await redisClient.del(`otp:${email}`);

    let user = await User.findOneAndUpdate(
      {
        email,
      },
      {
        isVerified: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
      EX: 7 * 24 * 60 * 60,
    });
    res.cookie("jwtToken", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ token, id: user._id });
  } catch (error) {
    console.log(error || "error in verifyOtp");
    res.status(500).json({ message: error });
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
    res.clearCookie("jwtToken", {
      httpOnly: false,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
};
module.exports = {
  signup,
  signin,
  oAuthLogin,
  logout,
  requestOtp,
  verifyOtp,
};
