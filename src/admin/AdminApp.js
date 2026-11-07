import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './admin.css';
import { api, getServer, getToken, setServer, setToken, setUnauthorizedHandler, SERVERS } from './api';
import { ErrorText, Field } from './ui';
import { NewTournament, TournamentList } from './Tournaments';
import Tournament from './Tournament';
import Round from './Round';
import Settings from './Settings';

function Login({ onLogin }) {
  const known = SERVERS.some((s) => s.url === getServer());
  const [server, setServerChoice] = useState(known ? getServer() : 'custom');
  const [custom, setCustom] = useState(known ? '' : getServer());
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setServer(server === 'custom' ? custom : server);
      const res = await api.login({ ...form, email: form.email.trim() });
      setToken(res.access_token);
      onLogin(await api.get('/api/admin/me'));
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bb-login">
      <form className="bb-card" onSubmit={submit}>
        <h1>Organiser sign-in</h1>
        <p className="bb-muted" style={{ marginBottom: 16 }}>Brilliancy Board admin console</p>
        <Field label="Server">
          <select value={server} onChange={(e) => setServerChoice(e.target.value)}>
            {SERVERS.map((s) => (
              <option key={s.url} value={s.url}>{s.label}</option>
            ))}
            <option value="custom">Other URL…</option>
          </select>
        </Field>
        {server === 'custom' && (
          <Field label="Server URL">
            <input type="url" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="https://…" required />
          </Field>
        )}
        <Field label="Email">
          <input type="email" value={form.email} onChange={set('email')} autoComplete="username" required />
        </Field>
        <Field label="Password">
          <input type="password" value={form.password} onChange={set('password')} autoComplete="current-password" required />
        </Field>
        <button type="submit" className="bb-btn bb-btn-primary" disabled={busy} style={{ width: '100%', padding: 11 }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <ErrorText error={error} />
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [me, setMe] = useState(null);
  const [checking, setChecking] = useState(!!getToken());

  const logout = () => {
    setToken(null);
    setMe(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (!getToken()) return;
    api.get('/api/admin/me').then(setMe, logout).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    document.title = 'Kibitzz organiser console';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  if (checking) return <div className="bb-admin"><p className="bb-main bb-muted">Checking session…</p></div>;
  if (!me) return <div className="bb-admin"><Login onLogin={setMe} /></div>;

  const superadmin = me.role === 'superadmin';
  return (
    <div className="bb-admin">
      <header className="bb-top">
        <span className="bb-brand">Kibitzz · Brilliancy Board</span>
        <Link to="/admin">Tournaments</Link>
        {superadmin && <Link to="/admin/new">New tournament</Link>}
        <Link to="/admin/settings">{superadmin ? 'Admins & workers' : 'App users'}</Link>
        <span className="bb-spacer" />
        <span className="bb-server">{getServer()}</span>
        <span>{me.email} ({me.role})</span>
        <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" onClick={logout}>Sign out</button>
      </header>
      <main className="bb-main">
        <Routes>
          <Route index element={<TournamentList me={me} />} />
          <Route path="new" element={<NewTournament />} />
          <Route path="settings" element={<Settings me={me} />} />
          <Route path="t/:tid" element={<Tournament me={me} />} />
          <Route path="t/:tid/round/:n" element={<Round />} />
        </Routes>
      </main>
    </div>
  );
}
