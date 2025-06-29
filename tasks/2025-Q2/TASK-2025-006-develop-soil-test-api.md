---
id: TASK-2025-006
title: "Develop Soil Test API"
status: done
priority: high
type: feature
estimate: 12h
assignee: @backend-team
created: 2025-06-29
updated: 2025-06-29
parents: [TASK-2025-002]
children: []
arch_refs: [ARCH-feature-soil-test, ARCH-data-soil-test]
audit_log:
  - {date: 2025-06-29, user: "@AI-DocArchitect", action: "created with status done"}
---
## Description
A core feature API for managing soil test records was developed. This allows authenticated users to manage their own soil analysis data.

## Acceptance Criteria
- All endpoints are protected and require a valid JWT.
- `POST /soil-tests`: An authenticated user can create a new soil test record.
- `GET /soil-tests`: An authenticated user can retrieve a list of all their previous soil tests.
- `GET /soil-tests/latest`: An authenticated user can retrieve their single most recent soil test.
- `DELETE /soil-tests/:testId`: An authenticated user can delete one of their soil tests.

## Definition of Done
- All endpoints are implemented in `soil_test.controller.js` and `soil_test.routes.js`.
- All endpoints are protected by `auth.middleware.js`.
- API functionality is verified via Postman tests.
- Documentation is updated to reflect the new feature.
