//
// Workouts page - accessible, mobile-first placeholder
//

// PUBLIC_INTERFACE
export default function Workouts() {
  /** Displays workout planning and history. Placeholder content for initial scaffolding. */
  return (
    <section className="fade-in" aria-labelledby="workouts-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Workouts</div>
        <div className="card-body">
          <h2 id="workouts-title" style={{ marginTop: 0, fontSize: 20 }}>Workouts</h2>
          <p className="text-muted">
            Plan, log, and track your training sessions. Coming soon.
          </p>
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Next session</div>
            <div style={{ fontWeight: 700 }}>—</div>
          </div>
        </div>
      </div>
    </section>
  );
}
