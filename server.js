// Express import and settings
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { getYearForResults } from "./api/lib/getYearForResults.js";
import { getLeaguePBPRoster } from "./api/pbproster.js";
import { getDBPByTeam, getDBPFull } from "./api/defensebyposition.js";
import { getGameLogByPlayer } from "./api/gamelogs.js";

const app = express();
const port = 1738;
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "nbatool_client/build")));

app.get("/api", (req, res) => {
    res.send("NBAtool Backend created by ZadaZiri");
});

// Rosters

app.get("/api/pbp_roster", (req, res) => {
    const year = getYearFromRequest(req);
    getLeaguePBPRoster(year)
        .then((roster) => res.json(roster))
        .catch((e) => {
            console.log(e);
            res.json({
                error: `There was an error fetching play by play roster`,
            });
        });
});

// Defense
app.get("/api/full_dbp_stats", (req, res) => {
    const year = getYearFromRequest(req);
    getDBPFull(year)
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

// This isn't being used right now
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
        `NBAtool Backend listening at http://localhost:${process.env.PORT || port}`,
    );
});

const getYearFromRequest = (req) => {
    const year = req.query.year;
    if (req.query.year) {
        return year;
    }

    return getYearForResults();
};
