import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';

const STEP_MS = 2500;

// The position after each of the first `count` plies, from the start of the game.
function positionsUpTo(uci, count) {
  const chess = new Chess();
  const out = [{ fen: chess.fen() }];
  uci.slice(0, count).forEach((u) => {
    const m = chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });
    out.push({ fen: chess.fen(), san: m.san, from: m.from, to: m.to });
  });
  return out;
}

// The move before a brilliant move, the move itself and the reply, on a board.
// Plays through once by itself; choosing a step stops that and pauses the stage.
export default function BrilliantMoment({ game, entry, moveLabel, onInteract, reduced }) {
  const { ply, colour, value } = entry;
  const positions = useMemo(() => positionsUpTo(game.moves_uci, ply + 1), [game.moves_uci, ply]);
  const hasReply = positions.length > ply + 1;
  const [step, setStep] = useState(reduced ? 1 : 0);
  const [auto, setAuto] = useState(!reduced);

  useEffect(() => {
    if (!auto || step >= (hasReply ? 2 : 1)) return undefined;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [auto, step, hasReply]);

  const side = colour === 'white' ? 'White' : 'Black';
  const steps = [
    { label: 'Move before', ply: ply - 1, text: `${side} to move. What would you play?` },
    { label: 'Brilliant move', ply, text: `The brilliant move: the next best option left ${value}% less chance of winning.` },
    { label: 'Next move', ply: ply + 1, text: hasReply ? 'The reply. Follow how the game went on.' : 'The game ended here.' },
  ];
  const shownPly = steps[step].ply;
  const pos = positions[Math.min(shownPly, positions.length - 1)];
  const lichess = game.pgn.split(/\n\n/).pop().trim();

  return (
    <div className="lbx-moment">
      <div className="lbx-game-head">
        {entry.display_name}, round {game.round_no}, board {game.board_no} · {game.white.display_name} vs {game.black.display_name} · {game.result}
      </div>
      <div className="lbx-moment-body">
        <div className="lbx-moment-board">
          <ChessBoard fen={pos.fen} from={pos.from} to={pos.to} flipped={colour === 'black'} spot={step === 1} />
        </div>
        <div className="lbx-moment-side">
          <div className="lbx-moment-steps">
            {steps.map((s, i) => {
              const move = positions[s.ply];
              return (
                <button
                  type="button"
                  key={s.label}
                  aria-pressed={step === i}
                  disabled={!move}
                  className={`lbx-moment-step${step === i ? ' on' : ''}${i === 1 ? ' star' : ''}`}
                  onClick={() => { setStep(i); setAuto(false); onInteract(); }}
                >
                  <small>{s.label}</small>
                  <b>{move ? moveLabel(s.ply, move.san) : '—'}{i === 1 && ' !!'}</b>
                </button>
              );
            })}
          </div>
          <p className="lbx-moment-text" aria-live="polite">{steps[step].text}</p>
          <a href={`https://lichess.org/analysis/pgn/${encodeURIComponent(lichess)}`} target="_blank" rel="noreferrer">
            Analyse the full game on Lichess &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
