//
// Mindfulness page - loads sessions into AppState with loading/error indicators
//
import { useEffect, useState } from 'react';
import { useAppActions, useAppState } from '../context/AppStateContext';
import * as mindfulnessService from '../services/mindfulnessService';

// PUBLIC_INTERFACE
export default function Mindfulness() {
  /** Displays mindfulness practices and sessions. Loads data via mindfulnessService into AppState. */
  const actions = useAppActions();
  const { mindfulness } = useAppState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const sessions = await mindfulnessService.list();
        if (!cancelled) actions.setSessions(sessions || []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load sessions');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [actions]);

  const sessions = mindfulness?.sessions || [];
  const last = sessions[0];

  return (
    <section className="fade-in" aria-labelledby="mindfulness-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Mindfulness</div>
        <div className="card-body">
          <h2 id="mindfulness-title" style={{ marginTop: 0, fontSize: 20 }}>Mindfulness</h2>
          <p className="text-muted">
            Guided breathing, focus, and meditation. Coming soon.
          </p>

          {loading && (
            <div className="card" role="status" aria-live="polite" style={{ padding: 12, marginTop: 12 }}>
              Loading sessions…
            </div>
          )}

          {error && (
            <div className="card" role="alert" aria-live="assertive" style={{ padding: 12, marginTop: 12, borderColor: 'var(--color-error)' }}>
              <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
              <span className="text-muted">{String(error)}</span>
            </div>
          )}

          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Last session</div>
            <div style={{ fontWeight: 700 }}>{last ? (last.type || 'Session') : '—'}</div>
          </div>

          <div className="text-muted" style={{ marginTop: 12, fontSize: 12 }}>
            Total sessions: {sessions.length}
          </div>
        </div>
      </div>
    </section>
  );
}
