//
/**
 * Profile page - accessible, mobile-first with optional debug footer.
 * Refactored to use common Card and Button components.
 */
//
import { useEffect, useMemo, useState } from 'react';
import { getConfig, getFeatureFlags } from '../utils/env';
import { healthcheck } from '../services/apiClient';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// PUBLIC_INTERFACE
export default function Profile() {
  /**
   * Displays user profile and settings. Adds a feature-flagged debug footer
   * that shows resolved environment configuration and backend healthcheck.
   */
  const flags = getFeatureFlags();
  // Allow multiple flag names for flexibility: debug.profileFooter, debug_profile_footer, debugFooter, showDebug
  const showDebug = Boolean(
    (flags && (
      (flags.debug && (flags.debug.profileFooter || flags.debug.showProfileFooter)) ||
      flags.debug_profile_footer ||
      flags.debugFooter ||
      flags.showDebug
    )) || false
  );

  const cfg = useMemo(() => getConfig(), []);
  const [open, setOpen] = useState(false);
  const [hcLoading, setHcLoading] = useState(false);
  const [hcError, setHcError] = useState(null);
  const [hc, setHc] = useState(null);

  useEffect(() => {
    // Run healthcheck on mount only if debug is enabled
    let cancelled = false;
    async function run() {
      if (!showDebug) return;
      setHcLoading(true);
      setHcError(null);
      try {
        const res = await healthcheck();
        if (!cancelled) setHc(res || null);
      } catch (e) {
        if (!cancelled) setHcError(e?.message || 'Healthcheck failed');
      } finally {
        if (!cancelled) setHcLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [showDebug]);

  const onReloadHealth = async () => {
    setHcLoading(true);
    setHcError(null);
    try {
      const res = await healthcheck();
      setHc(res || null);
    } catch (e) {
      setHcError(e?.message || 'Healthcheck failed');
    } finally {
      setHcLoading(false);
    }
  };

  return (
    <section className="fade-in" aria-labelledby="profile-title" style={{ margin: '1rem 0 5rem' }}>
      <Card title="Profile" style={{ marginBottom: '1rem' }}>
        <h2 id="profile-title" style={{ marginTop: 0, fontSize: 20 }}>Profile</h2>
        <p className="text-muted">
          Manage your preferences and account details. Coming soon.
        </p>

        <Card as="div" style={{ marginTop: 12 }}>
          <div className="text-muted" style={{ fontSize: 12 }}>Display name</div>
          <div style={{ fontWeight: 700 }}>—</div>
        </Card>
      </Card>

      {showDebug && (
        <Card
          title="Debug"
          headerRight={
            <Button
              variant="outline"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="debug-panel"
            >
              {open ? 'Hide' : 'Show'}
            </Button>
          }
          style={{ marginBottom: '1rem' }}
        >
          {open && (
            <div id="debug-panel">
              <div style={{ marginBottom: 12 }}>
                <div className="text-muted" style={{ fontSize: 12, marginBottom: 6 }}>Resolved configuration</div>
                <pre className="hide-overflow" style={{ margin: 0, padding: 12, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
{JSON.stringify(cfg, null, 2)}
                </pre>
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="text-muted" style={{ fontSize: 12, marginBottom: 6 }}>Healthcheck</div>
                {hcLoading && (
                  <Card as="div" role="status" aria-live="polite" style={{ padding: 12, marginBottom: 8 }}>
                    Checking backend…
                  </Card>
                )}
                {hcError && (
                  <Card as="div" role="alert" aria-live="assertive" style={{ padding: 12, marginBottom: 8, borderColor: 'var(--color-error)' }}>
                    <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
                    <span className="text-muted">{String(hcError)}</span>
                  </Card>
                )}
                {hc && (
                  <pre className="hide-overflow" style={{ margin: 0, padding: 12, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
{JSON.stringify(hc, null, 2)}
                  </pre>
                )}
                <div style={{ marginTop: 8 }}>
                  <Button variant="primary" onClick={onReloadHealth} disabled={hcLoading}>
                    {hcLoading ? 'Checking…' : 'Run healthcheck'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </section>
  );
}
