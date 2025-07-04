const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../server');

// Test database connection
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/bindisa_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Clear test database before each test suite
beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map(collection => collection.deleteMany())
  );
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Export test client
module.exports = supertest(app);
