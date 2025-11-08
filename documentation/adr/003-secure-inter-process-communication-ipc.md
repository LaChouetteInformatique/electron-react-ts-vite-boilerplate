# ADR-003: Secure Inter-Process Communication (IPC)

- **Date:** 2025-11-08
- **Status:** Accepted

## Context

In an Electron application, there are two main processes: the "Main" process (which has access to all Node.js APIs, like the `fs` file system) and the "Renderer" process (which runs the user interface in a browser-like environment). For security reasons, it is imperative to isolate the Renderer and not give it direct access to Node.js APIs.

However, the user interface needs to trigger actions in the Main process (e.g., "save this file" or "read this file for me"). Therefore, a secure communication channel is needed between these two worlds.

## Decision

We have chosen to implement IPC using the pattern recommended by the Electron team: **`contextBridge`** along with a **`preload` script**.

1.  A `preload.cts` script is executed in a context that has access to both the Renderer's `window` object and Node.js APIs.
2.  This script uses `contextBridge.exposeInMainWorld` to expose a custom and secure API on the Renderer's `window` object (under `window.api`).
3.  This API is the sole point of contact between the frontend and the backend. It is strongly typed via a shared type (`EventPayloadMapping`) to ensure the consistency of calls.
4.  All sensitive logic (file manipulation, displaying system dialogs) resides in the Main process and is exposed only via IPC handlers (`ipcMain.handle`).

## Consequences

- **Positive Consequences:**

  - **Maximum Security:** The Renderer is sandboxed. It has absolutely no way to access dangerous Node.js modules. The attack surface is reduced to the bare minimum defined by our API.
  - **Clear API Contract:** Communication is centralized and explicitly defined. The `EventPayloadMapping` type serves as living documentation and prevents integration errors between the front-end and back-end.
  - **Maintainability:** The separation of concerns is very clear. The UI code does not care about _how_ a file is saved; it simply calls `window.api.saveCurrentSession(...)`.

- **Negative Consequences or Trade-offs:**
  - **Initial Setup Overhead:** This approach requires a slightly more verbose configuration than an insecure solution (`nodeIntegration: true`). It involves creating the `preload` script, defining the types, and configuring the `BrowserWindow`'s `webPreferences`. This is an essential upfront cost for security.
