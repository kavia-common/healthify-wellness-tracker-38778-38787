//
// Habits page - loads habits into AppState with loading/error indicators
//
import { useEffect, useState } from 'react';
import { useAppActions, useAppState } from '../context/AppStateContext';
import * as habitsService from '../services/habitsService';

// PUBLIC_INTERFACE
export default function Habits() {
  /** Displays habit tracking and streaks. Loads data via habitsService into AppState. */
  const actions = useAppActions();
  const { habits } = useAppState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const items = await habitsService.list();
        if (!cancelled) actions.setHabits(items || []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load habits');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [actions]);

  const items = habits?.items || [];
  const activeCount = items.filter((h) => h?.active).length;

  return (
    <section className="fade-in" aria-labelledby="habits-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Habits</div>
        <div className="card-body">
          <h2 id="habits-title" style={{ marginTop: 0, fontSize: 20 }}>Habits</h2>
          <p className="text-muted">
            Build routines and maintain streaks. Coming soon.
          </p>

          {loading && (
            <div className="card" role="status" aria-live="polite" style={{ padding: 12, marginTop: 12 }}>
              Loading habits…
            </div>
          )}

          {error && (
            <div className="card" role="alert" aria-live="assertive" style={{ padding: 12, marginTop: 12, borderColor: 'var(--color-error)' }}>
              <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
              <span className="text-muted">{String(error)}</span>
            </div>
          )}

          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Active streaks</div>
            <div style={{ fontWeight: 700 }}>{activeCount || '—'}</div>
          </div>

          <div className="text-muted" style={{ marginTop: 12, fontSize: 12 }}>
            Total habits: {items.length}
          </div>
        </div>
      </div>
    </section>
  );
}
