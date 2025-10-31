//
// NotFound (404) page - accessible, mobile-first placeholder
//

import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 error page with clear guidance and link back to Dashboard. */
  return (
    <section className="fade-in" aria-labelledby="notfound-title" style={{ margin: '1rem 0 5rem' }}>
      <div className="card" role="alert" aria-live="polite">
        <div className="card-body">
          <h2 id="notfound-title" style={{ marginTop: 0, fontSize: 20 }}>Page not found</h2>
          <p className="text-muted">We couldn't find what you're looking for.</p>
          <Link to="/" className="btn btn-primary" aria-label="Go back to Dashboard">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
