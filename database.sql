-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "current_game" varchar(6)
);
create table "game_state" (
 "id" SERIAL PRIMARY KEY,
	"piece_positions" varchar(100) not null,
	"turn" integer default 1 not null,
	"ts" timestamp,
	"game_code" varchar(6) unique
);