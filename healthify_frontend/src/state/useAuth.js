/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication and app state from AppContext.
 */
import { useContext } from 'react';
import { AppContext } from './AppProvider';

export function useAuth() {
  return useContext(AppContext);
}

export default useAuth;
