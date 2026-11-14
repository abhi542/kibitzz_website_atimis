import './ChessBoard.css';

const GLYPH = { p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚' };
const FILES = 'abcdefgh';

// from/to highlight a move; spot marks it as the special one (the brilliant move).
export default function ChessBoard({ fen, from, to, flipped, spot }) {
  const rows = fen.split(' ')[0].split('/');
  const squares = [];
  rows.forEach((row, r) => {
    let f = 0;
    [...row].forEach((c) => {
      const empty = Number(c);
      for (let i = 0; i < (empty || 1); i += 1) {
        const name = FILES[f] + (8 - r);
        squares.push({ name, dark: (f + r) % 2 === 1, piece: empty ? null : c, file: f, rank: r });
        f += 1;
      }
    });
  });
  if (flipped) squares.reverse();
  const lastRow = flipped ? 0 : 7;
  const firstCol = flipped ? 7 : 0;
  return (
    <div className="bb-board" role="img" aria-label={`Position: ${fen}`}>
      {squares.map((s) => (
        <div key={s.name} className={`bb-sq ${s.dark ? 'dark' : 'light'}${s.name === from || s.name === to ? (spot ? ' spot' : ' last') : ''}`}>
          {s.file === firstCol && <span className="bb-sq-rank">{8 - s.rank}</span>}
          {s.rank === lastRow && <span className="bb-sq-file">{FILES[s.file]}</span>}
          {s.piece && (
            <span className={`bb-piece ${s.piece === s.piece.toUpperCase() ? 'w' : 'b'}`}>
              {GLYPH[s.piece.toLowerCase()]}{'︎'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
