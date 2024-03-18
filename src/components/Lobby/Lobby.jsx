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
import { Meteors } from "../Meteors/Meteors";

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
      <div className='w-full flex justify-center pt-24'>
        <div className=''>
          <div className='w-[600px] relative h-[300px]'>
            <div className='absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl' />
            <div className='relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-between items-start gap-2'>
              <h2 className='font-light text-xl text-neutral-300'>
                code - {user.current_game}
              </h2>
              <div>
                <button
                  className='px-4 py-2 rounded-md border border-black text-lime-600 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 me-2 hover:bg-lime-500 hover:text-black'
                  onClick={startGame}
                >
                  start game
                </button>
                <button
                  className='px-4 py-2 rounded-md border border-black text-rose-600 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 me-2 hover:bg-rose-600 hover:text-black'
                  onClick={leaveGame}
                >
                  leave lobby
                </button>
              </div>
              <div className='grid grid-cols-2 grid-rows-2 w-full gap-2'>
                {Array(4)
                  .fill(0)
                  .map((p, i) => {
                    if (game.players[i]) {
                      return (
                        <div className='border border-neutral-400 rounded-md p-2 text-neutral-400'>
                          {game.players[i]}
                        </div>
                      );
                    }
                    return (
                      <div className='border border-neutral-400 rounded-md p-2 text-neutral-400'>
                        waiting..
                      </div>
                    );
                  })}
              </div>

              <Meteors number={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
