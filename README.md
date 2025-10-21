
# Figma Clone: Real-Time Collaborative Design Tool

A web-based collaborative design application built with Next.js, Liveblocks, and Fabric.js, replicating the core real-time features of Figma.

**Live Demo:** **[https://figma-clone-quantic.vercel.app/](https://figma-clone-quantic.vercel.app/)**

![Live demo](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExczJhajZ3ZGlmandhbjVyODUzZ3FsenRhZTg1ZmJvYWd6aG90Z3RkZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zozwQtYaJAln5GzSlG/giphy.gif)

---

 ## Project Overview

This project is a clone of Figma, built from the ground up to demonstrate advanced skills in real-time web applications, state management, and modern frontend development. The primary goal was to create a functional, multiplayer design tool where users can create, edit, and interact on a shared canvas, with all changes broadcast instantly to everyone in the room.

This application is a perfect showcase of how to build complex, interactive, and stateful applications for the modern web.

---

 ## Core Features

* **Real-Time Collaboration:** Multiple users can be on the same canvas and see each other's actions live.
* **Live Cursors:** See the cursors of other users moving on the screen, complete with their name.
* **Multiplayer Comments:** Click anywhere on the canvas to drop a comment. Other users can see and reply to comments in real-time.
* **Live Emoji Reactions:** Send emoji reactions that appear dynamically on the cursors of all users.
* **Dynamic Shape Tools:** Create rectangles, circles, triangles, and lines.
* **Freeform Drawing:** A pencil tool for freehand sketching.
* **Text Tool:** Add and edit text elements directly on the canvas.
* **Element Manipulation:** Select, move, resize, and change the color and attributes of any element.
* **Undo/Redo:** Full history management for all canvas actions.
* **Shareable Workspaces:** A "Share" modal to manage access (UI implemented).

---

## Tech Stack

This project integrates a modern tech stack designed for high-performance, real-time applications.

* **Framework:** **[Next.js 14](https://nextjs.org/)** (using App Router)
* **Language:** **[TypeScript](https://www.typescriptlang.org/)**
* **Real-Time Collaboration:** **[Liveblocks](https://liveblocks.io/)**
    * **Presence:** For live cursors and user presence.
    * **Room Storage:** For syncing shapes, comments, and reactions.
    * **Comments:** Used for the built-in comment system.
* **Canvas API:** **[Fabric.js](http://fabricjs.com/)**
    * An object-oriented canvas library for creating and manipulating shapes, text, and drawings.
* **Styling:** **[Tailwind CSS](https://tailwindcss.com/)**
* **Deployment:** **[Vercel](https://vercel.com/)**

---

## Key Technical Highlights & Challenges

This section highlights the key technical implementations that make this project a strong portfolio piece.

### 1. Real-Time State Synchronization

The biggest challenge was ensuring that the canvas state is perfectly synchronized across all clients.

* **Solution:** I used **Liveblocks Room Storage**, which provides conflict-free replicated data types (CRDTs).
* **Implementation:** The entire canvas, including every shape's position, size, and color, is stored as a Liveblocks `LiveObject`. When one user modifies a shape, the change is broadcast, and all other clients re-render the canvas with the new state. This eliminates the need for a traditional backend database and REST API for canvas objects.

### 2. Live Cursors and Presence

To make the application feel truly "live," I implemented multiplayer cursors.

* **Solution:** I used **Liveblocks Presence**, which is designed for ephemeral state.
* **Implementation:** Each client broadcasts its cursor position (`onpointermove`) and selected emoji reaction to the Liveblocks room. All other clients subscribe to these presence updates and render the cursor and reactions for every other user, creating a seamless, high-performance multiplayer feel.

### 3. Fabric.js Canvas Management

Integrating a complex library like Fabric.js with React and Liveblocks required careful state management.

* **Solution:** I created a React hook (`useCanvas`) that initializes the Fabric.js canvas and subscribes to its events (e.g., `object:modified`, `object:added`).
* **Implementation:** When a user modifies an object on the canvas, a Fabric.js event is fired. This event triggers a function that updates the **Liveblocks storage**. A separate `useEffect` hook subscribes to changes in the Liveblocks storage and calls Fabric.js methods to render those changes. This creates a one-way data flow: `Fabric Event -> Update Liveblocks Storage -> Other Clients Subscribe -> Render on Fabric Canvas`.

### 4. Dynamic Commenting System

I built a commenting system that allows users to drop a pin anywhere on the canvas.

* **Solution:** I leveraged the **Liveblocks Comments** API.
* **Implementation:** When a user enters "comment mode," their click event is captured. This event creates a new comment thread tied to the cursor's `(x, y)` coordinates. The comments are rendered as an overlay on top of the main canvas, and Liveblocks handles the real-time creation and display of new comments.

---

## How To Run Locally

You can clone and run this project on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sksbkt/figma_clone.git](https://github.com/sksbkt/figma_clone.git)
    cd figma_clone
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    * You will need to create a free account at [liveblocks.io](https://liveblocks.io/) to get your API keys.
    * Create a file named `.env.local` in the root of the project.
    * Add your Liveblocks public and secret keys to this file:

    ```.env.local
    NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_YOUR_PUBLIC_KEY
    LIVEBLOCKS_SECRET_KEY=sk_dev_YOUR_SECRET_KEY
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser. Open a second browser window or tab to see the real-time collaboration in action.

---

## Contact

Created by **[Ali khoshbakht](https://github.com/sksbkt)**

* [**Portfolio** ](https://quanticmachines.netlify.app/)
* [**LinkedIn**](https://www.linkedin.com/ali-khoshbakht/)
* [**GitHub**](https://github.com/sksbkt)
