import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from './api';
import { Badge, Counts, Field, ImportFlow, Loading, useLoad, Warnings, fmtDate } from './ui';

export function TournamentList({ me }) {
  const state = useLoad(() => api.get('/api/admin/tournaments'), []);
  return (
    <>
      <div className="bb-row" style={{ justifyContent: 'space-between' }}>
        <h1>Tournaments</h1>
        {me.role === 'superadmin' && <Link className="bb-btn bb-btn-primary" to="/admin/new">+ New tournament</Link>}
      </div>
      <div className="bb-card">
        <Loading state={state}>
          {(rows) =>
            rows.length === 0 ? (
              <p className="bb-muted">No tournaments yet. Create one from a chess-results player list.</p>
            ) : (
              rows.map((t) => (
                <div key={t.id} className="bb-list-item">
                  <div>
                    <Link to={`/admin/t/${t.id}`} style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</Link>
                    <div className="bb-muted">
                      Join code <code>{t.join_code}</code> · {t.slug} · created {fmtDate(t.created_at)}
                    </div>
                  </div>
                  <Badge value={t.status} />
                </div>
              ))
            )
          }
        </Loading>
      </div>
    </>
  );
}

export function PlayerPreviewTable({ players }) {
  return (
    <div className="bb-table-wrap bb-scroll">
      <table className="bb-table">
        <thead>
          <tr>
            <th>No</th><th>Title</th><th>Name</th><th>FIDE ID</th><th>Rating</th><th>Category</th><th>F</th><th>Club</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.start_no}>
              <td>{p.start_no}</td>
              <td>{p.title}</td>
              <td>{p.display_name}</td>
              <td>{p.fide_id}</td>
              <td>{p.rating || '—'}</td>
              <td>{p.category}</td>
              <td>{p.female ? '✓' : ''}</td>
              <td>{p.club}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NewTournament() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', chess_results_url: '', slug: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <h1>New tournament</h1>
      <p className="bb-muted" style={{ margin: '6px 0 16px' }}>
        Upload the starting-rank list exported from chess-results (Excel). The tournament is created as a draft;
        set it live from its Overview tab when players can join.
      </p>
      <ImportFlow
        title="1. Player list"
        hint="chess-results → Starting rank → Excel export (.xlsx, under 5 MB)"
        previewUpload={(file) => api.upload('/api/admin/tournaments/preview', file)}
        extraValid={form.name.trim().length >= 3}
        confirmLabel="Create tournament"
        renderPreview={(p) => (
          <>
            <Counts counts={p.counts} />
            <Warnings items={p.warnings} />
            <PlayerPreviewTable players={p.players || []} />
            <h3 style={{ marginTop: 18 }}>2. Details</h3>
            <div className="bb-grid2">
              <Field label="Tournament name" hint="3–150 characters">
                <input type="text" value={form.name} onChange={set('name')} placeholder="Belagavi Open 2026" />
              </Field>
              <Field label="chess-results URL (optional)">
                <input type="url" value={form.chess_results_url} onChange={set('chess_results_url')} placeholder="https://chess-results.com/tnr…" />
              </Field>
              <Field label="Slug (optional)" hint="Used in the QR link; generated from the name if empty">
                <input type="text" value={form.slug} onChange={set('slug')} placeholder="belagavi-open-2026" />
              </Field>
            </div>
          </>
        )}
        confirm={(p) =>
          api.post('/api/admin/tournaments', {
            preview_id: p.preview_id,
            name: form.name.trim(),
            chess_results_url: form.chess_results_url.trim() || null,
            slug: form.slug.trim() || null,
          })
        }
        onDone={(t) => navigate(`/admin/t/${t.id}`)}
      />
    </>
  );
}
