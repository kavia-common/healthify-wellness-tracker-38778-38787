import React, { useEffect, useState } from 'react';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { getWorkouts, addWorkout } from '../services/api/trackingApi';

/**
 * PUBLIC_INTERFACE
 * Workouts
 * Manage and view workouts. Uses trackingApi for CRUD.
 */
export default function Workouts() {
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'cardio',
    durationMin: 30,
    notes: '',
  });

  async function load() {
    setLoading(true);
    setToast(null);
    try {
      const resp = await getWorkouts();
      if (resp.ok) setItems(resp.data || []);
      else setToast({ type: 'warning', message: resp.message || 'Could not load workouts' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to load workouts' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    setPending(true);
    setToast(null);
    try {
      const payload = {
        date: form.date,
        type: form.type,
        durationMin: Number(form.durationMin) || 0,
        notes: form.notes || undefined,
      };
      const resp = await addWorkout(payload);
      if (!resp.ok) throw new Error(resp.message || 'Failed to add workout');
      await load();
      setForm((f) => ({ ...f, notes: '' }));
      setToast({ type: 'success', message: 'Workout added' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Unable to add workout' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="retro-title">Workouts</h1>
        <p className="retro-subtitle">Track and plan your sessions</p>
      </header>

      <RetroCard title="Add Workout" elevated>
        <form onSubmit={onAdd} style={{ display: 'grid', gap: 12 }}>
          <label>
            <span className="retro-subtitle">Date</span>
            <input
              className="retro-input"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </label>
          <label>
            <span className="retro-subtitle">Type</span>
            <select
              className="retro-input"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength</option>
              <option value="yoga">Yoga</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            <span className="retro-subtitle">Duration (min)</span>
            <input
              className="retro-input"
              type="number"
              min="0"
              value={form.durationMin}
              onChange={(e) => setForm((f) => ({ ...f, durationMin: e.target.value }))}
              required
            />
          </label>
          <label>
            <span className="retro-subtitle">Notes</span>
            <input
              className="retro-input"
              type="text"
              placeholder="Optional notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </label>
          <RetroButton type="submit" disabled={pending}>
            {pending ? <Loader label="Saving" size={16} /> : 'Add Workout'}
          </RetroButton>
        </form>
      </RetroCard>

      <RetroCard title="Your Workouts" elevated>
        {loading ? (
          <Loader label="Loading workouts" />
        ) : items?.length ? (
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: 6 }}>
            {items.map((w) => (
              <li key={w.id}>
                <strong>{w.date?.slice(0, 10)}</strong> — {w.type} • {w.durationMin} min {w.notes ? `• ${w.notes}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <p className="retro-subtitle">No workouts yet. Add your first above!</p>
        )}
      </RetroCard>

      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
