# Bindisa Backend

Backend for Bindisa farming management system built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT, expiring tokens)
- Role-based access control (RBAC)
- Secure API endpoints
- Rate limiting and request validation
- Input sanitization and escaping (prevents XSS/injection)
- CORS restricted to trusted origins
- Centralized error handling (no stack traces in production)
- Environment-based configuration
- Automated security tests (Jest)
- API documentation (Swagger, coming soon)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (local or Atlas)
- Twilio account (for SMS functionality)

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
   ```

5. For production:
   ```bash
   npm start
   ```

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

## Project Structure

```
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/           # Database models
├── routes/           # API routes
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/bindisa-backend](https://github.com/yourusername/bindisa-backend)
