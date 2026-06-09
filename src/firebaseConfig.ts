/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseAppletConfig from '../firebase-applet-config.json';

// Use credentials from the AI Studio environment config, falling back to custom editable placeholders
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "YOUR_API_KEY",
  authDomain: firebaseAppletConfig.authDomain || "YOUR_AUTH_DOMAIN",
  projectId: firebaseAppletConfig.projectId || "YOUR_PROJECT_ID",
  storageBucket: firebaseAppletConfig.storageBucket || "YOUR_STORAGE_BUCKET",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "YOUR_MESSAGING_SENDER_ID",
  appId: firebaseAppletConfig.appId || "YOUR_APP_ID",
  measurementId: firebaseAppletConfig.measurementId || ""
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore (handling custom database ID configured by AI Studio if available)
export const db = firebaseAppletConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseAppletConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Compliant Operation Types enum for the error logging protocol
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

/**
 * Standard security-compliant exception handler that records and formats 
 * access-denied or error information as required by the Firebase Security standard.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
