const crypto = require('crypto');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

// Initialize Twilio only if real credentials are configured
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const twilioEnabled = accountSid && authToken && !accountSid.startsWith('your_');
let client = null;
if (twilioEnabled) {
  client = twilio(accountSid, authToken);
  console.log('Twilio enabled');
} else {
  console.warn('Twilio credentials missing – SMS sending disabled. OTPs will be logged to console.');
}

/**
 * Generate a 6-digit numeric OTP (string)
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.login = async (req, res) => {
  try {
    const { mobile, name } = req.body;
    
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required"
      });
    }

    // Check if user exists
    let user = await User.findOne({ phone_number: mobile });
    if (!user) {
      // Create new user if not exists
      user = new User({
        phone_number: mobile,
        name: name || mobile,
        is_verified: false
      });
      await user.save();
    }

    // Generate OTP
    const otp = generateOtp();
    user.otp_code = otp;
    user.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await user.save();

    if (twilioEnabled) {
      // Send OTP via Twilio
      client.messages
        .create({
          body: `Your Bindisa OTP is: ${otp}. This code will expire in 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: mobile
        })
        .then(message => {
          console.log(`OTP sent to ${mobile}, SID=${message.sid}`);
          res.json({
            success: true,
            message: "OTP has been sent successfully",
            userId: user._id
          });
        })
        .catch(err => {
          console.error("Twilio error:", err);
          res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again."
          });
        });
    } else {
      console.log(`Generated OTP for ${mobile}: ${otp}`);
      res.json({
        success: true,
        message: "OTP has been generated (SMS disabled in this environment)",
        otp: otp, // expose for dev/testing only
        userId: user._id
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.loginPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Clear any existing OTP
    user.otp_code = null;
    user.otp_expires_at = null;
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: user._id,
        token: token,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required"
      });
    }

    const user = await User.findOne({ phone_number: mobile });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check OTP expiry
    if (!user.otp_code || user.otp_expires_at < new Date()) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired"
      });
    }

    if (user.otp_code !== otp) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Clear OTP and mark user as verified
    user.otp_code = null;
    user.otp_expires_at = null;
    user.is_verified = true;
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "OTP verified successfully",
      data: {
        userId: user._id,
        token: token,
        user_type: user.user_type
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear the JWT token by sending an empty one
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
