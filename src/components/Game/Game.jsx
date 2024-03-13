import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import board from "/src/assets/parchis_board.svg";
import red from "/src/assets/red.svg";
export default function Game() {
  const game = useSelector((s) => s.game);
  const user = useSelector((s) => s.user.currentUser);
  const dispatch = useDispatch();
  const history = useHistory();

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
    };
    getInitialGameState();
  }, []);
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
  const lb = [1, 2, 3, 4, 5, 6, 7, 8];
  const lbb = [9, 10, 11, 12, 13, 14, 15, 16];
  const lt = [60, 61, 62, 63, 64, 65, 66, 67];
  const ltt = [52, 53, 54, 55, 56, 57, 58, 59];
  const rtt = [43, 44, 45, 46, 47, 48, 49, 50];
  const rt = [35, 36, 37, 38, 39, 40, 41, 42];
  const rb = [26, 27, 28, 29, 30, 31, 32, 33];
  const rbb = [18, 19, 20, 21, 22, 23, 24, 25];
  const horizontals = [
    1, 2, 3, 4, 5, 6, 7, 8, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39,
    40, 41, 42, 60, 61, 62, 63, 64, 65, 66, 67,
  ];
  const verticals = [
    9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 43, 44, 45,
    46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59,
  ];
  const position = [lb, lbb, rbb, rb, rt, rtt, ltt, lt];

  const boardRef = useRef();
  const handleBoardClick = (square, step, step2) => {
    console.log(square);
    let x = 0;
    let y = 0;
    //let step = 0.045;
    //let step2 = 0.0453;
    switch (position.findIndex((i) => i.includes(square))) {
      case 0:
        x = 1 - position[0].findIndex((i) => i === square) * step2;
        y = 0.4;
        break;
      case 1:
        x = 0.64;
        y = (8 - position[1].findIndex((i) => i === square)) * step;
        break;
      //
      case 2:
        x = 0.4;
        y = (position[2].findIndex((i) => i === square) + 1) * step;
        break;
      //
      case 3:
        x = (8 - position[3].findIndex((i) => i === square)) * step2;
        y = 0.4;
        break;
      case 4:
        x = (position[4].findIndex((i) => i === square) + 1) * step2;
        y = 0.64;
        break;
      case 5:
        x = 0.4;
        y = 1 - (7 - position[5].findIndex((i) => i === square)) * step;
        break;
      case 6:
        x = 0.64;
        y = 1 - position[6].findIndex((i) => i === square) * step;
        break;
      case 7:
        x = 1 - (7 - position[7].findIndex((i) => i === square)) * step2;
        y = 0.64;
        break;
      case -1:
        break;
      default:
        break;
    }
    const boardRect = boardRef.current.getBoundingClientRect();
    const newPiecePosition = {
      x: boardRect.width - boardRect.width * x,
      y: boardRect.height - boardRect.height * y,
    };
    setPiecePosition(newPiecePosition);
  };
  const iterate = () => {
    let start = 1;
    const c = setInterval(() => {
      handleBoardClick(start);
      start++;
    }, 250);
    if (start > 68) clearInterval(c);
  };
  const [t, st] = useState(1);
  const [s, ss] = useState(0.03);
  useEffect(() => {
    if (t === "" || s === "") {
      return;
    }
    handleBoardClick(Number(t), Number(s), Number(s));
  }, [t, s]);
  return (
    <div>
      <button onClick={leaveGame}>Leave</button>
      <button onClick={() => {}}>leaveGame</button>
      <input
        value={t}
        onChange={(e) => st(e.target.value)}
        type='number'
      ></input>
      <input
        value={s}
        onChange={(e) => ss(e.target.value)}
        type='number'
        step={0.0001}
      ></input>
      <p>Game: {JSON.stringify(game)}</p>
      <p>User: {JSON.stringify(user)}</p>
      <div style={{ position: "relative" }}>
        <img
          src={board}
          width={800}
          ref={boardRef}
          style={{ transform: "rotate(90deg)" }}
        />
        <img
          src={red}
          width={30}
          style={{
            position: "absolute",
            left: piecePosition.x,
            top: piecePosition.y,
          }}
        />
      </div>
    </div>
  );
}
