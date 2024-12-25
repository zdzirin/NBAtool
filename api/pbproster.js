const { PBP_PLAYER_DATA } = require("../consts.js");
const cheerio = require("cheerio");
const fetch = (await import("node-fetch")).default;

const { getYearForResults } = require("./lib/getYearForResults.js");

async function getLeaguePBPRoster(year) {
    const url = `https://www.basketball-reference.com/leagues/NBA_${year}_play-by-play.html`;
    let players = [];
    const res = await fetch(url);
    const data = await res.text();

    const start = data.indexOf("<table");
    const end = data.indexOf("</table>") + 8; // Addint the 8 characters in '</table> to the index to make sure that tag is picked up
    const table = data.substring(start, end);

    const $ = cheerio.load(table);
    $("tbody tr").each((i, el) => {
        players.push(parseRow(el));
    });

    players = players.filter((player) => player !== null);
    console.log(players);
    return players;
}

const parseRow = (el) => {
    let player = {};

    el.children.forEach((el, j) => {
        if (!el.attribs) {
            return;
        }

        let attr = el.attribs["data-stat"];
        addAttributeData(player, attr, el);
    });

    return player.team_id !== "2TM" ? player : null;
};

const addAttributeData = (player, attr, el) => {
    if (PLAYER_DATA.includes(attr)) {
        // Value is a link for these so we select data from inside
        if (LINK_ATTRIBUTES.includes(attr)) {
            const LINK_ATTR_MAP = {
                player: "player",
                name_display: "player",
                team_name_abbr: "team_id",
                team_id: "team_id",
            };

            // Players with multiple teams have a "total" row
            if (el.children[0].data === "2TM") {
                player[LINK_ATTR_MAP[attr]] = el.children[0].data;
                return;
            }

            player[LINK_ATTR_MAP[attr]] = el.children[0].children[0].data;

            if (attr == "player" || attr == "name_display") {
                player["player_link"] = el.children[0].attribs.href;
            }

            return;
        }

        // Sets 0's as they are simply empty on the page
        if (["pct_1", "pct_2", "pct_3", "pct_4", "pct_5"].includes(attr)) {
            player[attr] = el.children.length > 0 ? el.children[0].data : "0%";
            return;
        }

        if (attr === "plus_minus_on" || attr === "plus_minus_net") {
            player[attr] = el.children.length > 0 ? el.children[0].data : "--";
            return;
        }

        if (attr === "mp") {
            // Might be bolded, if so we need to get the data from inside the bold tag
            if (el.children[0].name === "strong") {
                player[attr] = el.children[0].children[0].data;
            } else {
                player[attr] = el.children[0].data;
            }

            return;
        }

        // If no special case simply set the attribute
        player[attr] = el.children[0].data;
    }
};

const LINK_ATTRIBUTES = ["player", "team_id", "team_name_abbr", "name_display"];

const PLAYER_DATA = [
    "player",
    "name_display",
    "pos",
    "team_id",
    "team_name_abbr",
    "g",
    "mp",
    "pct_1",
    "pct_2",
    "pct_3",
    "pct_4",
    "pct_5",
    "plus_minus_on",
    "plus_minus_net",
];

module.exports = { getLeaguePBPRoster };
