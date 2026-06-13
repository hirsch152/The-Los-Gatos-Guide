/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseAppletConfig from '../firebase-applet-config.json';

const FIREBASE_PROJECT_ID = "studio-3040251133-2d8cd";

const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "",
  authDomain: firebaseAppletConfig.authDomain || `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: firebaseAppletConfig.storageBucket || `${FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "",
  appId: firebaseAppletConfig.appId || "",
  measurementId: firebaseAppletConfig.measurementId || ""
};

const app = initializeApp(firebaseConfig);

// The Los Gatos Guide uses the default Firestore database: (default).
export const db = getFirestore(app);

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
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
