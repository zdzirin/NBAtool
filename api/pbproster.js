const { PBP_PLAYER_DATA } = require("../consts.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
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
    $("tbody tr.full_table").each((i, el) => players.push(parseRow(el)));

    return players;
}

const parseRow = (el) => {
    let player = {};
    el.children.forEach((el, j) => {
        let attr = el.attribs["data-stat"];
        addAttributeData(player, attr, el);
    });
    return player;
};

const addAttributeData = (player, attr, el) => {
    if (PLAYER_DATA.includes(attr)) {
        // Value is a link for these so we select data from inside
        if (attr == "player" || attr == "team_id") {
            // Players with multiple teams have a "total" row
            if (el.children[0].data === "TOT") {
                player[attr] = el.children[0].data;
                return;
            }

            player[attr] = el.children[0].children[0].data;

            if (attr == "player") {
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

        // If no special case simply set the attribute
        player[attr] = el.children[0].data;
    }
};

const PLAYER_DATA = [
    "player",
    "pos",
    "team_id",
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
