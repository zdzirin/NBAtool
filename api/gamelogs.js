import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { getYearForResults } from "./lib/getYearForResults.js";

const EXCLUDED_STATS = ["game_season", "age"];

async function getGameLogData(player) {
    const url = `https://www.basketball-reference.com/players/m/${player}/gamelog/${getYearForResults()}`;

    console.log(`Getting gamelog data from: ${url}`);
    // Make API call to get HTML
    const res = await fetch(url);
    console.log(`Response status: ${res.status}`);
    const data = await res.text();

    // Gets just the table to load into cheerio rather than the whole document
    const start = data.indexOf(
        '<table class="row_summable sortable stats_table" id="pgl_basic"',
    );
    const end = data.indexOf("</table>", start) + 8; // Adding the 8 characters in '</table> to the index to make sure that tag is picked up
    const table = data.substring(start, end);

    // Load table into cheerio and parse data
    const $ = cheerio.load(table);

    const gameLog = [];
    const statOrder = [];
    $("tbody tr").each((j, e) => {
        const game = {};
        e.children.forEach((e, i) => {
            // Ignore if no data or if it's the rank column
            if (e.name === "th" || !e.children || e.children.length < 1) return;

            // Get stat name and data and add to game object
            const stat = e.attribs["data-stat"];

            if (EXCLUDED_STATS.includes(stat)) return;

            let child = e.children[0];
            if (!child.hasOwnProperty("data")) {
                child = child.children[0];
            }
            game[stat] = child.data;

            // Add stat to order array on first run through
            if (j === 0) {
                statOrder.push(stat);
            }
        });
        gameLog.push(game);
    });

    return { statOrder, gameLog };
}

async function getGameLogByPlayer(player) {
    try {
        const gamelog = await getGameLogData(player);
        return gamelog;
    } catch (e) {
        console.log(`Error fetching gamelog for ${player}`);
        console.log(e);
        return { error: e };
    }
}

export { getGameLogByPlayer };
