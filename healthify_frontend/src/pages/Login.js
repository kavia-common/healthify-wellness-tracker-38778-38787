import React, { useEffect, useState } from 'react';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import useAuth from '../state/useAuth';
import { login as apiLogin, me as apiMe } from '../services/api/authApi';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login
 * Retro-styled sign-in page. Uses authApi for login and me, updates AppContext via useAuth.
 * Redirects to previous route (state.from) or /dashboard on success.
 */
export default function Login() {
  const { isAuthenticated, login: ctxLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo');
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(e) {
    e.preventDefault();
    setPending(true);
    setToast(null);
    try {
      const resp = await apiLogin({ email, password });
      if (!resp.ok) {
        throw new Error(resp.message || 'Login failed');
      }
      const token = resp?.data?.token;
      if (!token) throw new Error('No token received');
      // Fetch profile
      const meResp = await apiMe();
      if (!meResp.ok) {
        // allow context login to handle if backend returns cookie token only
        await ctxLogin({ email, password });
      } else {
        await ctxLogin({ email, password });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Unable to login' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-6)' }}>
      <RetroCard title="Welcome back 👋" subtitle="Sign in to continue" elevated>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            <span className="retro-subtitle">Email</span>
            <input
              className="retro-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            <span className="retro-subtitle">Password</span>
            <input
              className="retro-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <RetroButton type="submit" disabled={pending} ariaLabel="Sign in">
            {pending ? <Loader label="Signing in" size={16} /> : 'Sign In'}
          </RetroButton>
        </form>
        <hr className="retro-divider" />
        <p className="retro-subtitle">Tip: demo@example.com / demo</p>
      </RetroCard>
      {toast ? (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
