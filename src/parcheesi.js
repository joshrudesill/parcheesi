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
};
let blocks = {};
let currentPlayers = [
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "yellow",
    turns: 1,
    pieceOptions: [[], [], [], []],
    canMovePieces: false,
    canRoll: false,
  },
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "blue",
    turns: 1,
    pieceOptions: [[], [], [], []],
    canMovePieces: false,
    canRoll: false,
  },
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "red",
    turns: 1,
    pieceOptions: [[], [], [], []],
    canMovePieces: false,
    canRoll: false,
  },
  {
    pieces: [-1, -1, -1, -1],
    moveBag: [],
    color: "green",
    turns: 1,
    pieceOptions: [[], [], [], []],
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
  const playerArrays = piecePostitions
    .split("+")
    .map((i) => i.split(",").map((j) => Number(j)));
  setup(numPlayers);
  // Find blocks
  for (let i = 0; i < gameState.numPlayers; i++) {
    let doubles = {};
    playerArrays[i].forEach((x) => {
      doubles[x] = (doubles[x] || 0) + 1;
      if (doubles[x] === 2) {
        blocks[x] = i;
      }
    });
    currentPlayers[i].pieces = playerArrays[i];
  }
  console.log(blocks);
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
    currentPlayers.splice(numPlayers - 1, 4 - numPlayers);
  }
  board = new Uint8ClampedArray(68).map((_, i) => i);
};
const takeTurn = (player) => {
  let roll = [
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
  ];
  roll = [3, 6];

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
    console.log("piece at home");
    for (let i = 0; i < player.pieces.length; i++) {
      if (player.pieces[i] === 0) {
        player.pieceOptions[i] = [-1];
      }
    }
    return;
  }
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
};
const makeMove = (move, piece, player) => {
  if (move === -1) {
    let newSquare;
    switch (player.color) {
      case "yellow":
        newSquare = 5;
        break;
      case "blue":
        newSquare = 22;
        break;
      case "red":
        newSquare = 39;
        break;
      case "green":
        newSquare = 56;
        break;
      default:
        newSquare = 0;
    }
    player.pieces[piece] = newSquare;
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
    const squareToMove = getSquare(player.pieces[piece], move);
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
  calculateAllowedMoves(player.moveBag, player);
};

const getSquare = (start, amount) => {
  return (start + amount) % 68;
};
parseGameIntoMemory("0,0,5,6+0,12,0,0+0,0,0,0+0,0,0,0", 2);
takeTurn(currentPlayers[0]);
console.log(currentPlayers[0]);
makeMove(6, 3, currentPlayers[0]);
console.log(currentPlayers[0]);
console.log(currentPlayers[1]);
