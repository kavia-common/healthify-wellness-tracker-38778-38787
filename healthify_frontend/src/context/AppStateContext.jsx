import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Minimal AppState context to be expanded later.
 * Holds basic app-level state like user and loading flags.
 */
const AppStateContext = createContext({
  user: null,
  isLoading: false,
  error: null,
  // eslint-disable-next-line no-unused-vars
  setUser: (_u) => {},
  // eslint-disable-next-line no-unused-vars
  setIsLoading: (_b) => {},
  // eslint-disable-next-line no-unused-vars
  setError: (_e) => {},
  // eslint-disable-next-line no-unused-vars
  signIn: async (_creds) => {},
  signOut: () => {},
});

// PUBLIC_INTERFACE
export function AppStateProvider({ children }) {
  /** Provides shared app state (user, loading, error). Placeholder to be expanded with real logic later. */
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder auth actions
  const signIn = async () => {
    // To be implemented in a later step
    return Promise.resolve();
  };
  const signOut = () => {
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
      setUser,
      setIsLoading,
      setError,
      signIn,
      signOut,
    }),
    [user, isLoading, error]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAppState() {
  /** Hook to read and update AppState context. */
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return ctx;
}

export default AppStateContext;
