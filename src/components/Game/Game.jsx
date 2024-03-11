import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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
  return (
    <div>
      <button onClick={leaveGame}>Leave</button>
      <p>Game: {JSON.stringify(game)}</p>
      <p>User: {JSON.stringify(user)}</p>
    </div>
  );
}
