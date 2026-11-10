import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import ChessBoard from '../components/ChessBoard';

const STEP_MS = 2500;

const play = (fen, uci) => {
  const chess = new Chess(fen);
  const m = chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
  return { fen: chess.fen(), san: m.san, from: m.from, to: m.to, before: fen };
};

// Rows published before the server sent positions: rebuild them from the full game
function positionsFromGame(movesUci, ply) {
  try {
    const chess = new Chess();
    movesUci.slice(0, Math.max(0, ply - 2)).forEach((u) => chess.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] }));
    const colour = (i) => (i % 2 === 1 ? 'white' : 'black');
    const step = (p) => {
      const m = play(chess.fen(), movesUci[p - 1]);
      chess.load(m.fen);
      return { ply: p, colour: colour(p), san: m.san, uci: movesUci[p - 1], from: m.from, to: m.to, fen_before: m.before, fen_after: m.fen };
    };
    const previous = ply > 1 ? step(ply - 1) : null;
    return { previous, brilliant: step(ply) };
  } catch {
    return null;
  }
}

// The opponent's reply, when the full game is public and continues
function replyTo(brilliant, game) {
  const uci = game?.moves_uci?.[brilliant.ply];
  if (!uci || game.moves_uci[brilliant.ply - 1] !== brilliant.uci) return null;
  try {
    return play(brilliant.fen_after, uci);
  } catch {
    return null;
  }
}

// The move before a brilliant move, the move itself and (when the game is public) the
// reply, on a board. Plays through once by itself; choosing a step stops that.
// positions comes from the server: {previous, brilliant}, each with the board before and after.
export default function BrilliantMoment({ positions, ply, game, ...rest }) {
  const pos = useMemo(() => positions || (game ? positionsFromGame(game.moves_uci, ply) : null), [positions, game, ply]);
  if (!pos) return <div className="lbx-game">This position can't be shown.</div>;
  return <Moment positions={pos} game={game} {...rest} />;
}

function Moment({ positions, swing, entry, game, moveLabel, onInteract, reduced }) {
  const { previous, brilliant } = positions;
  const reply = useMemo(() => replyTo(brilliant, game), [brilliant, game]);
  const last = reply ? 2 : 1;
  const [step, setStep] = useState(reduced ? 1 : 0);
  const [auto, setAuto] = useState(!reduced);

  useEffect(() => {
    if (!auto || step >= last) return undefined;
    const id = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(id);
  }, [auto, step, last]);

  const side = brilliant.colour === 'white' ? 'White' : 'Black';
  const steps = [
    {
      label: 'Move before',
      board: previous ? { fen: previous.fen_after, from: previous.from, to: previous.to } : { fen: brilliant.fen_before },
      move: previous && moveLabel(previous.ply, previous.san),
      text: `${side} to move. What would you play?`,
    },
    {
      label: 'Brilliant move',
      board: { fen: brilliant.fen_after, from: brilliant.from, to: brilliant.to },
      move: moveLabel(brilliant.ply, brilliant.san),
      text: `The brilliant move: the next best option left ${swing}% less chance of winning.`,
    },
    {
      label: 'Next move',
      board: reply,
      move: reply && moveLabel(brilliant.ply + 1, reply.san),
      text: reply ? 'The reply. Follow how the game went on.' : game ? 'The game ended here.' : 'The reply is shown once both players make the game public.',
    },
  ];
  const shown = steps[step].board || steps[1].board;
  const pgn = game?.pgn?.split(/\n\n/).pop().trim();
  const analyse = pgn
    ? { href: `https://lichess.org/analysis/pgn/${encodeURIComponent(pgn)}`, text: 'Analyse the full game on Lichess' }
    : { href: `https://lichess.org/analysis/standard/${brilliant.fen_before.replace(/ /g, '_')}`, text: 'Analyse this position on Lichess' };

  return (
    <div className="lbx-moment">
      <div className="lbx-game-head">
        {game
          ? `${entry.display_name}, round ${game.round_no}, board ${game.board_no} · ${game.white.display_name} vs ${game.black.display_name} · ${game.result}`
          : `${entry.display_name}, round ${entry.round_no} · playing ${brilliant.colour}${entry.opponent ? ` vs ${entry.opponent}` : ''}`}
      </div>
      <div className="lbx-moment-body">
        <div className="lbx-moment-board">
          <ChessBoard fen={shown.fen} from={shown.from} to={shown.to} flipped={brilliant.colour === 'black'} spot={step === 1} />
        </div>
        <div className="lbx-moment-side">
          <div className="lbx-moment-steps">
            {steps.map((s, i) => (
              <button
                type="button"
                key={s.label}
                aria-pressed={step === i}
                disabled={i === 2 && !reply}
                className={`lbx-moment-step${step === i ? ' on' : ''}${i === 1 ? ' star' : ''}`}
                onClick={() => { setStep(i); setAuto(false); onInteract(); }}
              >
                <small>{s.label}</small>
                <b>{s.move || '—'}{i === 1 && ' !!'}</b>
              </button>
            ))}
          </div>
          <p className="lbx-moment-text" aria-live="polite">{steps[step].text}</p>
          <a href={analyse.href} target="_blank" rel="noreferrer">{analyse.text} &rarr;</a>
        </div>
      </div>
    </div>
  );
}
