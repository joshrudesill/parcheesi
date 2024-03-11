import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { socket } from "../../../socket";
import {
  addPlayer,
  setAdmin,
  setGameStarted,
} from "../../redux/reducers/game.reducer";

export default function Lobby() {
  const user = useSelector((s) => s.user.currentUser);
  const game = useSelector((s) => s.game);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.current_game === null) {
      history.push("/play");
    }
  }, [user.current_game]);
  useEffect(() => {
    if (game.gameStarted && user.current_game) {
      history.push("/game");
    }
  }, [game.gameStarted, user.current_game]);
  useEffect(() => {
    if (
      game.players.length > 0 &&
      user.username &&
      game.players[0] === user.username
    ) {
      dispatch(setAdmin(true));
    } else {
      dispatch(setAdmin(false));
    }
  }, [game.players, user.username]);
  useEffect(() => {
    const g = async () => {
      try {
        const currentGame = await axios.get("/api/game/cgs", {
          params: { game: user.current_game },
        });

        if (currentGame.data.game_code !== null) {
          dispatch(addPlayer([user.username]));
          // join socket room
          socket.emit(
            "join-game-room",
            currentGame.data.game_code,
            user.username
          );
        }
      } catch (e) {
        console.error(e);
      }
    };
    g();
  }, [user.current_game]);
  const leaveGame = async () => {
    try {
      const res = await axios.put("/api/game/exitgame");

      if (res.status === 201) {
        socket.emit("leaving-gameroom");
        dispatch({ type: "FETCH_USER" });
      }
    } catch (e) {
      console.error(e);
    }
  };
  const startGame = async () => {
    try {
      const res = await axios.put("/api/game/startgame", {
        gameCode: user.game_code,
      });

      if (res.status === 201) {
        socket.emit("notify-game-start");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div>
      <h2>{user.current_game}</h2>
      <button onClick={leaveGame}>Leave</button>
      <button onClick={startGame}>start</button>
      <div>
        {game.players.map((p) => (
          <p>{p}</p>
        ))}
      </div>
    </div>
  );
}
