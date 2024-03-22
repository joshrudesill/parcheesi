"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval;

export const CardStack = ({ items, offset, scaleFactor }) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState(items);

  const next = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      newArray.push(newArray.shift());
      return newArray;
    });
  };
  const prev = () => {
    setCards((prevCards) => {
      const newArray = [...prevCards];
      const next = newArray[1];
      newArray.unshift(newArray.pop());

      return newArray;
    });
  };
  return (
    <div className='relative  h-60 w-60 md:h-60 md:w-[50rem]'>
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className='absolute dark:bg-black bg-white h-60 w-60 md:h-60 md:w-[50rem] rounded-3xl p-4 shadow-xl border border-neutral-200 dark:border-white/[0.1]  shadow-black/[0.1] dark:shadow-white/[0.05] flex flex-col justify-between'
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
              zIndex: cards.length - index, //  decrease z-index for the cards that are behind
            }}
          >
            <div className='font-normal text-neutral-700 dark:text-neutral-200 text-xl'>
              {card.content}
            </div>
            <div>
              <p className='text-lg font-bold dark:text-white'>{card.name}</p>
            </div>
            <div className='flex flex-row justify-between'>
              <button onClick={prev}>Previous</button>
              <button onClick={next}>Next</button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
