# Bindisa Backend

Backend for Bindisa farming management system built with Node.js, Express, and dual database support (Supabase + MongoDB).

## Features

- Dual Database Support (Supabase + MongoDB)
- Demo Mode without Database Dependency
- Complete API Documentation (Swagger)
- Role-based Access Control (Farmer/Expert/Admin)
- Weather Integration
- Soil Test Management
- Soil NPK Analysis and Fertilizer Recommendation
- Crop Recommendations
- Farming Plan Management
- Production-grade Security
- Docker Support
- PM2 Process Management
- Render Deployment Ready

## Prerequisites

- Node.js (v18 or later)
- npm (latest version)
- Docker (for containerization)
- Optional:
  - Supabase account (for PostgreSQL)
  - MongoDB Atlas account
  - Twilio account (for SMS)
  - Weather API key

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database Configuration
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# MongoDB
MONGODB_URI=your_mongodb_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Weather API
WEATHER_API_KEY=your_weather_api_key

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Demo Mode
DEMO_MODE=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/app.log
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bindisa-backend.git
   cd bindisa-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the environment variables in `.env` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   # Note: The 'dev' script in package.json is configured to run on PORT 3002 for Windows environments.
   ```

5. For production:
   ```bash
   npm start
   ```

## Demo Mode

To run in demo mode without database:

1. Set `DEMO_MODE=true` in your `.env` file
2. Use these demo credentials:
   - Farmer: 9876543210 / demo123
   - Expert: 9876543211 / expert123
   - Admin: 9876543212 / admin123

## Testing and Data Setup

### Importing NPK Data

To populate your MongoDB with initial NPK-related data (states, districts, crops, crop requirements, and fertilizers), run the import script:

```bash
node scripts/import_npk_data.js
```

### Creating a Default User

For testing purposes, you can create a default `farmer` user with email `farmer@example.com` and password `password123`. This user can be used to log in and test protected routes.

```bash
node scripts/create_default_user.js
```

### Testing the NPK Analysis Endpoint

Once the server is running and you have a user, you can test the NPK analysis endpoint.

**Endpoint:** `POST http://localhost:3002/api/npk/analyze`

**Request Body (JSON):**
```json
{
  "n": 100,
  "p": 50,
  "k": 30,
  "ph": 6.5,
  "cropId": 1,
  "stateId": 1,
  "districtId": 1
}
```

**Headers:** Include an `Authorization` header with a valid JWT token obtained from login.
`Authorization: Bearer YOUR_JWT_TOKEN_HERE`

The user associated with the JWT token must have the `FARMER`, `EXPERT`, or `ADMIN` role.

## API Documentation

Access the Swagger documentation at:
- Development: http://localhost:3000/docs
- Production: http://your-domain.com/docs

## Deployment

### Docker

```bash
# Build the Docker image
docker build -t bindisa-backend .

# Run the container
docker run -d -p 3000:3000 -e NODE_ENV=production bindisa-backend
```

### PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# View logs
pm2 logs
```

### Render

1. Create a new web service on Render
2. Connect your GitHub repository
3. Use the `render.yaml` configuration
4. Set environment variables in Render dashboard

## Security Features

- JWT-based authentication
- Rate limiting (100 requests/IP in 15 minutes)
- Input validation and sanitization
- CORS protection
- Security headers
- Request logging and audit trails
- XSS and injection protection

## License

MIT License - feel free to use this code in your projects!

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)

### Soil NPK Analysis
- `POST /api/npk/analyze` - Perform soil NPK analysis and get fertilizer recommendations (protected, requires FARMER, EXPERT, or ADMIN role)

## Project Structure

```
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # API routes
├── scripts/          # Utility scripts (data import, user creation)
├── utils/            # Utility functions and constants (e.g., roles)
├── .env.example      # Example environment variables
├── .gitignore        # Git ignore file
├── package.json      # Dependencies and scripts
└── server.js         # Application entry point
```

## Security

- **Input validation & sanitization:** All endpoints strictly validate and sanitize input using express-validator. String fields are trimmed/escaped, numeric fields are type-checked.
- **Rate limiting:** Prevents brute-force and DoS attacks.
- **Helmet:** Sets secure HTTP headers.
- **Mongo-sanitize & HPP:** Prevents NoSQL injection and HTTP parameter pollution.
- **JWT authentication:** All sensitive endpoints require a valid, expiring JWT.
- **RBAC:** Role-based access control enforced on all critical endpoints.
- **CORS:** Only allows requests from trusted origins (set via `CORS_ORIGIN` env variable).
- **Error handling:** Centralized, never leaks stack traces or sensitive info to clients.
- **Payload size limiting:** Large payloads are rejected (max 1MB).
- **Environment variables:** All secrets/config are loaded from `.env` (never hardcoded).

### Automated Security Testing

Run security tests with:
```bash
npm test
```
This will run Jest tests in `tests/security.test.js` to check:
- JWT enforcement
- Payload size limits
- Input sanitization (XSS prevention)
- RBAC enforcement
- CORS restrictions

**Recommended:** Add this to your CI/CD pipeline for every commit.

## Troubleshooting

### `EADDRINUSE: address already in use :::3000` or `:::3002`

This error means another process is already using the port the server is trying to bind to.
*   **Solution 1:** Ensure no other instance of the server is running.
*   **Solution 2:** If you're using `nodemon`, ensure it's configured correctly. The `dev` script in `package.json` is set to use `PORT=3002` for Windows.
*   **Solution 3:** If the issue persists, try changing the `PORT` in your `.env` file or directly in `server.js` to an unused port (e.g., `3003`).

### `MODULE_NOT_FOUND: ../utils/roles`

This error indicates that the `utils/roles.js` file was not found. This file defines the user roles.
*   **Solution:** Ensure the `utils` directory and `roles.js` file exist in your project root. If not, create `utils/roles.js` with the following content:
    ```javascript
    const ROLES = {
      ADMIN: 'admin',
      EXPERT: 'expert',
      FARMER: 'farmer'
    };

    module.exports = ROLES;
    ```

### `MongooseServerSelectionError: connect ECONNREFUSED`

This error means the application cannot connect to your MongoDB database.
*   **Solution 1:** Ensure your MongoDB server is running.
*   **Solution 2:** Verify that the `MONGODB_URI` in your `.env` file is correct and points to your running MongoDB instance.
*   **Solution 3:** Check firewall settings that might be blocking the connection to MongoDB.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Prasanna Chavhan - prasannachavhan786@gmail.com

Project Link: [https://github.com/chavhanprasanna/Bindisa-Backend](https://github.com/chavhanprasanna/Bindisa-Backend)
