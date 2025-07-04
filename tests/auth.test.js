const request = require('./setup');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

describe('Authentication Tests', () => {
  let testUser;
  let testPassword = 'Test@123';

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      phone_number: '9876543210',
      name: 'Test User',
      email: 'test@example.com',
      password: await bcrypt.hash(testPassword, 10),
      user_type: 'farmer'
    });
  });

  describe('Password-based Login', () => {
    it('should login with correct credentials', async () => {
      const response = await request.post('/auth/login-password')
        .send({
          email: 'test@example.com',
          password: testPassword
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should fail with incorrect password', async () => {
      const response = await request.post('/auth/login-password')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail with non-existent email', async () => {
      const response = await request.post('/auth/login-password')
        .send({
          email: 'nonexistent@example.com',
          password: testPassword
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('OTP-based Login', () => {
    it('should send OTP and verify successfully', async () => {
      // Request OTP
      const otpResponse = await request.post('/auth/login')
        .send({ phone_number: '9876543210' });

      expect(otpResponse.status).toBe(200);
      expect(otpResponse.body).toHaveProperty('message');

      // Verify OTP (using stored OTP from testUser)
      const verifyResponse = await request.post('/auth/otp-verify')
        .send({
          phone_number: '9876543210',
          otp: testUser.otp_code
        });

      expect(verifyResponse.status).toBe(200);
      expect(verifyResponse.body).toHaveProperty('token');
    });

    it('should fail with incorrect OTP', async () => {
      const response = await request.post('/auth/otp-verify')
        .send({
          phone_number: '9876543210',
          otp: '123456'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
