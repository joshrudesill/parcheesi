import React from "react";
import { Boxes } from "../Background-Boxes/BackgroundBoxes";
import { cn } from "../../utils/cs";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// This is one of our simplest components
// It doesn't have local state
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is

function InfoPage() {
  const history = useHistory();
  return (
    <div className='w-full text-center pt-24'>
      <div>
        <div className='relative w-[75%] left-[12.5%] overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg h-[500px]'>
          <div className='absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none' />

          <Boxes />
          <h1 className={cn("md:text-4xl text-2xl text-red-600 relative z-20")}>
            ParchEZ
          </h1>
          <p className='text-center mt-2 text-neutral-300 relative z-20'>
            Simple. Unintrusive. Fun.
          </p>
        </div>
        <div className='flex flex-row w-[75%] left-[12.5%] relative justify-end mt-2 gap-2'>
          <button
            className='px-4 py-2 rounded-md border border-black  text-neutral-900 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
            onClick={() => history.push("/login")}
          >
            log in
          </button>
          <button
            className='px-4 py-2 rounded-md border border-black  text-neutral-900 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
            onClick={() => history.push("/register")}
          >
            sign up
          </button>
          <button
            className='px-4 py-2 rounded-md border border-black  text-neutral-900 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
            onClick={() => history.push("/")}
          >
            rules
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;
