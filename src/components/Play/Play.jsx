import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGameCode } from "../../redux/reducers/game.reducer";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Play() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.currentUser);
  const history = useHistory();
  useEffect(() => {
    if (user && user.current_game) {
      history.push("/lobby");
    }
  }, [user.current_game]);
  const gameInit = async () => {
    const { data } = await axios.get("/api/game/init-setup");
    dispatch(setGameCode(data));
  };
  return (
    <div>
      <button onClick={gameInit}>Create</button>
      <input />
    </div>
  );
}
