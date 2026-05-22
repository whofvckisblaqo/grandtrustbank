'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User, Lock, Bell, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Edit2, X, Save } from 'lucide-react';

function TabBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${active ? 'bg-gtb-accent text-gtb-dark' : 'text-gtb-subtle hover:text-white'}`}>
      {label}
    </button>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-gtb-accent' : 'bg-white/20'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

const kycColors = { pending: '#F59E0B', verified: '#22C55E', rejected: '#EF4444' };
const kycLabels = { pending: 'Pending Review', verified: 'Verified', rejected: 'Rejected' };

export default function SettingsPage() {
  const { user, refetch } = useAuth();
  const [tab, setTab] = useState('profile');

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password change state
  const [currPwd, setCurrPwd]       = useState('');
  const [newPwd, setNewPwd]         = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurr, setShowCurr]     = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError]     = useState('');

  // Notification prefs (UI only)
  const [notifs, setNotifs] = useState({
    transfers: true,
    bills: true,
    security: true,
    marketing: false,
    sms: false,
  });

  function openProfileEdit() {
    setProfileForm({
      firstName: user.firstName || '',
      lastName:  user.lastName  || '',
      phone:     user.phone     || '',
      street:    user.address?.street  || '',
      city:      user.address?.city    || '',
      state:     user.address?.state   || '',
      country:   user.address?.country || 'United States',
      zipCode:   user.address?.zipCode || '',
    });
    setProfileError('');
    setProfileSuccess('');
    setEditingProfile(true);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setProfileLoading(true); setProfileError(''); setProfileSuccess('');
    try {
      const res = await fetch('/api/user/profile', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          firstName: profileForm.firstName,
          lastName:  profileForm.lastName,
          phone:     profileForm.phone,
          address: {
            street:  profileForm.street,
            city:    profileForm.city,
            state:   profileForm.state,
            country: profileForm.country,
            zipCode: profileForm.zipCode,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProfileSuccess(data.message);
      await refetch();
      setTimeout(() => { setEditingProfile(false); setProfileSuccess(''); }, 1200);
    } catch (e) {
      setProfileError(e.message);
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match'); return; }
    if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters'); return; }
    setPwdLoading(true); setPwdError(''); setPwdSuccess('');
    try {
      const res = await fetch('/api/user/password', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentPassword: currPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPwdSuccess(data.message);
      setCurrPwd(''); setNewPwd(''); setConfirmPwd('');
    } catch (e) { setPwdError(e.message); }
    finally { setPwdLoading(false); }
  }

  if (!user) return null;

  const initials  = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '';

  const pf = (k) => (e) => setProfileForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-black text-white">Settings</h1>
        <p className="text-gtb-muted text-sm">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-xl mb-6 w-fit">
        <TabBtn label="Profile"       active={tab === 'profile'}  onClick={() => setTab('profile')} />
        <TabBtn label="Security"      active={tab === 'security'} onClick={() => setTab('security')} />
        <TabBtn label="Notifications" active={tab === 'notifs'}   onClick={() => setTab('notifs')} />
      </div>

      {/* ── Profile tab ── */}
      {tab === 'profile' && (
        <div className="space-y-5">
          {/* Avatar row */}
          <div className="glass-card rounded-2xl p-6 flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gtb-accent flex items-center justify-center flex-shrink-0">
                <span className="text-gtb-dark font-black text-xl">{initials}</span>
              </div>
              <div>
                <div className="text-white font-bold text-lg">{user.firstName} {user.lastName}</div>
                <div className="text-gtb-muted text-sm">{user.email}</div>
                {joinedDate && <div className="text-gtb-muted text-xs mt-1">Member since {joinedDate}</div>}
              </div>
            </div>
            <button
              onClick={openProfileEdit}
              className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-sm text-gtb-subtle hover:text-white transition-all flex-shrink-0"
            >
              <Edit2 size={14} /> Edit
            </button>
          </div>

          {/* Edit form */}
          {editingProfile && (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="text-white font-semibold">Edit Profile</div>
                <button onClick={() => setEditingProfile(false)} className="text-gtb-muted hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">First Name</label>
                    <input type="text" value={profileForm.firstName} onChange={pf('firstName')} className="input-dark w-full" required />
                  </div>
                  <div>
                    <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Last Name</label>
                    <input type="text" value={profileForm.lastName} onChange={pf('lastName')} className="input-dark w-full" required />
                  </div>
                </div>
                <div>
                  <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Phone</label>
                  <input type="tel" value={profileForm.phone} onChange={pf('phone')} className="input-dark w-full" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Street Address</label>
                  <input type="text" value={profileForm.street} onChange={pf('street')} className="input-dark w-full" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">City</label>
                    <input type="text" value={profileForm.city} onChange={pf('city')} className="input-dark w-full" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">State / Region</label>
                    <input type="text" value={profileForm.state} onChange={pf('state')} className="input-dark w-full" placeholder="NY" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">ZIP / Postal Code</label>
                    <input type="text" value={profileForm.zipCode} onChange={pf('zipCode')} className="input-dark w-full" placeholder="10001" />
                  </div>
                  <div>
                    <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Country</label>
                    <input type="text" value={profileForm.country} onChange={pf('country')} className="input-dark w-full" />
                  </div>
                </div>

                {profileError && (
                  <div className="flex items-center gap-2 text-gtb-danger text-sm bg-gtb-danger/10 rounded-xl p-3">
                    <AlertCircle size={14} /> {profileError}
                  </div>
                )}
                {profileSuccess && (
                  <div className="flex items-center gap-2 text-gtb-success text-sm bg-gtb-success/10 rounded-xl p-3">
                    <CheckCircle size={14} /> {profileSuccess}
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingProfile(false)} className="btn-ghost flex-1 justify-center">
                    Cancel
                  </button>
                  <button type="submit" disabled={profileLoading} className="btn-primary flex-1 justify-center gap-2">
                    {profileLoading
                      ? <div className="w-4 h-4 border-2 border-gtb-dark/30 border-t-gtb-dark rounded-full animate-spin" />
                      : <><Save size={15} /> Save Changes</>
                    }
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Info fields (read view) */}
          {!editingProfile && (
            <div className="glass-card rounded-2xl overflow-hidden">
              {[
                { label: 'First Name',    value: user.firstName },
                { label: 'Last Name',     value: user.lastName },
                { label: 'Email',         value: user.email },
                { label: 'Phone',         value: user.phone },
                { label: 'Date of Birth', value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US') : '—' },
                { label: 'Address',       value: [user.address?.street, user.address?.city, user.address?.state, user.address?.country].filter(Boolean).join(', ') || 'United States' },
              ].map(({ label, value }, i) => (
                <div key={label} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
                  <div>
                    <div className="text-gtb-muted text-xs">{label}</div>
                    <div className="text-white font-medium text-sm mt-0.5">{value || '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* KYC Status */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <Shield size={18} className="text-gtb-muted" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Identity Verification</div>
                  <div className="text-gtb-muted text-xs">KYC Status</div>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                background: `${kycColors[user.kycStatus]}15`,
                color:       kycColors[user.kycStatus],
                border:      `1px solid ${kycColors[user.kycStatus]}30`,
              }}>
                {kycLabels[user.kycStatus] || user.kycStatus}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Security tab ── */}
      {tab === 'security' && (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gtb-accent/10 flex items-center justify-center">
                <Lock size={18} className="text-gtb-accent" />
              </div>
              <div>
                <div className="text-white font-semibold">Change Password</div>
                <div className="text-gtb-muted text-xs">Update your login password</div>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Current Password</label>
                <div className="input-wrap">
                  <input
                    type={showCurr ? 'text' : 'password'}
                    value={currPwd}
                    onChange={e => setCurrPwd(e.target.value)}
                    placeholder="••••••••"
                    className="input-dark w-full pr-12"
                    required
                  />
                  <span className="input-icon-right">
                    <button type="button" onClick={() => setShowCurr(s => !s)} className="text-gtb-muted hover:text-white transition-colors">
                      {showCurr ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">New Password</label>
                <div className="input-wrap">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onChange={e => setNewPwd(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-dark w-full pr-12"
                    minLength={8}
                    required
                  />
                  <span className="input-icon-right">
                    <button type="button" onClick={() => setShowNew(s => !s)} className="text-gtb-muted hover:text-white transition-colors">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-gtb-muted text-xs mb-2 uppercase tracking-wider">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={e => setConfirmPwd(e.target.value)}
                  placeholder="Repeat new password"
                  className="input-dark w-full"
                  required
                />
              </div>

              {pwdError && (
                <div className="flex items-center gap-2 text-gtb-danger text-sm bg-gtb-danger/10 rounded-xl p-3">
                  <AlertCircle size={14} /> {pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="flex items-center gap-2 text-gtb-success text-sm bg-gtb-success/10 rounded-xl p-3">
                  <CheckCircle size={14} /> {pwdSuccess}
                </div>
              )}

              <button type="submit" disabled={pwdLoading} className="btn-primary w-full justify-center">
                {pwdLoading ? 'Updating…' : 'Update Password'}
              </button>
            </form>
          </div>

          <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                <Shield size={18} className="text-gtb-muted" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Two-Factor Authentication</div>
                <div className="text-gtb-muted text-xs">Coming soon — adds extra login security</div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs bg-white/[0.06] text-gtb-muted">Soon</div>
          </div>
        </div>
      )}

      {/* ── Notifications tab ── */}
      {tab === 'notifs' && (
        <div className="glass-card rounded-2xl overflow-hidden">
          {[
            { key: 'transfers',  label: 'Transfer Alerts',     desc: 'Get notified on every transfer' },
            { key: 'bills',      label: 'Bill Reminders',      desc: 'Upcoming bill due dates' },
            { key: 'security',   label: 'Security Alerts',     desc: 'Login attempts and suspicious activity' },
            { key: 'marketing',  label: 'Offers & Promotions', desc: 'Product updates and promotions' },
            { key: 'sms',        label: 'SMS Notifications',   desc: 'Receive alerts via text message' },
          ].map(({ key, label, desc }, i) => (
            <div key={key} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-white/[0.05]' : ''}`}>
              <div>
                <div className="text-white font-medium text-sm">{label}</div>
                <div className="text-gtb-muted text-xs mt-0.5">{desc}</div>
              </div>
              <Toggle checked={notifs[key]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
