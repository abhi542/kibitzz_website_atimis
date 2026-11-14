import { useState } from 'react';
import { api } from './api';
import { Action, Loading, useLoad, fmtDate } from './ui';

const AWARDS = [
  ['best_game', 'Best game', 'Top players of each category board (Open, U10, U12…)'],
  ['brilliant_move', 'Brilliant move', 'Top players of each category board (Open, U10, U12…)'],
  ['comeback', 'Best comeback', 'Top players of the single board for everyone'],
];
const PRIZE_NAMES = { brilliancy_prize: 'Brilliancy prize', best_game: 'Best game', brilliant_move: 'Brilliant move', comeback: 'Best comeback', category: 'Category' };

// Comeback is one board for everyone, so its prize has no group
const prizeGroup = (award, group) => (award === 'comeback' ? null : group);

export default function Prizes({ tour }) {
  const shortlist = useLoad(() => api.get(`/api/admin/t/${tour.id}/prizes/shortlist`), [tour.id]);
  const prizes = useLoad(() => api.get(`/api/admin/t/${tour.id}/prizes`), [tour.id]);
  const refresh = () => {
    shortlist.reload();
    prizes.reload();
  };
  const current = (prizes.data || []).filter((p) => !p.superseded_by);
  const winnerOf = (award, group) => current.find((p) => p.award === award && (p.group || null) === group);

  const signOff = (award, group, e, ply) => () => {
    const note = window.prompt(`${PRIZE_NAMES[award]}${group ? ` · ${group}` : ''}: award to ${e.display_name}. Note for the record (at least 3 characters)`);
    if (note === null) return Promise.resolve(null);
    return api.post(`/api/admin/t/${tour.id}/prizes`, { award, group, official_game_id: e.game_id, ply: ply ?? null, note });
  };

  return (
    <>
      <ShortlistSizes tour={tour} onSaved={shortlist.reload} />

      <div className="bb-card">
        <h3>Prize shortlist</h3>
        <p className="bb-muted">
          From the final published cumulative leaderboard. Anyone tied with the last pick is included, so you see every contender.
        </p>
        {shortlist.error?.code === 'NOT_FINAL' ? (
          <div className="bb-note bb-note-info">
            The shortlist appears once the final round is published and the tournament is set to <strong>finished</strong>.
          </div>
        ) : (
          <Loading state={shortlist}>
            {(s) => {
              const shown = AWARDS.filter(([a]) => s[a]);
              if (!shown.length) return <p className="bb-muted">Nothing to shortlist: every award is switched off or set to 0.</p>;
              return shown.map(([award, title]) => (
                <div key={award} style={{ marginTop: 14 }}>
                  <h4 className="bb-switch-head">{title} · top {s.settings[award]} per board</h4>
                  {s[award].length === 0 && <p className="bb-muted">No entries.</p>}
                  {s[award].map((board) => {
                    const group = prizeGroup(award, board.group);
                    const winner = winnerOf(award, group);
                    return (
                      <div key={board.group}>
                        <div className="bb-label" style={{ marginTop: 6 }}>
                          {board.label}
                          {winner && <span className="bb-badge bb-good" style={{ marginLeft: 8 }}>Awarded: {winner.winner?.display_name}</span>}
                        </div>
                        <div className="bb-table-wrap">
                          <table className="bb-table">
                            <thead>
                              <tr>
                                <th>#</th><th>Player</th><th>Rating</th><th>Rd</th><th>Value</th>
                                {award === 'brilliant_move' && <><th>Brilliant moves</th><th>Best move</th></>}
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {board.rows.map((e, i) => (
                                <tr key={`${e.game_id}-${e.colour}-${i}`} className={e.tie ? 'bb-flag' : ''}>
                                  <td>{e.rank}{e.tie ? ' (tie)' : ''}</td>
                                  <td>{e.title ? `${e.title} ` : ''}{e.display_name}<div className="bb-muted">{e.category || ''}</div></td>
                                  <td>{e.rating || '—'}</td>
                                  <td>{e.round_no}</td>
                                  <td>{e.value ?? '—'}</td>
                                  {award === 'brilliant_move' && (
                                    <>
                                      <td>{e.brilliant_count}</td>
                                      <td>{e.san ? `${e.san} (ply ${e.ply})` : ''}</td>
                                    </>
                                  )}
                                  <td>
                                    <div className="bb-row" style={{ margin: 0 }}>
                                      <Action small run={signOff(award, group, e, award === 'brilliant_move' ? e.ply : null)} onDone={(r) => r && refresh()}>
                                        {winner ? 'Award instead' : 'Award prize'}
                                      </Action>
                                      {award === 'brilliant_move' && (
                                        <Action small kind="ghost" run={signOff('brilliancy_prize', null, e, e.ply)} onDone={(r) => r && refresh()}>
                                          Brilliancy prize
                                        </Action>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            }}
          </Loading>
        )}
      </div>

      <div className="bb-card">
        <h3>Awarded prizes</h3>
        <Loading state={prizes}>
          {() =>
            current.length === 0 ? (
              <p className="bb-muted">No prizes signed off yet.</p>
            ) : (
              <div className="bb-table-wrap">
                <table className="bb-table">
                  <thead><tr><th>Prize</th><th>Board</th><th>Winner</th><th>Rd</th><th>Note</th><th>Signed off</th></tr></thead>
                  <tbody>
                    {current.map((p) => (
                      <tr key={p.id}>
                        <td><strong>{PRIZE_NAMES[p.award] || p.award}</strong></td>
                        <td>{p.group || '—'}</td>
                        <td>{p.winner?.display_name}</td>
                        <td>{p.winner?.round_no}</td>
                        <td>{p.note}</td>
                        <td className="bb-muted">{fmtDate(p.approved_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </Loading>
      </div>
    </>
  );
}

function ShortlistSizes({ tour, onSaved }) {
  const initial = tour.award_config_effective?.prize_shortlist || { best_game: 1, brilliant_move: 1, comeback: 2 };
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const changed = AWARDS.some(([a]) => Number(form[a]) !== Number(saved[a]));
  const valid = AWARDS.every(([a]) => form[a] !== '' && Number(form[a]) >= 0 && Number(form[a]) <= 20);

  const save = () => api.post(`/api/admin/t/${tour.id}/prize-shortlist`, Object.fromEntries(AWARDS.map(([a]) => [a, Number(form[a])])));

  return (
    <div className="bb-card">
      <h3>Shortlist size</h3>
      <p className="bb-muted">How many players to shortlist from the top of each board. 0 leaves an award out. You can change this at any time.</p>
      <div className="bb-row" style={{ alignItems: 'flex-start', gap: 24 }}>
        {AWARDS.map(([award, title, hint]) => (
          <label key={award} className="bb-field" style={{ maxWidth: 220 }}>
            <span className="bb-label">{title}</span>
            <input
              type="number"
              min={0}
              max={20}
              value={form[award]}
              onChange={(e) => setForm({ ...form, [award]: e.target.value === '' ? '' : Number(e.target.value) })}
              style={{ width: 90 }}
            />
            <span className="bb-hint">{hint}</span>
          </label>
        ))}
      </div>
      <Action run={save} disabled={!changed || !valid} onDone={(r) => { setSaved(r); setForm(r); onSaved(); }}>
        Save shortlist size
      </Action>
      {!valid && <p className="bb-hint">Each number must be between 0 and 20.</p>}
    </div>
  );
}
