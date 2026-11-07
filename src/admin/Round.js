import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, downloadFile, getServer } from './api';
import { Action, Badge, ImportFlow, Loading, useLoad, Warnings, fmtDate } from './ui';
import { RoundFilePreview } from './Tournament';
import GameViewer, { rowOpens } from './GameViewer';

const TABS = ['Results & status', 'Boards', 'Submissions', 'Analyses', 'Leaderboard'];

export default function Round() {
  const { tid, n } = useParams();
  const [tab, setTab] = useState(TABS[0]);
  const tour = useLoad(() => api.get(`/api/admin/t/${tid}`), [tid]);
  const rounds = useLoad(() => api.get(`/api/admin/t/${tid}/rounds`), [tid]);
  const round = rounds.data && rounds.data.find((r) => String(r.round_no) === String(n));
  const base = `/api/admin/t/${tid}/rounds/${n}`;

  return (
    <>
      <Link to={`/admin/t/${tid}`} className="bb-muted">← {tour.data ? tour.data.name : 'Tournament'}</Link>
      <div className="bb-row" style={{ marginTop: 6 }}>
        <h1>Round {n}</h1>
        {round && <Badge value={round.status} />}
      </div>
      <div className="bb-tabs">
        {TABS.map((name) => (
          <button key={name} type="button" className={`bb-tab${tab === name ? ' active' : ''}`} onClick={() => setTab(name)}>{name}</button>
        ))}
      </div>
      <Loading state={rounds}>
        {() =>
          !round ? (
            <p className="bb-muted">Round {n} has no pairings yet. Import them from the tournament's Rounds tab.</p>
          ) : (
            <>
              {tab === TABS[0] && <Status tid={tid} n={n} round={round} base={base} reload={rounds.reload} />}
              {tab === 'Boards' && <Boards base={base} />}
              {tab === 'Submissions' && <Submissions base={base} />}
              {tab === 'Analyses' && <Analyses tid={tid} base={base} />}
              {tab === 'Leaderboard' && <Leaderboard base={base} round={round} slug={tour.data?.slug} reload={rounds.reload} />}
            </>
          )
        }
      </Loading>
    </>
  );
}

function Status({ tid, n, round, base, reload }) {
  return (
    <>
      <div className="bb-card">
        <h3>Round flow</h3>
        <p className="bb-muted">
          paired → <strong>closed</strong> (results imported, players can upload) → <strong>reviewing</strong> → <strong>published</strong>.
          Approve submissions and mark analyses usable before publishing.
        </p>
        <div className="bb-row">
          <Badge value={round.status} />
          {['closed', 'published'].includes(round.status) && (
            <Action run={() => api.post(`${base}/start-review`)} onDone={reload}>Start review</Action>
          )}
          {round.status === 'reviewing' && (
            <Action kind="ghost" run={() => api.post(`${base}/reopen`)} onDone={reload}>Reopen (back to closed)</Action>
          )}
          {round.pairings_file_id && (
            <Action kind="ghost" small run={() => downloadFile(round.pairings_file_id, `round${n}-pairings.xlsx`)}>Download pairings file</Action>
          )}
          {round.results_file_id && (
            <Action kind="ghost" small run={() => downloadFile(round.results_file_id, `round${n}-results.xlsx`)}>Download results file</Action>
          )}
        </div>
        <p className="bb-muted">
          {round.boards} boards · submissions: {Object.entries(round.submissions).map(([k, v]) => `${v} ${k}`).join(', ') || 'none'} · updated {fmtDate(round.updated_at)}
        </p>
      </div>
      <ImportFlow
        title={round.status === 'paired' ? 'Import results' : 'Re-import results (correction)'}
        hint="chess-results → this round's results → Excel export. Importing results opens uploads for players. A changed result on an approved game creates a new game version and sends the round back to review."
        previewUpload={(file) => api.upload(`${base}/results/preview`, file)}
        renderPreview={(p) => <RoundFilePreview p={p} />}
        confirm={(p) => api.post(`${base}/results`, { preview_id: p.preview_id })}
        confirmLabel="Import results"
        onDone={reload}
      />
      {round.status === 'paired' && (
        <ImportFlow
          title="Re-import pairings"
          hint="Only while the round is still paired."
          previewUpload={(file) => api.upload(`/api/admin/t/${tid}/rounds/${n}/pairings/preview`, file)}
          renderPreview={(p) => <RoundFilePreview p={p} />}
          confirm={(p) => api.post(`/api/admin/t/${tid}/rounds/${n}/pairings`, { preview_id: p.preview_id })}
          confirmLabel="Import pairings"
          onDone={reload}
        />
      )}
    </>
  );
}

function Boards({ base }) {
  const state = useLoad(() => api.get(`${base}/boards`), [base]);
  return (
    <div className="bb-card">
      <Loading state={state}>
        {(boards) => (
          <div className="bb-table-wrap">
            <table className="bb-table">
              <thead><tr><th>Board</th><th>White</th><th>Black</th><th>Result</th><th>Played</th><th>Kind</th></tr></thead>
              <tbody>
                {boards.map((b) => (
                  <tr key={b.id}>
                    <td>{b.board_no}</td>
                    <td>{b.white_name}</td>
                    <td>{b.black_name || '—'}</td>
                    <td>{b.result_raw ?? b.result ?? '—'}</td>
                    <td>{b.game_played == null ? '—' : b.game_played ? '✓' : '✗'}</td>
                    <td>{b.kind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Loading>
    </div>
  );
}

// Accepts PGN text or space-separated UCI moves
function movesBody(text) {
  const t = text.trim();
  if (/^([a-h][1-8][a-h][1-8][qrbn]?\s*)+$/i.test(t)) return { moves_uci: t.split(/\s+/) };
  return { pgn: t };
}

function Checks({ checks }) {
  if (!checks) return null;
  return (
    <div>
      {Object.entries(checks).map(([k, c]) => (
        <div key={k} title={c.note || ''} style={{ color: c.ok ? '#11695F' : '#B42318' }}>
          {c.ok ? '✓' : '✗'} {k.replace(/_/g, ' ')}{!c.ok && c.note ? `: ${c.note}` : ''}
        </div>
      ))}
    </div>
  );
}

function Submissions({ base }) {
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState([]);
  const [bulk, setBulk] = useState(null);
  const [viewing, setViewing] = useState(null);
  const state = useLoad(() => api.get(`${base}/submissions${status ? `?status=${status}` : ''}`), [base, status]);
  const boards = useLoad(() => api.get(`${base}/boards`), [base]);
  const refresh = () => {
    setSelected([]);
    state.reload();
  };
  const ask = (label) => window.prompt(label);
  const open = (s) => {
    const b = boards.data?.find((x) => x.board_no === s.board_no);
    setViewing({
      title: `Board ${s.board_no}${b ? `: ${b.white_name} vs ${b.black_name || '—'}` : ''}`,
      subtitle: `Submission · ${s.source} · ${s.status}`,
      result: s.board_result,
      uci: s.moves_uci || [],
    });
  };

  const approveEdited = (s) => () => {
    const text = ask('Corrected moves: paste PGN or space-separated UCI (leave empty to cancel)');
    if (!text) return Promise.resolve(null);
    return api.post(`/api/admin/submissions/${s.id}/approve`, movesBody(text));
  };
  const reject = (s) => () => {
    const reason = ask('Reject: reason shown to the uploader');
    if (reason === null) return Promise.resolve(null);
    return api.post(`/api/admin/submissions/${s.id}/reject`, { reason: reason || null });
  };
  const correct = (s) => () => {
    const text = ask('Corrected moves for the official game: paste PGN or space-separated UCI');
    if (!text) return Promise.resolve(null);
    const reason = ask('Why are the moves being corrected? (min 3 characters)');
    if (!reason) return Promise.resolve(null);
    return api.post(`/api/admin/submissions/${s.id}/correct`, { ...movesBody(text), reason });
  };

  return (
    <div className="bb-card">
      <div className="bb-row">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setSelected([]); }}>
          <option value="">All</option>
          <option value="uploaded">Uploaded</option>
          <option value="confirmed">Confirmed</option>
          <option value="disputed">Disputed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <Action disabled={!selected.length} run={() => api.post('/api/admin/submissions/bulk-approve', { ids: selected })} onDone={(r) => { setBulk(r); refresh(); }}>
          Approve selected ({selected.length})
        </Action>
        <span className="bb-muted">Problems are listed first: disputes, failed checks, re-review flags.</span>
      </div>
      {bulk && (
        <Warnings tone={bulk.skipped.length ? 'warn' : 'good'} title={`Approved ${bulk.approved.length}, skipped ${bulk.skipped.length}`} items={bulk.skipped.map((s) => `${s.id}: ${s.reason}`)} />
      )}
      <Loading state={state}>
        {(rows) =>
          rows.length === 0 ? (
            <p className="bb-muted">No submissions{status ? ` with status ${status}` : ''}.</p>
          ) : (
            <div className="bb-table-wrap">
              <table className="bb-table">
                <thead>
                  <tr><th></th><th>Board</th><th>Source</th><th>Moves</th><th>Checks</th><th>Opponent</th><th>Status</th><th>Uploaded</th><th></th></tr>
                </thead>
                <tbody>
                  {rows.map((s) => (
                    <tr key={s.id} className={`bb-row-link ${s.status === 'disputed' || !s.checks_passed ? 'bb-flag-bad' : s.needs_review ? 'bb-flag' : ''}`} onClick={rowOpens(() => open(s))}>
                      <td>
                        {!s.bulk_blocker && (
                          <input type="checkbox" checked={selected.includes(s.id)} onChange={() => setSelected((x) => (x.includes(s.id) ? x.filter((i) => i !== s.id) : [...x, s.id]))} />
                        )}
                      </td>
                      <td>
                        <strong>{s.board_no}</strong>
                        <div className="bb-muted">result {s.board_result || '—'}</div>
                      </td>
                      <td>{s.source}</td>
                      <td>
                        <button type="button" className="bb-linkbtn" onClick={() => open(s)}>{s.moves_uci?.length || 0} plies</button>
                      </td>
                      <td><Checks checks={s.checks} /></td>
                      <td>
                        {s.opponent_response}
                        {s.dispute_note && <div className="bb-muted">“{s.dispute_note}”</div>}
                        {s.first_difference_ply && <div className="bb-muted">differs from ply {s.first_difference_ply}</div>}
                      </td>
                      <td>
                        <Badge value={s.status} />
                        {s.auto_approved && <div className="bb-muted">auto, all checks passed</div>}
                        {s.needs_review && <div className="bb-muted">{s.needs_review_reason || 're-review'}</div>}
                        {s.reject_reason && <div className="bb-muted">{s.reject_reason}</div>}
                      </td>
                      <td className="bb-muted">{fmtDate(s.created_at)}</td>
                      <td>
                        <div className="bb-row" style={{ margin: 0 }}>
                          {['uploaded', 'confirmed', 'disputed'].includes(s.status) && (
                            <>
                              <Action small run={() => api.post(`/api/admin/submissions/${s.id}/approve`)} onDone={refresh}>Approve</Action>
                              <Action small kind="ghost" run={approveEdited(s)} onDone={(r) => r && refresh()}>Approve edited</Action>
                              <Action small kind="danger" run={reject(s)} onDone={(r) => r && refresh()}>Reject</Action>
                            </>
                          )}
                          {s.status === 'approved' && s.needs_review && (
                            <Action small run={() => api.post(`/api/admin/submissions/${s.id}/keep`)} onDone={refresh}>Keep as is</Action>
                          )}
                          {s.status === 'approved' && (
                            <Action small kind="ghost" run={correct(s)} onDone={(r) => r && refresh()}>Correct moves</Action>
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
      {viewing && <GameViewer game={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function Analyses({ tid, base }) {
  const state = useLoad(() => api.get(`${base}/analyses`), [base]);
  const failed = useLoad(() => api.get(`/api/admin/t/${tid}/jobs?status=failed`), [tid]);
  const [bulk, setBulk] = useState(null);
  const [viewing, setViewing] = useState(null);
  const refresh = () => {
    state.reload();
    failed.reload();
  };
  const movesOf = (r) => r.moves_uci || r.analysis?.moves?.map((m) => m.uci) || [];
  const open = (r) => setViewing({
    title: `Board ${r.board_no}: ${r.white} vs ${r.black}`,
    subtitle: `Official game v${r.version}${r.analysis ? ` · ${r.analysis.engine?.id || 'engine'} analysis` : ' · not analysed yet'}`,
    result: r.result,
    uci: movesOf(r),
    notes: r.analysis?.moves,
  });
  const exclude = (aid) => () => {
    const reason = window.prompt('Exclude from leaderboards: reason');
    if (reason === null) return Promise.resolve(null);
    return api.post(`/api/admin/analyses/${aid}/exclude`, { reason: reason || null });
  };
  const score = (side) => (side && side.accuracy != null ? `${side.accuracy}%${side.eligible ? '' : ' (not eligible)'}` : '—');

  return (
    <>
      <div className="bb-card">
        <Loading state={state}>
          {(rows) => {
            const ready = rows.filter((r) => r.analysis && r.analysis.review_status === 'pending' && !r.anomaly).map((r) => r.analysis.id);
            return (
              <>
                <div className="bb-row">
                  <Action disabled={!ready.length} run={() => api.post('/api/admin/analyses/bulk-usable', { ids: ready })} onDone={(r) => { setBulk(r); refresh(); }}>
                    Mark all clean pending usable ({ready.length})
                  </Action>
                  <span className="bb-muted">Games with an anomaly flag must be reviewed one by one.</span>
                </div>
                {bulk && <Warnings tone={bulk.skipped.length ? 'warn' : 'good'} title={`Usable ${bulk.usable.length}, skipped ${bulk.skipped.length}`} items={bulk.skipped.map((s) => `${s.id}: ${s.reason}`)} />}
                {rows.length === 0 ? (
                  <p className="bb-muted">No official games yet. They appear when submissions are approved.</p>
                ) : (
                  <div className="bb-table-wrap">
                    <table className="bb-table">
                      <thead>
                        <tr><th>Board</th><th>Players</th><th>Ver.</th><th>Job</th><th>White acc.</th><th>Black acc.</th><th>Flags</th><th>Review</th><th></th></tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => {
                          const a = r.analysis;
                          return (
                            <tr key={r.official_game_id} className={`${movesOf(r).length ? 'bb-row-link' : ''} ${r.anomaly ? 'bb-flag-bad' : ''}`} onClick={movesOf(r).length ? rowOpens(() => open(r)) : undefined}>
                              <td>
                                {movesOf(r).length ? <button type="button" className="bb-linkbtn" onClick={() => open(r)}>{r.board_no}</button> : r.board_no}
                              </td>
                              <td>{r.white} – {r.black}<div className="bb-muted">{r.result}</div></td>
                              <td>v{r.version}</td>
                              <td>
                                <Badge value={r.job_status || 'none'} />
                                {r.job_errors.map((e, i) => <div key={i} className="bb-muted">{e.error}</div>)}
                              </td>
                              <td>{score(a?.white)}</td>
                              <td>{score(a?.black)}</td>
                              <td>{r.anomaly && <Badge value="anomaly" />} {a?.flags?.map((f) => f.type).join(', ')}</td>
                              <td>
                                {a ? <Badge value={a.review_status} /> : <span className="bb-muted">waiting for worker</span>}
                                {a?.review_note && <div className="bb-muted">{a.review_note}</div>}
                              </td>
                              <td>
                                {a && (
                                  <div className="bb-row" style={{ margin: 0 }}>
                                    {a.review_status === 'pending' && (
                                      <>
                                        <Action small run={() => api.post(`/api/admin/analyses/${a.id}/usable`)} onDone={refresh}>Usable</Action>
                                        <Action small kind="danger" run={exclude(a.id)} onDone={(x) => x && refresh()}>Exclude</Action>
                                      </>
                                    )}
                                    <Action small kind="ghost" confirm="Re-run the engine on this game?" run={() => api.post(`/api/admin/analyses/${a.id}/rerun`)} onDone={refresh}>Re-run</Action>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            );
          }}
        </Loading>
        {viewing && <GameViewer game={viewing} onClose={() => setViewing(null)} />}
      </div>
      <div className="bb-card">
        <h3>Failed analysis jobs (whole tournament)</h3>
        <Loading state={failed}>
          {(jobs) =>
            jobs.length === 0 ? (
              <p className="bb-muted">None.</p>
            ) : (
              jobs.map((j) => (
                <div key={j.id} className="bb-list-item">
                  <div>
                    Game <code>{j.official_game_id.slice(-8)}</code> v{j.game_version} · attempts {j.attempts} · {fmtDate(j.updated_at)}
                    <div className="bb-muted">{(j.errors || []).slice(-1).map((e) => e.error).join('')}</div>
                  </div>
                  <Action small run={() => api.post(`/api/admin/jobs/${j.id}/requeue`)} onDone={refresh}>Re-queue</Action>
                </div>
              ))
            )
          }
        </Loading>
      </div>
    </>
  );
}

const AWARDS = { best_game: 'Best game', brilliant_move: 'Brilliant move', comeback: 'Comeback', clean_game: 'Clean game' };

function BoardTables({ content }) {
  const labels = Object.fromEntries((content.groups || []).map((g) => [g.key, g.label]));
  return Object.entries(content.boards).map(([award, groups]) => (
    <div key={award} style={{ marginBottom: 14 }}>
      <h3>{AWARDS[award] || award}</h3>
      {Object.entries(groups).every(([, rows]) => rows.length === 0) && <p className="bb-muted">No entries.</p>}
      {Object.entries(groups).filter(([, rows]) => rows.length).map(([g, rows]) => (
        <div key={g}>
          <div className="bb-label" style={{ marginTop: 6 }}>{labels[g] || g}</div>
          <div className="bb-table-wrap">
            <table className="bb-table">
              <thead><tr><th>#</th><th>Player</th><th>Rating</th><th>Rd</th><th>Colour</th><th>Result</th><th>Value</th><th>Moves</th><th>Move</th><th>Replay</th></tr></thead>
              <tbody>
                {rows.map((e, i) => (
                  <tr key={`${e.game_id}-${e.ply || ''}-${i}`} className={e.tie ? 'bb-flag' : ''}>
                    <td>{e.rank ?? i + 1}{e.tie ? ' (tie)' : ''}</td>
                    <td>{e.title ? `${e.title} ` : ''}{e.display_name}</td>
                    <td>{e.rating || '—'}</td>
                    <td>{e.round_no}</td>
                    <td>{e.colour}</td>
                    <td>{e.result}</td>
                    <td>{e.value ?? '—'}</td>
                    <td>{e.counted_moves}</td>
                    <td>{e.san ? `${e.san} (ply ${e.ply})` : ''}</td>
                    <td>{e.replay ? '✓' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  ));
}

function Leaderboard({ base, round, slug, reload }) {
  const [scope, setScope] = useState('round');
  const state = useLoad(() => api.get(`${base}/leaderboard/preview`), [base, round.status]);
  const unpublish = () => {
    const reason = window.prompt('Why is the leaderboard being taken down?');
    if (!reason) return Promise.resolve(null);
    return api.post(`${base}/unpublish`, { reason });
  };

  return (
    <div className="bb-card">
      <div className="bb-row">
        {['round', 'cumulative'].map((s) => (
          <button key={s} type="button" className={`bb-tab${scope === s ? ' active' : ''}`} onClick={() => setScope(s)}>{s}</button>
        ))}
        <span className="bb-spacer" style={{ flex: 1 }} />
        {round.status === 'reviewing' && (
          <Action
            confirm="Publish this leaderboard? Players and the public will see it."
            disabled={!state.data}
            run={() =>
              api.post(`${base}/publish`, {
                expected_hash: { round: state.data.round.content_hash, cumulative: state.data.cumulative.content_hash },
              })
            }
            onDone={() => { reload(); state.reload(); }}
          >
            Publish round {round.round_no}
          </Action>
        )}
        {round.status === 'published' && (
          <Action kind="danger" run={unpublish} onDone={(r) => r && (reload(), state.reload())}>Unpublish</Action>
        )}
      </div>
      {round.status !== 'reviewing' && round.status !== 'published' && (
        <p className="bb-note bb-note-info">Start review on the Results & status tab before publishing.</p>
      )}
      {round.status === 'published' && slug && (
        <p className="bb-muted">
          Public JSON:{' '}
          <a href={`${getServer()}/api/public/t/${slug}/leaderboard?scope=${scope}&round=${round.round_no}`} target="_blank" rel="noreferrer">
            {getServer()}/api/public/t/{slug}/leaderboard?scope={scope}&round={round.round_no}
          </a>
        </p>
      )}
      <Loading state={state}>
        {(p) => (
          <>
            <p className="bb-muted" style={{ margin: '8px 0' }}>
              Preview · {p[scope].content.games_counted} games counted · hash <code>{p[scope].content_hash.slice(0, 12)}</code>
            </p>
            <BoardTables content={p[scope].content} />
          </>
        )}
      </Loading>
    </div>
  );
}
