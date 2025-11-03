import React, { useEffect, useState } from 'react';
import RetroCard from '../components/RetroCard';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { getProfile } from '../services/api/userApi';
import { getWorkouts, getNutrition, getHabits } from '../services/api/trackingApi';

/**
 * PUBLIC_INTERFACE
 * Dashboard
 * Overview screen showing quick links and brief summaries.
 */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [profile, setProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setToast(null);
      try {
        const [p, w, m, h] = await Promise.all([
          getProfile(),
          getWorkouts({ limit: 3 }),
          getNutrition({ limit: 3 }),
          getHabits({ limit: 5 }),
        ]);
        if (!mounted) return;
        if (p.ok) setProfile(p.data);
        if (w.ok) setWorkouts(w.data || []);
        if (m.ok) setMeals(m.data || []);
        if (h.ok) setHabits(h.data || []);
        if (!p.ok || !w.ok || !m.ok || !h.ok) {
          const msg = [p, w, m, h].filter((r) => !r.ok).map((r) => r.message).join(' • ');
          setToast({ type: 'warning', message: msg || 'Some data could not be loaded' });
        }
      } catch (err) {
        if (mounted) setToast({ type: 'error', message: err?.message || 'Failed to load dashboard' });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="retro-title">Dashboard</h1>
        <p className="retro-subtitle">Overview of your wellness</p>
      </header>

      <RetroCard title="Profile" subtitle="Your account at a glance" elevated>
        {loading ? (
          <Loader label="Loading profile" />
        ) : profile ? (
          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Name:</strong> {profile.name}</div>
            <div><strong>Email:</strong> {profile.email}</div>
            <div><span className="retro-badge">Plan: {profile.plan || 'free'}</span></div>
          </div>
        ) : (
          <p className="retro-subtitle">Profile unavailable.</p>
        )}
      </RetroCard>

      <RetroCard title="Recent Workouts" subtitle="Last 3 sessions" elevated>
        {loading ? (
          <Loader label="Loading workouts" />
        ) : (workouts?.length ? (
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {workouts.map((w) => (
              <li key={w.id}>
                {w.date?.slice(0, 10)} — {w.type} • {w.durationMin} min
              </li>
            ))}
          </ul>
        ) : (
          <p className="retro-subtitle">No workouts yet.</p>
        ))}
      </RetroCard>

      <RetroCard title="Recent Meals" subtitle="Last 3 entries" elevated>
        {loading ? (
          <Loader label="Loading meals" />
        ) : (meals?.length ? (
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {meals.map((m) => (
              <li key={m.id}>
                {m.date?.slice(0, 10)} — {m.name} • {m.calories} kcal
              </li>
            ))}
          </ul>
        ) : (
          <p className="retro-subtitle">No meals logged yet.</p>
        ))}
      </RetroCard>

      <RetroCard title="Habits" subtitle="Top habits" elevated>
        {loading ? (
          <Loader label="Loading habits" />
        ) : (habits?.length ? (
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {habits.map((h) => (
              <li key={h.id}>
                {h.name} — <span className="retro-badge">{h.completedToday ? 'Completed today' : 'Pending'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="retro-subtitle">No habits created yet.</p>
        ))}
      </RetroCard>

      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
