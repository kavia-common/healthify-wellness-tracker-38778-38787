import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** Indicates if a user is authenticated */
  isAuthenticated: false,
  /** Login function */
  login: () => {},
  /** Logout function */
  logout: () => {},
});

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Hook to access authentication state.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Temporary in-memory auth provider. In a later step this should be replaced
 * by a real AppProvider wired to backend authentication.
 */
export function AuthProvider({ children }) {
  // Temporary stub: keep auth in local state. Replace with real auth later.
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value = useMemo(
    () => ({
      isAuthenticated,
      login: () => setIsAuthenticated(true),
      logout: () => setIsAuthenticated(false),
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * PrivateRoute
 * Route guard that renders child routes only when authenticated.
 * - If not authenticated: redirects to /login and preserves the intended path in state.
 */
export function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

// Minimal placeholder pages to ensure the app compiles.
// These will be replaced or expanded later with real screens.
function PageContainer({ title, children }) {
  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto', textAlign: 'left' }}>
      <h1 className="retro-title" style={{ marginBottom: 8 }}>{title}</h1>
      <p className="retro-subtitle" style={{ marginTop: 0 }}>
        Temporary placeholder screen
      </p>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <PageContainer title="Login">
      <p className="sr-note">Authenticate to continue.</p>
      <button className="theme-toggle" onClick={login} aria-label="Login">
        Sign In
      </button>
    </PageContainer>
  );
}

function DashboardPage() {
  return (
    <PageContainer title="Dashboard">
      <p className="sr-note">Overview of your health metrics and shortcuts.</p>
    </PageContainer>
  );
}

function WorkoutsPage() {
  return (
    <PageContainer title="Workouts">
      <p className="sr-note">Track and plan your workouts.</p>
    </PageContainer>
  );
}

function NutritionPage() {
  return (
    <PageContainer title="Nutrition">
      <p className="sr-note">Log meals and analyze nutrients.</p>
    </PageContainer>
  );
}

function HabitsPage() {
  return (
    <PageContainer title="Habits">
      <p className="sr-note">Build and maintain healthy routines.</p>
    </PageContainer>
  );
}

function InsightsPage() {
  return (
    <PageContainer title="Insights">
      <p className="sr-note">AI-driven recommendations and trends.</p>
    </PageContainer>
  );
}

function ProfilePage() {
  return (
    <PageContainer title="Profile">
      <p className="sr-note">Manage your personal info and preferences.</p>
    </PageContainer>
  );
}

/**
 * PUBLIC_INTERFACE
 * AppRouter
 * All application routes. Behavior:
 * - Public: /login
 * - Protected: /dashboard, /workouts, /nutrition, /habits, /insights, /profile
 * - Redirects:
 *    - Unauthenticated access to protected routes -> /login
 *    - Authenticated navigating to / -> /dashboard
 *    - Unknown routes -> redirects to root (which then redirects accordingly)
 */
export default function AppRouter() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/habits" element={<HabitsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
