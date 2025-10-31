//
// Profile page - accessible, mobile-first with optional debug footer
//
import { useEffect, useMemo, useState } from 'react';
import { getConfig, getFeatureFlags } from '../utils/env';
import { healthcheck } from '../services/apiClient';

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

      {showDebug && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Debug</span>
            <button
              className="btn btn-outline"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="debug-panel"
            >
              {open ? 'Hide' : 'Show'}
            </button>
          </div>
          {open && (
            <div id="debug-panel" className="card-body">
              <div style={{ marginBottom: 12 }}>
                <div className="text-muted" style={{ fontSize: 12, marginBottom: 6 }}>Resolved configuration</div>
                <pre className="hide-overflow" style={{ margin: 0, padding: 12, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
{JSON.stringify(cfg, null, 2)}
                </pre>
              </div>

              <div style={{ marginTop: 12 }}>
                <div className="text-muted" style={{ fontSize: 12, marginBottom: 6 }}>Healthcheck</div>
                {hcLoading && (
                  <div className="card" role="status" aria-live="polite" style={{ padding: 12, marginBottom: 8 }}>
                    Checking backend…
                  </div>
                )}
                {hcError && (
                  <div className="card" role="alert" aria-live="assertive" style={{ padding: 12, marginBottom: 8, borderColor: 'var(--color-error)' }}>
                    <strong style={{ color: 'var(--color-error)' }}>Error: </strong>
                    <span className="text-muted">{String(hcError)}</span>
                  </div>
                )}
                {hc && (
                  <pre className="hide-overflow" style={{ margin: 0, padding: 12, background: 'var(--color-surface)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
{JSON.stringify(hc, null, 2)}
                  </pre>
                )}
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-primary" onClick={onReloadHealth} disabled={hcLoading}>
                    {hcLoading ? 'Checking…' : 'Run healthcheck'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
