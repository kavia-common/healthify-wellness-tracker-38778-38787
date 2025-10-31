//
// Workouts page - loads workouts into AppState with loading/error indicators
//
import { useEffect, useState } from 'react';
import { useAppActions, useAppState } from '../context/AppStateContext';
import * as workoutsService from '../services/workoutsService';

// PUBLIC_INTERFACE
export default function Workouts() {
  /** Displays workout planning and history. Loads data via workoutsService into AppState. */
  const actions = useAppActions();
  const { workouts } = useAppState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const items = await workoutsService.list();
        if (!cancelled) actions.setWorkouts(items || []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load workouts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [actions]);

  const items = workouts?.items || [];
  const next = items[0];

  return (
    <section className="fade-in" aria-labelledby="workouts-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Workouts</div>
        <div className="card-body">
          <h2 id="workouts-title" style={{ marginTop: 0, fontSize: 20 }}>Workouts</h2>
          <p className="text-muted">
            Plan, log, and track your training sessions. Coming soon.
          </p>

          {loading && (
            <div className="card" role="status" aria-live="polite" style={{ padding: 12, marginTop: 12 }}>
              Loading workouts…
            </div>
          )}

          {error && (
            <div className="card" role="alert" aria-live="assertive" style={{ padding: 12, marginTop: 12, borderColor: 'var(--color-error)' }}>
              <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
              <span className="text-muted">{String(error)}</span>
            </div>
          )}

          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Next session</div>
            <div style={{ fontWeight: 700 }}>{next ? (next.name || 'Workout') : '—'}</div>
          </div>

          <div className="text-muted" style={{ marginTop: 12, fontSize: 12 }}>
            Loaded workouts: {items.length}
          </div>
        </div>
      </div>
    </section>
  );
}
