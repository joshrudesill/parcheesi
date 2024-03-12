let board;
let gameState = {
  turn: 0,
  numPlayers: 0,
};
let defaultPlayer = {
  pieces: [-1, -1, -1, -1],
  moveBag: [],
  color: "",
  turns: 0,
  pieceOptions: [[], [], [], []],
};
let blocks = {};
let homeSquares = [5, 22, 39, 56];
let currentPlayers = [
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "yellow",
    homeSquare: 5,
    turns: 1,
    pieceOptions: [[], [], [], []],
    lastPiece: { player: -1, at: -1 },
    canMovePieces: false,
    canRoll: false,
  },
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "blue",
    homeSquare: 22,
    turns: 1,
    pieceOptions: [[], [], [], []],
    lastPiece: { player: -1, at: -1 },
    canMovePieces: false,
    canRoll: false,
  },
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "red",
    homeSquare: 39,
    turns: 1,
    pieceOptions: [[], [], [], []],
    lastPiece: { player: -1, at: -1 },
    canMovePieces: false,
    canRoll: false,
  },
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "green",
    homeSquare: 56,
    turns: 1,
    pieceOptions: [[], [], [], []],
    lastPiece: { player: -1, at: -1 },
    canMovePieces: false,
    canRoll: false,
  },
];

let safeSquares = [5, 12, 17, 22, 29, 39, 46, 51, 56, 63, 68];
//  Actions [ receiveNewGameState<()>, rollDice<()>, movePiece<()> ],
//  State [ moveBag<[]>, turnsLeft<int> (for rolling doubles), pieceOptions<[[]]>, pieces<[]>, turn<int>, numPlayers<int>, canMovePieces<bool>, canRoll<bool> ]
// "1,1,1,1+2,2,2,2+3,3,3,3+4,4,4,4"
const parseGameIntoMemory = (piecePostitions, numPlayers, turn) => {
  gameState.numPlayers = numPlayers;
  gameState.turn = turn;
  // Parse db result into array
  const gameNotation = piecePostitions.split("#");
  const lastAt = gameNotation[1]
    .split("+")
    .map((i) => i.split(",").map((j) => Number(j)));
  console.log(lastAt);
  const playerArrays = gameNotation[0]
    .split("+")
    .map((i) => i.split(",").map((j) => Number(j)));
  setup(numPlayers);
  // Find blocks
  for (let i = 0; i < gameState.numPlayers; i++) {
    // playerArrays[i].forEach((x) => {
    //   doubles[x] = (doubles[x] || 0) + 1;
    //   if (doubles[x] === 2) {
    //     blocks[x] = i;
    //   }
    // });
    currentPlayers[i].pieces = playerArrays[i];
    currentPlayers[i].lastPiece = { player: lastAt[i][0], at: lastAt[i][1] };
  }
};
const setup = (numPlayers) => {
  // Error checking
  if (numPlayers < 2) {
    console.error("Must have more than 2 players in setup");
    return;
  } else if (numPlayers > 4) {
    console.error("Must have less than 4 players in setup");
    return;
  }
  gameState.numPlayers = numPlayers;
  // Change currentPlayers to match numPlayers
  if (numPlayers !== 4) {
    currentPlayers.splice(numPlayers, 4 - numPlayers);
  }
  board = new Uint8ClampedArray(68).map((_, i) => i);
};
const takeTurn = (player) => {
  let roll = [
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
  ];
  roll = [1, 5];

  // Check if any pieces at home still, if so force removal on 5
  if (roll[0] === roll[1]) {
    player.turns += 1;
    if (roll[0] === 5) {
    }
  } else if (roll[0] === 6 || roll[1] === 6) {
    player.turns += 1;
  }

  // When one 5 is rolled
  if ((roll[0] === 5 || roll[1] === 5) && !(roll[0] === 5 && roll[1] === 5)) {
  }
  player.moveBag.push(...roll);
  calculateAllowedMoves(roll, player);
};
const calculateAllowedMoves = (roll, player) => {
  if (roll.includes(5) && player.pieces.some((p) => p === 0)) {
    for (let i = 0; i < player.pieces.length; i++) {
      if (player.pieces[i] === 0) {
        player.pieceOptions[i] = [-1];
      }
    }
  } else {
    for (let j = 0; j < 4; j++) {
      const piece = player.pieces[j];
      // console.log("Checking piece at:", piece);
      if (piece !== 0) {
        let out = [...roll];
        for (let i = 0; i < roll.length; i++) {
          // console.log("Checking roll:", roll[i]);
          for (let x = 1; x <= roll[i]; x++) {
            const next = getSquare(piece, x);
            //   console.log("Next square is:", next);
            if (blocks[next]) {
              // console.log("Block found at:", next);
              if (out.length === 1) {
                out = [];
              } else {
                out.splice(i, 1);
              }
              // console.log("Out is now", out);
              break;
            }
          }
        }
        //   console.log("Piece options is now:", out);
        player.pieceOptions[j] = out;
      }
    }
  }
  let doubles = {};
  for (let i = 0; i < gameState.numPlayers; i++) {
    currentPlayers[i].pieces.forEach((x) => {
      if (x !== 0) {
        if (doubles[x]) {
          doubles[x].push(i);
        } else {
          doubles[x] = [i];
        }
        if (doubles[x].length === 2) {
          blocks[x] = doubles[x];
        }
      }
    });
  }

  // if there is a block at porch -
  // check if its a personal block
  // if so remove -1 from any pieces at home (0)
  console.log("blocks", blocks);
  if (blocks.hasOwnProperty(player.homeSquare)) {
    console.log("block at home");
    if (
      blocks[player.homeSquare][0] + 1 === gameState.turn &&
      blocks[player.homeSquare][1] + 1 === gameState.turn
    ) {
      player.pieceOptions = player.pieceOptions.map((po) =>
        po.length === 1 && po[0] === -1 ? [] : po
      );
    }
  }
};
const makeMove = (move, piece, player) => {
  if (move === -1) {
    let newSquare = player.homeSquare;

    player.pieces[piece] = newSquare;
    if (
      player.lastPiece.player !== -1 &&
      blocks.hasOwnProperty(player.homeSquare)
    ) {
      console.log("kicking piece");
      currentPlayers[player.lastPiece.player].pieces[player.lastPiece.at] = 0;
    }
    // Check for other players
    for (const p of currentPlayers) {
      if (p.color === player.color) {
        continue;
      }
      for (let i = 0; i < 3; i++) {
        if (p.pieces[i] === newSquare && !safeSquares.includes(p.pieces[i])) {
          // Take piece
          // need more logic here to determine who was first on the porch square
          p.pieces[i] = 0;
        }
      }
    }
    player.pieceOptions[piece] = [];
    player.moveBag =
      player.moveBag[0] === 5 ? [player.moveBag[1]] : [player.moveBag[0]];
  } else {
    const enemyHomeSquares = homeSquares.filter((i) => i !== player.homeSquare);
    console.log(enemyHomeSquares);
    const squareToMove = getSquare(player.pieces[piece], move);
    if (enemyHomeSquares.includes(squareToMove)) {
      currentPlayers[
        homeSquares.findIndex((i) => i === squareToMove)
      ].lastPiece = {
        player: gameState.turn - 1,
        at: piece,
      };
    }
    player.pieces[piece] = squareToMove;
    // Check for other players
    for (const p of currentPlayers) {
      if (p.color === player.color) {
        continue;
      }
      for (let i = 0; i < 3; i++) {
        if (
          p.pieces[i] === squareToMove &&
          !safeSquares.includes(p.pieces[i])
        ) {
          // Take piece
          p.pieces[i] = 0;
        }
      }
    }
    player.moveBag =
      player.moveBag[0] === move ? [player.moveBag[1]] : [player.moveBag[0]];
  }
  player.pieceOptions = defaultPlayer.pieceOptions;
  calculateAllowedMoves(player.moveBag, player);
};

const getSquare = (start, amount) => {
  return (start + amount) % 68;
};
parseGameIntoMemory(
  "0,0,5,0+5,22,0,0+0,0,0,0+0,0,0,0#1,0+-1,-1+-1,-1+-1,-1",
  2,
  1
);

takeTurn(currentPlayers[0]);
console.log(currentPlayers[0]);
makeMove(-1, 3, currentPlayers[0]);
console.log(currentPlayers[0]);
console.log(currentPlayers[1]);
console.log(blocks);
