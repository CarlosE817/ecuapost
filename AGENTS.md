# EcuaPost Agent Guidelines

Welcome, fellow agent! This document provides guidelines and context for working on the EcuaPost codebase.

## 1. Project Overview

EcuaPost is a minimalist Twitter-like social network built with React, TypeScript, Vite, TailwindCSS, and Firebase. Key features include user authentication (Google, Facebook, Phone, Email), tweet creation (with image uploads to Firebase Storage), likes, bookmarks, and a responsive UI.

## 2. Architecture & State Management

The application recently underwent a refactoring to centralize state management and improve code organization.

*   **React Context (`AppContext.tsx`)**:
    *   A primary global context (`AppContext`) is used to manage application-wide state and actions.
    *   This context provides information about the authenticated user, all tweets, bookmarked tweet IDs, and functions to interact with these (e.g., posting new tweets, liking, bookmarking).
    *   Components should consume `useAppContext()` to access this shared state and actions, reducing prop drilling.
*   **Custom Hooks**:
    *   `src/hooks/useAuth.ts`: Manages Firebase Authentication logic, user session state, and provides sign-in/sign-out methods. It exposes `user`, `loading`, and `error` states.
    *   `src/hooks/useTweets.ts`: Manages all operations related to tweets.
        *   Handles CRUD operations (Create, Read from localStorage, Update for like/retweet/edit, Delete).
        *   Integrates with **Firebase Storage** for image uploads: when a new tweet with images is created, images are uploaded to Firebase Storage, and their download URLs are stored within the tweet data in `localStorage`.
        *   Manages the local state of all tweets.
    *   `src/hooks/useBookmarks.ts`: Manages bookmarking functionality, storing bookmarked tweet IDs in `localStorage`.
*   **Data Persistence**:
    *   Tweet content (text, user info, image URLs, metadata like likes/retweets) and bookmark IDs are persisted in `localStorage`.
    *   Uploaded images themselves are stored in **Firebase Storage**.

## 3. Firebase Integration

*   **Authentication**: Managed by `firebase/auth` and abstracted via `useAuth.ts`. Configuration is in `src/config/firebase.ts`.
*   **Storage**: Used for storing uploaded images.
    *   Configuration is in `src/config/firebase.ts` (storage instance initialized).
    *   Image upload logic is within `useTweets.ts`.
    *   **Important**: Ensure Firebase Storage rules are correctly set up in the Firebase console to allow writes for authenticated users (typically to a path like `tweet_images/{userId}/{imageName}`) and public reads for images. Example rules are provided in `README.md`.

## 4. Key Components & Structure

*   `src/main.tsx`: Entry point, wraps `App` with `AppProvider` and `ThemeProvider`.
*   `src/App.tsx`: Main application component (`AppContent`), handles routing logic (which view to display based on `activeTab` from `AppContext`) and renders global components like `AuthModal` and `Toast`.
*   `src/components/`: Contains all UI components.
    *   `Sidebar.tsx`: Navigation, uses `AppContext` for active tab and user state.
    *   `Timeline.tsx`: Displays the main feed of tweets, uses `AppContext`.
    *   `TweetCard.tsx`: Renders individual tweets, uses `AppContext` for interactions and user data.
    *   `ComposeBox.tsx`: For creating new tweets, uses `AppContext` for `handleNewTweet` and user data.
    *   `AuthModal.tsx`: Handles all authentication flows, uses `useAuth` hook.
*   `src/contexts/`: Contains React context definitions (`AppContext.tsx`, `ThemeContext.tsx`).
*   `src/hooks/`: Contains custom hooks for business logic and state.
*   `src/types/`: TypeScript type definitions.
*   `src/data/`: Mock data (used for initial state if localStorage is empty).

## 5. Development Guidelines

*   **State Management**: Prefer using `AppContext` for global state. For local component state, use `useState` or `useReducer`.
*   **Styling**: TailwindCSS is used. Strive for consistent use of utility classes.
*   **Linting & Formatting**: ESLint is configured (`eslint.config.js`). Run `npm run lint` to check for issues. Consistent formatting is encouraged (consider integrating Prettier if not already done by the user).
*   **Accessibility (a11y)**: Make a best effort to follow accessibility best practices. Use semantic HTML, provide `alt` text for images, ensure keyboard navigability, and use ARIA attributes where appropriate (e.g., for icon buttons, modals).
*   **Comments**: Add comments to explain complex logic or non-obvious code sections.

## 6. Running the Application

```bash
npm install
# (Ensure Firebase config in src/config/firebase.ts is correctly set up)
npm run dev
```

## 7. Testing

*   The project is set up with Vitest. Test files are typically located in `__tests__` subdirectories within the component/hook's folder (e.g., `src/hooks/__tests__/useTweets.test.ts`).
*   Run tests using:
    ```bash
    npm test
    ```
    or specifically:
    ```bash
    npx vitest <path_to_test_file>
    ```
*   The test setup file is `src/setupTests.ts`, which includes mocks for `localStorage` and Firebase services.
*   **Note**: There have been some difficulties running Vitest consistently in certain sandboxed CI/agent environments. If tests fail to run or time out, try executing them in a local development environment first.

## 8. Handling Image Uploads

*   Images are uploaded to Firebase Storage in the `handleNewTweet` function within `useTweets.ts`.
*   A unique path (including user ID and a UUID for the image) is generated for each image.
*   The public `downloadURL` obtained from Firebase Storage is then stored in the `images` array of the `Tweet` object, which is persisted to `localStorage`.
*   `TweetCard.tsx` renders images using these URLs.

Remember to always check the `README.md` for user-facing setup and feature information. Good luck!
