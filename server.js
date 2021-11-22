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
const { getDBPByTeam } = require("./api/defensebyposition.js");

app.get("/api/dbp_stats/:team", (req, res) => {
  getDBPByTeam(req.params.team)
    .then((stats) => {
      res.json(stats);
    })
    .catch((e) => {
      console.log(e);
      res.json({
        error: `There was an error fetching play by play roster for team ${req.params.team}`,
      });
    });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/nbatool_client/build/index.html"));
});

app.listen(port, () => {
  console.log(`NBAtool Backend listening at http://localhost:${port}`);
});
