import { CardStack } from "../card-rules/CardRules";

export default function Rules() {
  return (
    <div className='flex  justify-center mt-24'>
      <CardStack items={CARDS} />
    </div>
  );
}
const CARDS = [
  {
    id: 0,
    name: "Basics",
    content: (
      <p>
        The basic rules of Parcheesi are realtively simple. The goal is to move
        all your pawns around the board and into the center area, known as the
        "home" area, before your opponents.
      </p>
    ),
  },
  {
    id: 1,
    name: "Movement",
    content: (
      <p>
        Players move their pawns according to the number rolled on the die.
        Pawns must move in a clockwise direction around the board. When a player
        gets to their home square they are allowed to move a piece 10 squares.
      </p>
    ),
  },
  {
    id: 2,
    name: "Capturing",
    content: (
      <p>
        If a player lands on a space occupied by an opponent's pawn, the
        opponent's pawn is sent back to its starting area. However, this rule
        does not apply to pawns in the "safe zones" or when a player's own pawns
        are on the same space. A player is then allowed to move one piece 20
        squares.
      </p>
    ),
  },
  {
    id: 3,
    name: "Special Spaces",
    content: (
      <p>
        The board contains safe zones and shortcuts marked with special symbols.
        Pawns in these zones are safe from capture and may take shortcuts to
        advance faster.
      </p>
    ),
  },
  {
    id: 4,
    name: "Rolling",
    content: (
      <p>
        Doubles grant an additional turn. If a player rolls three consecutive
        doubles, they must send one of their pawns back to the starting area.
        Also, a 5 must be rolled to take a piece out of the starting area.
      </p>
    ),
  },
  {
    id: 4,
    name: "Blocking",
    content: (
      <p>
        If a player has 2 of their pieces of a single square that square is a
        block and no player can pass until they unblock by either moving away or
        rolling a double and being forced to move away. Blocks can be made by 2
        opposing players on safe squares.
      </p>
    ),
  },
];
