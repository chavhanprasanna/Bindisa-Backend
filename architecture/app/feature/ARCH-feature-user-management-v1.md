---
id: ARCH-feature-user-management
title: "Feature: User Management API"
type: feature
layer: application
owner: @backend-team
version: v1
status: current
created: 2025-06-29
updated: 2025-06-29
tags: [user, api, crud]
depends_on: [ARCH-data-user]
referenced_by: []
---
## Context
This feature provides a set of administrative API endpoints for performing Create, Read, Update, and Delete (CRUD) operations on user resources. This is distinct from the public-facing authentication service and is intended for system administrators.

## Structure
This feature is implemented across the following files:
- **Controller**: `controllers/user.controller.js` contains the business logic for each CRUD operation.
- **Routes**: `routes/user.routes.js` defines the API endpoints and maps them to the controller functions.
- **Model**: `models/user.js` (see `ARCH-data-user`).

## Behavior
The API provides standard RESTful endpoints for user management.

**Endpoints:**
- `POST /users`: Creates a new user.
- `GET /users`: Retrieves a list of all users.
- `GET /users/:id`: Retrieves a single user by their ID.
- `PUT /users/:id`: Updates a user's details by their ID.
- `DELETE /users/:id`: Deletes a user by their ID.

Currently, these endpoints are not protected by authentication/authorization middleware, which is a security risk that needs to be addressed.

## Evolution
### Planned
- Add role-based access control (RBAC) middleware to ensure only users with the 'admin' role can access these endpoints.
- Implement pagination and searching for the `GET /users` endpoint.
- Add more robust validation for user creation and updates.
