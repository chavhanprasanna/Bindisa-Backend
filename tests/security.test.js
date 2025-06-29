const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
require('dotenv').config();

// Generate a valid JWT for testing
const testUser = { _id: '507f1f77bcf86cd799439011', user_type: 'admin' };
const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Security Tests', () => {
  it('should reject requests without JWT', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(401);
  });

  it('should reject requests with invalid JWT', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });

  it('should reject requests with excessive payload', async () => {
    const bigPayload = 'a'.repeat(2 * 1024 * 1024); // 2MB
    const res = await request(app)
      .post('/crops')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: bigPayload, type: 'test' });
    expect(res.statusCode).toBe(413);
  });

  it('should sanitize input and prevent XSS', async () => {
    const res = await request(app)
      .post('/crops')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '<script>alert(1)</script>', type: 'test' });
    expect(res.body.name).not.toContain('<script>');
  });

  it('should enforce RBAC', async () => {
    const farmerToken = jwt.sign({ _id: '507f1f77bcf86cd799439012', user_type: 'farmer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({ phone_number: '9876543210', name: 'Test', user_type: 'farmer' });
    expect(res.statusCode).toBe(403);
  });

  it('should restrict CORS to allowed origins', async () => {
    const res = await request(app)
      .get('/users')
      .set('Origin', 'http://malicious-site.com')
      .set('Authorization', `Bearer ${token}`);
    expect(res.headers['access-control-allow-origin']).not.toBe('http://malicious-site.com');
  });
});
