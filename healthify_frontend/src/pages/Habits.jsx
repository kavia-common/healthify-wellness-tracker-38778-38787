//
// Habits page - accessible, mobile-first placeholder
//

// PUBLIC_INTERFACE
export default function Habits() {
  /** Displays habit tracking and streaks. Placeholder content for initial scaffolding. */
  return (
    <section className="fade-in" aria-labelledby="habits-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Habits</div>
        <div className="card-body">
          <h2 id="habits-title" style={{ marginTop: 0, fontSize: 20 }}>Habits</h2>
          <p className="text-muted">
            Build routines and maintain streaks. Coming soon.
          </p>
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Active streaks</div>
            <div style={{ fontWeight: 700 }}>—</div>
          </div>
        </div>
      </div>
    </section>
  );
}
