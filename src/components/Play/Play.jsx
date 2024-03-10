import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGameCode } from "../../redux/reducers/game.reducer";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Play() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.currentUser);
  const history = useHistory();
  const [gameCode, setGameCode] = useState("");
  useEffect(() => {
    if (user && user.current_game !== null) {
      history.push("/lobby");
    }
  }, [user.current_game]);
  const gameInit = async () => {
    await axios.get("/api/game/init-setup");
    dispatch({ type: "FETCH_USER" });
  };
  const joinGame = async () => {
    await axios.post("/api/game/join", { gameCode });
    dispatch({ type: "FETCH_USER" });
  };
  return (
    <div>
      <button onClick={gameInit}>Create</button>

      <input
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={joinGame}>Join</button>
    </div>
  );
}
