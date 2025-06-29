---
id: ARCH-feature-soil-test
title: "Feature: Soil Test API"
type: feature
layer: application
owner: @backend-team
version: v1
status: current
created: 2025-06-29
updated: 2025-06-29
tags: [soil-test, api, crud]
depends_on:
  - ARCH-data-user
  - ARCH-data-soil-test
  - ARCH-service-auth
referenced_by: []
---
## Context
This feature provides a set of API endpoints for managing a user's soil test records. It allows authenticated users to create new test records, view their history of tests, retrieve the most recent one, and delete records.

## Structure
This feature is implemented across the following files:
- **Controller**: `controllers/soil_test.controller.js` contains the business logic for handling the requests.
- **Routes**: `routes/soil_test.routes.js` defines the API endpoints and links them to the controller functions.
- **Middleware**: `middleware/auth.middleware.js` is used to protect all endpoints, ensuring only authenticated users can access them.
- **Model**: `models/soil_test.js` (see `ARCH-data-soil-test`).

## Behavior
All endpoints under `/soil-tests` require a valid JWT token. The user's ID is extracted from the token and used to scope all database operations, ensuring users can only access their own data.

**Endpoints:**
- `POST /`: Creates a new soil test record for the authenticated user.
- `GET /`: Retrieves a list of all soil tests for the authenticated user, with optional filtering by date range and location.
- `GET /latest`: Retrieves the single most recent soil test for the authenticated user.
- `DELETE /:testId`: Deletes a specific soil test by its ID.

The controller validates input and interacts with the `SoilTest` Mongoose model to perform database operations.

## Evolution
### Planned
- Add an `UPDATE` endpoint to allow users to correct soil test data.
- Implement pagination for the `GET /` endpoint to handle large numbers of records.
- Integrate with an AI service to generate recommendations based on newly created soil tests.
