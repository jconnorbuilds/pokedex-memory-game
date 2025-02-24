import { createContext, useState } from 'react';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => (user ? setUser(user) : setUser(null)));

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
