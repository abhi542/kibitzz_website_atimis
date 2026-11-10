import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Published Brilliancy Board leaderboards. Reads only /api/public, which serves
// frozen snapshots, so nothing shows here until an organiser publishes a round.
export const PUBLIC_API = process.env.REACT_APP_API_URL || 'https://kibitzz-dev.onrender.com';

// Holds the chess library, so it loads only when a brilliant move is on screen
const BrilliantMoment = lazy(() => import('./BrilliantMoment'));

const SLIDE_MS = 8000;
const REFRESH_MS = 60000;

const AWARDS = {
  best_game: { title: 'Best Game', short: 'Best game', blurb: 'Highest game quality: accuracy, weighted towards the critical moments.' },
  brilliant_move: { title: 'Brilliant Move', short: 'Brilliant', blurb: 'Sacrifices that were the only good move. Most brilliant moves first; on a tie, the biggest single swing.' },
  comeback: { title: 'Best Comeback', short: 'Comeback', blurb: 'Wins from the worst position, by the lowest winning chance the player held.' },
  clean_game: { title: 'Clean Games', short: 'Clean', blurb: 'Games with no mistakes or blunders after the opening.' },
};
// Awards with a board per group (Open, U10, U12…); the others are one board for everyone
const GROUPED = ['best_game', 'brilliant_move'];

async function getJson(path, options) {
  const res = await fetch(PUBLIC_API + path, options);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(body?.error?.message || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
}

// With refreshMs, re-reads quietly and only updates when the answer changed, so a
// screen left open in the hall follows new settings without replaying its animations.
function useJson(path, refreshMs) {
  const [state, setState] = useState({ loading: !!path, data: null, error: null });
  useEffect(() => {
    if (!path) {
      setState({ loading: false, data: null, error: null });
      return undefined;
    }
    let live = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    getJson(path).then(
      (data) => live && setState({ loading: false, data, error: null }),
      (error) => live && setState({ loading: false, data: null, error }),
    );
    const timer = refreshMs && setInterval(() => {
      getJson(path, { cache: 'no-cache' }).then(
        (data) => live && setState((s) => (JSON.stringify(s.data) === JSON.stringify(data) ? s : { loading: false, data, error: null })),
        () => {},
      );
    }, refreshMs);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [path, refreshMs]);
  return state;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return undefined;
    setReduced(mq.matches);
    const on = (e) => setReduced(e.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduced;
}

// Counts from 0 to the target each time the slide mounts.
// The API can send null (e.g. a game whose analysis hasn't finished), so show a dash then.
function CountUp({ value, decimals = 0, delay = 0 }) {
  const reduced = useReducedMotion();
  const valid = Number.isFinite(value);
  const [shown, setShown] = useState(reduced && valid ? value : 0);
  useEffect(() => {
    if (!valid) return undefined;
    if (reduced) { setShown(value); return undefined; }
    let raf;
    let start;
    const duration = 1100;
    const tick = (t) => {
      if (start === undefined) start = t + delay;
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Animation frames pause in background tabs; make sure the real number lands
    const done = setTimeout(() => setShown(value), delay + duration + 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); };
  }, [value, delay, reduced, valid]);
  if (!valid) return <>–</>;
  return <>{shown.toFixed(decimals)}</>;
}

function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function initials(name) {
  return (name || '?').split(/[\s,]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function moveLabel(ply, san) {
  return `${Math.ceil(ply / 2)}${ply % 2 ? '.' : '…'} ${san || ''}`;
}

function outcome(e) {
  if (!e.result) return '';
  if (e.result === '1/2-1/2') return 'Draw';
  return e.result === (e.colour === 'white' ? '1-0' : '0-1') ? 'Won' : 'Lost';
}

// One identity per leaderboard line, to find the same line in the previous round
function lineKey(award, e) {
  return award === 'brilliant_move' ? `${e.game_id}:${e.ply}` : `${e.display_name}:${e.title || ''}`;
}

function Trophy({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="lbx-trophy">
      <defs>
        <linearGradient id="lbx-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE29A" />
          <stop offset=".55" stopColor="#E8B64C" />
          <stop offset="1" stopColor="#B7802A" />
        </linearGradient>
      </defs>
      <path d="M18 8h28v14c0 9-6 16-14 16s-14-7-14-16V8z" fill="url(#lbx-gold)" />
      <path d="M18 12H9v4c0 7 5 12 11 12M46 12h9v4c0 7-5 12-11 12" fill="none" stroke="#E8B64C" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M28 38h8v8h-8z" fill="#C99536" />
      <path d="M20 46h24l2 8H18z" fill="url(#lbx-gold)" />
      <rect x="16" y="54" width="32" height="5" rx="2" fill="#1B7274" />
      <path d="M32 15l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="#FFF6D8" opacity=".9" />
    </svg>
  );
}

function Movement({ move }) {
  if (move === undefined) return null;
  if (move === 'new') return <span className="lbx-move lbx-move-new">NEW</span>;
  if (move === 0) return <span className="lbx-move lbx-move-same" aria-label="No change">–</span>;
  return move > 0
    ? <span className="lbx-move lbx-move-up" aria-label={`Up ${move}`}>▲{move}</span>
    : <span className="lbx-move lbx-move-down" aria-label={`Down ${-move}`}>▼{-move}</span>;
}

function Score({ award, e, delay }) {
  if (award === 'best_game') {
    return <><b className="lbx-num"><CountUp value={e.value} decimals={1} delay={delay} /></b><small>score</small></>;
  }
  if (award === 'brilliant_move') {
    return <><b className="lbx-num">+<CountUp value={e.value} decimals={1} delay={delay} />%</b><small>{moveLabel(e.ply, e.san)}</small></>;
  }
  if (award === 'comeback') {
    return <><b className="lbx-num"><CountUp value={e.value} delay={delay} />%</b><small>lowest, then won</small></>;
  }
  return null;
}

function GameReplay({ slug, gameId }) {
  const { loading, data, error } = useJson(`/api/public/t/${slug}/games/${gameId}`);
  if (loading) return <div className="lbx-game">Loading game…</div>;
  if (error) return <div className="lbx-game">{error.message}</div>;
  const moves = data.pgn.split(/\n\n/).pop().trim();
  return (
    <div className="lbx-game">
      <div className="lbx-game-head">
        Round {data.round_no}, board {data.board_no} · {data.white.display_name} vs {data.black.display_name} · {data.result}
      </div>
      <p className="lbx-moves">{moves}</p>
      <a href={'https://lichess.org/analysis/pgn/' + encodeURIComponent(moves)} target="_blank" rel="noreferrer">
        Play through on Lichess &rarr;
      </a>
    </div>
  );
}

// Every brilliant move on a row that the server sent a board for; the row's own (best) move first
function brilliantChoices(entry) {
  const own = entry.positions
    ? [{ game_id: entry.game_id, ply: entry.ply, san: entry.san, swing: entry.value, round_no: entry.round_no, positions: entry.positions }]
    : [];
  const others = (entry.brilliant_moves || [])
    .filter((m) => m.positions && !(m.game_id === entry.game_id && m.ply === entry.ply));
  return [...own, ...others];
}

const canShowMove = (e) => !!e.positions || !!e.replay;

function BrilliantGame({ slug, entry, onInteract }) {
  const reduced = useReducedMotion();
  const choices = brilliantChoices(entry);
  const [index, setIndex] = useState(0);
  // Rows published before positions were sent fall back to the row's move, rebuilt from the game
  const move = choices[index] || { game_id: entry.game_id, ply: entry.ply, swing: entry.value, positions: null };
  // The full game adds the opponent's reply and the Lichess link. It is public only when both
  // players agreed; for the row's own game the row says so, for another game just try.
  const fetchGame = move.game_id !== entry.game_id || entry.replay;
  const game = useJson(fetchGame ? `/api/public/t/${slug}/games/${move.game_id}` : null);
  if (!move.positions && game.loading) return <div className="lbx-game">Loading the position…</div>;
  if (!move.positions && !game.data) return <div className="lbx-game">{game.error?.message || 'This position can\'t be shown.'}</div>;
  return (
    <>
      {choices.length > 1 && (
        <div className="lbx-moment-picker" role="group" aria-label="Brilliant moves">
          {choices.map((m, i) => (
            <button type="button" key={`${m.game_id}-${m.ply}`} aria-pressed={i === index} className={i === index ? 'on' : ''}
                    onClick={() => { setIndex(i); onInteract(); }}>
              R{m.round_no} · {moveLabel(m.ply, m.san)} <small>+{m.swing}%</small>
            </button>
          ))}
        </div>
      )}
      <Suspense fallback={<div className="lbx-game">Loading the position…</div>}>
        <BrilliantMoment
          key={`${move.game_id}-${move.ply}`}
          positions={move.positions}
          ply={move.ply}
          swing={move.swing}
          game={game.data}
          entry={entry}
          moveLabel={moveLabel}
          onInteract={onInteract}
          reduced={reduced}
        />
      </Suspense>
    </>
  );
}

const MEDALS = { 1: 'gold', 2: 'silver', 3: 'bronze' };

function Podium({ award, top, moves, onPick, canPick }) {
  // Second, first, third: the winner stands in the middle
  const order = [top[1], top[0], top[2]].filter(Boolean);
  return (
    <div className="lbx-podium">
      {order.map((e) => {
        const place = top.indexOf(e) + 1;
        return (
          <button type="button" key={lineKey(award, e)} className={`lbx-step lbx-step-${place}`}
                  onClick={() => canPick(e) && onPick(e)} disabled={!canPick(e)}
                  style={{ '--d': `${(3 - place) * 140}ms`, gridColumn: { 1: 2, 2: 1, 3: 3 }[place] }}>
            {place === 1 && <Trophy size={44} />}
            <span className={`lbx-avatar lbx-${MEDALS[place]}`}>{initials(e.display_name)}</span>
            <span className="lbx-pname">{e.title && <em>{e.title}</em>}{e.display_name}</span>
            <span className="lbx-pmeta">{e.rating || 'unrated'}{e.category ? ` · ${e.category}` : ''} <Movement move={moves[lineKey(award, e)]} /></span>
            <span className="lbx-pscore"><Score award={award} e={e} delay={(3 - place) * 140 + 300} /></span>
            <span className={`lbx-block lbx-${MEDALS[place]}`}><span>{place}</span></span>
          </button>
        );
      })}
    </div>
  );
}

function Slide({ award, rows, slug, moves, groupPicker, onInteract }) {
  const [picked, setPicked] = useState(null);
  const meta = AWARDS[award];
  const ranked = award !== 'clean_game';
  const brilliant = award === 'brilliant_move';
  // A brilliant move can be shown from its positions even when the game itself isn't public
  const canPick = brilliant ? canShowMove : (e) => !!e.replay;
  // The top move that can be shown is on the board without a click
  const moment = brilliant ? picked || rows.find(canShowMove) : null;
  const pick = (e) => {
    setPicked(e);
    onInteract();
  };
  return (
    <div className="lbx-slide" key={award}>
      <div className="lbx-slide-head">
        <div>
          <div className="lbx-kicker">Award</div>
          <h2 className="lbx-title">{meta.title}</h2>
          <p className="lbx-blurb">{meta.blurb}</p>
        </div>
        {groupPicker}
      </div>

      {rows.length === 0 && (
        <div className="lbx-empty">
          <Trophy size={64} />
          <p>No one has taken this trophy yet. It's still up for grabs.</p>
        </div>
      )}

      {ranked && rows.length > 0 && (
        <>
          <Podium award={award} top={rows.slice(0, 3)} moves={moves} onPick={pick} canPick={canPick} />
          {rows.length > 3 && (
            <ol className="lbx-rows" start={4}>
              {rows.slice(3).map((e, i) => (
                <li key={lineKey(award, e)} className="lbx-row" style={{ '--d': `${500 + i * 90}ms` }}>
                  <span className="lbx-rank">{e.rank}{e.tie && <sup title="Tied">=</sup>}</span>
                  <span className="lbx-avatar lbx-plain">{initials(e.display_name)}</span>
                  <span className="lbx-who">
                    <span className="lbx-rname">{e.title && <em>{e.title}</em>}{e.display_name} <Movement move={moves[lineKey(award, e)]} /></span>
                    <span className="lbx-rmeta">
                      {e.rating || 'unrated'}{e.category ? ` · ${e.category}` : ''} · R{e.round_no} · {outcome(e)} vs {e.opponent || 'hidden'}
                    </span>
                  </span>
                  <span className="lbx-rscore"><Score award={award} e={e} delay={600 + i * 90} /></span>
                  {canPick(e) && <button type="button" className="lbx-view" onClick={() => pick(e)}>{brilliant ? 'See move' : 'Game'}</button>}
                </li>
              ))}
            </ol>
          )}
        </>
      )}

      {!ranked && rows.length > 0 && (
        <div className="lbx-badges">
          {rows.map((e, i) => (
            <button type="button" key={`${e.game_id}-${e.colour}`} className="lbx-badge" disabled={!e.replay}
                    onClick={() => e.replay && pick(e)} style={{ '--d': `${i * 70}ms` }}>
              <span className="lbx-badge-icon" aria-hidden="true">✓</span>
              <span className="lbx-rname">{e.title && <em>{e.title}</em>}{e.display_name}</span>
              <span className="lbx-rmeta">Round {e.round_no} · {outcome(e)}</span>
            </button>
          ))}
        </div>
      )}

      {moment && (
        <div className="lbx-picked">
          <BrilliantGame key={lineKey(award, moment)} slug={slug} entry={moment} onInteract={onInteract} />
        </div>
      )}

      {brilliant && rows.length > 0 && !moment && (
        <p className="lbx-moment-private">The positions are shown once the player links their profile and agrees to be shown.</p>
      )}

      {picked && !brilliant && (
        <div className="lbx-picked">
          <button type="button" className="lbx-close" onClick={() => setPicked(null)} aria-label="Close game">×</button>
          <GameReplay slug={slug} gameId={picked.game_id} />
        </div>
      )}
    </div>
  );
}

function Shell({ children, dark }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Navbar />
      <main className={dark ? 'lbx-page' : 'lb-main'}>{children}</main>
      <Footer />
    </>
  );
}

function Note({ children, tone }) {
  return <p className={'lb-note' + (tone ? ' lb-note-' + tone : '')}>{children}</p>;
}

// ── /leaderboards ────────────────────────────────────────────────────────────

export function LeaderboardIndex() {
  const { loading, data, error } = useJson('/api/public/tournaments');
  useEffect(() => { document.title = 'Tournament leaderboards | Kibitzz'; }, []);

  return (
    <Shell>
      <div className="lb-eyebrow">Brilliancy Board</div>
      <h1 className="lb-h1">Tournament leaderboards</h1>
      <p className="lb-lead">
        The best games, brilliant moves and comebacks from tournaments on Kibitzz, analysed by Stockfish and checked by the organisers.
      </p>
      {loading && <Note>Loading tournaments…</Note>}
      {error && <Note tone="bad">Couldn't load the leaderboards. {error.message}</Note>}
      {data && data.tournaments.length === 0 && <Note>No leaderboards have been published yet.</Note>}
      {data && data.tournaments.length > 0 && (
        <ul className="lb-list">
          {data.tournaments.map((t) => (
            <li key={t.slug}>
              <Link to={'/leaderboards/' + t.slug} className="lb-tournament">
                <Trophy size={40} />
                <div style={{ flex: 1 }}>
                  <div className="lb-tournament-name">{t.name}</div>
                  <div className="lb-muted">
                    After round {t.latest_round} · published {fmtDate(t.published_at)}
                    {t.status === 'finished' && ' · final'}
                  </div>
                </div>
                <span className="lb-arrow">View &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}

// ── /leaderboards/:slug ──────────────────────────────────────────────────────

export function LeaderboardPage() {
  const { slug } = useParams();
  const info = useJson(`/api/public/t/${slug}`, REFRESH_MS);
  const rounds = info.data?.published_rounds || [];
  const [round, setRound] = useState(null);
  const [scope, setScope] = useState('cumulative');
  const [group, setGroup] = useState('open');
  const current = round ?? (rounds.length ? rounds[rounds.length - 1].round_no : null);
  const previous = rounds.filter((r) => r.round_no < (current || 0)).pop()?.round_no;
  const board = useJson(current ? `/api/public/t/${slug}/leaderboard?round=${current}&scope=${scope}` : null, REFRESH_MS);
  // Movement arrows compare the standings with the previous published round
  const prev = useJson(current && previous && scope === 'cumulative'
    ? `/api/public/t/${slug}/leaderboard?round=${previous}&scope=cumulative` : null, REFRESH_MS);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  const reduced = useReducedMotion();
  const touchX = useRef(null);

  useEffect(() => {
    if (info.data) document.title = `${info.data.name} leaderboard | Kibitzz`;
  }, [info.data]);

  const content = board.data;
  const awards = useMemo(() => (content ? Object.keys(AWARDS).filter((a) => content.boards[a]) : []), [content]);
  // Best Game and Brilliant Move have a board per group (Open, U10…); the rest are one board
  const groups = content
    ? content.groups.filter((g) => GROUPED.some((a) => (content.boards[a]?.[g.key] || []).length > 0))
    : [];
  const groupKey = groups.some((g) => g.key === group) ? group : groups[0]?.key || 'open';
  const rowsFor = useCallback((a) => {
    if (!content) return [];
    return (GROUPED.includes(a) ? content.boards[a][groupKey] : content.boards[a].open) || [];
  }, [content, groupKey]);

  const active = awards.length ? awards[index % awards.length] : null;
  const running = playing && !hovering && awards.length > 1;

  const go = useCallback((step) => {
    if (!awards.length) return;
    setIndex((i) => {
      // Skip empty awards while rotating, unless everything is empty
      for (let k = 1; k <= awards.length; k += 1) {
        const n = (((i + step * k) % awards.length) + awards.length) % awards.length;
        if (rowsFor(awards[n]).length || k === awards.length) return n;
      }
      return i;
    });
  }, [awards, rowsFor]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [running, index, go]);

  useEffect(() => { setIndex(0); }, [current, scope]);

  const moves = useMemo(() => {
    if (!prev.data || !content || !active) return {};
    const before = {};
    const prevBoard = prev.data.boards[active];
    const prevRows = prevBoard ? (GROUPED.includes(active) ? prevBoard[groupKey] : prevBoard.open) || [] : [];
    prevRows.forEach((e) => { before[lineKey(active, e)] = e.rank; });
    const out = {};
    rowsFor(active).forEach((e) => {
      const k = lineKey(active, e);
      out[k] = before[k] === undefined ? 'new' : before[k] - e.rank;
    });
    return out;
  }, [prev.data, content, active, groupKey, rowsFor]);

  if (info.loading) return <Shell dark><div className="lbx-wrap"><p className="lbx-loading">Loading…</p></div></Shell>;
  if (info.error) {
    return (
      <Shell>
        <Note tone="bad">{info.error.status === 404 ? 'This tournament was not found.' : info.error.message}</Note>
        <Link to="/leaderboards" className="lb-link">&larr; All leaderboards</Link>
      </Shell>
    );
  }

  const t = info.data;
  const pick = (i) => { setIndex(i); setPlaying(false); };

  return (
    <Shell dark>
      <div className="lbx-wrap">
        <Link to="/leaderboards" className="lbx-back">&larr; All leaderboards</Link>
        <header className="lbx-hero">
          <Trophy size={72} />
          <div>
            <div className="lbx-kicker">Kibitzz Brilliancy Board</div>
            <h1 className="lbx-h1">{t.name}</h1>
            <p className="lbx-sub">
              {t.status === 'finished' ? 'Final standings' : 'Live from the tournament hall'}
              {content && <> · <b><CountUp value={content.games_counted} /></b> game{content.games_counted === 1 ? '' : 's'} analysed</>}
              {t.chess_results_url && <> · <a href={t.chess_results_url} target="_blank" rel="noreferrer">chess-results</a></>}
            </p>
          </div>
        </header>

        {t.prizes.length > 0 && (
          <div className="lbx-prizes">
            {t.prizes.map((p) => (
              <div key={`${p.award}-${p.group || ''}`} className="lbx-prize">
                <Trophy size={28} />
                <span>
                  <small>{AWARDS[p.award]?.title || p.award.replace(/_/g, ' ')}{p.group ? ` · ${p.group}` : ''}</small>
                  <b>{p.winner.title && <em>{p.winner.title}</em>}{p.winner.display_name}</b>
                </span>
              </div>
            ))}
          </div>
        )}

        {rounds.length === 0 ? (
          <div className="lbx-stage"><div className="lbx-empty"><Trophy size={64} /><p>The first leaderboard hasn't been published yet.</p></div></div>
        ) : (
          <>
            <div className="lbx-controls">
              <select value={current} onChange={(e) => setRound(Number(e.target.value))} aria-label="Round">
                {rounds.map((r) => <option key={r.round_no} value={r.round_no}>Round {r.round_no}</option>)}
              </select>
              <div className="lbx-seg" role="group" aria-label="Standings">
                {[['cumulative', `Up to round ${current}`], ['round', `Round ${current} only`]].map(([k, label]) => (
                  <button key={k} type="button" aria-pressed={scope === k} className={scope === k ? 'on' : ''} onClick={() => setScope(k)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {board.error && <Note tone="bad">{board.error.message}</Note>}
            {board.loading && !content && <div className="lbx-stage"><p className="lbx-loading">Loading leaderboard…</p></div>}
            {content && !active && <div className="lbx-stage"><p className="lbx-loading">No awards are being shown right now.</p></div>}
            {content && active && (
              <section
                className="lbx-stage"
                aria-roledescription="carousel"
                aria-label="Awards"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => setHovering(true)}
                onBlur={() => setHovering(false)}
                onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
                onTouchEnd={(e) => {
                  const dx = e.changedTouches[0].clientX - (touchX.current ?? e.changedTouches[0].clientX);
                  if (Math.abs(dx) > 50) { go(dx < 0 ? 1 : -1); setPlaying(false); }
                }}
              >
                <div className="lbx-tabs" role="tablist">
                  {awards.map((a, i) => (
                    <button key={a} type="button" role="tab" aria-selected={a === active}
                            className={'lbx-tab' + (a === active ? ' on' : '') + (rowsFor(a).length ? '' : ' empty')}
                            onClick={() => pick(i)}>
                      {AWARDS[a].short}
                      <span className="lbx-count">{rowsFor(a).length}</span>
                      {a === active && (
                        <span key={`${index}-${running}`} className={'lbx-progress' + (running && !reduced ? ' run' : '')}
                              style={{ animationDuration: `${SLIDE_MS}ms` }} />
                      )}
                    </button>
                  ))}
                  <span className="lbx-tabs-spacer" />
                  <button type="button" className="lbx-icon" onClick={() => { go(-1); setPlaying(false); }} aria-label="Previous award">‹</button>
                  <button type="button" className="lbx-icon" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause rotation' : 'Play rotation'}>
                    {playing ? '❚❚' : '▶'}
                  </button>
                  <button type="button" className="lbx-icon" onClick={() => { go(1); setPlaying(false); }} aria-label="Next award">›</button>
                </div>

                <Slide
                  key={`${active}-${groupKey}-${current}-${scope}`}
                  award={active}
                  slug={slug}
                  rows={rowsFor(active)}
                  moves={moves}
                  onInteract={() => setPlaying(false)}
                  groupPicker={GROUPED.includes(active) && groups.length > 1 && (
                    <select className="lbx-group" value={groupKey} onChange={(e) => { setGroup(e.target.value); setPlaying(false); }} aria-label="Group">
                      {groups.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
                    </select>
                  )}
                />
              </section>
            )}
            <p className="lbx-foot">
              {content && <>Published {fmtDate(content.published_at)} · </>}
              Only players who linked their profile in the Kibitzz app and agreed to be shown appear here.
            </p>
          </>
        )}
      </div>
    </Shell>
  );
}
