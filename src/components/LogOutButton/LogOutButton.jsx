import React from "react";
import { useDispatch } from "react-redux";

function LogOutButton(props) {
  const dispatch = useDispatch();
  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      className='px-4 py-2 rounded-md border border-black  text-neutarl-700 text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200'
      onClick={() => dispatch({ type: "LOGOUT" })}
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
