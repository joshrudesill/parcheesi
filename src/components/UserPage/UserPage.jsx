import React from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";

function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const user = useSelector((store) => store.user.currentUser);
  return (
    <div className='flex  justify-center mt-24'>
      <div className='flex flex-col w-[30rem] p-4 rounded-md gap-2  bg-gray-900 shadow-lg shadow-white text-neutral-200'>
        <h2 className='text-2xl font-medium'>
          Here are your stats{" "}
          <span className='font-light tracking-wider'>{user.username}</span>
        </h2>
        <div className='border-t' />
        <h2 className='text-xl font-medium'>
          You have won <span className='font-light tracking-wider'>41</span>{" "}
          games
        </h2>

        <h2 className='text-xl font-medium'>
          You have lost <span className='font-light tracking-wider'>32</span>{" "}
          games
        </h2>
        <h2 className='text-xl font-medium'>
          That's a <span className='font-light tracking-wider'>56%</span>{" "}
          winrate
        </h2>
        <div className='border-t' />
        <h2 className='text-xl font-medium'>
          Your account ID is{" "}
          <span className='font-light tracking-wider'>{user.id}</span>
        </h2>
        <div className='border-t' />
        <div className='flex gap-2'>
          <LogOutButton />
          <button className='px-4 py-2 bg-rose-600 rounded-md border border-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'>
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
