# ADR-005: Data Persistence via On-the-Fly Sanitization

- **Date:** 2025-11-08
- **Status:** Accepted

## Context

A fundamental principle of the project is the longevity of user data. The format of save files is expected to evolve with new application versions (adding new fields, modifying structures). It is crucial that the application can open files created by older versions without crashing or corrupting the data. The application must be resilient to potentially outdated, incomplete, or corrupted data.

## Decision

We have adopted a **validate-and-repair-on-read strategy** for all external data (session loading, file import). This strategy is built on two pillars:

1.  **Zod as a Single Source of Truth:** The Zod library is used to define strict schemas for all our data structures (`SessionState`, `Entity`, etc.). These schemas are considered the canonical definition of what the data _must_ look like in the current version of the application.
2.  **A "Sanitization" Module (`data-sanitizer.ts`):** All incoming data is systematically passed through this module. It uses Zod's `Schema.safeParse()` to validate the structure.
    - Missing fields in an old save file are automatically added thanks to the `.default()` values defined in the Zod schemas.
    - Data that does not match the expected type is discarded by Zod.
    - An additional semantic validation pass cleans up logical inconsistencies (e.g., deleting relationships or flows that point to non-existent entities).
3.  **User Notification:** If significant corrections were made, a report is generated, and the user is informed via a notification or a confirmation modal, explaining what was cleaned up.

## Consequences

- **Positive Consequences:**

  - **Exceptional Robustness:** The application will never crash due to a malformed or outdated save file. It "self-heals".
  - **Worry-Free Scalability:** Developers can evolve data schemas with confidence. Simply adding default values to new fields ensures backward compatibility.
  - **Simplified Maintenance:** Eliminates the need to create complex and brittle migration scripts for each version change.
  - **Data Reliability:** Guarantees that the in-memory application state is always healthy and conforms to the current schemas.

- **Negative Consequences or Trade-offs:**
  - **Controlled Data Loss:** In extreme cases where data is completely unrecognizable or if a feature is removed, the corresponding data will be lost (deleted) during the cleanup. This is a deliberate choice that prioritizes application stability over the preservation of invalid data.
  - **Tight Coupling with Zod:** The data persistence architecture is intrinsically linked to the Zod library. Changing the validation library would require a significant rewrite of this logic.
