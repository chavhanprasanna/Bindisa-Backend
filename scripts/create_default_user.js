const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user'); // Assuming your User model is here

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bindisa';

const createDefaultUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for user creation.');

    const email = 'farmer@example.com';
    const password = 'password123'; // Default password
    const user_type = 'farmer';

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`User with email ${email} already exists. Skipping creation.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      user_type,
      phone_number: '1234567890', // Dummy phone number
      name: 'Default Farmer'
    });

    await newUser.save();
    console.log(`Default farmer user created: ${email} with password: ${password}`);
  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createDefaultUser();
