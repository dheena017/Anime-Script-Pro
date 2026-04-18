
import { useState, useEffect } from 'react';

/**
 * MOCK STORAGE UTILITY
 * Replaces Firebase with LocalStorage for fully client-side persistent state.
 */

// Types
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Script {
  id: string;
  uid: string;
  prompt: string;
  script: string;
  tone: string;
  audience: string;
  episode: string;
  session: string;
  model: string;
  createdAt: any;
  updatedAt?: any;
  isFavorite?: boolean;
}

// Mock User
const GUEST_USER: User = {
  uid: 'guest-user-id',
  email: 'guest@example.com',
  displayName: 'Guest Creator',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest'
};

// Storage Keys
const STORAGE_KEYS = {
  SCRIPTS: 'anime_script_pro_scripts',
  USER: 'anime_script_pro_user'
};

// --- AUTH ---
export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : GUEST_USER; // Default to guest for now
};

export const setStoredUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// --- HOOKS ---
export const useAuthState = (_auth?: any) => {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, this might involve checking a session/cookie
    setUser(getStoredUser());
  }, []);

  return [user, loading] as const;
};

export const signInWithEmailAndPassword = async (_auth: any, email: string, _pass: string) => {
  const user: User = { uid: 'mock-id', email, displayName: email.split('@')[0], photoURL: null };
  setStoredUser(user);
  return { user };
};


export const signOut = async (_auth: any) => {
  setStoredUser(null);
};

export const createUserWithEmailAndPassword = async (_auth: any, email: string, _pass: string) => {
  const user: User = { uid: 'mock-register-id', email, displayName: email.split('@')[0], photoURL: null };
  setStoredUser(user);
  return { user };
};

export const updateProfile = async (_user: any, _data: any) => {
  // Mock update
};

// --- FIRESTORE MOCK ---
export const storage = {
  scripts: {
    getAll: (): Script[] => {
      const stored = localStorage.getItem(STORAGE_KEYS.SCRIPTS);
      return stored ? JSON.parse(stored) : [];
    },
    
    getByUser: (uid: string): Script[] => {
      return storage.scripts.getAll().filter(s => s.uid === uid);
    },

    getById: (id: string): Script | undefined => {
      return storage.scripts.getAll().find(s => s.id === id);
    },

    add: (data: Omit<Script, 'id'>): { id: string } => {
      const scripts = storage.scripts.getAll();
      const newId = Math.random().toString(36).substring(2, 15);
      const newScript: Script = {
        ...data,
        id: newId,
        createdAt: new Date().toISOString()
      };
      scripts.push(newScript);
      localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(scripts));
      return { id: newId };
    },

    update: (id: string, data: Partial<Script>): void => {
      const scripts = storage.scripts.getAll();
      const index = scripts.findIndex(s => s.id === id);
      if (index !== -1) {
        scripts[index] = { ...scripts[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(scripts));
      }
    },

    delete: (id: string): void => {
      const scripts = storage.scripts.getAll();
      const filtered = scripts.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(filtered));
    }
  }
};

// Firestore Compatibility shims
export const collection = (_db: any, name: string) => name;
export const query = (col: any, ..._filters: any[]) => col;
export const where = (_field: string, _op: string, _value: any) => ({ field: _field, op: _op, value: _value });
export const orderBy = (_field: string, _dir?: string) => ({ field: _field, dir: _dir });
export const onSnapshot = (q: any, callback: (snapshot: any) => void, errorCallback?: (error: any) => void) => {
  // Basic implementation that triggers immediately
  const scripts = storage.scripts.getAll();
  callback({
    docs: scripts.map(s => ({
      id: s.id,
      data: () => s
    }))
  });
  return () => {}; // Unsubscribe
};

export const doc = (_db: any, col: string, id: string) => ({ col, id });
export const deleteDoc = async (docRef: any) => {
  storage.scripts.delete(docRef.id);
};
export const updateDoc = async (docRef: any, data: any) => {
  storage.scripts.update(docRef.id, data);
};
export const addDoc = async (_col: any, data: any) => {
  return storage.scripts.add(data);
};
export const serverTimestamp = () => new Date().toISOString();

// Mock objects
export const auth = {};
export const db = {};

export class Timestamp {
  constructor(public seconds: number, public nanoseconds: number) {}
  static now() {
    const d = new Date();
    return new Timestamp(Math.floor(d.getTime() / 1000), 0);
  }
  static fromDate(date: Date) {
    return new Timestamp(Math.floor(date.getTime() / 1000), 0);
  }
  toDate() {
    return new Date(this.seconds * 1000);
  }
  toMillis() {
    return this.seconds * 1000;
  }
}
