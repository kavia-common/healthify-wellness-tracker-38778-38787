import React, { useEffect, useState } from 'react';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { getProfile, updateProfile } from '../services/api/userApi';
import useAuth from '../state/useAuth';

/**
 * PUBLIC_INTERFACE
 * Profile
 * Manage user profile, wired to userApi.
 */
export default function Profile() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    heightCm: '',
    weightKg: '',
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setToast(null);
      try {
        const resp = await getProfile();
        if (mounted) {
          if (resp.ok) {
            const d = resp.data || {};
            setForm({
              name: d.name || '',
              email: d.email || '',
              age: d.age ?? '',
              heightCm: d.heightCm ?? '',
              weightKg: d.weightKg ?? '',
            });
          } else {
            setToast({ type: 'warning', message: resp.message || 'Could not load profile' });
          }
        }
      } catch (err) {
        if (mounted) setToast({ type: 'error', message: err?.message || 'Failed to load profile' });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setPending(true);
    setToast(null);
    try {
      const payload = {
        name: form.name || undefined,
        // email may be immutable depending on backend; keep as is but not necessarily submitted
        age: form.age ? Number(form.age) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      };
      const resp = await updateProfile(payload);
      if (!resp.ok) throw new Error(resp.message || 'Failed to update profile');
      setToast({ type: 'success', message: 'Profile updated' });
    } catch (err) {
      setToast({ type: 'error', message: err?.message || 'Unable to update profile' });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="retro-container" style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-6)' }}>
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <h1 className="retro-title">Profile</h1>
        <p className="retro-subtitle">Manage your personal info and preferences</p>
      </header>

      <RetroCard title="Your Details" elevated>
        {loading ? (
          <Loader label="Loading profile" />
        ) : (
          <form onSubmit={onSave} style={{ display: 'grid', gap: 12 }}>
            <label>
              <span className="retro-subtitle">Name</span>
              <input
                className="retro-input"
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </label>
            <label>
              <span className="retro-subtitle">Email</span>
              <input className="retro-input" type="email" value={form.email} readOnly />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label>
                <span className="retro-subtitle">Age</span>
                <input
                  className="retro-input"
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                />
              </label>
              <label>
                <span className="retro-subtitle">Height (cm)</span>
                <input
                  className="retro-input"
                  type="number"
                  min="0"
                  value={form.heightCm}
                  onChange={(e) => setForm((f) => ({ ...f, heightCm: e.target.value }))}
                />
              </label>
              <label>
                <span className="retro-subtitle">Weight (kg)</span>
                <input
                  className="retro-input"
                  type="number"
                  min="0"
                  value={form.weightKg}
                  onChange={(e) => setForm((f) => ({ ...f, weightKg: e.target.value }))}
                />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <RetroButton type="submit" disabled={pending}>
                {pending ? <Loader label="Saving" size={16} /> : 'Save Changes'}
              </RetroButton>
              <RetroButton type="button" variant="danger" onClick={logout}>
                Logout
              </RetroButton>
            </div>
          </form>
        )}
      </RetroCard>

      {toast ? <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
