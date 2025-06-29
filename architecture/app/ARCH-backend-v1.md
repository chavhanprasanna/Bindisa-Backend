---
layer: application
owner: @backend-team
version: v1
status: current # current | planned | deprecated
created: 2025-05-20
updated: 2025-06-29
tags: [backend, nodejs, express, mongodb, auth, user-management, soil-test]
depends_on:
  - ARCH-service-auth
  - ARCH-feature-user-management
  - ARCH-feature-soil-test
  - ARCH-data-user
  - ARCH-data-soil-test
referenced_by: []
---
## Context
This document describes the high-level architecture of the Bindisa backend system. The backend is responsible for business logic, data storage, and providing a secure API for client applications.

Key features implemented in this version include:
- **User Authentication**: OTP-based login and JWT session management.
- **User Management**: Full CRUD operations for user profiles.
- **Soil Test Management**: CRUD operations for user-submitted soil test data.
- **Dashboard API**: An endpoint providing mock data for the main dashboard.

## Structure
The application follows a standard layered architecture pattern:
- **Controllers**: Handle incoming requests, validate input, and orchestrate business logic.
- **Middleware**: Provides cross-cutting concerns like authentication, logging, error handling, and security headers.
- **Models**: Define the MongoDB data schemas using Mongoose.
- **Routes**: Map API endpoints to controller functions. (`auth.routes.js`, `user.routes.js`, `soil_test.routes.js`, `dashboard.routes.js`)
- **Server**: The main entry point (`server.js`) that configures and starts the Express application.

## Behavior
The system exposes a RESTful API over HTTPS. All sensitive endpoints are protected and require a valid JWT token provided in the `Authorization` header. The authentication flow uses a One-Time Password (OTP) sent via SMS (with a console fallback for development).

## Evolution
### Planned
- Integrate remaining data models (e.g., `CropSuggestion`, `FarmingPlan`) into the API.
- Replace mock data in the Dashboard API with real data aggregations.
- Implement a full-featured CI/CD pipeline.

### Historical
- v1: Initial setup with User Authentication (OTP), User Management, and Soil Test APIs.
