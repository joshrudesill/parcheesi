import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Lobby() {
  const game = useSelector((s) => s.user.currentUser.current_game);
  useEffect(() => {
    const g = async () => {
      try {
        const currentGame = await axios.get("/api/game/cgs", {
          params: { game: game },
        });
        if (currentGame.game_code) {
          // join socket room
        }
      } catch (e) {
        console.error(e);
      }
    };
    g();
  }, [game]);
  return (
    <div>
      <h2>{game}</h2>
    </div>
  );
}
