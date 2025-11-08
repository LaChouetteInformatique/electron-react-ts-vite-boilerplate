# ADR-004: Client-Side State Management (Custom Hook)

- **Date:** 2025-11-08
- **Status:** Accepted

## Context

A complex React application like this simulator requires a clear state management strategy. The project's specific needs include:

1.  The ability to undo and redo actions.
2.  An auto-save mechanism that does not trigger on every state change (for performance reasons) but rather after a short period of inactivity (debouncing).

## Decision

Rather than integrating an external state management library (like Redux, Zustand, etc.), the decision was made to develop a **custom React hook, `useSessionManager`**.

This hook centralizes all session state logic and implements the required features in a tailor-made fashion:

1.  **History for Undo/Redo:** The hook maintains an internal state `{ past: [], present: SessionState, future: [] }`. Every user-driven state modification pushes the previous state into `past` and clears `future`. The `undo` and `redo` functions simply navigate this history.
2.  **Debounced Saving:** To prevent auto-save from triggering on an `undo` or `redo`, the hook manages a separate state, `sessionForSaving`. This state is updated only during direct user actions. It is this state that is watched by the `useDebouncedSave` hook to trigger the write to disk.

## Consequences

- **Positive Consequences:**

  - **Zero External Dependencies:** The application remains lightweight and is not tied to the ecosystem or future developments of a third-party library.
  - **Targeted Solution:** The code is minimalist and does exactly what the project needs, without any superfluous complexity.
  - **Full Control:** The logic is entirely under our control, easy to understand in the project's context, and simple to modify if new specific needs emerge.

- **Negative Consequences or Trade-offs:**
  - **Lack of Advanced Debugging Tools:** We forego specialized tools like Redux DevTools, which allow for time-travel debugging and state inspection. Debugging is done with standard React tools.
  - **Re-implementation of a Known Pattern:** The history logic is a problem already solved by many libraries. We are re-implementing it here, which is a conscious choice in favor of simplicity and autonomy.
  - **Less Suited for Very High Complexity:** If the application's state were to grow exponentially with many complex asynchronous logics, this solution might become harder to maintain than a structured library.
