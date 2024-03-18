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
  const game = useSelector((s) => s.game);
  const user = useSelector((s) => s.user.currentUser);

  const dispatch = useDispatch();
  const history = useHistory();
  const [myTurn, setMyTurn] = useState(false);
  const [canRoll, setCanRoll] = useState(false);
  const [moveBag, setMoveBag] = useState([]);
  const [turnsLeft, setTurnsLeft] = useState(0);
  const [pieceOptions, setPieceOptions] = useState([[], [], [], []]);

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
    console.log();
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

  const rollDice = () => {
    setCanRoll(false);
    dispatch(
      takeTurnRedux({
        gs: takeTurn(game.gameState, game.turn),
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
        <button onClick={rollDice} disabled={!myTurn || !canRoll}>
          Take Turn
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
        <img
          src={board}
          width={800}
          ref={boardRef}
          style={{ transform: "rotate(90deg)" }}
        />

        {game.gameState &&
          game.gameState?.map((p) => (
            <Pieces
              color={p.color}
              pieces={p.pieces}
              boardWidth={boardRef.current.getBoundingClientRect().width}
            />
          ))}
      </div>
    </div>
  );
}
