import { useProfile } from '../hooks/useProfile';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { useAuth } from '../hooks/useAuth';
import { formatBytes } from '../lib/utils';

export default function SettingsPage() {
  const { profile } = useProfile();
  const { limits, aiUsedToday } = useUsageLimits();
  const { signOut } = useAuth();

  return (
    <div className="settings-view">
      <div className="settings-header">
        <h2>Settings</h2>
      </div>
      <div className="settings-content">
        <div className="settings-section">
          <h3>Profile</h3>
          <div className="settings-field">
            <label>Display Name</label>
            <input type="text" value={profile?.full_name ?? ''} readOnly />
          </div>
          <div className="settings-field">
            <label>Email</label>
            <input type="text" value={profile?.email ?? ''} readOnly />
          </div>
        </div>
        <div className="settings-section">
          <h3>Plan & Usage</h3>
          <div className="settings-field">
            <label>Plan</label>
            <input type="text" value={profile?.plan ?? 'free'} readOnly />
          </div>
          <div className="settings-field">
            <label>AI messages today</label>
            <input type="text" value={`${aiUsedToday}/${limits.maxAiDaily}`} readOnly />
          </div>
          <div className="settings-field">
            <label>Max PDF size</label>
            <input type="text" value={formatBytes(limits.maxFileBytes)} readOnly />
          </div>
        </div>
        <div className="settings-section">
          <h3>Account</h3>
          <button className="btn btn-ghost" onClick={signOut} type="button">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
