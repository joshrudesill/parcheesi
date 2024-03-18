let board;
let gameState = {
  turn: 0,
  numPlayers: 0,
};
let defaultPlayer = {
  pieces: [-1, -1, -1, -1],
  moveBag: [],
  color: "",
  extraRolls: 0,
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
    extraRolls: 1,
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
    extraRolls: 1,
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
    extraRolls: 1,
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
    extraRolls: 1,
    pieceOptions: [[], [], [], []],
    lastPiece: { player: -1, at: -1 },
    canMovePieces: false,
    canRoll: false,
  },
];
function deepCopy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj; // Return the obj if it's not an object or an array
  }

  const newObj = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (
        typeof obj[key] !== "object" ||
        obj[key] === null ||
        obj[key] instanceof String
      ) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = deepCopy(obj[key]);
      }
    }
  }

  return newObj;
}

let safeSquares = [5, 12, 17, 22, 29, 39, 46, 51, 56, 63, 68];
//  Actions [ receiveNewGameState<()>, rollDice<()>, movePiece<()> ],
//  State [ moveBag<[]>, turnsLeft<int> (for rolling doubles), pieceOptions<[[]]>, pieces<[]>, turn<int>, numPlayers<int>, canMovePieces<bool>, canRoll<bool> ]
// "1,1,1,1+2,2,2,2+3,3,3,3+4,4,4,4"
export const parseGameIntoMemory = (piecePostitions, numPlayers, turn, cb) => {
  console.log("pc, ", piecePostitions);
  // currentPlayers = Object.assign([], currentPlayers);
  currentPlayers = deepCopy(currentPlayers);
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
  currentPlayers = setup(numPlayers, currentPlayers);
  // Find blocks

  for (let i = 0; i < gameState.numPlayers; i++) {
    // console.log(Object.isExtensible(currentPlayers));
    // currentPlayers[i] = { ...currentPlayers[i] };
    currentPlayers[i].pieces = [...currentPlayers[i].pieces];
    // console.log(Object.isExtensible(currentPlayers[i]));
    // console.log(Object.isExtensible(currentPlayers[i].pieces));
    // currentPlayers[i].pieces = [...currentPlayers[i].pieces];
    currentPlayers[i].pieces = playerArrays[i];
    currentPlayers[i].lastPiece = { player: lastAt[i][0], at: lastAt[i][1] };
  }
  cb(currentPlayers);
};
const setup = (numPlayers, currentPlayers) => {
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
  return currentPlayers;
};
export function takeTurn(gs, pturn) {
  // currentPlayers = Object.assign([], gs);
  // console.log(Object.isExtensible(currentPlayers)); // false
  // console.log(Object.isExtensible(currentPlayers[pturn]));
  // let player = Object.assign({}, currentPlayers[pturn]);
  // console.log(Object.isExtensible(player)); // true
  // console.log(player);
  currentPlayers = deepCopy(gs);
  let player = currentPlayers[pturn];

  let roll = [
    Math.floor(Math.random() * 5) + 1,
    Math.floor(Math.random() * 5) + 1,
  ];
  roll = [2, 3];

  // Check if any pieces at home still, if so force removal on 5
  if (roll[0] === roll[1]) {
    player.extraRolls += 1;
    if (roll[0] === 5) {
    }
  } else if (roll[0] === 6 || roll[1] === 6) {
    player.extraRolls += 1;
  }

  // When one 5 is rolled
  if ((roll[0] === 5 || roll[1] === 5) && !(roll[0] === 5 && roll[1] === 5)) {
  }
  player.moveBag = [...roll];
  calculateAllowedMoves(roll, player, currentPlayers);
  return player;
}
const calculateAllowedMoves = (roll, player, currentPlayers) => {
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
  if (roll.includes(5) && player.pieces.some((p) => p === 0)) {
    for (let i = 0; i < player.pieces.length; i++) {
      if (player.pieces[i] === 0) {
        player.pieceOptions[i] = [-1];
      }
    }
  } else {
    for (let j = 0; j < 4; j++) {
      const piece = player.pieces[j];
      // if piece is in garage, continue
      // console.log("Checking piece at:", piece);
      if (piece !== 0) {
        let out = [...roll];
        for (let i = 0; i < roll.length; i++) {
          // console.log("Checking roll:", roll[i]);
          for (let x = 1; x <= roll[i]; x++) {
            const next = getSquare(piece, x); // get square needs to get modified to look for color
            // if next square is in driveway,
            // check if move it out of bounds
            // if so take move out of pieceoptions
            // else leave in
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
        player.pieceOptions = [...player.pieceOptions];
        player.pieceOptions[j] = out;
      }
    }
  }

  // if there is a block at porch -
  // check if its a personal block
  // if so remove -1 from any pieces at home (0)
  if (blocks.hasOwnProperty(player.homeSquare)) {
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
export const makeMove = (move, piece, gs, pturn) => {
  // currentPlayers = Object.assign([], gs);
  // let player = Object.assign({}, currentPlayers[pturn]);
  currentPlayers = deepCopy(gs);
  let player = currentPlayers[pturn];
  if (move === -1) {
    let newSquare = player.homeSquare;
    player.pieces[piece] = newSquare;
    let pieceTaken = false;
    if (
      player.lastPiece.player !== -1 &&
      blocks.hasOwnProperty(player.homeSquare)
    ) {
      currentPlayers[player.lastPiece.player].pieces[player.lastPiece.at] = 0;
      player.extraRolls++;
      pieceTaken = true;
      player.lastAt = { player: -1, at: -1 };
    }

    player.pieceOptions[piece] = [];
    // need to reset lastPiece at some point..
    player.moveBag =
      player.moveBag[0] === 5 ? [player.moveBag[1]] : [player.moveBag[0]];
    if (pieceTaken) player.moveBag.push(20);
  } else {
    // if move is on driveway, make move
    // if move lands in garage, increment pieces home or something like that
    console.log("move not -1");
    const enemyHomeSquares = homeSquares.filter((i) => i !== player.homeSquare);
    const squareToMove = getSquare(player.pieces[piece], move);
    console.log("moving to square", squareToMove);
    let pieceTaken = false;
    if (enemyHomeSquares.includes(squareToMove)) {
      const hs = homeSquares.findIndex((i) => i === squareToMove);
      if (hs !== -1 && hs < currentPlayers.length) {
        currentPlayers[hs].lastPiece = {
          player: gameState.turn - 1,
          at: piece,
        };
      }
    }
    // If player starts at enemy home square then moves away, need to reset last at
    if (enemyHomeSquares.includes(player.pieces[piece])) {
      const hs = homeSquares.findIndex((i) => i === squareToMove);
      if (hs !== -1 && hs < currentPlayers.length) {
        currentPlayers[hs].lastPiece = {
          player: -1,
          at: -1,
        };
      }
    }
    // player.pieces = [...player.pieces];
    player.pieces[piece] = squareToMove;
    // Check for other players
    let updatedPlayers = [];
    for (let j = 0; j < currentPlayers.length; j++) {
      let p = Object.assign({}, currentPlayers[j]);
      if (p.color === player.color) {
        console.log("continuing");
        updatedPlayers.push(p);
        continue;
      }
      for (let i = 0; i < 4; i++) {
        console.log(p);
        console.log(i);
        if (
          p.pieces[i] === squareToMove &&
          !safeSquares.includes(p.pieces[i])
        ) {
          // Take piece
          console.log("take1");
          // p.pieces = [...p.pieces];
          p.pieces[i] = 0;
          player.moveBag = [...player.moveBag, 20];
          player.extraRolls++;
          pieceTaken = true;
        }
      }
      updatedPlayers.push(p);
    }
    currentPlayers = updatedPlayers;
    console.log(currentPlayers);
    let oneDelete = false;
    player.moveBag = player.moveBag.filter((m) => {
      if (oneDelete) {
        return true;
      }
      if (m !== move) {
        return true;
      } else {
        oneDelete = true;
        return false;
      }
    });
  }
  player.pieceOptions = defaultPlayer.pieceOptions;
  calculateAllowedMoves(player.moveBag, player, currentPlayers);
  currentPlayers[pturn] = player;
  console.log(currentPlayers);
  return currentPlayers;
};

const getSquare = (start, amount) => {
  return (start + amount) % 68;
};
// parseGameIntoMemory(
//   `
//   0,0,5,0
//   +
//   0,6,5,0
//   +0,0,0,0+0,0,0,0#
//   1,2+-1,-1+-1,-1+-1,-1`,
//   2,
//   1
// );

// takeTurn(currentPlayers[0]);
// console.log(currentPlayers[0]);
// makeMove(-1, 3, currentPlayers[0]);
// console.log(currentPlayers[0]);
// console.log(currentPlayers[1]);
// console.log(blocks);
