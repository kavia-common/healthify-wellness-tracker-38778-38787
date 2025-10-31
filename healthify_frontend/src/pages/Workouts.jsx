//
/**
 * Workouts page - loads workouts into AppState with loading/error indicators.
 * Refactored to use common Card component.
 */
//
import { useEffect, useState } from 'react';
import { useAppActions, useAppState } from '../context/AppStateContext';
import * as workoutsService from '../services/workoutsService';
import Card from '../components/common/Card';

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
      <Card title="Workouts" style={{ marginBottom: '1rem' }}>
        <h2 id="workouts-title" style={{ marginTop: 0, fontSize: 20 }}>Workouts</h2>
        <p className="text-muted">
          Plan, log, and track your training sessions. Coming soon.
        </p>

        {loading && (
          <Card as="div" role="status" aria-live="polite" style={{ padding: 12, marginTop: 12 }}>
            Loading workouts…
          </Card>
        )}

        {error && (
          <Card as="div" role="alert" aria-live="assertive" style={{ padding: 12, marginTop: 12, borderColor: 'var(--color-error)' }}>
            <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
            <span className="text-muted">{String(error)}</span>
          </Card>
        )}

        <Card as="div" style={{ padding: 12, marginTop: 12 }}>
          <div className="text-muted" style={{ fontSize: 12 }}>Next session</div>
          <div style={{ fontWeight: 700 }}>{next ? (next.name || 'Workout') : '—'}</div>
        </Card>

        <div className="text-muted" style={{ marginTop: 12, fontSize: 12 }}>
          Loaded workouts: {items.length}
        </div>
      </Card>
    </section>
  );
}
