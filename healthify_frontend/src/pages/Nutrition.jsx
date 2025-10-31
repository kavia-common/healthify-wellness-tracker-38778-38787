//
/**
 * Nutrition page - loads meals into AppState with loading/error indicators.
 * Refactored to use common Card component.
 */
//
import { useEffect, useState } from 'react';
import { useAppActions, useAppState } from '../context/AppStateContext';
import * as nutritionService from '../services/nutritionService';
import Card from '../components/common/Card';

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
      <Card title="Nutrition" style={{ marginBottom: '1rem' }}>
        <h2 id="nutrition-title" style={{ marginTop: 0, fontSize: 20 }}>Nutrition</h2>
        <p className="text-muted">
          Track meals, macros, and hydration. Coming soon.
        </p>

        {loading && (
          <Card as="div" role="status" aria-live="polite" style={{ padding: 12, marginTop: 12 }}>
            Loading meals…
          </Card>
        )}

        {error && (
          <Card as="div" role="alert" aria-live="assertive" style={{ padding: 12, marginTop: 12, borderColor: 'var(--color-error)' }}>
            <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
            <span className="text-muted">{String(error)}</span>
          </Card>
        )}

        <Card as="div" style={{ padding: 12, marginTop: 12 }}>
          <div className="text-muted" style={{ fontSize: 12 }}>Today’s summary</div>
          <div style={{ fontWeight: 700 }}>{calories} kcal • {meals.length} meal(s)</div>
        </Card>
      </Card>
    </section>
  );
}
