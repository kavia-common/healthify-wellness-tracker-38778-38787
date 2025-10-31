//
// Nutrition page - loads meals into AppState with loading/error indicators
//
import { useEffect, useState } from 'react';
import { useAppActions, useAppState } from '../context/AppStateContext';
import * as nutritionService from '../services/nutritionService';

// PUBLIC_INTERFACE
export default function Nutrition() {
  /** Displays nutrition tracking and insights. Loads data via nutritionService into AppState. */
  const actions = useAppActions();
  const { nutrition } = useAppState();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const meals = await nutritionService.list();
        if (!cancelled) actions.setMeals(meals || []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load meals');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [actions]);

  const meals = nutrition?.meals || [];
  const calories = meals.reduce((sum, m) => sum + (m?.calories || 0), 0);

  return (
    <section className="fade-in" aria-labelledby="nutrition-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Nutrition</div>
        <div className="card-body">
          <h2 id="nutrition-title" style={{ marginTop: 0, fontSize: 20 }}>Nutrition</h2>
          <p className="text-muted">
            Track meals, macros, and hydration. Coming soon.
          </p>

          {loading && (
            <div className="card" role="status" aria-live="polite" style={{ padding: 12, marginTop: 12 }}>
              Loading meals…
            </div>
          )}

          {error && (
            <div className="card" role="alert" aria-live="assertive" style={{ padding: 12, marginTop: 12, borderColor: 'var(--color-error)' }}>
              <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
              <span className="text-muted">{String(error)}</span>
            </div>
          )}

          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Today’s summary</div>
            <div style={{ fontWeight: 700 }}>{calories} kcal • {meals.length} meal(s)</div>
          </div>
        </div>
      </div>
    </section>
  );
}
