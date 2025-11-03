import React, { useEffect, useState } from 'react';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { getHabits, updateHabit } from '../services/api/trackingApi';

/**
 * PUBLIC_INTERFACE
 * Habits
 * Track daily routines; toggle completion using trackingApi.updateHabit.
 */
export default function Habits() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  async function load() {
    setLoading(true);
    setToast(null);
    try {
      const resp = await getHabits();
      if (resp.ok) setItems(resp.data || []);
      else setToast({ type: 'warning', message: resp.message || 'Could not load habits' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to load habits' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleComplete(habit) {
    if (!habit?.id) return;
    setUpdatingId(habit.id);
    setToast(null);
    try {
      const resp = await updateHabit(habit.id, { completedToday: !habit.completedToday });
      if (!resp.ok) throw new Error(resp.message || 'Failed to update habit');
      await load();
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Unable to update habit' });
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="retro-title">Habits</h1>
        <p className="retro-subtitle">Build and maintain healthy routines</p>
      </header>

      <RetroCard title="Your Habits" elevated>
        {loading ? (
          <Loader label="Loading habits" />
        ) : (items?.length ? (
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: 8 }}>
            {items.map((h) => (
              <li key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <strong>{h.name}</strong>
                  <div className="retro-subtitle">{h.schedule || 'daily'} • Streak: {h.streak || 0}</div>
                </div>
                <RetroButton
                  variant={h.completedToday ? 'secondary' : 'primary'}
                  onClick={() => toggleComplete(h)}
                  disabled={updatingId === h.id}
                >
                  {updatingId === h.id ? <Loader label="Updating" size={16} /> : (h.completedToday ? 'Undo' : 'Done')}
                </RetroButton>
              </li>
            ))}
          </ul>
        ) : (
          <p className="retro-subtitle">You have no habits yet.</p>
        ))}
      </RetroCard>

      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
