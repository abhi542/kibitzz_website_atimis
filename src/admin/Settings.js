import { useState } from 'react';
import { api } from './api';
import { Action, Badge, Field, Loading, useLoad, fmtDate } from './ui';

export default function Settings({ me }) {
  if (me.role !== 'superadmin') {
    return (
      <>
        <h1>App users</h1>
        <div style={{ marginTop: 16 }}><AppRoles superadmin={false} /></div>
      </>
    );
  }
  return (
    <>
      <h1>Admins & workers</h1>
      <div className="bb-grid2" style={{ marginTop: 16 }}>
        <Admins me={me} />
        <Assign />
      </div>
      <AppRoles superadmin />
      <Workers />
    </>
  );
}

function OneTimeSecret({ title, children }) {
  return (
    <div className="bb-note bb-note-warn">
      <strong>{title}</strong> This is shown once; copy it now.
      <div className="bb-secret" style={{ marginTop: 8 }}>{children}</div>
    </div>
  );
}

function Admins({ me }) {
  const state = useLoad(() => api.get('/api/admin/admins'), []);
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'admin' });
  const [created, setCreated] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="bb-card">
      <h3>Organiser accounts</h3>
      <Loading state={state}>
        {(admins) =>
          admins.map((a) => (
            <div key={a.id} className="bb-list-item">
              <div>
                <strong>{a.name || a.email}</strong>
                <div className="bb-muted">{a.email} · {a.role}</div>
              </div>
              <div className="bb-row" style={{ margin: 0 }}>
                <Badge value={a.active ? 'live' : 'disabled'} />
                {a.active && a.id !== me.id && (
                  <Action small kind="danger" confirm={`Disable ${a.email}?`} run={() => api.post(`/api/admin/admins/${a.id}/disable`)} onDone={state.reload}>
                    Disable
                  </Action>
                )}
              </div>
            </div>
          ))
        }
      </Loading>
      <h3 style={{ marginTop: 18 }}>Add organiser</h3>
      <Field label="Email"><input type="email" value={form.email} onChange={set('email')} /></Field>
      <Field label="Name"><input type="text" value={form.name} onChange={set('name')} /></Field>
      <Field label="Password" hint="At least 12 characters"><input type="password" value={form.password} onChange={set('password')} autoComplete="new-password" /></Field>
      <Field label="Role">
        <select value={form.role} onChange={set('role')}>
          <option value="admin">admin (assigned tournaments only)</option>
          <option value="superadmin">superadmin</option>
        </select>
      </Field>
      <Action
        disabled={!form.email || form.password.length < 12}
        run={() => api.post('/api/admin/admins', { ...form, name: form.name || null })}
        onDone={(a) => {
          setCreated(a);
          setForm({ email: '', name: '', password: '', role: 'admin' });
          state.reload();
        }}
      >
        Create organiser
      </Action>
      {created && (
        <p className="bb-note bb-note-good">
          {created.email} can now sign in with the password you set.
        </p>
      )}
    </div>
  );
}

function Assign() {
  const tournaments = useLoad(() => api.get('/api/admin/tournaments'), []);
  const admins = useLoad(() => api.get('/api/admin/admins'), []);
  const [tid, setTid] = useState('');
  const [aid, setAid] = useState('');
  const [done, setDone] = useState(null);

  return (
    <div className="bb-card">
      <h3>Assign organiser to tournament</h3>
      <p className="bb-muted" style={{ marginBottom: 10 }}>An admin only sees the tournaments they are assigned to. Superadmins see all.</p>
      <Field label="Tournament">
        <select value={tid} onChange={(e) => setTid(e.target.value)}>
          <option value="">Choose…</option>
          {(tournaments.data || []).map((t) => <option key={t.id} value={t.id}>{t.name} ({t.join_code})</option>)}
        </select>
      </Field>
      <Field label="Organiser">
        <select value={aid} onChange={(e) => setAid(e.target.value)}>
          <option value="">Choose…</option>
          {(admins.data || []).filter((a) => a.active).map((a) => <option key={a.id} value={a.id}>{a.email} ({a.role})</option>)}
        </select>
      </Field>
      <div className="bb-row">
        <Action disabled={!tid || !aid} run={() => api.post(`/api/admin/t/${tid}/admins`, { admin_id: aid })} onDone={() => setDone('Assigned.')}>Assign</Action>
        <Action kind="danger" disabled={!tid || !aid} run={() => api.del(`/api/admin/t/${tid}/admins/${aid}`)} onDone={(r) => setDone(r.removed ? 'Removed.' : 'Was not assigned.')}>Remove</Action>
      </div>
      {done && <p className="bb-muted">{done}</p>}
    </div>
  );
}

const ROLE_HELP = {
  user: 'links 1 player, uploads only that player\'s games',
  arbiter: 'can upload the game on any board',
  manager: 'can link unlimited players (coach, academy)',
};

function AppRoles({ superadmin }) {
  const state = useLoad(() => api.get('/api/admin/app-roles'), []);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(superadmin ? 'arbiter' : 'manager');

  return (
    <div className="bb-card" style={{ marginBottom: 16 }}>
      <h3>App user roles</h3>
      <p className="bb-muted">
        Everyone in the app is a plain user ({ROLE_HELP.user}) unless listed here; app admins can always link unlimited players. Find them by the email they sign in to the app with.
      </p>
      <div className="bb-row">
        <input type="email" placeholder="app user email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: 260 }} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {superadmin && <option value="arbiter">arbiter: {ROLE_HELP.arbiter}</option>}
          <option value="manager">manager: {ROLE_HELP.manager}</option>
          <option value="user">plain user (remove role)</option>
        </select>
        <Action disabled={!email.trim()} run={() => api.post('/api/admin/app-roles', { email: email.trim(), role })} onDone={() => { setEmail(''); state.reload(); }}>
          Save role
        </Action>
      </div>
      <Loading state={state}>
        {(rows) =>
          rows.length === 0 ? <p className="bb-muted">{superadmin ? 'No arbiters or managers yet.' : 'No managers yet.'}</p> : rows.map((r) => (
            <div key={r.user_id} className="bb-list-item">
              <div>
                <strong>{r.name || r.email}</strong>
                <div className="bb-muted">{r.email} · {ROLE_HELP[r.role]}</div>
              </div>
              <div className="bb-row" style={{ margin: 0 }}>
                <Badge value={r.role} />
                <Action small kind="danger" confirm={`Make ${r.email} a plain user?`} run={() => api.post('/api/admin/app-roles', { email: r.email, role: 'user' })} onDone={state.reload}>
                  Remove
                </Action>
              </div>
            </div>
          ))
        }
      </Loading>
    </div>
  );
}

function Workers() {
  const state = useLoad(() => api.get('/api/admin/workers/tokens'), []);
  const [label, setLabel] = useState('');
  const [issued, setIssued] = useState(null);

  return (
    <div className="bb-card">
      <h3>Analysis worker tokens</h3>
      <p className="bb-muted">The Stockfish worker uses one of these to claim analysis jobs.</p>
      <div className="bb-row">
        <input type="text" placeholder="Label, e.g. mac-mini worker" value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: 260 }} />
        <Action disabled={label.trim().length < 2} run={() => api.post('/api/admin/workers/tokens', { label: label.trim() })} onDone={(t) => { setIssued(t); setLabel(''); state.reload(); }}>
          Issue token
        </Action>
      </div>
      {issued && <OneTimeSecret title={`Token for “${issued.label}”.`}>{issued.token}</OneTimeSecret>}
      <Loading state={state}>
        {(tokens) =>
          tokens.map((t) => (
            <div key={t.id} className="bb-list-item">
              <div>
                <strong>{t.label}</strong>
                <div className="bb-muted">created {fmtDate(t.created_at)} · last used {fmtDate(t.last_used_at)}</div>
              </div>
              {t.revoked_at ? (
                <Badge value="revoked" />
              ) : (
                <Action small kind="danger" confirm={`Revoke “${t.label}”?`} run={() => api.del(`/api/admin/workers/tokens/${t.id}`)} onDone={state.reload}>Revoke</Action>
              )}
            </div>
          ))
        }
      </Loading>
    </div>
  );
}
