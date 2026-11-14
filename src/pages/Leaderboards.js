import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import appLogo from '../assets/kibitzz_logo.png';
import { QRCodeSVG } from 'qrcode.react';

// Published Brilliancy Board leaderboards. Reads only /api/public, which serves
// frozen snapshots, so nothing shows here until an organiser publishes a round.
export const PUBLIC_API = process.env.REACT_APP_API_URL || 'https://kibitzz-dev.onrender.com';
// Where the hall QR code sends phones. Set it when the TV runs on a local or preview address.
const PUBLIC_SITE = process.env.REACT_APP_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://kibitzz.in');

// Holds the chess library, so it loads only when a brilliant move is on screen
const BrilliantReplay = lazy(() => import('./BrilliantReplay'));

const SLIDE_MS = 8000;

// Hall TV mode (?tv=1): one screen, no scrolling, read from across the room
const TV_SLIDE_MS = 15000;
const TV_PAGE_MS = 9000;       // category cards page through at this pace
const TV_CATS_PER_PAGE = 4;
const CAT_TOP = 5;            // lines shown on each category card
const TV_ROWS = 4;             // open lines shown under the podium
const BRAND_MS = 10000;        // the Kibitzz spot, once per full rotation
const REFRESH_MS = 60000;

const AWARDS = {
  best_game: { title: 'Best Game', short: 'Best game', blurb: 'Highest game quality: accuracy, weighted towards the critical moments.' },
  brilliant_move: { title: 'Brilliant Move', short: 'Brilliant', blurb: 'Sacrifices that were the only good move. Players are ranked by how many they found.' },
  comeback: { title: 'Best Comeback', short: 'Comeback', blurb: 'Wins from the worst position, by the lowest winning chance the player held.' },
};

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

// Counts from 0 to the target each time the slide mounts
function CountUp({ value: raw, decimals = 0, delay = 0 }) {
  const value = Number.isFinite(Number(raw)) && raw !== null ? Number(raw) : 0;
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

// A player who hasn't claimed their profile yet
function shownName(e) {
  return e.locked ? `(${e.display_name || 'Unclaimed player'})` : e.display_name;
}

function avatarText(e) {
  return e.locked ? '?' : initials(e.display_name);
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
  if (e.locked) return `locked:${e.rank}:${e.category || ''}`;
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

// How many brilliant moves the player found (older snapshots carry one line per move)
function brilliantCount(e) {
  return e.brilliant_count || e.brilliant_moves?.length || 1;
}

function Score({ award, e, delay }) {
  // Locked lines (player hasn't claimed their profile yet) come without a value
  if (e.value === null || e.value === undefined) {
    return <><b className="lbx-num">—</b><small>{e.locked ? 'not public yet' : 'no score'}</small></>;
  }
  if (award === 'best_game') {
    return <><b className="lbx-num"><CountUp value={e.value} decimals={1} delay={delay} /></b><small>score</small></>;
  }
  if (award === 'brilliant_move') {
    const n = brilliantCount(e);
    return <><b className="lbx-num"><CountUp value={n} delay={delay} /> !!</b><small>brilliant move{n === 1 ? '' : 's'}</small></>;
  }
  if (award === 'comeback') {
    return <><b className="lbx-num">Won</b><small>from a losing position</small></>;
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
    </div>
  );
}

// A public game is fetched for the full replay; otherwise the position
// snapshots that come with the leaderboard line are enough to show the moment.
function canShowMoment(e) {
  return !!(e && !e.locked && (e.replay || e.positions?.brilliant));
}

// Full-screen "instant replay" of one brilliant move. A public game is fetched
// only when the line carries no position snapshot of its own.
function ReplayOverlay({ slug, entry, tv, tournament, onDone }) {
  const needGame = !entry.positions?.brilliant && entry.replay;
  const { loading, data, error } = useJson(needGame ? `/api/public/t/${slug}/games/${entry.game_id}` : null);
  const reduced = useReducedMotion();
  useEffect(() => { if (error) onDone(); }, [error, onDone]);
  if (loading || error) return null;
  return (
    <Suspense fallback={null}>
      <BrilliantReplay key={`${entry.game_id}-${entry.ply}`} entry={entry} game={data || null} moveLabel={moveLabel}
                       onDone={onDone} reduced={reduced} tv={tv} tournament={tournament} />
    </Suspense>
  );
}

const MEDALS = { 1: 'gold', 2: 'silver', 3: 'bronze' };

function Podium({ award, top, moves, onPick }) {
  const pickable = (e) => e.replay || (award === 'brilliant_move' && canShowMoment(e));
  // Second, first, third: the winner stands in the middle
  const order = [top[1], top[0], top[2]].filter(Boolean);
  return (
    <div className="lbx-podium">
      {order.map((e) => {
        const place = top.indexOf(e) + 1;
        return (
          <button type="button" key={lineKey(award, e)} className={`lbx-step lbx-step-${place}`}
                  onClick={() => pickable(e) && onPick(e)} disabled={!pickable(e)}
                  style={{ '--d': `${(3 - place) * 140}ms`, gridColumn: { 1: 2, 2: 1, 3: 3 }[place] }}>
            {place === 1 && <Trophy size={44} />}
            <span className={`lbx-avatar lbx-${MEDALS[place]}`}>{avatarText(e)}</span>
            <span className={'lbx-pname' + (e.locked ? ' lbx-locked' : '')}>{e.title && <em>{e.title}</em>}{shownName(e)}</span>
            <span className="lbx-pmeta">{e.category || ''} <Movement move={moves[lineKey(award, e)]} /></span>
            <span className="lbx-pscore"><Score award={award} e={e} delay={(3 - place) * 140 + 300} /></span>
            <span className={`lbx-block lbx-${MEDALS[place]}`}><span>{place}</span></span>
          </button>
        );
      })}
    </div>
  );
}

// Category boards (U11, Women, rating bands…) in a fixed reading order:
// age categories youngest first, then girls' categories, Women, rating bands
function groupOrder(g, bandIndex) {
  const k = g.key;
  const age = parseInt((k.match(/\d+/) || ['999'])[0], 10);
  if (k.startsWith('cat:U')) return [0, age];
  if (k.startsWith('cat:F')) return [1, age];
  if (k.startsWith('cat:')) return [2, age];
  if (k === 'women') return [3, 0];
  if (k.startsWith('band:')) return [4, bandIndex];
  return [5, 0];
}

function sortGroups(groups) {
  const keyed = groups.map((g, i) => ({ g, o: groupOrder(g, i) }));
  keyed.sort((a, b) => a.o[0] - b.o[0] || a.o[1] - b.o[1] || a.g.label.localeCompare(b.g.label));
  return keyed.map((x) => x.g);
}

// A plain score for the compact category cards (no count-up: there can be dozens)
function shortScore(award, e) {
  if (e.value === null || e.value === undefined) return '—';
  if (award === 'best_game') return Number(e.value).toFixed(1);
  if (award === 'brilliant_move') return `${brilliantCount(e)} !!`;
  if (award === 'comeback') return '';
  return '';
}

function CategoryGrid({ award, groups, prevBoard, onInteract, tv, title = 'Every category' }) {
  const [open, setOpen] = useState({});
  const [page, setPage] = useState(0);
  const filled = groups.filter((g) => g.rows.length > 0);
  const pages = tv ? Math.max(1, Math.ceil(filled.length / TV_CATS_PER_PAGE)) : 1;
  useEffect(() => {
    if (!tv || pages < 2) return undefined;
    const id = setInterval(() => setPage((p) => (p + 1) % pages), TV_PAGE_MS);
    return () => clearInterval(id);
  }, [tv, pages]);
  if (!filled.length) return null;
  const shown = tv ? filled.slice((page % pages) * TV_CATS_PER_PAGE, (page % pages + 1) * TV_CATS_PER_PAGE) : filled;

  return (
    <section className="lbx-cats" aria-label={title}>
      <div className="lbx-cats-head">
        <div>
          <h3 className="lbx-cats-title">{title}</h3>
          {!tv && <p className="lbx-blurb">Each age group, Women and rating group has its own board.</p>}
        </div>
        {tv && pages > 1 && (
          <span className="lbx-cat-pages" aria-label={`Page ${(page % pages) + 1} of ${pages}`}>
            {Array.from({ length: pages }, (_, i) => <span key={i} className={i === page % pages ? 'on' : ''} />)}
          </span>
        )}
      </div>
      <div className="lbx-cat-grid">
        {shown.map((g) => {
          const expanded = !tv && !!open[g.key];
          const before = {};
          (prevBoard?.[g.key] || []).forEach((e) => { before[lineKey(award, e)] = e.rank; });
          return (
            <article key={g.key} className="lbx-cat">
              <header className="lbx-cat-head">
                <h4>{g.label}</h4>
                <span>{g.rows.length} ranked</span>
              </header>
              <ol className="lbx-cat-list">
                {(expanded ? g.rows : g.rows.slice(0, CAT_TOP)).map((e) => {
                  const k = lineKey(award, e);
                  const move = prevBoard && !e.locked ? (before[k] === undefined ? 'new' : before[k] - e.rank) : undefined;
                  return (
                    <li key={k} className="lbx-cat-row">
                      <span className={'lbx-cat-rank' + (e.rank <= 3 ? ` lbx-${MEDALS[e.rank]}` : '')}>{e.rank}</span>
                      <span className="lbx-who">
                        <span className={'lbx-cat-name' + (e.locked ? ' lbx-locked' : '')}>{e.title && <em>{e.title}</em>}{shownName(e)}<Movement move={move} /></span>
                        <span className="lbx-rmeta">
                          {e.locked ? 'Not public yet' : [e.category, e.round_no && `Round ${e.round_no}`].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                      <b className={'lbx-cat-score' + (e.rank === 1 ? ' first' : '')}>{shortScore(award, e)}</b>
                    </li>
                  );
                })}
              </ol>
              {!tv && g.rows.length > CAT_TOP && (
                <button type="button" className="lbx-cat-more" aria-expanded={expanded}
                        onClick={() => { setOpen((o) => ({ ...o, [g.key]: !expanded })); onInteract(); }}>
                  {expanded ? `Show top ${CAT_TOP}` : `See all ${g.rows.length}`}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Slide({ award, rows, slug, moves, categories = [], prevBoard, onInteract, onWatch, tv }) {
  const [picked, setPicked] = useState(null);
  const meta = AWARDS[award];
  const brilliant = award === 'brilliant_move';
  // The highest-ranked brilliant move that can be replayed
  const top = brilliant ? rows.find(canShowMoment) : null;
  // Open on one side, every category on the other (wide screens and the TV)
  const split = categories.some((g) => g.rows.length > 0);
  const pick = (e) => {
    onInteract();
    if (brilliant) onWatch(e);
    else setPicked(e);
  };
  return (
    <div className="lbx-slide" key={award}>
      <div className="lbx-slide-head">
        <div>
          <div className="lbx-kicker">Award</div>
          <h2 className="lbx-title">{meta.title}</h2>
          <p className="lbx-blurb">{meta.blurb}</p>
        </div>
        <div className="lbx-head-side">
          {top && !tv && (
            <button type="button" className="lbx-watch" onClick={() => pick(top)}>
              <span aria-hidden="true">▶</span> Watch the top brilliant move
            </button>
          )}
          {split && <span className="lbx-open-tag">Open · every player</span>}
        </div>
      </div>

      <div className={split ? 'lbx-split' : 'lbx-single'}>
      <div className="lbx-split-main">
      {rows.length === 0 && (
        <div className="lbx-empty">
          <Trophy size={64} />
          <p>No one has taken this trophy yet. It's still up for grabs.</p>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <Podium award={award} top={rows.slice(0, 3)} moves={moves} onPick={pick} />
          {rows.length > 3 && (
            <ol className="lbx-rows" start={4}>
              {rows.slice(3, tv ? 3 + TV_ROWS : undefined).map((e, i) => (
                <li key={lineKey(award, e)} className="lbx-row" style={{ '--d': `${500 + i * 90}ms` }}>
                  <span className="lbx-rank">{e.rank}{e.tie && <sup title="Tied">=</sup>}</span>
                  <span className="lbx-avatar lbx-plain">{avatarText(e)}</span>
                  <span className="lbx-who">
                    <span className={'lbx-rname' + (e.locked ? ' lbx-locked' : '')}>{e.title && <em>{e.title}</em>}{shownName(e)} <Movement move={moves[lineKey(award, e)]} /></span>
                    <span className="lbx-rmeta">
                      {e.locked
                        ? 'Hasn’t linked a Kibitzz profile yet'
                        : <>{e.category ? `${e.category} · ` : ''}Round {e.round_no} · {outcome(e)}{e.opponent ? ` vs ${e.opponent}` : ''}</>}
                    </span>
                  </span>
                  <span className="lbx-rscore"><Score award={award} e={e} delay={600 + i * 90} /></span>
                  {(e.replay || (brilliant && canShowMoment(e))) && (
                    <button type="button" className="lbx-view" onClick={() => pick(e)}>{brilliant ? 'See move' : 'Game'}</button>
                  )}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
      </div>

      {split && (
        <div className="lbx-split-side">
          <CategoryGrid award={award} groups={categories} prevBoard={prevBoard} onInteract={onInteract} tv={tv} />
        </div>
      )}
      </div>

      {brilliant && rows.length > 0 && !top && !tv && (
        <p className="lbx-moment-private">The positions are shown once both players have agreed to make their game public.</p>
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

// Shown on the hall TV once per rotation: what Kibitzz is, and where to get it
function BrandSpot({ onDone }) {
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const id = setTimeout(() => done.current?.(), BRAND_MS);
    return () => clearTimeout(id);
  }, []);
  const steps = [
    ['1', 'Scan', 'Photograph your handwritten scoresheet'],
    ['2', 'Analyse', 'Stockfish checks every move of the game'],
    ['3', 'Learn', 'The critical moments, explained in plain English'],
  ];
  return (
    <div className="kb-spot" role="dialog" aria-label="About Kibitzz">
      <div className="kb-spot-inner">
        <div className="kb-brand">
          <img src={appLogo} alt="" className="kb-logo" />
          <span className="kb-word">Kibitzz</span>
        </div>
        <div className="kb-eyebrow">Scan · Review · Improve</div>
        <h2 className="kb-h">Turn handwritten chess scoresheets into <span>meaningful learning.</span></h2>
        <div className="kb-steps">
          {steps.map(([n, title, text], i) => (
            <div key={n} className="kb-step" style={{ '--d': `${400 + i * 180}ms` }}>
              <span className="kb-step-n">{n}</span>
              <b>{title}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <div className="kb-foot">
          <span>This Brilliancy Board is powered by Kibitzz</span>
          <div className="kb-stores">
            <span className="kb-store">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="#0E1A24"><path d="M16.37 12.6c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.09-2.01-3.76-2.04-1.6-.16-3.12.94-3.93.94-.81 0-2.06-.92-3.39-.89-1.74.03-3.35 1.01-4.25 2.57-1.81 3.14-.46 7.79 1.3 10.34.86 1.25 1.89 2.65 3.24 2.6 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.4-.02 2.29-1.27 3.14-2.53.99-1.45 1.4-2.86 1.42-2.93-.03-.01-2.72-1.04-2.73-4.12zM13.8 5c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-3 1.54-.66.76-1.23 1.98-1.08 3.15 1.14.09 2.31-.58 3.02-1.44z" /></svg>
              <span><small>Download on the</small>App Store</span>
            </span>
            <span className="kb-store">
              <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none"><path d="M3.61 1.814A1.82 1.82 0 003 3.293v17.414a1.82 1.82 0 00.61 1.479l.078.066 9.767-9.767v-.23L3.688 1.749l-.078.065z" fill="#4285F4" /><path d="M16.711 15.74l-3.256-3.255v-.23l3.256-3.256.073.042 3.86 2.193c1.102.626 1.102 1.65 0 2.276l-3.86 2.193-.073.037z" fill="#FBBC04" /><path d="M16.784 15.703L13.455 12.37 3.61 22.186c.363.385.964.432 1.636.048l11.538-6.531z" fill="#EA4335" /><path d="M16.784 8.999L5.246 2.466C4.574 2.082 3.973 2.13 3.61 2.514L13.455 12.37l3.329-3.371z" fill="#34A853" /></svg>
              <span><small>Get it on</small>Google Play</span>
            </span>
          </div>
          <span className="kb-site">kibitzz.in</span>
        </div>
      </div>
    </div>
  );
}

function Shell({ children, dark, tv }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  // The hall TV gets the board alone: no site menu or footer
  if (tv) return <main className="lbx-page lbx-tv">{children}</main>;
  // The page fills the screen, so a short list never leaves the footer floating mid-page
  return (
    <div className="lb-shell">
      <Navbar />
      <main className={dark ? 'lbx-page' : 'lb-main'}>{children}</main>
      <Footer />
    </div>
  );
}

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
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
        The best games, brilliant moves and comebacks from tournaments on Kibitzz, analysed by Stockfish.
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
  const [params] = useSearchParams();
  const tv = params.get('tv') === '1';
  const info = useJson(`/api/public/t/${slug}`, REFRESH_MS);
  const rounds = info.data?.published_rounds || [];
  const [round, setRound] = useState(null);
  const [scope, setScope] = useState('cumulative');
  const current = round ?? (rounds.length ? rounds[rounds.length - 1].round_no : null);
  const previous = rounds.filter((r) => r.round_no < (current || 0)).pop()?.round_no;
  const board = useJson(current ? `/api/public/t/${slug}/leaderboard?round=${current}&scope=${scope}` : null, REFRESH_MS);
  // Movement arrows compare the standings with the previous published round
  const prev = useJson(current && previous && scope === 'cumulative'
    ? `/api/public/t/${slug}/leaderboard?round=${previous}&scope=cumulative` : null, REFRESH_MS);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);
  // The full-screen brilliant replay: { entry, auto } — auto ones move the rotation on when they end
  const [replay, setReplay] = useState(null);
  const [brand, setBrand] = useState(false);
  const shown = useRef(0);
  const reduced = useReducedMotion();
  const touchX = useRef(null);

  useEffect(() => {
    if (info.data) document.title = `${info.data.name} leaderboard | Kibitzz`;
  }, [info.data]);

  const content = board.data;
  const awards = useMemo(() => (content ? Object.keys(AWARDS).filter((a) => content.boards[a]) : []), [content]);
  // The main board of every award is Open; any other group keys become category cards
  const rowsFor = useCallback((a) => (content?.boards[a]?.open) || [], [content]);
  const categoriesFor = useCallback((a) => {
    const board = content?.boards[a];
    if (!board) return [];
    const labels = {};
    (content.groups || []).forEach((g) => { labels[g.key] = g.label; });
    const groups = Object.keys(board)
      .filter((k) => k !== 'open')
      .map((k) => ({ key: k, label: labels[k] || k.replace(/^(cat|band):/, ''), rows: board[k] || [] }));
    return groups.some((g) => g.rows.length) ? sortGroups(groups) : [];
  }, [content]);

  const active = awards.length ? awards[index % awards.length] : null;
  // On the TV a resting mouse must not freeze the rotation
  const running = playing && (tv || !hovering) && awards.length > 1 && !replay && !brand;
  const catPages = active ? Math.ceil(categoriesFor(active).filter((g) => g.rows.length).length / TV_CATS_PER_PAGE) : 0;
  const slideMs = tv ? Math.max(TV_SLIDE_MS, catPages * TV_PAGE_MS) : SLIDE_MS;

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

  // Next slide; on the TV, once every full rotation, the Kibitzz spot comes first
  const advance = useCallback(() => {
    shown.current += 1;
    // On the TV, the Kibitzz spot closes each full rotation
    if (tv && awards.length && shown.current % awards.length === 0) setBrand(true);
    else go(1);
  }, [tv, awards.length, go]);

  useEffect(() => {
    if (!running) return undefined;
    const id = setTimeout(() => {
      // After the brilliant leaderboard has had its time, play the top move full screen
      const top = active === 'brilliant_move' ? rowsFor(active).find(canShowMoment) : null;
      if (top) setReplay({ entry: top, auto: true });
      else advance();
    }, slideMs);
    return () => clearTimeout(id);
  }, [running, index, advance, slideMs, active, rowsFor]);

  const endReplay = useCallback(() => {
    if (replay?.auto) advance();
    setReplay(null);
  }, [replay, advance]);

  const endBrand = useCallback(() => {
    setBrand(false);
    go(1);
  }, [go]);

  useEffect(() => { setIndex(0); }, [current, scope]);

  const moves = useMemo(() => {
    if (!prev.data || !content || !active) return {};
    const before = {};
    const prevBoard = prev.data.boards[active];
    const prevRows = prevBoard?.open || [];
    prevRows.forEach((e) => { before[lineKey(active, e)] = e.rank; });
    const out = {};
    rowsFor(active).forEach((e) => {
      const k = lineKey(active, e);
      out[k] = before[k] === undefined ? 'new' : before[k] - e.rank;
    });
    return out;
  }, [prev.data, content, active, rowsFor]);

  if (info.loading) return <Shell dark tv={tv}><div className="lbx-wrap"><p className="lbx-loading">Loading…</p></div></Shell>;
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
    <Shell dark tv={tv}>
      <div className="lbx-wrap">
        {!tv && (
          <div className="lbx-topbar">
            <Link to="/leaderboards" className="lbx-back">&larr; All leaderboards</Link>
            <Link to={`/leaderboards/${slug}?tv=1`} className="lbx-tvlink">Open TV mode</Link>
          </div>
        )}
        <header className="lbx-hero">
          <Trophy size={72} />
          <div className="lbx-hero-text">
            <div className="lbx-kicker">Kibitzz Brilliancy Board</div>
            <h1 className="lbx-h1">{t.name}</h1>
            <p className="lbx-sub">
              {t.status === 'finished' ? 'Final standings' : 'Live from the tournament hall'}
              {tv && current && <> · after round <b>{current}</b></>}
              {!tv && t.chess_results_url && <> · <a href={t.chess_results_url} target="_blank" rel="noreferrer">chess-results</a></>}
            </p>
          </div>
          {tv && (
            <div className="lbx-tv-follow">
              <div className="lbx-tv-follow-text">
                <b>Scan to follow live</b>
                <span>Every category, on your phone</span>
                <button type="button" className="lbx-tv-fs" onClick={toggleFullscreen}>Full screen</button>
              </div>
              <div className="lbx-qr">
                <QRCodeSVG value={`${PUBLIC_SITE}/leaderboards/${slug}`} size={256} level="M" marginSize={0}
                           bgColor="#FFFFFF" fgColor="#0E1A24" title="Scan to open this leaderboard" />
              </div>
            </div>
          )}
        </header>

        {t.prizes.some((p) => AWARDS[p.award]) && (
          <div className="lbx-prizes">
            {t.prizes.filter((p) => AWARDS[p.award]).map((p) => (
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
            {!tv && <div className="lbx-controls">
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
            </div>}

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
                              style={{ animationDuration: `${slideMs}ms` }} />
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
                  key={`${active}-${current}-${scope}`}
                  award={active}
                  slug={slug}
                  rows={rowsFor(active)}
                  moves={moves}
                  categories={categoriesFor(active)}
                  prevBoard={prev.data?.boards?.[active]}
                  onInteract={tv ? () => {} : () => setPlaying(false)}
                  onWatch={(e) => setReplay({ entry: e, auto: false })}
                  tv={tv}
                />
              </section>
            )}
            {replay && (
              <ReplayOverlay slug={slug} entry={replay.entry} tv={tv} tournament={t.name} onDone={endReplay} />
            )}
            {brand && <BrandSpot onDone={endBrand} />}
            {!tv && <p className="lbx-foot">
              {content && <>Published {fmtDate(content.published_at)} · </>}
              Only players who linked their profile in the Kibitzz app and agreed to be shown appear here.
            </p>}
          </>
        )}
      </div>
    </Shell>
  );
}
