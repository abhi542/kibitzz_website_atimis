import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';

// Plays the UCI moves from the start. Stops at the first illegal move, so a
// submission that failed the legal check still shows everything before it.
function replay(uci) {
  const chess = new Chess();
  const positions = [{ fen: chess.fen() }];
  for (let i = 0; i < uci.length; i += 1) {
    const u = uci[i];
    try {
      const m = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
      positions.push({ fen: chess.fen(), san: m.san, from: m.from, to: m.to });
    } catch (e) {
      return { positions, illegal: { ply: i + 1, uci: u }, pgn: chess.pgn() };
    }
  }
  return { positions, illegal: null, pgn: chess.pgn() };
}

// game: { title, subtitle, result, uci, notes } where notes[i] (optional) is the
// worker's entry for ply i+1: { label, win_pct_white }.
export default function GameViewer({ game, onClose }) {
  const { positions, illegal, pgn } = useMemo(() => replay(game.uci), [game.uci]);
  const last = positions.length - 1;
  const [ply, setPly] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeMove = useRef(null);
  const dialog = useRef(null);

  const go = useCallback((n) => setPly(Math.max(0, Math.min(last, n))), [last]);

  useEffect(() => {
    const opener = document.activeElement;
    dialog.current?.focus();
    return () => opener?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setPly((p) => Math.max(0, p - 1)); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setPly((p) => Math.min(last, p + 1)); }
      else if (e.key === 'Home') { e.preventDefault(); setPly(0); }
      else if (e.key === 'End') { e.preventDefault(); setPly(last); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last, onClose]);

  useEffect(() => {
    activeMove.current?.scrollIntoView({ block: 'nearest' });
  }, [ply]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pgn);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      window.prompt('Copy the PGN', pgn);
    }
  };

  const pos = positions[ply];
  const note = ply > 0 ? game.notes?.[ply - 1] : null;
  const whitePct = note?.win_pct_white;
  const barPct = whitePct ?? 50;
  const pairs = [];
  for (let i = 1; i <= last; i += 2) pairs.push(i);

  const moveButton = (i) => {
    if (i > last) return <span />;
    const label = game.notes?.[i - 1]?.label;
    return (
      <button
        type="button"
        ref={i === ply ? activeMove : null}
        className={`bb-move${i === ply ? ' active' : ''}${label ? ` ${label}` : ''}`}
        title={label || undefined}
        onClick={() => go(i)}
      >
        {positions[i].san}
      </button>
    );
  };

  return (
    <div className="bb-viewer-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bb-viewer" role="dialog" aria-modal="true" aria-label={game.title} tabIndex={-1} ref={dialog}>
        <div className="bb-viewer-head">
          <div>
            <h3>{game.title}</h3>
            {game.subtitle && <div className="bb-muted">{game.subtitle}</div>}
          </div>
          <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" onClick={onClose}>Close</button>
        </div>
        {illegal && (
          <div className="bb-viewer-illegal">
            Stops at ply {illegal.ply}: <code>{illegal.uci}</code> is not a legal move here.
          </div>
        )}
        <div className="bb-viewer-body">
          <div className="bb-viewer-left">
            <div className="bb-board-wrap">
              {game.notes?.length > 0 && (
                <div className={`bb-evalbar${flipped ? ' flipped' : ''}`} title={`White ${barPct}% to win`}>
                  <div style={{ height: `${barPct}%` }} />
                </div>
              )}
              <ChessBoard fen={pos.fen} from={pos.from} to={pos.to} flipped={flipped} />
            </div>
            <div className="bb-viewer-nav">
              <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" aria-label="First move" disabled={ply === 0} onClick={() => go(0)}>«</button>
              <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" aria-label="Previous move" disabled={ply === 0} onClick={() => go(ply - 1)}>‹</button>
              <span className="bb-muted bb-viewer-ply">{ply === 0 ? 'Start' : `Ply ${ply} of ${last}`}</span>
              <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" aria-label="Next move" disabled={ply === last} onClick={() => go(ply + 1)}>›</button>
              <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" aria-label="Last move" disabled={ply === last} onClick={() => go(last)}>»</button>
              <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" onClick={() => setFlipped((x) => !x)}>Flip</button>
            </div>
          </div>
          <div className="bb-viewer-right">
            <div className="bb-movelist">
              {pairs.length === 0 && <p className="bb-muted">No legal moves to show.</p>}
              {pairs.map((i) => (
                <div key={i} className="bb-move-row">
                  <span className="bb-move-no">{(i + 1) / 2}.</span>
                  {moveButton(i)}
                  {moveButton(i + 1)}
                </div>
              ))}
            </div>
            {note?.label && <div className="bb-muted bb-viewer-note">This move: {note.label}{whitePct != null ? ` · White ${whitePct}% to win` : ''}</div>}
            {game.result && <div className="bb-viewer-result">Result: <strong>{game.result}</strong></div>}
            <div className="bb-row" style={{ margin: 0 }}>
              <button type="button" className="bb-btn bb-btn-ghost bb-btn-sm" onClick={copy}>{copied ? 'Copied' : 'Copy PGN'}</button>
              <a className="bb-btn bb-btn-ghost bb-btn-sm" href={`https://lichess.org/analysis/pgn/${encodeURIComponent(pgn)}`} target="_blank" rel="noreferrer">Open on Lichess</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Row clicks open the game, except on the row's own controls or while selecting text.
export const rowOpens = (open) => (e) => {
  if (e.target.closest('button, a, input, select, textarea, label, summary, details')) return;
  if (window.getSelection()?.toString()) return;
  open();
};
