//
// Mindfulness page - accessible, mobile-first placeholder
//

// PUBLIC_INTERFACE
export default function Mindfulness() {
  /** Displays mindfulness practices and sessions. Placeholder content for initial scaffolding. */
  return (
    <section className="fade-in" aria-labelledby="mindfulness-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Mindfulness</div>
        <div className="card-body">
          <h2 id="mindfulness-title" style={{ marginTop: 0, fontSize: 20 }}>Mindfulness</h2>
          <p className="text-muted">
            Guided breathing, focus, and meditation. Coming soon.
          </p>
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Last session</div>
            <div style={{ fontWeight: 700 }}>—</div>
          </div>
        </div>
      </div>
    </section>
  );
}
