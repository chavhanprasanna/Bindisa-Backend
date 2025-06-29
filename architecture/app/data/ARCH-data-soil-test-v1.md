---
id: ARCH-data-soil-test
title: "Data Model: Soil Test"
type: data_model
layer: data_model
owner: @backend-team
version: v1
status: current
created: 2025-06-29
updated: 2025-06-29
tags: [soil-test, data_model, mongodb]
depends_on: [ARCH-data-user]
referenced_by: []
---
## Context
This document defines the data schema for a soil test record. Each record is associated with a specific user and contains the results of a soil analysis. This is a core data model for providing agricultural recommendations.

## Structure
The schema is defined in `models/soil_test.js` using Mongoose.

**Key Fields:**
- `user_id`: (ObjectId, ref: 'User') A mandatory reference to the user who submitted the test.
- `ph`: (Number) The pH level of the soil.
- `nitrogen`: (Number) The nitrogen content.
- `phosphorus`: (Number) The phosphorus content.
- `potassium`: (Number) The potassium content.
- `moisture`: (Number) The moisture level.
- `ec`: (Number) The electrical conductivity.
- `test_time`: (Date) The timestamp when the test was conducted.
- `location`: (String) A user-defined location for the test (e.g., "Field A").

## Behavior
This model is used by the Soil Test feature to create, retrieve, update, and delete soil test records. The `user_id` field creates a direct relationship, allowing for queries that fetch all tests for a specific user.

The data from these records is intended to be the input for future features like AI-based crop and fertilizer recommendations.

## Evolution
### Planned
- Add validation to ensure nutrient values are within a realistic range.
- Consider adding a GeoJSON field for more precise location tracking.
