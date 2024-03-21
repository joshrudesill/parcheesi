import { useDispatch, useSelector } from "react-redux";
import { makeMoveRedux } from "../../redux/reducers/game.reducer";
import { makeMove } from "../../parcheesi";

export default function Move({ pieceAt, moves, index }) {
  const dispatch = useDispatch();
  const { gs, turn } = useSelector((s) => {
    return { gs: s.game.gameState, turn: s.game.turn };
  });

  return (
    <div className=' border border-1 border-zinc-400 flex flex-col rounded-md p-2 shadow-sm bg-zinc-500 shadow-zinc-600 gap-2 divide-y divide-zinc-400'>
      <div className='flex gap-2'>
        <button className='rounded-lg bg-slate-50 w-12 h-12 text-sm font-bold'>
          {pieceAt === 0 ? "Home" : pieceAt}
        </button>
        {moves.map((move) => (
          <div
            className='rounded-lg bg-slate-50 w-12 h-12 border-4 border-black text-center inline-block p-2 text-xl font-bold hover:text-3xl cursor-pointer'
            onClick={() =>
              dispatch(makeMoveRedux(makeMove(move, index, gs, turn)))
            }
          >
            {move === -1 ? 5 : move}
          </div>
        ))}
        {moves.length === 1 && (
          <div className='rounded-lg bg-slate-50 w-12 h-12 border-4 border-black text-center inline-block p-2 text-xl font-bold'></div>
        )}
        <button className='rounded-lg bg-orange-500  hover:bg-orange-600 hover:text-white h-12 text-sm font-bold grow'>
          Pick
        </button>
      </div>
    </div>
  );
}
