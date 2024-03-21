import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameReset, setGameCode } from "../../redux/reducers/game.reducer";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Meteors } from "../Meteors/Meteors";

export default function Play() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.currentUser);
  const history = useHistory();
  const [gameCode, setGameCode] = useState("");
  useEffect(() => {
    dispatch(gameReset());
  }, []);
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
    <div className='w-full flex justify-center pt-24'>
      <div className=''>
        <div className='w-[600px] relative h-[300px]'>
          <div className='absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl' />
          <div className='relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-around items-start gap-2'>
            <h2 className='font-light text-xl text-neutral-300'>let's play</h2>
            <button
              className='text-gray-200 border border-gray-400 p-2 rounded-md hover:bg-white hover:text-black bg-gray-900 z-100'
              onClick={gameInit}
            >
              create game
            </button>
            <div className='border-t w-full border-gray-700'></div>

            <button
              className='text-gray-200 border border-gray-400 p-2 rounded-md hover:bg-white hover:text-black '
              onClick={joinGame}
            >
              join with code
            </button>
            <input
              className='bg-transparent border border-slate-500 rounded-md p-0.5'
              placeholder='code'
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              maxLength={6}
            />
            <Meteors number={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
