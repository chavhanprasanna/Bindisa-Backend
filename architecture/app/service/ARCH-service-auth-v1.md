---
id: ARCH-service-auth
title: "Service: Authentication"
type: service
layer: application
owner: @backend-team
version: v1
status: current
created: 2025-06-29
updated: 2025-06-29
tags: [auth, jwt, otp, security]
depends_on: [ARCH-data-user]
referenced_by: []
---
## Context
This service handles user authentication for the Bindisa application. It implements a mobile-first, OTP-based login flow. Upon successful verification, it issues a JSON Web Token (JWT) that clients can use to access protected API endpoints.

## Structure
The authentication service is composed of several key files:
- **Controller**: `auth.controller.js` contains the core logic for the login and OTP verification process. It handles user lookup/creation, OTP generation, and interfacing with the Twilio service for sending SMS.
- **Routes**: `routes/auth.routes.js` defines the `/login` and `/otp-verify` endpoints.
- **Middleware**:
  - `middleware/auth.middleware.js`: Verifies the JWT on incoming requests to protected routes. It decodes the token and attaches the user payload to the request object.
  - `middleware/validation.middleware.js`: Provides input validation for the authentication routes (e.g., ensuring mobile number and OTP formats are correct).
- **Model**: The service relies on the User model, defined in `models/user.js` (see `ARCH-data-user`).

## Behavior
The authentication flow is a two-step process:
1.  **Login Request (`POST /auth/login`)**:
    - The user provides their `mobile` number.
    - The service checks if a user with this number exists. If not, a new user is created.
    - A 6-digit OTP is generated and stored on the user document.
    - The OTP is sent to the user's mobile number via Twilio. For development environments without Twilio credentials, the OTP is logged to the console and returned in the response for easier testing.
2.  **OTP Verification (`POST /auth/otp-verify`)**:
    - The user submits their `mobile` number and the `otp` they received.
    - The service validates the OTP against the stored value.
    - If valid, the OTP is cleared from the user document, the user is marked as verified, and a JWT is generated using the `user.generateAuthToken()` method.
    - The JWT is returned to the client.

## Evolution
### Planned
- Implement refresh tokens to allow for longer-lived sessions without compromising security.
- Add rate limiting specifically to the `/login` endpoint to prevent OTP spam.
- Implement a timeout for OTP validity (e.g., 5 minutes).
