import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import board from "/src/assets/board.svg";

import { makeMove, parseGameIntoMemory, takeTurn } from "../../parcheesi";
import {
  makeMoveRedux,
  setGame,
  setPlayerNumber,
  setTurn,
  takeTurnRedux,
} from "../../redux/reducers/game.reducer";
import Pieces from "../Pieces/Pieces";
export default function Game() {
  const { game, doubles } = useSelector((s) => {
    // doubles {square: 1, colors: ['red', 'blue']}
    let concatGS = [];
    let dObj = {};
    let doubles = [];
    for (let gs of s.game.gameState) {
      for (let p of gs.pieces) {
        concatGS = concatGS.concat({
          at: p,
          color: gs.color,
        });
      }
    }
    for (const d of concatGS) {
      if (dObj[d.at]) {
        doubles.push({ at: d.at, colors: dObj[d.at].concat(d.color) });
      } else {
        if (d.at !== 0) {
          dObj[d.at] = [d.color];
        }
      }
    }
    return { game: s.game, doubles };
  });
  const user = useSelector((s) => s.user.currentUser);

  const dispatch = useDispatch();
  const history = useHistory();
  const [myTurn, setMyTurn] = useState(false);
  const [canRoll, setCanRoll] = useState(false);
  const [roll, setRoll] = useState([]);
  const [hasRolled, setHasRolled] = useState(false);

  useEffect(() => {
    dispatch(
      setPlayerNumber(game.players.findIndex((p) => p === user.username))
    );
  }, []);
  useEffect(() => {
    if (user.current_game === null) {
      history.push("/play");
    }
  }, [user.current_game]);

  useEffect(() => {
    const getInitialGameState = async () => {
      const currentGame = await axios.get("/api/game/cgs", {
        params: { game: user.current_game },
      });
      dispatch(setTurn(currentGame.data.turn - 1));
      parseGameIntoMemory(
        currentGame.data["piece_positions"],
        2, // Hard coded for now
        currentGame.data["turn"],
        (gs) => dispatch(setGame(gs))
      );
    };
    getInitialGameState();
  }, []);
  useEffect(() => {
    if (game.turn === game.playerNumber) {
      setMyTurn(true);
      setCanRoll(true);
    } else {
      setMyTurn(false);
    }
  }, [game.turn, game.playerNumber]);

  useEffect(() => {
    if (
      game.gameState[game.playerNumber]?.extraRolls > 0 &&
      game.gameState[game.playerNumber]?.moveBag.length === 0
    ) {
      setCanRoll(true);
    }
  }, [
    game.gameState[game.playerNumber]?.extraRolls,
    game.gameState[game.playerNumber]?.moveBag.length,
    game?.playerNumber,
  ]);
  useEffect(() => {
    if (
      roll[0] === roll[1] &&
      game.gameState[game.playerNumber]?.pieceOptions.every(
        (po) => po.length === 0
      ) &&
      game.gameState[game.playerNumber]?.extraRolls > 0
    ) {
      setCanRoll(true);
    }
  }, [roll]);
  useEffect(() => {
    if (
      hasRolled &&
      game.gameState[game.playerNumber]?.extraRolls === 0 &&
      game.gameState[game.playerNumber]?.moveBag.length === 0 &&
      !canRoll
    ) {
      console.log("TURN OVER");
      setMyTurn(false);
      let newGSPos = "";
      let newGSLastAt = "#";
      for (let i = 0; i < 4; i++) {
        const gs = game.gameState.at(i);
        let s = "";
        let l = "";
        if (gs) {
          s += gs.pieces.join(",");
          l += `${gs.lastPiece.player},${gs.lastPiece.at}`;
        } else {
          s += "0,0,0,0";
          l += "-1,-1";
        }
        if (i !== 3) {
          s += "+";
          l += "+";
        }
        newGSPos = newGSPos.concat(s);
        newGSLastAt = newGSLastAt.concat(l);
      }
      const nextTurn = game.turn + 1 < game.players.length ? game.turn + 1 : 0;
      socket.emit("next-turn", newGSPos.concat(newGSLastAt), nextTurn);
    }
  }, [
    game.gameState[game.playerNumber]?.extraRolls,
    game.gameState[game.playerNumber]?.moveBag.length,
    canRoll,
  ]);

  const leaveGame = async () => {
    try {
      const res = await axios.put("/api/game/exitgame");

      if (res.status === 201) {
        socket.emit("leaving-startedgame");
        dispatch({ type: "FETCH_USER" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const rollDice = (d = false) => {
    console.log("setting false");
    setHasRolled(true);
    setCanRoll(false);
    let jsRoll = [
      Math.floor(Math.random() * 5) + 1,
      Math.floor(Math.random() * 5) + 1,
    ];
    if (d) {
      jsRoll = [5, 3];
    }
    setRoll([...jsRoll]);
    dispatch(
      takeTurnRedux({
        gs: takeTurn(game.gameState, game.turn, jsRoll),
        turn: game.turn,
      })
    );
  };

  const [piecePosition, setPiecePosition] = useState({ x: 0, y: 0 });
  const boardRef = useRef();

  return (
    <div>
      <button onClick={leaveGame}>Leave</button>
      <button onClick={() => {}}>leaveGame</button>
      <input type='number'></input>
      <input type='number' step={0.0001}></input>
      <p>
        Game: {JSON.stringify(game.gameState[game.playerNumber]?.pieceOptions)}
      </p>

      <div>
        <p>{JSON.stringify(roll)}</p>
        <button
          onClick={() => rollDice(false)}
          disabled={!myTurn || !canRoll}
          className='p-2 border'
        >
          Take Turn
        </button>
        <button
          onClick={() => rollDice(true)}
          disabled={!myTurn || !canRoll}
          className='p-2 border'
        >
          double
        </button>
        <button
          onClick={() => socket.emit("end-game", "player-won", user.username)}
          className='p-2 border'
        >
          end
        </button>
        {game.gameState[game.playerNumber]?.pieceOptions.map((po, i) => {
          if (po.length > 0) {
            return (
              <div>
                Piece at {i}:{" "}
                {po.map((p) => (
                  <button
                    onClick={() =>
                      dispatch(
                        makeMoveRedux(makeMove(p, i, game.gameState, game.turn))
                      )
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            );
          }
        })}
      </div>
      <div style={{ position: "relative" }}>
        <img src={board} width={800} ref={boardRef} style={{}} />

        {game.gameState &&
          game.gameState?.map((p, i) => (
            <Pieces
              color={p.color}
              pieces={p.pieces}
              doubles={doubles}
              iteration={i}
              boardWidth={boardRef.current.getBoundingClientRect().width}
            />
          ))}
      </div>
    </div>
  );
}
