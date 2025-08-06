const { redisClient } = require("../config/redis");
const generateOtp = require("./generateOtp");
const { sendMail } = require("./nodeMailer");

const sendOtp = async (email) => {
  await redisClient.del(`otp:${email}`);
  const otp = generateOtp();

  await redisClient.setEx(`otp:${email}`, 300, otp);
  sendMail(
    email,
    "Your otp Code",
    `<p> Your OTP is ${otp}. It expires in 5 minute</p>`
  );
};

module.exports = sendOtp;
