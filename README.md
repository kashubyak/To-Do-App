# To-Do App (Next.js & Firebase)

This is a web application for task management developed as a test assignment. It allows users to create and organize task lists, manage individual tasks, and collaborate with other users by assigning roles.

The application is built with a clean, decoupled architecture, separating business logic (services), presentation logic (hooks), and UI (components).

---

## ✨ Key Features

- **User Authentication:**

  - User registration (Name, Email, Password).
  - User sign-in.
  - Persistent login state managed by Firebase Authentication.

- **List Management (CRUD):**

  - Create new to-do lists.
  - Edit existing list names.
  - Delete lists (only by Admins).

- **Task Management (CRUD):**

  - Create new tasks with a title and description within a list.
  - Edit existing tasks (title and description).
  - Delete tasks.
  - Toggle tasks as complete/incomplete.

- **Collaborative Roles & Permissions:**
  - **Add Members:** Add other registered users to a list by their email address.
  - **Admin Role:** Full CRUD control over the list and its tasks. Can add/remove other members.
  - **Viewer Role:** Can view all tasks and _only_ toggle their completion status.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** MUI (Material-UI) & Emotion
- **Backend & DB:** Firebase (Authentication & Firestore)
- **Form Management:** `react-hook-form`
- **Styling:** Tailwind CSS (for base layout and theming)

---

## 🏁 Getting Started

Follow these instructions to get the project running on your local machine.

### 1. Prerequisites

- Node.js (v18.0 or later recommended)
- `npm` or `yarn`

### 2. Clone the Repository

```bash
git clone [https://github.com/kashubyak/To-Do-App.git](https://github.com/kashubyak/To-Do-App.git)
cd To-Do-App
```

### 3\. Install Dependencies

```bash
npm install
```

### 4\. Set up Firebase

This project requires a Firebase project to handle authentication and the database.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the steps.
3.  Once your project is created, click the **Web icon (`</>`)** to "Add an app to get started".
4.  Register your app. Firebase will provide you with a `firebaseConfig` object. **Copy this object.**
5.  In the Firebase Console, go to the **Authentication** tab (left sidebar).
    - Click "Get started".
    - Select **"Email/Password"** and **Enable** it.
6.  Go to the **Firestore Database** tab.
    - Click **"Create database"**.
    - Start in **Test Mode**. (This allows the app to read/write without complex security rules).
    - Choose a region.

### 5\. Set Environment Variables

1.  In the root of your project, create a new file named `.env.local`.

2.  Paste your `firebaseConfig` keys into this file, adding the `NEXT_PUBLIC_` prefix to each key. See `.env.example` for the required fields.

    **.env.local:**

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...
    ```

**Important:** The "Add Member" feature works by looking up users by their email in the `users` collection. This collection is automatically populated when a new user registers (see `src/services/auth.service.ts`).

### 6\. Run the Application

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

---

## 📂 Project Structure

The application follows a clean architecture to separate concerns:

- `src/app/`: Contains page "containers" (e.g., `login/page.tsx`). These are minimal files that connect hooks to UI components.
- `src/components/`: "Dumb" UI components that receive props and display UI (e.g., `RegisterForm.tsx`, `TaskList.tsx`).
- `src/hooks/`: Custom hooks that contain all presentation logic and state management for a page (e.g., `useLogin.ts`, `useListPage.ts`).
- `src/services/`: All business logic and direct API calls to Firebase (e.g., `auth.service.ts`, `todo.service.ts`).
- `src/types/`: Contains all TypeScript interfaces and types for the application.
- `src/lib/`: Firebase SDK initialization (`firebase.ts`).
- `src/utils/`: Helper functions (e.g., `email.utils.ts` for encoding Firestore keys).

```

```
