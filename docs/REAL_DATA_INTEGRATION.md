# Integrating Real-Time Data with Firebase

This document outlines the steps to transition the DigiCondo application from using mock/placeholder data to interacting with a real-time Firebase backend (Firestore, Authentication, Storage).

**Prerequisites:**

1.  **Firebase Project:** You need a Firebase project set up. ([console.firebase.google.com](https://console.firebase.google.com/))
2.  **Firebase CLI:** Install the Firebase CLI (`npm install -g firebase-tools`) and log in (`firebase login`).
3.  **Environment Variables:** Securely store your Firebase project configuration keys (apiKey, authDomain, etc.) in environment variables (e.g., `.env.local`).

**Steps:**

1.  **Enable Firebase Services:**
    *   **Authentication:** Enable the required sign-in methods (Email/Password, potentially others if needed).
    *   **Firestore:** Create a Firestore database. Start in **test mode** for initial development (allows open read/write) or configure **security rules** immediately for production.
    *   **Storage:** Enable Cloud Storage for Firebase to handle file uploads (profile pictures, occurrence photos, document uploads, delivery photos). Configure **storage security rules**.

2.  **Configure Firebase in Next.js:**
    *   Create a Firebase configuration file (e.g., `src/lib/firebase/config.ts`) to initialize the Firebase app using your environment variables.
    *   Export the initialized Firebase app, Auth instance, Firestore instance, and Storage instance.

    ```typescript
    // src/lib/firebase/config.ts
    import { initializeApp, getApps, getApp } from 'firebase/app';
    import { getAuth } from 'firebase/auth';
    import { getFirestore } from 'firebase/firestore';
    import { getStorage } from 'firebase/storage';

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
    };

    // Initialize Firebase
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    export { app, auth, db, storage };
    ```

3.  **Refactor Authentication (`src/app/login/page.tsx`):**
    *   Replace the simulated login logic (`handleLogin`) with Firebase Authentication calls:
        *   Use `signInWithEmailAndPassword` (adjust based on login identifier - CPF might require a lookup first to get the email).
        *   Handle different roles (Resident, Sindico, Admin) potentially by:
            *   Having separate login forms/logic.
            *   Storing user roles in Firestore or Custom Claims within Firebase Auth. Redirect based on the fetched role after successful login.
    *   Implement registration (`handleRegister`) using `createUserWithEmailAndPassword`. Store additional user details (CPF, Name, Role, initial condo assignment) in a Firestore `users` collection, linking by the `uid` from Auth.
    *   Implement password reset functionality using `sendPasswordResetEmail`.
    *   Manage user authentication state using Firebase Auth listeners (`onAuthStateChanged`) or a context/provider.

4.  **Refactor Data Fetching and Mutations (Services & Pages):**
    *   **Firestore Collections:** Define your Firestore data structures (collections and documents). Examples:
        *   `condominiums`: Stores condo details (CNPJ, address, etc.).
        *   `users`: Stores user profiles (name, CPF, email, role, associated condo ID, `authUid`).
        *   `residents`: (Alternative to users, or linked) Stores resident-specific info (block, apartment, status).
        *   `announcements`: Stores announcements, potentially with condo ID targets.
        *   `occurrences`: Stores complaints/suggestions/praises with resident ID, condo ID, status.
        *   `tickets`: Stores support tickets linked to occurrences or direct requests.
        *   `messages`: Subcollection within `tickets` for conversation history.
        *   `reservations`: Stores booking details with user ID, date, status, payment info.
        *   `deliveries`: Stores delivery records with resident ID, condo ID, status.
        *   `vehicles`, `pets`, `visitors`: Linked to residents.
        *   `councilMembers`, `employees`: Linked to condominiums.
    *   **Update Service Files:** Modify functions in `src/services/*.ts` (like `database.ts` placeholders, `pix.ts`, `boleto.ts`, `notifications.ts`) to interact with Firestore for data operations (`getDoc`, `addDoc`, `updateDoc`, `query`, `where`, etc.) and Firebase Storage for file uploads (`uploadBytes`, `getDownloadURL`). **Crucially, database writes/sensitive reads must happen server-side (e.g., in Server Actions or API routes), not directly from client components.**
    *   **Update Pages:** Modify page components (`*.tsx`) to:
        *   Fetch data using server components, Server Actions, or client-side fetching libraries (like React Query or SWR) that call your backend API routes/Server Actions.
        *   Use Firestore real-time listeners (`onSnapshot`) where appropriate for live updates (e.g., announcements feed, ticket messages).
        *   Trigger mutations (add, update, delete) via Server Actions or API routes that perform the secure Firestore/Storage operations.

5.  **Implement File Uploads (Storage):**
    *   In components allowing uploads (profile picture, occurrence photo, documents, delivery photo), use the Firebase Storage SDK.
    *   Generate unique file names.
    *   Use `uploadBytes` or `uploadString` to upload the file.
    *   Get the `downloadURL` after upload and store this URL in the corresponding Firestore document (e.g., in the `users` document for profile pictures, `occurrences` for issue photos).
    *   **Security:** Ensure Storage Security Rules only allow authenticated users to upload to appropriate paths and restrict read access as needed. Perform backend validation (`src/services/image-validation.ts` logic) before accepting uploads.

6.  **Implement Notifications (FCM & Email):**
    *   **Firebase Cloud Messaging (FCM):**
        *   Set up FCM in your Firebase project.
        *   Request notification permission from users on the client-side.
        *   Get the device registration token (FCM token) and store it securely, linked to the user (e.g., in their Firestore document).
        *   Modify `src/services/push.ts` and `src/services/notifications.ts` to use the Firebase Admin SDK (server-side) or a secure API route to send push messages via FCM to specific tokens based on application logic (e.g., new announcement, delivery arrival).
    *   **Email:**
        *   Choose an email sending service (e.g., SendGrid, Mailgun, Firebase Trigger Email extension).
        *   Modify `src/services/email.ts` and `src/services/notifications.ts` to trigger emails via the chosen service's API (called from your backend/Server Actions).

7.  **Security Rules:**
    *   **Firestore:** Define robust security rules to control read/write access to your collections based on user authentication (`request.auth.uid`), roles (custom claims or Firestore data), and data ownership. Start restrictive and grant access as needed.
    *   **Storage:** Define security rules to control file uploads and downloads based on authentication, path structure (e.g., `/users/{userId}/profile.jpg`), and potentially file metadata (size, content type).

8.  **Testing:**
    *   Thoroughly test all features with real Firebase interactions.
    *   Test authentication flows for all roles.
    *   Test data fetching, creation, updates, and deletion.
    *   Test file uploads and downloads.
    *   Test notification triggers.
    *   Test security rules using the Firebase console simulators and unit/integration tests.

This is a high-level overview. Each step involves detailed implementation specific to Firebase SDKs and your application's logic. Remember to prioritize security throughout the process, especially regarding database access and file uploads.
