import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import useAuth from '../state/useAuth';
import Loader from '../components/Loader';

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

// Lazy-loaded pages for code-splitting
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Workouts = lazy(() => import('../pages/Workouts'));
const Nutrition = lazy(() => import('../pages/Nutrition'));
const Habits = lazy(() => import('../pages/Habits'));
const Insights = lazy(() => import('../pages/Insights'));
const Profile = lazy(() => import('../pages/Profile'));

/**
 * PUBLIC_INTERFACE
 * AppRouter
 * All application routes with lazy-loaded pages and Suspense loader.
 * Behavior:
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
      <Suspense
        fallback={
          <div className="retro-container" style={{ paddingTop: 'var(--space-6)' }}>
            <Loader label="Loading page" />
          </div>
        }
      >
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
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
