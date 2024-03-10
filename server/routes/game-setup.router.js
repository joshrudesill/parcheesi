const express = require("express");
const pool = require("../modules/pool");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const router = express.Router();
const { randomUUID } = require("node:crypto");

router.get("/init-setup", rejectUnauthenticated, async (req, res) => {
  const gameCode = randomUUID().slice(0, 6);

  try {
    const r1 = await pool.query(
      `INSERT INTO "game_state" 
          (
              "piece_positions", "ts", "game_code" 
              )
              VALUES 
              (
                  $1,$2,$3
                  );
                  
                  `,
      ["1,1,1,1+2,2,2,2+3,3,3,3+4,4,4,4", new Date(), gameCode]
    );

    const r2 = await pool.query(
      `UPDATE "user" SET current_game = $1 WHERE id = $2;`,
      [gameCode, req.user.id]
    );
  } catch (e) {
    console.error(e);
    res.sendStatus(404);
  }

  res.send(gameCode);
});
router.get("/cgs", rejectUnauthenticated, async (req, res) => {
  try {
    const game = await pool.query(
      'SELECT * FROM "game_state" WHERE game_code = $1 LIMIT 1;',
      [req.query.game]
    );
    res.send(game.rows[0]);
  } catch (e) {
    console.error(e);
    res.send(500);
  }
});

router.post("/join", rejectUnauthenticated, async (req, res) => {
  console.log(req.query);
  console.log(req.body);
  try {
    const game = await pool.query(
      'UPDATE "user" SET current_game = $1 WHERE id = $2',
      [req.body.gameCode, req.user.id]
    );
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.send(500);
  }
});
router.put("/exitgame", async (req, res) => {
  try {
    const game = await pool.query(
      'UPDATE "user" SET current_game = null WHERE id = $1',
      [req.user.id]
    );
    res.sendStatus(201);
  } catch (e) {
    console.error(e);
    res.send(500);
  }
});

module.exports = router;
