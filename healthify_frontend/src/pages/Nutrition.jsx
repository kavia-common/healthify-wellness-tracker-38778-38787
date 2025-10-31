//
// Nutrition page - accessible, mobile-first placeholder
//

// PUBLIC_INTERFACE
export default function Nutrition() {
  /** Displays nutrition tracking and insights. Placeholder content for initial scaffolding. */
  return (
    <section className="fade-in" aria-labelledby="nutrition-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Nutrition</div>
        <div className="card-body">
          <h2 id="nutrition-title" style={{ marginTop: 0, fontSize: 20 }}>Nutrition</h2>
          <p className="text-muted">
            Track meals, macros, and hydration. Coming soon.
          </p>
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Today’s summary</div>
            <div style={{ fontWeight: 700 }}>—</div>
          </div>
        </div>
      </div>
    </section>
  );
}
