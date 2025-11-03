import React, { useEffect, useState } from 'react';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { getNutrition, addMeal } from '../services/api/trackingApi';

/**
 * PUBLIC_INTERFACE
 * Nutrition
 * Log meals and show recent nutrition entries.
 */
export default function Nutrition() {
  const [items, setItems] = useState([]);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    name: 'Breakfast',
    calories: 400,
  });

  async function load() {
    setLoading(true);
    setToast(null);
    try {
      const resp = await getNutrition();
      if (resp.ok) setItems(resp.data || []);
      else setToast({ type: 'warning', message: resp.message || 'Could not load meals' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Failed to load meals' });
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
        name: form.name,
        calories: Number(form.calories) || 0,
      };
      const resp = await addMeal(payload);
      if (!resp.ok) throw new Error(resp.message || 'Failed to add meal');
      await load();
      setToast({ type: 'success', message: 'Meal added' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Unable to add meal' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="retro-title">Nutrition</h1>
        <p className="retro-subtitle">Log your meals</p>
      </header>

      <RetroCard title="Add Meal" elevated>
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
            <span className="retro-subtitle">Meal</span>
            <select
              className="retro-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </label>
          <label>
            <span className="retro-subtitle">Calories</span>
            <input
              className="retro-input"
              type="number"
              min="0"
              value={form.calories}
              onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
              required
            />
          </label>
          <RetroButton type="submit" disabled={pending}>
            {pending ? <Loader label="Saving" size={16} /> : 'Add Meal'}
          </RetroButton>
        </form>
      </RetroCard>

      <RetroCard title="Recent Meals" elevated>
        {loading ? (
          <Loader label="Loading meals" />
        ) : items?.length ? (
          <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'grid', gap: 6 }}>
            {items.map((m) => (
              <li key={m.id}>
                <strong>{m.date?.slice(0, 10)}</strong> — {m.name} • {m.calories} kcal
              </li>
            ))}
          </ul>
        ) : (
          <p className="retro-subtitle">No meals logged yet.</p>
        )}
      </RetroCard>

      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
