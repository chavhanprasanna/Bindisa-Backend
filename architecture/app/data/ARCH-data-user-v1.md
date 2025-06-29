---
id: ARCH-data-user
title: "Data Model: User"
type: data_model
layer: data_model
owner: @backend-team
version: v1
status: current
created: 2025-06-29
updated: 2025-06-29
tags: [user, data_model, mongodb]
depends_on: []
referenced_by: []
---
## Context
This document defines the data schema for a user of the Bindisa application. The user model is central to the system, underpinning authentication, authorization, and data ownership for other models like Soil Tests.

## Structure
The schema is defined in `models/user.js` using Mongoose.

**Key Fields:**
- `phone_number`: (String) The user's mobile number, used as the primary unique identifier for login.
- `name`: (String) The user's name.
- `preferred_language`: (String) The user's language preference (e.g., 'en').
- `user_type`: (String, enum: ['farmer', 'expert', 'admin']) The role of the user, defaulting to 'farmer'.
- `is_verified`: (Boolean) Flag indicating if the user has successfully verified their phone number via OTP.
- `last_login`: (Date) Timestamp of the last successful login.
- `otp_code`: (String) A temporary field to store the One-Time Password during the login flow. It is cleared after successful verification.

**Methods:**
- `generateAuthToken()`: A method on the user instance that creates and returns a signed JSON Web Token (JWT) containing the user's `_id`.

## Behavior
A new user is created either during the first login attempt or via the user management API. The `phone_number` is the key for authentication. The `user_type` field is intended for future role-based access control (RBAC) logic, though this is not fully implemented yet.

The `generateAuthToken` method is called after a successful OTP verification to create a session token for the client.

## Evolution
### Planned
- Implement password-based authentication as an alternative to OTP.
- Expand `user_type` roles and implement granular permissions based on them.
