/**
 * Firebase configuration object.
 * Values are read from environment variables for production security (e.g., on Vercel),
 * falling back to provided default values for development convenience.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAE7cEN3cyLwZegS0cRou257UEnXMdvyV8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-9429347809-24af9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-9429347809-24af9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "347349276806",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:347349276806:web:3612f50f85ab17430f1907",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""
};
