// Express import and settings
import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
const port = 1738;

app.get("/", (req, res) => {
  res.send("NBAtool Backend created by ZadaZiri");
});

// Rosters
import { getPBPRosterByTeam } from "./api/pbproster.js";

app.get("/pbp_roster/:team", (req, res) => {
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
import { getDBPByTeam } from "./api/defensebyposition.js";

app.get("/dbp_stats/:team", (req, res) => {
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

app.listen(port, () => {
  console.log(`NBAtool Backend listening at http://localhost:${port}`);
});
