# FairRoom

> Role-based room booking system designed around fair access, booking conflict prevention, and enforceable strike-based restrictions.

## Project Metadata
- Type: system
- Domain: web application, booking systems, operational policy enforcement
- Status: in progress
- Level: intermediate
- Year: 2026
- Featured: no
- Repository URL: https://github.com/Freeman-md/FairRoom
- Live URL: https://fortunate-recreation-production.up.railway.app
- Thumbnail URL: Not public

## Summary

FairRoom is a web-based room booking system for a student and admin environment. It supports room discovery, booking creation and management, account visibility, and administrative oversight across bookings, strikes, rooms, amenities, and analytics. The project is not defined only by its screens or CRUD endpoints. Its core identity is a policy-aware operating model: fair access, double-booking prevention, and visible enforcement through a three-strike restriction rule.

The repository and the FairRoom Notion hub show that the project was developed through explicit scope alignment, architecture decision records, a canonical API contract, workflow modelling, and traceability from stories to implementation. That makes `system` the best classification. The boundaries, rules, orchestration between student and admin flows, and the operating model matter more than the individual UI forms.

## Tech Stack

- React
- Vite
- TypeScript
- React Router
- React Hook Form
- Zod
- Vitest
- Rust
- Axum
- SeaORM
- PostgreSQL
- JWT authentication
- Docker
- GitHub Actions
- Railway

## System Context

FairRoom exists to solve more than room reservation. The underlying problem is fair access to shared rooms when misuse, late cancellation, no-shows, and booking conflicts create operational friction. The Notion scope document defines the system as a room booking platform where users search rooms, create bookings, view their own bookings, and become restricted when strike rules are triggered. The same planning material makes the three-strike rule a core business rule rather than an optional add-on.

The Notion hub also shows that FairRoom was framed with explicit scope boundaries, gate-based delivery checkpoints, locked technology decisions, a canonical API contract, and report traceability expectations. That planning process is part of the system itself because it defines what the code is supposed to enforce.

## System Snapshot
### Core System Idea
FairRoom combines a conventional booking flow with explicit policy enforcement, derived account standing, and role-based administrative control so that room access stays visible, constrained, and auditable.

### Main Components
1. Student-facing room discovery and booking flows allow users to search available rooms, inspect room details, confirm bookings, review their own bookings, and view account standing through the React frontend.
2. Account-state logic derives booking eligibility from active strike counts, exposing whether a user is in a good, warned, or restricted state before booking creation is allowed.
3. Booking management enforces conflict prevention, ownership checks, deadline-sensitive modification and cancellation rules, and booking status transitions such as `active`, `cancelled`, `completed`, and `no_show`.
4. Admin operations provide booking oversight, user lookup, strike creation and revocation, room and amenity management, and room-usage analytics through dedicated admin routes and screens.
5. The backend uses Rust, Axum, SeaORM, and PostgreSQL to implement a REST API with JWT-based authentication, role claims, and relational entities such as users, rooms, bookings, strikes, reminders, and amenities.
6. The planning and delivery layer is formalized through the FairRoom Notion hub, which contains scope alignment, ADRs, workflow and UI references, a canonical API contract, and a traceability-oriented delivery structure that governs how the codebase evolves.

## Design Focus

- Fairness and policy enforcement as first-class system rules
- Clear separation between student and admin responsibilities
- Contract-first backend design through a canonical REST API definition
- Explicit scope boundaries and gate-based delivery discipline
- Traceability from requirements and workflows into UI, architecture, and implementation

## Architectural Innovation

The strongest architectural move in FairRoom is that policy is not hidden inside ad hoc UI checks. The Notion API contract defines account-state derivation, strike thresholds, booking eligibility rules, canonical statuses, and admin-only operations as system-level behaviour. The generated OpenAPI file is treated as an implementation artifact derived from the planning contract, not the other way around.

That makes the system more than a standard full-stack booking app. It is organized around a governed boundary: student flows for search and booking, admin flows for enforcement and oversight, and a shared contract that stabilizes role names, booking statuses, reminder statuses, room status values, and endpoint responsibilities.

## Implementation Model

The frontend is a React, Vite, and TypeScript application. Its route structure shows separate student and admin experiences, including login, registration, search, room details, booking confirmation, bookings, account status, and admin pages for bookings, inventory, strikes, and analytics.

The backend is a Rust and Axum application with SeaORM and PostgreSQL. The package manifest and planning materials align around a REST API with JWT bearer authentication and role claims. The live README and OpenAPI contract show the implemented surface area across authentication, user account views, rooms, bookings, admin booking oversight, strike management, room management, amenities, and room-usage analytics.

The contract layer is especially important in this repository. The Notion hub marks the API contract as canonical, and the repository contains `contracts/fairroom.openapi.yaml` as the generated implementation artifact. That file stabilizes the system’s request and response shapes, status enums, error classes, and endpoint map.

## Performance / Operational Profile
### Latency Profile
- Title: Request-response web system with contract-governed API boundaries
- Description: FairRoom operates as a conventional frontend-to-backend web system rather than a batch pipeline. Its operational profile is shaped by authenticated REST requests, backend validation, relational persistence, and derived account-state checks before sensitive actions like booking creation or strike management proceed.

### System Focus
- Title: Booking integrity and policy-aware control
- Description: The main concern is not raw throughput but correctness of booking state, fairness enforcement, and role-based control. Conflict prevention, strike thresholds, eligibility rules, and canonical status handling are central to the system’s behaviour.

## Outcomes

The available evidence shows that FairRoom has moved beyond planning into a working full-stack implementation with deployed frontend and backend URLs, student and admin route coverage, a Rust backend, a React frontend, and a committed OpenAPI contract. The Notion hub also shows completed planning artifacts such as scope alignment, ADRs, API contract work, sprint coordination, and report evidence mapping.

Just as important, the project establishes a disciplined delivery trail. Scope, terminology, endpoint behaviour, and entity boundaries are written down before being treated as implementation truth. That makes the system easier to reason about, test, and explain.

## Why This Matters

FairRoom matters because it demonstrates system thinking rather than just page building. The valuable part is not that it can create and list bookings. The valuable part is that booking access is governed by explicit rules, admin actions are bounded by role-specific surfaces, and the repository is backed by a planning hub that defines what the system is allowed to become.

That combination of scope control, contract-first thinking, policy enforcement, and implementation alignment is exactly what separates a serious system from a stitched-together CRUD demo.

## Future Improvements

- Complete and document end-to-end requirement traceability from user stories to tests and demo evidence
- Strengthen automated validation across frontend, backend, and contract compatibility
- Expand reminder delivery implementation beyond contract definition where still incomplete
- Add clearer documentation of deployment topology across frontend, backend, and database services
- Tighten evidence of analytics, strike workflows, and admin governance in the root repository docs
