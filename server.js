// Express import and settings
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 1738;
app.use(cors());
app.use(express.static(path.join(__dirname, "nbatool_client/build")));

app.get("/api", (req, res) => {
  res.send("NBAtool Backend created by ZadaZiri");
});

// Rosters
const { getPBPRosterByTeam } = require("./api/pbproster.js");

app.get("/api/pbp_roster/:team", (req, res) => {
  getPBPRosterByTeam(req.params.team)
    .then((roster) => res.json(roster))
    .catch((e) => {
      console.log(e);
      res.json({
        error: `There was an error fetching play by play roster for team ${req.params.team}`,
      });
    });
});

// Defense
const { getDBPByTeam, getDBPFull } = require("./api/defensebyposition.js");

app.get("/api/full_dbp_stats", (req, res) => {
  getDBPFull()
    .then((stats) => {
      res.json(stats);
    })
    .catch((e) => {
      console.log(e);
      res.json({
        error: `There was an error fetching full dbp data`,
      });
    });
});

app.get("/api/dbp_stats/:team", (req, res) => {
  getDBPByTeam(req.params.team)
    .then((stats) => {
      res.json(stats);
    })
    .catch((e) => {
      console.log(e);
      res.json({
        error: `There was an error fetching dbp roster for team ${req.params.team}`,
      });
    });
});

// Game Log
const { getGameLogByPlayer } = require("./api/gamelogs.js");

app.get("/api/gamelog/:player", (req, res) => {
  getGameLogByPlayer(req.params.player)
    .then((gamelog) => {
      if (gamelog.hasOwnProperty("error")) throw new Error(gamelog.error);
      res.json(gamelog);
    })
    .catch((e) => {
      console.log(e);
      res.json({
        error: `There was an error fetching game log for player ${req.params.player}`,
      });
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/nbatool_client/build/index.html"));
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `NBAtool Backend listening at http://localhost:${process.env.PORT || port}`
  );
});
