import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, downloadFile } from './api';
import CategorySwitches from './CategorySwitches';
import { Action, Badge, Counts, ErrorText, ImportFlow, Loading, useLoad, Warnings, fmtDate } from './ui';

const STATUS_MOVES = { draft: ['live'], live: ['finished', 'draft'], finished: ['live'] };
const TABS = ['Overview', 'Players', 'Claims', 'Rounds', 'Audit'];

export default function Tournament({ me }) {
  const { tid } = useParams();
  const [tab, setTab] = useState('Overview');
  const t = useLoad(() => api.get(`/api/admin/t/${tid}`), [tid]);

  return (
    <Loading state={t}>
      {(tour) => (
        <>
          <Link to="/admin" className="bb-muted">← All tournaments</Link>
          <div className="bb-row" style={{ marginTop: 6 }}>
            <h1>{tour.name}</h1>
            <Badge value={tour.status} />
          </div>
          <div className="bb-tabs">
            {TABS.map((name) => (
              <button key={name} type="button" className={`bb-tab${tab === name ? ' active' : ''}`} onClick={() => setTab(name)}>
                {name}
                {name === 'Claims' && tour.counts.claims_pending > 0 ? ` (${tour.counts.claims_pending})` : ''}
              </button>
            ))}
          </div>
          {tab === 'Overview' && <Overview tour={tour} reload={t.reload} me={me} />}
          {tab === 'Players' && <Players tid={tid} />}
          {tab === 'Claims' && <Claims tid={tid} onChange={t.reload} />}
          {tab === 'Rounds' && <Rounds tid={tid} />}
          {tab === 'Audit' && <Audit tid={tid} />}
        </>
      )}
    </Loading>
  );
}

// The on/off switches have their own card; this leaves the rules
const withoutSwitches = ({ awards, group_types, ...rules } = {}) => rules;

function Overview({ tour, reload }) {
  const [awardText, setAwardText] = useState(JSON.stringify(withoutSwitches(tour.award_config || {}), null, 2));
  const [awardError, setAwardError] = useState(null);

  const saveAward = () => {
    let parsed;
    try {
      parsed = JSON.parse(awardText || '{}');
    } catch {
      setAwardError({ code: 'BAD_JSON', message: 'Award overrides must be valid JSON' });
      return Promise.resolve();
    }
    setAwardError(null);
    return api.post(`/api/admin/t/${tour.id}/award-config`, { award_config: parsed });
  };

  return (
    <>
      <div className="bb-grid2">
        <div className="bb-card">
          <h3>Details</h3>
          <dl className="bb-kv">
            <dt>Join code</dt><dd><code style={{ fontSize: 16 }}>{tour.join_code}</code></dd>
            <dt>QR link</dt><dd><a href={tour.qr_url} target="_blank" rel="noreferrer">{tour.qr_url}</a></dd>
            <dt>Slug</dt><dd>{tour.slug}</dd>
            <dt>chess-results</dt><dd>{tour.chess_results_url ? <a href={tour.chess_results_url} target="_blank" rel="noreferrer">open</a> : '—'}</dd>
            <dt>Engine</dt><dd>{tour.engine_config?.id || 'not pinned yet'} · {tour.engine_config?.nodes?.toLocaleString()} nodes</dd>
            <dt>Rules version</dt><dd>{tour.rules_version}</dd>
            <dt>Created</dt><dd>{fmtDate(tour.created_at)}</dd>
          </dl>
          <Counts counts={tour.counts} />
          {tour.players_file_id && (
            <Action kind="ghost" small run={() => downloadFile(tour.players_file_id, `${tour.slug}-players.xlsx`)}>
              Download imported player list
            </Action>
          )}
        </div>
        <div className="bb-card">
          <h3>Status</h3>
          <p className="bb-muted" style={{ marginBottom: 10 }}>
            Players can join only while the tournament is <strong>live</strong>. Prizes are signed off once it is finished.
          </p>
          <div className="bb-row">
            <Badge value={tour.status} />
            {STATUS_MOVES[tour.status].map((s) => (
              <Action
                key={s}
                kind={s === 'live' ? 'primary' : 'ghost'}
                confirm={`Set tournament to ${s}?`}
                run={() => api.post(`/api/admin/t/${tour.id}/status`, { status: s })}
                onDone={reload}
              >
                Set {s}
              </Action>
            ))}
          </div>
        </div>
      </div>

      <ImportFlow
        title="Re-import player list"
        hint="Upload an updated chess-results list. Players with claims or games are never deleted."
        previewUpload={(file) => api.upload(`/api/admin/t/${tour.id}/players/preview`, file)}
        renderPreview={(p) => (
          <>
            <Counts counts={p.counts} />
            <Warnings items={p.warnings} />
            <Counts
              counts={{
                added: p.diff.added.length,
                updated: p.diff.updated.length,
                removed: p.diff.removed.length,
                kept_missing: p.diff.kept_missing.length,
              }}
            />
            {p.diff.updated.length > 0 && (
              <div className="bb-table-wrap bb-scroll">
                <table className="bb-table">
                  <thead><tr><th>No</th><th>Changes (old → new)</th></tr></thead>
                  <tbody>
                    {p.diff.updated.map((u) => (
                      <tr key={u.start_no}>
                        <td>{u.start_no}</td>
                        <td>{Object.entries(u.changes).map(([k, [a, b]]) => `${k}: ${a ?? '—'} → ${b ?? '—'}`).join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {p.diff.kept_missing.length > 0 && (
              <p className="bb-muted">Kept although missing from the file (they have claims or games): {p.diff.kept_missing.join(', ')}</p>
            )}
          </>
        )}
        confirm={(p) => api.post(`/api/admin/t/${tour.id}/players`, { preview_id: p.preview_id })}
        confirmLabel="Apply changes"
        onDone={reload}
      />

      <CategorySwitches tour={tour} />

      <div className="bb-card">
        <h3>Award rules</h3>
        <p className="bb-muted">
          Overrides on top of the defaults (min group size, rating bands, category merges, top N). Locked after the first
          leaderboard is published; re-import the player list afterwards to regroup players.
        </p>
        <div className="bb-grid2" style={{ marginTop: 10 }}>
          <textarea rows={10} value={awardText} onChange={(e) => setAwardText(e.target.value)} style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 12 }} />
          <pre className="bb-note bb-note-info" style={{ margin: 0, overflow: 'auto', maxHeight: 240, fontSize: 12 }}>
            {'Effective now:\n' + JSON.stringify(withoutSwitches(tour.award_config_effective), null, 2)}
          </pre>
        </div>
        <Action run={saveAward} onDone={reload}>Save overrides</Action>
        <ErrorText error={awardError} />
      </div>
    </>
  );
}

function Players({ tid }) {
  const [q, setQ] = useState('');
  const state = useLoad(() => api.get(`/api/admin/t/${tid}/players`), [tid]);
  return (
    <div className="bb-card">
      <div className="bb-row">
        <input type="text" placeholder="Filter by name, FIDE ID or start no" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 300 }} />
      </div>
      <Loading state={state}>
        {(players) => {
          const needle = q.trim().toLowerCase();
          const rows = needle
            ? players.filter((p) => `${p.start_no} ${p.display_name} ${p.fide_id || ''} ${p.club || ''}`.toLowerCase().includes(needle))
            : players;
          return (
            <>
              <p className="bb-muted">{rows.length} of {players.length} players · {players.filter((p) => p.claimed_by).length} claimed</p>
              <div className="bb-table-wrap">
                <table className="bb-table">
                  <thead>
                    <tr><th>No</th><th>Title</th><th>Name</th><th>FIDE ID</th><th>Rating</th><th>Cat.</th><th>Groups</th><th>Claimed</th><th>Public</th></tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => (
                      <tr key={p.id}>
                        <td>{p.start_no}</td>
                        <td>{p.title}</td>
                        <td>{p.display_name}</td>
                        <td>{p.fide_id}</td>
                        <td>{p.rating || '—'}</td>
                        <td>{p.category}</td>
                        <td className="bb-muted">{(p.groups || []).join(', ')}</td>
                        <td>{p.claimed_by ? <Badge value="approved" /> : ''}</td>
                        <td>{p.public_consent ? '✓' : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        }}
      </Loading>
    </div>
  );
}

function Claims({ tid, onChange }) {
  const [status, setStatus] = useState('pending');
  const [selected, setSelected] = useState([]);
  const [bulkResult, setBulkResult] = useState(null);
  const state = useLoad(() => api.get(`/api/admin/t/${tid}/claims${status ? `?status=${status}` : ''}`), [tid, status]);
  const refresh = () => {
    setSelected([]);
    state.reload();
    onChange();
  };
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const withReason = (path, label) => () => {
    const reason = window.prompt(`${label}: reason shown to the user`);
    if (reason === null) return Promise.resolve(null);
    return api.post(path, { reason: reason || null });
  };

  return (
    <div className="bb-card">
      <div className="bb-row">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setSelected([]); }}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revoked">Revoked</option>
          <option value="">All</option>
        </select>
        <Action
          disabled={selected.length === 0}
          run={() => api.post('/api/admin/claims/bulk-approve', { ids: selected })}
          onDone={(r) => { setBulkResult(r); refresh(); }}
        >
          Approve selected ({selected.length})
        </Action>
        <span className="bb-muted">Conflicts and accounts over 3 players can't be bulk-approved; review them one by one.</span>
      </div>
      {bulkResult && (
        <Warnings
          tone={bulkResult.skipped.length ? 'warn' : 'good'}
          title={`Approved ${bulkResult.approved.length}, skipped ${bulkResult.skipped.length}`}
          items={bulkResult.skipped.map((s) => `${s.id}: ${s.reason}`)}
        />
      )}
      <Loading state={state}>
        {(rows) =>
          rows.length === 0 ? (
            <p className="bb-muted">No {status || ''} claims.</p>
          ) : (
            <div className="bb-table-wrap">
              <table className="bb-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all bulk-approvable"
                        checked={rows.some((r) => r.bulk_ok) && rows.filter((r) => r.bulk_ok).every((r) => selected.includes(r.id))}
                        onChange={(e) => setSelected(e.target.checked ? rows.filter((r) => r.bulk_ok).map((r) => r.id) : [])}
                      />
                    </th>
                    <th>Player</th><th>Relationship</th><th>Consent</th><th>Account</th><th>Flags</th><th>Status</th><th>Requested</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id} className={c.conflict ? 'bb-flag-bad' : c.over_limit ? 'bb-flag' : ''}>
                      <td>{c.bulk_ok && <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggle(c.id)} />}</td>
                      <td>
                        <strong>#{c.player?.start_no} {c.player?.display_name}</strong>
                        <div className="bb-muted">{[c.player?.title, c.player?.rating, c.player?.category, c.player?.fide_id].filter(Boolean).join(' · ')}</div>
                      </td>
                      <td>{c.relationship}</td>
                      <td>
                        {c.consent_given ? 'public' : 'private'}
                        {c.parent_consent && <div className="bb-muted">parent: {c.parent_consent.parent_name}</div>}
                      </td>
                      <td>
                        <code title="user id">{c.user_id.slice(-8)}</code>
                        <div className="bb-muted">{c.account_active_claims} active</div>
                      </td>
                      <td>
                        {c.conflict && <Badge value="conflict" />} {c.over_limit && <Badge value="over limit" />}
                      </td>
                      <td>
                        <Badge value={c.status} />
                        {c.reason && <div className="bb-muted">{c.reason}</div>}
                      </td>
                      <td className="bb-muted">{fmtDate(c.created_at)}</td>
                      <td>
                        <div className="bb-row" style={{ margin: 0 }}>
                          {c.status === 'pending' && (
                            <>
                              <Action small run={() => api.post(`/api/admin/claims/${c.id}/approve`)} onDone={refresh}>Approve</Action>
                              <Action small kind="danger" run={withReason(`/api/admin/claims/${c.id}/reject`, 'Reject')} onDone={(r) => r && refresh()}>Reject</Action>
                            </>
                          )}
                          {c.status === 'approved' && (
                            <Action small kind="danger" run={withReason(`/api/admin/claims/${c.id}/revoke`, 'Revoke')} onDone={(r) => r && refresh()}>Revoke</Action>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </Loading>
    </div>
  );
}

export function BoardsPreviewTable({ boards }) {
  return (
    <div className="bb-table-wrap bb-scroll">
      <table className="bb-table">
        <thead>
          <tr><th>Board</th><th>White</th><th>Black</th><th>Result</th><th>Kind</th></tr>
        </thead>
        <tbody>
          {boards.map((b) => (
            <tr key={b.board_no} className={b.kind === 'forfeit' || b.kind === 'bye' ? 'bb-flag' : ''}>
              <td>{b.board_no}</td>
              <td>#{b.white_no} {b.white_name}</td>
              <td>{b.black_no ? `#${b.black_no} ${b.black_name || ''}` : '—'}</td>
              <td>{b.result_raw ?? b.result ?? '—'}</td>
              <td>{b.kind}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RoundFilePreview({ p }) {
  const problems = Object.entries(p.problems || {}).filter(([, v]) => v && v.length).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v.join(', ')}`);
  const changes = Object.entries(p.changes || {}).filter(([, v]) => v && v.length).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${JSON.stringify(v)}`);
  return (
    <>
      <Counts counts={p.counts} />
      <Warnings items={p.warnings} />
      <Warnings title="Problems" items={problems} tone="bad" />
      <Warnings title="Changes from what's already imported" items={changes} />
      <BoardsPreviewTable boards={p.boards || []} />
    </>
  );
}

function Rounds({ tid }) {
  const state = useLoad(() => api.get(`/api/admin/t/${tid}/rounds`), [tid]);
  const [n, setN] = useState('');

  return (
    <Loading state={state}>
      {(rounds) => {
        const next = rounds.length ? Math.max(...rounds.map((r) => r.round_no)) + 1 : 1;
        const roundNo = Number(n) || next;
        return (
          <>
            <div className="bb-card">
              <h3>Rounds</h3>
              {rounds.length === 0 && <p className="bb-muted">No rounds yet. Import round 1 pairings below.</p>}
              {rounds.map((r) => (
                <div key={r.id} className="bb-list-item">
                  <div>
                    <Link to={`/admin/t/${tid}/round/${r.round_no}`} style={{ fontWeight: 700, fontSize: 15 }}>Round {r.round_no}</Link>
                    <div className="bb-muted">
                      {r.boards} boards · submissions: {Object.entries(r.submissions).map(([k, v]) => `${v} ${k}`).join(', ') || 'none'}
                    </div>
                  </div>
                  <div className="bb-row" style={{ margin: 0 }}>
                    <Badge value={r.status} />
                    <Link className="bb-btn bb-btn-ghost bb-btn-sm" to={`/admin/t/${tid}/round/${r.round_no}`}>Open</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="bb-card" style={{ paddingBottom: 4 }}>
              <div className="bb-row" style={{ margin: 0 }}>
                <span className="bb-label">Round number</span>
                <input type="number" min={1} value={n} placeholder={String(next)} onChange={(e) => setN(e.target.value)} style={{ width: 90 }} />
              </div>
            </div>
            <ImportFlow
              key={roundNo}
              title={`Import round ${roundNo} pairings`}
              hint="chess-results → Pairings for this round → Excel export. Uploads stay closed until results are imported."
              previewUpload={(file) => api.upload(`/api/admin/t/${tid}/rounds/${roundNo}/pairings/preview`, file)}
              renderPreview={(p) => <RoundFilePreview p={p} />}
              confirm={(p) => api.post(`/api/admin/t/${tid}/rounds/${roundNo}/pairings`, { preview_id: p.preview_id })}
              confirmLabel="Import pairings"
              onDone={() => { setN(''); state.reload(); }}
            />
          </>
        );
      }}
    </Loading>
  );
}

function Audit({ tid }) {
  const [pages, setPages] = useState([]);
  const [before, setBefore] = useState(null);
  const state = useLoad(() => api.get(`/api/admin/t/${tid}/audit?limit=100${before ? `&before=${before}` : ''}`), [tid, before]);
  return (
    <div className="bb-card">
      <Loading state={state}>
        {(res) => {
          const rows = [...pages, ...res.rows];
          return (
            <>
              <div className="bb-table-wrap">
                <table className="bb-table">
                  <thead><tr><th>When</th><th>Action</th><th>Actor</th><th>Entity</th><th>Before → after</th></tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id}>
                        <td className="bb-muted" style={{ whiteSpace: 'nowrap' }}>{fmtDate(r.at)}</td>
                        <td><strong>{r.action}</strong></td>
                        <td>{r.actor_role} <code>{String(r.actor_id || '').slice(-6)}</code></td>
                        <td>{r.entity} <code>{String(r.entity_id || '').slice(-6)}</code></td>
                        <td><code>{r.before ? JSON.stringify(r.before) : ''}{r.before && r.after ? ' → ' : ''}{r.after ? JSON.stringify(r.after) : ''}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {res.rows.length === 100 && (
                <button type="button" className="bb-btn bb-btn-ghost" onClick={() => { setPages(rows); setBefore(res.next_before); }}>
                  Load older
                </button>
              )}
            </>
          );
        }}
      </Loading>
    </div>
  );
}
