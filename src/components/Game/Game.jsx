import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import board from "/src/assets/parchis_board.svg";

import { parseGameIntoMemory, takeTurn } from "../../parcheesi";
import {
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
    console.log("change");
  }, [game.gameState[game.playerNumber]]);
  useEffect(() => {
    const getInitialGameState = async () => {
      const currentGame = await axios.get("/api/game/cgs", {
        params: { game: user.current_game },
      });
      dispatch(setTurn(currentGame.data.turn - 1));
      console.log("cg: ", currentGame);
      parseGameIntoMemory(
        currentGame.data["piece_positions"],
        2,
        currentGame.data["turn"],
        (gs) => dispatch(setGame(gs))
      );
    };
    getInitialGameState();
  }, []);
  useEffect(() => {
    if (game.turn === game.playerNumber) {
      setMyTurn(true);
    } else {
      setMyTurn(false);
    }
  }, [game.turn, game.playerNumber]);
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
  const [piecePosition, setPiecePosition] = useState({ x: 0, y: 0 });
  const boardRef = useRef();

  return (
    <div>
      <button onClick={leaveGame}>Leave</button>
      <button onClick={() => {}}>leaveGame</button>
      <input type='number'></input>
      <input type='number' step={0.0001}></input>
      <p>Game: {JSON.stringify(game)}</p>
      <div>
        <button
          onClick={() =>
            dispatch(
              takeTurnRedux({
                gs: takeTurn(game.gameState, game.turn),
                turn: game.turn,
              })
            )
          }
          disabled={!myTurn}
        >
          Take Turn
        </button>
      </div>
      <div style={{ position: "relative" }}>
        <img
          src={board}
          width={800}
          ref={boardRef}
          style={{ transform: "rotate(90deg)" }}
        />

        {game.gameState &&
          game.gameState.map((p) => (
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
