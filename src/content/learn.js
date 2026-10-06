// Content for the /learn section. Each article is rendered by
// src/pages/LearnArticle.js and prerendered by scripts/prerender.js.
//
// Body items: a string is a paragraph; an array is a bullet list;
// { ol: [...] } is a numbered list; { code: "..." } is a code block.

export const LEARN_UPDATED = '2026-10-06';

export const articles = [
  {
    slug: 'how-to-digitize-a-chess-scoresheet',
    title: 'How to digitize a chess scoresheet',
    metaTitle: 'How to Digitize a Chess Scoresheet (3 Ways) — Kibitzz',
    description:
      'Three ways to turn a handwritten chess scoresheet into a digital game you can replay and analyze: typing it in, a scanning app, or a hybrid. Steps, tips and trade-offs.',
    blurb: 'Three ways to get a handwritten game onto your phone or computer, and which one fits you.',
    answer:
      'To digitize a chess scoresheet, you either re-enter the moves by hand into a chess board or database, or photograph the sheet and let a scanner app read the handwriting for you. Either way, the goal is a PGN file or a playable game you can replay and run through an engine.',
    sections: [
      {
        h: 'Why digitize your scoresheets at all?',
        body: [
          'A paper scoresheet records what happened but cannot be replayed, searched or analyzed. Once a game is digital you can step through it move by move, ask an engine where the evaluation changed, and keep a searchable collection of every tournament game you have played.',
          'Most improvement comes from reviewing your own games, and reviewing is only practical when the game is already on a screen. The sooner you digitize after a tournament, the more of the game you still remember.',
        ],
      },
      {
        h: 'Method 1: type the moves in yourself',
        body: [
          'The traditional approach is to open a chess board or database program, set up the starting position and enter each move from the sheet. Most programs flag a move that is not legal in the current position, which makes this a good way to catch a misread character.',
          { ol: [
            'Open an analysis board or chess database and start a new game.',
            'Enter the moves in order, one at a time, from the scoresheet.',
            'If a move is rejected as illegal, re-read the sheet: you have usually mistaken a symbol or skipped a move.',
            'Fill in the player names, event, date and result.',
            'Save or export the game as PGN.',
          ] },
          'This is accurate and free, but it is slow. Entering a 40-move game carefully takes several minutes, and a pile of tournament sheets can take an evening.',
        ],
      },
      {
        h: 'Method 2: photograph it and use a scanner app',
        body: [
          'A scoresheet scanner reads the handwriting from a photo and rebuilds the game for you. The better ones do more than read characters: they check each reading against the rules of chess, so a smudged move that could only be one legal move is corrected automatically.',
          { ol: [
            'Place the sheet flat on a table with even lighting and no shadow across it.',
            'Photograph the whole sheet from directly above, with all move columns in frame.',
            'Let the app read it, then step through the reconstructed game and fix any move it flagged.',
            'Export or analyze the finished game.',
          ] },
          'Kibitzz works this way: you photograph the handwritten sheet, it reconstructs the game move by move, validates every move against the rules and runs Stockfish analysis. For a typical 40-move game that takes about 8 seconds from photo to playable game.',
        ],
      },
      {
        h: 'Tips that make any method more accurate',
        body: [
          [
            'Write clearly during the game. Distinguish b from 6, and 1 from l, because those are the most common sources of misreads.',
            'Write the move number and both moves on each row, and do not leave gaps.',
            'If you correct a move, cross it out neatly instead of writing over it.',
            'Photograph or enter the game soon after the round, while you can still resolve doubtful moves from memory.',
            'Keep the sheet flat. A curled page distorts the columns and hurts any scanner.',
          ],
        ],
      },
      {
        h: 'Which method should you choose?',
        body: [
          'If you play one or two games a month, typing them in is fine. If you play regularly, coach students, or run a club and collect many sheets, a scanner saves hours and removes most of the copying errors. Many players mix the two: scan first, then correct the few moves the scanner was unsure about.',
        ],
      },
    ],
    related: ['how-to-convert-chess-scoresheet-to-pgn', 'what-is-chess-ocr', 'how-to-analyze-a-chess-game'],
  },

  {
    slug: 'how-to-convert-chess-scoresheet-to-pgn',
    title: 'How to convert a chess scoresheet to PGN',
    metaTitle: 'How to Convert a Chess Scoresheet to PGN — Kibitzz',
    description:
      'Learn what PGN is and how to turn a handwritten chess scoresheet into a clean PGN file: header tags, move format, castling, results, and how to validate the result.',
    blurb: 'What a PGN file contains and how to turn a handwritten sheet into one without errors.',
    answer:
      'To convert a chess scoresheet to PGN, write the game as a short header of tags followed by the moves in standard algebraic notation and the result. You can type that by hand, or photograph the sheet and let a scanner such as Kibitzz produce the PGN for you.',
    sections: [
      {
        h: 'What is a PGN file?',
        body: [
          'PGN stands for Portable Game Notation. It is a plain-text format for chess games that nearly every engine, database and chess website can open. Because it is just text, you can store it, email it or paste it into an analysis board.',
        ],
      },
      {
        h: 'What does a PGN look like?',
        body: [
          'A PGN has two parts: header tags in square brackets, then the moves. Here is a complete, very short example:',
          { code: '[Event "Club Night"]\n[Site "Bengaluru"]\n[Date "2026.10.06"]\n[Round "1"]\n[White "Player A"]\n[Black "Player B"]\n[Result "1-0"]\n\n1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0' },
          'The seven tags above (Event, Site, Date, Round, White, Black and Result) are the standard set. The game ends with the result: 1-0 for a White win, 0-1 for a Black win, 1/2-1/2 for a draw, or * if the game is unfinished.',
        ],
      },
      {
        h: 'How to convert a scoresheet to PGN by hand',
        body: [
          { ol: [
            'Copy the header details from the top of the sheet: players, event, round, date and result.',
            'Write the moves in order as White move, Black move, with the move number before each pair.',
            'Use the PGN spelling for special moves: O-O and O-O-O for castling (the capital letter O, not the digit zero), x for captures, = for promotion such as e8=Q, + for check and # for checkmate.',
            'End with the result token, matching the Result tag.',
            'Paste the text into a chess board or database and replay it. An illegal move means you miscopied something earlier.',
            'Save the file with a .pgn extension.',
          ] },
        ],
      },
      {
        h: 'Common mistakes when writing PGN',
        body: [
          [
            'Using zeros instead of the letter O for castling.',
            'Omitting a move, which makes every later move illegal in the replay.',
            'Mixing up similar-looking characters, such as b and 6 or 1 and l.',
            'Writing piece letters from another language, such as S for a knight, instead of the English N.',
            'Forgetting the result, or giving a Result tag that does not match the last move.',
          ],
        ],
      },
      {
        h: 'Converting a scoresheet to PGN automatically',
        body: [
          'A scoresheet scanner skips the typing. You photograph the handwritten sheet and the app reads the moves, rebuilds the game, validates every move against the rules of chess and gives you a game you can export as PGN. Kibitzz supports PGN export, so the digitized game opens in any engine or chess database.',
          'Validation matters because handwriting is ambiguous. When a character could be read two ways, only one reading is usually a legal move, and that is the one the scanner should choose.',
        ],
      },
    ],
    related: ['how-to-digitize-a-chess-scoresheet', 'what-is-chess-ocr', 'how-to-analyze-a-chess-game'],
  },

  {
    slug: 'what-is-chess-ocr',
    title: 'What is chess OCR?',
    metaTitle: 'What Is Chess OCR? Reading Handwritten Scoresheets — Kibitzz',
    description:
      'Chess OCR is optical character recognition specialized for chess notation. See how it reads handwritten scoresheets, why chess rules make it more accurate, and where it still struggles.',
    blurb: 'How software reads handwritten chess notation, and why chess rules make it more reliable.',
    answer:
      'Chess OCR is optical character recognition specialized for chess notation: software that reads a photo of a handwritten or printed scoresheet and turns it into a list of moves. The best systems also check each move against the rules of chess to correct reading errors.',
    sections: [
      {
        h: 'How is chess OCR different from ordinary OCR?',
        body: [
          'General OCR tries to read any text. Chess notation is a tiny, strict language: piece letters (K, Q, R, B, N), files a to h, ranks 1 to 8, and a few symbols such as x, +, # and O-O. Knowing that vocabulary lets a chess-specific reader reject impossible readings. A character that looks like a 9 cannot be a rank, so it is probably a 4 or a g.',
          'The bigger advantage is that chess has rules. Every move must be legal in the position it was played from, so a reader that tracks the board while it reads can resolve doubtful handwriting by asking which reading is a legal move.',
        ],
      },
      {
        h: 'How does it read a scoresheet?',
        body: [
          { ol: [
            'Find the sheet in the photo and straighten it.',
            'Locate the move columns and separate each row into the White move and the Black move.',
            'Recognize the handwriting in each cell and propose one or more candidate moves.',
            'Replay the game from the starting position and keep only the candidates that are legal.',
            'Flag any move it cannot resolve for a human to confirm.',
          ] },
        ],
      },
      {
        h: 'What makes handwritten chess notation hard?',
        body: [
          [
            'Look-alike characters: b and 6, 1 and l, 5 and S, 0 and O.',
            'Different habits for the same move, such as 0-0 instead of O-O.',
            'Notation in another language, where piece letters differ, such as S for the knight in German.',
            'Crossed-out and rewritten moves on tournament sheets.',
            'Missing or incomplete moves, common when a player is short of time.',
            'Poor photos: shadows, curled paper, glare or a sheet cut off at the edge.',
          ],
        ],
      },
      {
        h: 'Where does chess OCR still need a human?',
        body: [
          'If a move is genuinely illegible, or if two readings are both legal, no software can be certain. Good tools show you the uncertain moves so you can fix them in seconds instead of hiding a guess. Treat the output as a fast first draft that you confirm, not as a guarantee.',
        ],
      },
      {
        h: 'Chess OCR in Kibitzz',
        body: [
          'Kibitzz reads standard handwritten scoresheets, including messy tournament notation, from a photo. It reconstructs the game move by move, validates every move against the rules, and then analyzes the game with Stockfish. The result is a playable game you can step through and export as PGN.',
        ],
      },
    ],
    related: ['how-to-digitize-a-chess-scoresheet', 'how-to-convert-chess-scoresheet-to-pgn', 'how-to-analyze-a-chess-game'],
  },

  {
    slug: 'how-to-analyze-a-chess-game',
    title: 'How to analyze a chess game',
    metaTitle: 'How to Analyze a Chess Game to Improve Faster — Kibitzz',
    description:
      'A practical method for analyzing your own chess games: review before using an engine, find the critical moments, classify your mistakes and turn them into training.',
    blurb: 'A step-by-step method to find what really cost you the game and fix it.',
    answer:
      'To analyze a chess game, replay it, note where you felt unsure, then use an engine to find the moments where the evaluation changed most. Work out why each mistake happened, and look for patterns across many games so you know what to train.',
    sections: [
      {
        h: 'Step 1: get the game onto a board',
        body: [
          'You cannot analyze a game on paper. Enter or scan the moves so you can replay them. If you played over the board, see our guide to digitizing a chess scoresheet. If you played online, the game is already saved for you.',
        ],
      },
      {
        h: 'Step 2: review the game before turning on the engine',
        body: [
          'Replay the game yourself first and write down what you thought at the key moments: where you were uncertain, where you felt you were better, and where the game turned. This step is the most valuable one, because it shows you how you think, and an engine cannot tell you that.',
        ],
      },
      {
        h: 'Step 3: run an engine and find the critical moments',
        body: [
          'Now check your notes against an engine such as Stockfish. Do not read every line. Look for the moves where the evaluation swings sharply, because those are the critical moments where the game was won or lost.',
          'An evaluation of +1.0 roughly means White is ahead by the equivalent of a pawn. What matters is the change from one move to the next, and whether the engine move was something you could realistically have found.',
        ],
      },
      {
        h: 'Step 4: find out why you erred',
        body: [
          'For each critical moment, decide which kind of error it was. The cause tells you what to practice.',
          [
            'A tactical oversight: you missed a threat or a combination.',
            'A positional misjudgment: you chose the wrong plan or traded the wrong pieces.',
            'An opening gap: you left your preparation too early or did not know the idea.',
            'Time pressure: the move came with very little time left.',
            'An endgame technique error: a winning or drawn position was mishandled.',
          ],
        ],
      },
      {
        h: 'Step 5: look for patterns, not single games',
        body: [
          'One game shows one mistake. Ten games show what you keep doing. If most of your swings are tactical oversights, drill tactics. If they cluster in the opening, fix your repertoire. Keep a running list of your error types and check it after every tournament.',
        ],
      },
      {
        h: 'Step 6: turn the findings into practice',
        body: [
          'End each review by writing one or two concrete things to work on, such as a tactical motif you missed or an endgame to study, and then practice those specifically. Analysis only pays off when it changes what you train.',
          'Kibitzz is built around this loop. After it digitizes your scoresheet and runs Stockfish, it highlights the critical moments and explains in plain English what changed, what was missed and what to improve.',
        ],
      },
    ],
    related: ['how-to-analyze-tournament-chess-games', 'chess-blunders-mistakes-inaccuracies', 'how-to-digitize-a-chess-scoresheet'],
  },

  {
    slug: 'how-to-analyze-tournament-chess-games',
    title: 'How to analyze tournament chess games',
    metaTitle: 'How to Analyze Tournament Chess Games — Kibitzz',
    description:
      'Over-the-board tournament games need a different review routine from online games. How to capture, digitize and study your tournament games, and how coaches can review students.',
    blurb: 'A routine for reviewing over-the-board games, for players and for coaches.',
    answer:
      'To analyze tournament chess games, digitize your scoresheets soon after the round, write down your thoughts while they are fresh, then review with an engine and track patterns across the whole event. Over-the-board games take extra effort because the moves start on paper.',
    sections: [
      {
        h: 'Why tournament games are harder to analyze than online games',
        body: [
          'An online game is saved automatically, with every move and often the clock times. A tournament game exists only on your handwritten scoresheet, so you have to get it onto a screen before any real analysis can begin. That extra step is why many players never review their over-the-board games, even though those are the games that matter most.',
        ],
      },
      {
        h: 'Before and during the game',
        body: [
          [
            'Write your moves legibly and in full. Clear notation makes digitizing fast and accurate.',
            'If you have a moment between moves, jot a symbol next to a move you were unsure about. It will help you remember where to look.',
            'Keep your own sheet. Copy the opponent\'s sheet or take a photo of yours at the end if the organizers allow it.',
          ],
        ],
      },
      {
        h: 'Right after the round',
        body: [
          { ol: [
            'Photograph or enter the scoresheet that day, while you still remember the game.',
            'Write a few lines on how it felt: where you were comfortable, where you were worried, and where you think it turned.',
            'Only then run the engine, so your own impressions are recorded first.',
          ] },
        ],
      },
      {
        h: 'Reviewing the whole tournament',
        body: [
          'The real value comes from comparing games. After the event, line up the critical moments from every round and look for what repeats: the same opening trouble, the same kind of tactical oversight, collapses late in a long game, or mistakes under time pressure. Choose one theme to work on before the next event.',
        ],
      },
      {
        h: 'For coaches and clubs',
        body: [
          'Coaches reviewing several students face the same bottleneck at larger scale: a stack of paper sheets. Digitizing them quickly lets you open each game, see the engine\'s critical moments, and spend your time discussing ideas instead of copying notation. Keeping every student\'s games in one digital collection also makes it easy to track progress from one tournament to the next.',
          'Kibitzz is designed for this use: tournament and club players, improving players, and coaches and clubs can scan a sheet and get a playable, engine-checked game with a plain-English summary of the critical moments.',
        ],
      },
    ],
    related: ['how-to-analyze-a-chess-game', 'how-to-digitize-a-chess-scoresheet', 'chess-blunders-mistakes-inaccuracies'],
  },

  {
    slug: 'chess-blunders-mistakes-inaccuracies',
    title: 'Chess blunders, mistakes and inaccuracies explained',
    metaTitle: 'Blunder vs Mistake vs Inaccuracy in Chess Explained — Kibitzz',
    description:
      'What the labels blunder, mistake and inaccuracy mean in chess analysis, how engines decide them, and how to use them to find what to practice.',
    blurb: 'What the move labels in engine analysis mean, and how to use them to improve.',
    answer:
      'In engine analysis, an inaccuracy is a small slip, a mistake is a clearly worse move, and a blunder is a move that throws away a large part of your advantage or loses material or the game. The labels come from how much a move changes the engine\'s evaluation.',
    sections: [
      {
        h: 'How engines decide the labels',
        body: [
          'An engine such as Stockfish gives every position an evaluation. After you play a move, it compares the new evaluation with what the best move would have given. The bigger the drop, the more serious the label. Engine evaluations are often shown in centipawns, where 100 centipawns is roughly the value of a pawn.',
          'There is no single universal cutoff. Different tools set their own thresholds, and some measure the drop in winning chances instead of centipawns, so the same move can be labeled differently in different programs.',
        ],
      },
      {
        h: 'Inaccuracy',
        body: [
          'An inaccuracy is a move that is playable but not best. It gives up a little of your advantage, or lets the opponent equalize slowly, and it rarely decides a game by itself. Most strong games contain a few.',
        ],
      },
      {
        h: 'Mistake',
        body: [
          'A mistake is a move that clearly worsens your position, for example allowing a strong plan or a lost pawn, but does not lose the game on the spot. A mistake often hands the opponent the initiative.',
        ],
      },
      {
        h: 'Blunder',
        body: [
          'A blunder is a serious error that swings the evaluation heavily, such as hanging a piece, missing a mate or walking into a tactic. Blunders are usually the moves that decide a game.',
        ],
      },
      {
        h: 'Why context matters',
        body: [
          'A move that looks like a blunder in a balanced position may barely matter if you were already completely winning, and the reverse is also true. Labels are a guide to where to look, not a final verdict. Always ask whether a human could realistically have found the better move, and why you chose the one you played.',
        ],
      },
      {
        h: 'Using the labels to improve',
        body: [
          'Count your blunders and mistakes across several games and sort them: tactical oversight, wrong plan, opening gap, or time pressure. The biggest group is what you should practice first. Reducing your blunders usually raises your results faster than learning new openings.',
          'Kibitzz highlights the critical moments of each game and gives a player accuracy score from the Stockfish analysis, then explains in plain English what changed at those moments.',
        ],
      },
    ],
    related: ['how-to-analyze-a-chess-game', 'how-to-analyze-tournament-chess-games', 'what-is-chess-ocr'],
  },
];

export const getArticle = (slug) => articles.find((a) => a.slug === slug);
