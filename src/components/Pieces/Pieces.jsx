import { useSelector } from "react-redux";
import red from "/src/assets/red.svg";
import blue from "/src/assets/blue.svg";
import yellow from "/src/assets/yellow.svg";
import { useEffect, useMemo, useState } from "react";
export default function Pieces({
  color,
  pieces,
  boardWidth,
  doubles,
  iteration,
}) {
  const gameState = useSelector((s) => s.game.gameState);
  const [s, sets] = useState(0.047);
  const colorSource = useMemo(() => {
    if (color === "yellow") {
      return yellow;
    }
    if (color === "red") {
      return red;
    }
  }, [color]);
  const getPiecePosition = (square, step) => {
    if (square === 0) {
      return { x: 0, y: 0 };
    }
    let x = 0;
    let y = 0;
    //let step = 0.47;
    let step2 = 0.0453;
    switch (position.findIndex((i) => i.includes(square))) {
      case 0:
        x = 1 - position[0].findIndex((i) => i === square) * step;
        x -= 0.003;
        y = 0.3975;
        break;
      case 1:
        x = 0.64;
        y = (8 - position[1].findIndex((i) => i === square)) * step;
        y -= 0.005;
        break;
      //
      case 2:
        x = 0.3975;
        y = (position[2].findIndex((i) => i === square) + 1) * step;
        y -= 0.005;
        break;
      //
      case 3:
        x = (8 - position[3].findIndex((i) => i === square)) * step;
        y = 0.3975;
        x -= 0.006;
        break;
      case 4:
        x = (position[4].findIndex((i) => i === square) + 1) * step;
        y = 0.64;
        x -= 0.006;
        break;
      case 5:
        x = 0.3975;
        y = 1 - (7 - position[5].findIndex((i) => i === square)) * step;
        y -= 0.005;
        break;
      case 6:
        x = 0.64;
        y = 1 - position[6].findIndex((i) => i === square) * step;
        y -= 0.005;
        break;
      case 7:
        x = 1 - (7 - position[7].findIndex((i) => i === square)) * step;
        x -= 0.003;
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
  const [homePieces, setHomePieces] = useState(0);
  const [piecePos, setPieces] = useState([]);

  const position = [lb, lbb, rbb, rb, rt, rtt, ltt, lt];
  const p = useMemo(() => {
    let out = [];
    for (const piece of pieces) {
      const newPos = getPiecePosition(piece, s);

      out.push({ ...newPos, at: piece });
    }
    return out;
  }, [...pieces, s]);

  const homeCoords = {
    green: { left: 65, top: 65 },
    yellow: { left: 33, top: 460 },
    blue: { left: 610, top: 610 },
    red: { left: 460, top: 33 },
  };
  const homePieceCoords = [
    { left: 100, top: 0 },
    { right: 0, top: -30 },
    { left: 0, top: 30 },
    { left: 100, top: 0 },
  ];
  const [t, sett] = useState(3);
  const [c, setc] = useState({ x: 0, y: 0 });
  useEffect(() => {
    setc({ ...getPiecePosition(t, s) });
  }, [t]);
  return (
    <>
      {p.map((p) => {
        if (
          Object.values(doubles)
            .map((e) => e.at)
            .includes(p.at)
        ) {
          if (horizontals.includes(p.at)) {
            return (
              <>
                <img
                  src={colorSource}
                  width={25}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y + 15,
                  }}
                />
                <img
                  src={colorSource}
                  width={25}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y - 15,
                  }}
                />
              </>
            );
          } else {
            return (
              <>
                <img
                  src={colorSource}
                  width={25}
                  style={{
                    position: "absolute",
                    left: p.x + 15,
                    top: p.y,
                  }}
                />
                <img
                  src={colorSource}
                  width={25}
                  style={{
                    position: "absolute",
                    left: p.x - 15,
                    top: p.y,
                  }}
                />
              </>
            );
          }
        } else {
          return (
            <img
              src={colorSource}
              width={25}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                opacity: p.x === 0 && p.y === 0 ? "0" : "1",
              }}
            />
          );
        }
      })}
      {/* <img
        src={color === "yellow" ? red : blue}
        width={30}
        style={{
          position: "absolute",

          left: c.x,
          top: c.y,
        }}
      /> */}
      <div
        style={{
          position: "absolute",
          left: homeCoords[color].left,
          top: homeCoords[color].top,
        }}
      >
        {p.map((p, i) => {
          return (
            <>
              <img
                src={colorSource}
                style={{
                  position: "relative",
                  ...homePieceCoords[i],
                  opacity: p.x === 0 && p.y === 0 ? "1" : "0",
                }}
                width={30}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
