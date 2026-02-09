'use client';

import React, { useMemo, useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const firebaseServices = useMemo(() => {
    // Only initialize if we are in the browser
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  // Automatically sign in anonymously on mount to ensure a valid auth context
  // for Firestore rules, even in a public-access prototype.
  useEffect(() => {
    if (isMounted && firebaseServices?.auth) {
      // We check if there's already a user before initiating
      const unsubscribe = firebaseServices.auth.onAuthStateChanged((user) => {
        if (!user) {
          initiateAnonymousSignIn(firebaseServices.auth);
        }
      });
      return () => unsubscribe();
    }
  }, [isMounted, firebaseServices]);

  // Avoid rendering the provider during SSR to prevent hydration mismatches
  // and server-side Firebase initialization errors.
  if (!isMounted || !firebaseServices) {
    return <>{children}</>;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}