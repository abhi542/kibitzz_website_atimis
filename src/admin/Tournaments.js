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

// Sections read from chess-results: one tournament per category, each with its own number block
export function SectionsSummary({ sections }) {
  if (!sections?.length) return null;
  return (
    <div className="bb-table-wrap" style={{ marginBottom: 12 }}>
      <table className="bb-table">
        <thead><tr><th>Section</th><th>Players</th><th>Numbered from</th><th>chess-results tournament</th></tr></thead>
        <tbody>
          {sections.map((s) => (
            <tr key={s.tnr}>
              <td><strong>{s.label}</strong>{s.key ? '' : <div className="bb-hint">No category found in the title: plays in Open only</div>}</td>
              <td>{s.players ?? '—'}</td>
              <td>{s.offset + 1}</td>
              <td><a href={s.url} target="_blank" rel="noreferrer">{s.title || s.tnr}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Links separated by commas (new lines work too); any page of the tournament works
export const parseLinks = (text) =>
  text.split(/[\s,]+/).map((u) => u.trim()).filter((u) => /chess-results\.com\/tnr\d+/i.test(u)).map((url) => ({ url }));

export function LinksInput({ value, onChange }) {
  const n = parseLinks(value).length;
  return (
    <label className="bb-field">
      <span className="bb-label">chess-results links, one per category, separated by commas</span>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://s1.chess-results.com/tnr1542110.aspx?lan=1&art=0, https://s3.chess-results.com/tnr1542115.aspx?lan=1&art=0"
        style={{ width: '100%', fontFamily: 'monospace', fontSize: 13 }}
      />
      <span className="bb-hint">
        {n ? `${n} link${n > 1 ? 's' : ''}. ` : ''}Any page of each tournament works. The category (U16, Open…) is read from the title. Players are
        numbered per section (U16 → 1001, 1002…; the next section → 2001…) and boards show as “U16 · Board 5”.
      </span>
    </label>
  );
}

export function PlayerPreviewTable({ players }) {
  const sections = players.some((p) => p.section);
  return (
    <div className="bb-table-wrap bb-scroll">
      <table className="bb-table">
        <thead>
          <tr>
            <th>No</th>{sections && <th>Section</th>}<th>Title</th><th>Name</th><th>FIDE ID</th><th>Rating</th><th>Category</th><th>F</th><th>Club</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.start_no}>
              <td>{p.start_no}</td>
              {sections && <td>{p.section} #{p.section_no}</td>}
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
  const [links, setLinks] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <>
      <h1>New tournament</h1>
      <p className="bb-muted" style={{ margin: '6px 0 16px' }}>
        Paste the chess-results links of every category (one tournament per category), or upload a single starting-rank
        Excel. The tournament is created as a draft; set it live from its Overview tab when players can join.
      </p>
      <ImportFlow
        title="1. Player list"
        hint="Links: rounds can then be fetched from chess-results too. Excel: chess-results → Starting rank → Excel export (.xlsx, under 5 MB)."
        previewUpload={(file) => api.upload('/api/admin/tournaments/preview', file)}
        beforeFetch={<LinksInput value={links} onChange={setLinks} />}
        fetchValid={parseLinks(links).length > 0}
        fetchPreview={() => api.post('/api/admin/tournaments/preview-chess-results', { sections: parseLinks(links) })}
        extraValid={form.name.trim().length >= 3}
        confirmLabel="Create tournament"
        renderPreview={(p) => (
          <>
            <SectionsSummary sections={p.sections} />
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
