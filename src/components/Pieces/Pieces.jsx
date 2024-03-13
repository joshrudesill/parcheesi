import { useSelector } from "react-redux";
import red from "/src/assets/red.svg";
import blue from "/src/assets/blue.svg";
import { useState } from "react";
export default function Pieces({ color, pieces, boardWidth }) {
  const gameState = useSelector((s) => s.game.gameState);
  const lb = [1, 2, 3, 4, 5, 6, 7, 8];
  const lbb = [9, 10, 11, 12, 13, 14, 15, 16];
  const lt = [60, 61, 62, 63, 64, 65, 66, 67];
  const ltt = [52, 53, 54, 55, 56, 57, 58, 59];
  const rtt = [43, 44, 45, 46, 47, 48, 49, 50];
  const rt = [35, 36, 37, 38, 39, 40, 41, 42];
  const rb = [26, 27, 28, 29, 30, 31, 32, 33];
  const rbb = [18, 19, 20, 21, 22, 23, 24, 25];
  const horizontals = [
    1, 2, 3, 4, 5, 6, 7, 8, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38, 39,
    40, 41, 42, 60, 61, 62, 63, 64, 65, 66, 67,
  ];
  const verticals = [
    9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 43, 44, 45,
    46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 58, 59,
  ];
  const position = [lb, lbb, rbb, rb, rt, rtt, ltt, lt];

  const getPiecePosition = (square) => {
    let x = 0;
    let y = 0;
    let step = 0.045;
    let step2 = 0.0453;
    switch (position.findIndex((i) => i.includes(square))) {
      case 0:
        x = 1 - position[0].findIndex((i) => i === square) * step2;
        y = 0.4;
        break;
      case 1:
        x = 0.64;
        y = (8 - position[1].findIndex((i) => i === square)) * step;
        break;
      //
      case 2:
        x = 0.4;
        y = (position[2].findIndex((i) => i === square) + 1) * step;
        break;
      //
      case 3:
        x = (8 - position[3].findIndex((i) => i === square)) * step2;
        y = 0.4;
        break;
      case 4:
        x = (position[4].findIndex((i) => i === square) + 1) * step2;
        y = 0.64;
        break;
      case 5:
        x = 0.4;
        y = 1 - (7 - position[5].findIndex((i) => i === square)) * step;
        break;
      case 6:
        x = 0.64;
        y = 1 - position[6].findIndex((i) => i === square) * step;
        break;
      case 7:
        x = 1 - (7 - position[7].findIndex((i) => i === square)) * step2;
        y = 0.64;
        break;
      case -1:
        break;
      default:
        break;
    }
    return {
      x: boardWidth - boardWidth * x,
      y: boardWidth - boardWidth * y,
    };
  };

  return (
    <>
      {pieces.map((p) => {
        const { x, y } = getPiecePosition(p);
        return (
          <img
            src={color === "yellow" ? red : blue}
            width={30}
            style={{
              position: "absolute",
              left: x,
              top: y,
            }}
          />
        );
      })}
    </>
  );
}
