# ADR-002: Data Persistence Strategy (Local JSON Files)

- **Date:** 2025-11-08
- **Status:** Accepted

## Context

The application must guarantee absolute confidentiality and 100% offline functionality. It is therefore necessary to choose a storage strategy for user data (current work session, named saves, preferences) that is simple, robust, and local to the user's machine.

The data to be stored, although structured as a graph (entities, relationships, flows), does not represent a very large volume and does not require complex querying capabilities.

## Decision

We have decided to use **JSON files** stored directly in the user data directory managed by Electron (`app.getPath('userData')`). This approach is implemented via three distinct files:

1.  `sessionState.json`: For automatic saving and restoration of the current work session.
2.  `simulationSlots.json`: To store the list of named saves ("slots") created by the user.
3.  `userPreferences.json`: For settings not tied to a specific simulation, such as the sort order of saves or custom flow colors.

Reading and writing these files are handled by Electron's Main process via the Node.js `fs` module, exposed securely to the frontend via the IPC API.

## Consequences

- **Positive Consequences:**

  - **Extreme Simplicity:** Requires no external dependencies (like a database engine). The logic is limited to reading/writing files, which is trivial to implement and maintain.
  - **Transparency and Portability:** JSON files are human-readable, which greatly simplifies debugging. The user can also easily back up their data directory manually if they wish.
  - **Lightweight:** Adds no weight to the final application, unlike integrating a database like SQLite.
  - **Sufficient Performance:** For the size of the simulations envisioned, loading and writing the entire JSON file into memory is a near-instantaneous and perfectly acceptable operation.

- **Negative Consequences or Trade-offs:**
  - **Not Suitable for Large Datasets:** This strategy is not performant for datasets of several megabytes, as the entire file is read/written each time. This use case is considered out of scope for this project.
  - **No Atomic Transactions:** A write error (e.g., full disk) could potentially corrupt a file. This risk is low and is mitigated by the resilience of the `data-sanitizer`, which can recover a partially corrupted file.
  - **No Complex Queries:** It is impossible to perform queries on the data without first loading the entire file into memory.
