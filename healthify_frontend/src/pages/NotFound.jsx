//
/**
 * NotFound (404) page - accessible, mobile-first placeholder.
 * Refactored to use Card and Button components.
 */
//

import Card from '../components/common/Card';
import Button from '../components/common/Button';

// PUBLIC_INTERFACE
export default function NotFound() {
  /** 404 error page with clear guidance and link back to Dashboard. */
  return (
    <section className="fade-in" aria-labelledby="notfound-title" style={{ margin: '1rem 0 5rem' }}>
      <Card as="div" role="alert" aria-live="polite">
        <h2 id="notfound-title" style={{ marginTop: 0, fontSize: 20 }}>Page not found</h2>
        <p className="text-muted">We couldn't find what you're looking for.</p>
        <Button to="/" variant="primary" aria-label="Go back to Dashboard">
          Go to Dashboard
        </Button>
      </Card>
    </section>
  );
}
