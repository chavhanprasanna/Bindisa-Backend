const request = require('./setup');
const CropSuggestion = require('../models/crop_suggestion');
const SoilTest = require('../models/soil_test');
const User = require('../models/user');

describe('Crop Suggestion Tests', () => {
  let testUser;
  let testSoilTest;
  let testCropSuggestion;
  let token;

  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      phone_number: '9876543210',
      name: 'Test User',
      email: 'test@example.com',
      user_type: 'farmer'
    });

    // Create test soil test
    testSoilTest = await SoilTest.create({
      user_id: testUser._id,
      location: 'Test Field',
      ph: 6.5,
      nitrogen: 45,
      phosphorus: 20,
      potassium: 30,
      test_time: new Date()
    });

    // Login to get token
    const loginResponse = await request.post('/auth/login-password')
      .send({
        email: 'test@example.com',
        password: 'Test@123'
      });
    token = loginResponse.body.token;
  });

  describe('Create Crop Suggestion', () => {
    it('should create a new crop suggestion', async () => {
      const response = await request.post('/crop-suggestions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          soil_test_id: testSoilTest._id,
          suggested_crop: 'Wheat',
          rotation_advice: 'Rotate with legumes next season',
          weather_data: 'Sunny',
          region: 'Test Region'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.suggested_crop).toBe('Wheat');
    });

    it('should validate required fields', async () => {
      const response = await request.post('/crop-suggestions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          suggested_crop: 'Wheat'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('details');
    });
  });

  describe('Get Crop Suggestions', () => {
    beforeEach(async () => {
      testCropSuggestion = await CropSuggestion.create({
        soil_test_id: testSoilTest._id,
        suggested_crop: 'Wheat',
        rotation_advice: 'Rotate with legumes next season',
        weather_data: 'Sunny',
        region: 'Test Region'
      });
    });

    it('should get all crop suggestions', async () => {
      const response = await request.get('/crop-suggestions')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('suggestions');
      expect(response.body.suggestions).toHaveLength(1);
    });

    it('should get single crop suggestion', async () => {
      const response = await request.get(`/crop-suggestions/${testCropSuggestion._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.suggested_crop).toBe('Wheat');
    });
  });

  describe('Update Crop Suggestion', () => {
    beforeEach(async () => {
      testCropSuggestion = await CropSuggestion.create({
        soil_test_id: testSoilTest._id,
        suggested_crop: 'Wheat',
        rotation_advice: 'Rotate with legumes next season',
        weather_data: 'Sunny',
        region: 'Test Region'
      });
    });

    it('should update crop suggestion', async () => {
      const response = await request.put(`/crop-suggestions/${testCropSuggestion._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          suggested_crop: 'Rice',
          rotation_advice: 'New advice'
        });

      expect(response.status).toBe(200);
      expect(response.body.suggested_crop).toBe('Rice');
    });
  });

  describe('Delete Crop Suggestion', () => {
    beforeEach(async () => {
      testCropSuggestion = await CropSuggestion.create({
        soil_test_id: testSoilTest._id,
        suggested_crop: 'Wheat',
        rotation_advice: 'Rotate with legumes next season',
        weather_data: 'Sunny',
        region: 'Test Region'
      });
    });

    it('should delete crop suggestion', async () => {
      const response = await request.delete(`/crop-suggestions/${testCropSuggestion._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('CropSuggestion deleted');
    });
  });
});
