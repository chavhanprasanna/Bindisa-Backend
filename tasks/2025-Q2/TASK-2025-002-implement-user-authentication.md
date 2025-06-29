---
id: TASK-2025-002
title: "Implement User Authentication (OTP-based)"
status: done
priority: high
type: feature
estimate: 8h
assignee: @backend-team
created: 2025-05-20
updated: 2025-06-29
parents: [TASK-2025-001]
children: []
arch_refs: [ARCH-service-auth]
audit_log:
  - {date: 2025-05-20, user: "@pm", action: "created with status backlog"}
  - {date: 2025-05-21, user: "@backend-lead", action: "status backlog → in_progress"}
  - {date: 2025-06-29, user: "@AI-DocArchitect", action: "status: in_progress → done"}
  - {date: 2025-06-29, user: "@AI-DocArchitect", action: "updated arch_refs"}
---
## Description
Develop the user authentication module using a mobile number and One-Time Password (OTP) flow. The system generates and sends an OTP, which the user provides back to receive a JSON Web Token (JWT) for session management.

## Acceptance Criteria
- A user can initiate login by providing a 10-digit mobile number to the `POST /auth/login` endpoint.
- If the user does not exist, a new user record is created.
- The system generates a 6-digit OTP, stores it, and sends it to the user's mobile number (or logs it to the console in dev).
- The user can verify the OTP by sending their mobile number and the OTP to `POST /auth/otp-verify`.
- Upon successful verification, the server returns a valid JWT.
- Protected API endpoints (e.g., `/soil-tests`) return a 401 Unauthorized error if a valid JWT is not provided in the `Authorization: Bearer <token>` header.

## Definition of Done
- Code implemented in `auth.controller.js`, `user.model.js`, and related routes/middleware.
