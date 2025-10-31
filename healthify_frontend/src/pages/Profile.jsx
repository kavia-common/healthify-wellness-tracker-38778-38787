//
// Profile page - accessible, mobile-first placeholder
//

// PUBLIC_INTERFACE
export default function Profile() {
  /** Displays user profile and settings. Placeholder content for initial scaffolding. */
  return (
    <section className="fade-in" aria-labelledby="profile-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-header">Profile</div>
        <div className="card-body">
          <h2 id="profile-title" style={{ marginTop: 0, fontSize: 20 }}>Profile</h2>
          <p className="text-muted">
            Manage your preferences and account details. Coming soon.
          </p>
          <div className="card" style={{ padding: 12, marginTop: 12 }}>
            <div className="text-muted" style={{ fontSize: 12 }}>Display name</div>
            <div style={{ fontWeight: 700 }}>—</div>
          </div>
        </div>
      </div>
    </section>
  );
}
