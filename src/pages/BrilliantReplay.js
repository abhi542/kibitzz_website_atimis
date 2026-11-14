import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import './BrilliantReplay.css';

const GLYPH = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };
const FILES = 'abcdefgh';

// The replay's timeline, in ms from the start: the REPLAY wipe, the position
// before the move, the move sliding across, the landing, then the name banner.
const T = { board: 700, move: 2600, land: 3350, banner: 3700, end: 11000 };

function parseFen(fen) {
  const out = {};
  fen.split(' ')[0].split('/').forEach((row, r) => {
    let f = 0;
    [...row].forEach((c) => {
      const n = Number(c);
      if (n) f += n;
      else { out[FILES[f] + (8 - r)] = c; f += 1; }
    });
  });
  return out;
}

// The moment as two positions and the moves around it. Prefers the snapshot the
// leaderboard already carries; falls back to replaying a public game's moves.
function snapshotOf(entry, game) {
  const p = entry.positions;
  if (p?.brilliant) {
    const b = p.brilliant;
    return {
      before: b.fen_before, after: b.fen_after, from: b.from, to: b.to, san: b.san, ply: b.ply,
      prev: p.previous ? { from: p.previous.from, to: p.previous.to, san: p.previous.san, ply: p.previous.ply } : null,
    };
  }
  if (!game?.moves_uci || !entry.ply) return null;
  const chess = new Chess();
  const play = (u) => chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
  let prev = null;
  for (let i = 0; i < entry.ply - 1; i += 1) {
    const m = play(game.moves_uci[i]);
    prev = { from: m.from, to: m.to, san: m.san, ply: i + 1 };
  }
  const before = chess.fen();
  const m = play(game.moves_uci[entry.ply - 1]);
  return { before, after: chess.fen(), from: m.from, to: m.to, san: m.san, ply: entry.ply, prev };
}

// Every piece as a sprite with a start and end square, so the ones that move
// slide (the brilliant move, a castling rook) and captured ones fade out.
function sprites(snap) {
  const b = parseFen(snap.before);
  const a = parseFen(snap.after);
  const list = Object.entries(b).map(([sq, c]) => ({ id: sq, c, cEnd: c, start: sq, end: sq, gone: false }));
  const at = Object.fromEntries(list.map((p) => [p.start, p]));
  const mover = at[snap.from];
  if (at[snap.to] && at[snap.to] !== mover) at[snap.to].gone = true;
  if (mover) { mover.end = snap.to; mover.cEnd = a[snap.to] || mover.c; mover.mover = true; }
  const arriving = Object.entries(a).filter(([sq, c]) => sq !== snap.to && b[sq] !== c);
  list.filter((p) => p !== mover && !p.gone && a[p.start] !== p.c).forEach((p) => {
    const i = arriving.findIndex(([, c]) => c === p.c);
    if (i >= 0) { p.end = arriving[i][0]; arriving.splice(i, 1); } else p.gone = true;
  });
  return list;
}

function place(sq, flipped) {
  let col = FILES.indexOf(sq[0]);
  let row = 8 - Number(sq[1]);
  if (flipped) { col = 7 - col; row = 7 - row; }
  return { col, row };
}

export default function BrilliantReplay({ entry, game, moveLabel, onDone, reduced, tv, tournament }) {
  const snap = useMemo(() => snapshotOf(entry, game), [entry, game]);
  const pieces = useMemo(() => (snap ? sprites(snap) : []), [snap]);
  const [t, setT] = useState(reduced ? T.banner : 0);
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    if (reduced) {
      const id = setTimeout(() => done.current?.(), 8000);
      return () => clearTimeout(id);
    }
    const ids = [T.board, T.move, T.land, T.banner].map((ms) => setTimeout(() => setT(ms), ms));
    ids.push(setTimeout(() => done.current?.(), T.end));
    return () => ids.forEach(clearTimeout);
  }, [reduced]);

  useEffect(() => {
    if (tv) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') done.current?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tv]);

  if (!snap) return null;
  const flipped = entry.colour === 'black';
  const moved = t >= T.move;
  const landed = t >= T.land;
  const squares = [];
  for (let r = 0; r < 8; r += 1) {
    for (let c = 0; c < 8; c += 1) {
      const file = flipped ? 7 - c : c;
      const rank = flipped ? r + 1 : 8 - r;
      const name = FILES[file] + rank;
      let mark = '';
      if (landed && (name === snap.from || name === snap.to)) mark = ' spot';
      else if (!landed && snap.prev && (name === snap.prev.from || name === snap.prev.to)) mark = ' last';
      squares.push(<div key={name} className={`rp-sq ${(r + c) % 2 ? 'dark' : 'light'}${mark}`} />);
    }
  }
  const dest = place(snap.to, flipped);
  const side = entry.colour === 'white' ? 'White' : 'Black';

  return (
    <div className={'rp' + (tv ? ' rp-tv' : '')} role="dialog" aria-label={`Replay: ${entry.display_name}, ${moveLabel(snap.ply, snap.san)}`}>
      <div className="rp-wipe" aria-hidden="true"><span>Replay</span></div>

      <div className="rp-top">
        <div className="rp-bug"><span className="rp-dot" />Replay<em>· Brilliant move</em></div>
        <div className="rp-top-right">
          {tournament && <div className="rp-event">{tournament}</div>}
          {!tv && <button type="button" className="rp-close" onClick={() => done.current?.()} aria-label="Close replay">×</button>}
        </div>
      </div>

      <div className={'rp-stage' + (t >= T.board ? ' in' : '')}>
        <div className="rp-board-wrap">
          <div className="rp-board">
            {squares}
            {pieces.map((p) => {
              const { col, row } = place(moved ? p.end : p.start, flipped);
              const ch = moved ? p.cEnd : p.c;
              return (
                <span key={p.id}
                      className={`rp-piece ${ch === ch.toUpperCase() ? 'w' : 'b'}${p.mover ? ' mover' : ''}${p.mover && landed ? ' landed' : ''}${p.gone && moved ? ' gone' : ''}`}
                      style={{ left: `${col * 12.5}%`, top: `${row * 12.5}%` }}>
                  {GLYPH[ch.toLowerCase()]}{'︎'}
                </span>
              );
            })}
            {landed && (
              <>
                <span className="rp-ring" style={{ left: `${dest.col * 12.5}%`, top: `${dest.row * 12.5}%` }} />
                <span className="rp-bang-sq" style={{ left: `${Math.min(dest.col * 12.5 + 7, 88)}%`, top: `${Math.max(dest.row * 12.5 - 5, 0)}%` }}>!!</span>
              </>
            )}
          </div>
          <div className={'rp-caption' + (moved ? ' out' : '')}>
            {snap.prev ? <>After <b>{moveLabel(snap.prev.ply, snap.prev.san)}</b> · {side} to move</> : <>{side} to move</>}
          </div>
        </div>

        <div className={'rp-banner' + (t >= T.banner ? ' in' : '')}>
          <div className="rp-bang">!!</div>
          <div className="rp-who">
            <span className="rp-kick">Brilliant move · Round {entry.round_no}</span>
            <b className="rp-name">{entry.title && <em>{entry.title}</em>}{entry.display_name}</b>
            <span className="rp-move">{moveLabel(snap.ply, snap.san)}!!</span>
            <span className="rp-meta">
              {side}
              {entry.brilliant_count > 1 && <> · <b>{entry.brilliant_count}</b> brilliant moves this tournament</>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
