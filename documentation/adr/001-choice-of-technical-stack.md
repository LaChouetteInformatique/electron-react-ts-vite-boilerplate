# **ADR-001: Choice of the Main Technical Stack**

- **Date:** 2025-11-08
- **Status:** Accepted

## **Context**

This project has fundamental requirements that guide the technology choices:

1.  **Offline Operation:** Confidentiality is paramount. The application must run as a standalone desktop program, never sending user data over the internet.
2.  **Cross-Platform Distribution:** The application must be easily distributable and installable on major operating systems (Windows, macOS, Linux).
3.  **Rich User Interface:** The concept of a "sandbox" based on a graph of entities, with complex interactions (drag-and-drop, contextual modals, data visualizations), requires a modern and high-performance front-end technology.
4.  **Reliability and Maintainability:** The core of the project is its calculation logic and data structure. The stack must ensure robustness, type safety, and the long-term persistence of user data.
5.  **Development Efficiency:** The tooling must allow for a rapid development cycle, with near-instant hot reloading and simple configuration of aliases and paths.

## **Decision**

The following technical stack was chosen to meet these requirements, forming a coherent ecosystem where each component has a specific role:

1.  **Application Framework: Electron**

    - To create a cross-platform desktop application using web technologies. It directly addresses the needs for offline operation and distribution.

2.  **User Interface (Frontend): React + TypeScript**

    - **React** is chosen for its component-based model, which is ideal for building a complex and modular UI.
    - **TypeScript** is mandated for its robustness, maintainability, and error prevention capabilities. It allows for building a safe codebase, especially for a project with complex business logic.

3.  **Main Process (Backend): Node.js (via Electron)**

    - Electron's Main process, running on Node.js, is used for all non-display logic: tax and social security calculations, application lifecycle management, and, most importantly, secure access to the file system for saving and loading sessions.

4.  **Build Tooling: Vite**

    - Vite is preferred over other solutions (like Webpack via Create React App) for its exceptional development speed (near-instant HMR) and modern configuration.

5.  **Styling: TailwindCSS + ShadCN/UI**

    - **TailwindCSS** is used for rapid and consistent styling via utility classes.
    - **ShadCN/UI** is chosen as a library of un-styled components. This provides accessible and functional components (modals, buttons, etc.) while leaving full control over their appearance via Tailwind, enabling the creation of a modern and custom interface.

6.  **Data Validation: Zod**
    - Zod is a central architectural choice. It is not just used for validation but as the **single source of truth** for all data schemas. TypeScript types are inferred from Zod, ensuring perfect synchronization between data structures, their validation, and their use in the code. It is the cornerstone of user save file persistence.

## **Consequences**

- **Positive Consequences:**

  - **Unified Ecosystem:** The entire project is developed in TypeScript/JavaScript, for the front-end, back-end, and build processes, simplifying the required skill set.
  - **High Development Velocity:** The combination of Vite + React + TailwindCSS allows for very rapid development and iteration on the user interface.
  - **"Bulletproof" Robustness:** The use of TypeScript and, especially, a "schema-first" approach with Zod makes the application extremely resilient to invalid or corrupt data—an essential point for save file persistence.
  - **Modern User Experience:** The stack enables the construction of an application that is aesthetic, high-performing, and enjoyable to use.
  - **Maximum Portability:** The choice of Electron ensures that the simulator can reach the widest possible audience, regardless of their OS.

- **Negative Consequences or Trade-offs:**
  - **Application Size:** Electron applications bundle a version of Chromium, making them inherently larger (in terms of disk space) than native applications. This is the accepted trade-off for portability and ease of development.
  - **Memory Consumption:** Similarly, RAM usage may be higher than that of an equivalent native application. For a simulator with occasional use and non-intensive continuous calculations, this trade-off is considered entirely acceptable.
  - **Build Chain Complexity:** The interaction between Vite (for the front-end) and the TypeScript transpilation process for the Electron backend (`tsc`) adds slight complexity to the build configuration compared to a standard web application (visible in the `package.json` scripts).
