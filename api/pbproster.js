const { PBP_PLAYER_DATA } = require("../consts.js");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

async function getPBPRosterByTeam(team) {
  const url = `https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fteams%2F${team}%2F2023.html&div=div_pbp`;
  let players = [];

  // Fetch table from bball reference
  console.log(`Getting PBP Roster from: ${url}`);
  let res = await fetch(url);
  let data = await res.text();

  let start = data.indexOf("<table");
  let end = data.indexOf("</table>") + 8; // Addint the 8 characters in '</table> to the index to make sure that tag is picked up
  let table = data.substring(start, end);
  const $ = cheerio.load(table);
  $("tbody tr").each((i, el) => players.push(parseRow(el)));
  return players;
}

const parseRow = (el) => {
  let player = {};
  el.children.forEach((el) => {
    let attr = el.attribs["data-stat"];
    if (PBP_PLAYER_DATA.includes(attr)) {
      if (attr == "player" || attr == "g") {
        player[attr] = {
          name: el.children[0].children[0].data,
          link: el.children[0].attribs.href,
        };
      } else if (["pct_1", "pct_2", "pct_3", "pct_4", "pct_5"].includes(attr)) {
        player[attr] = el.children.length > 0 ? el.children[0].data : "0%";
      } else {
        player[attr] = el.children[0].data;
      }
    }
  });
  return player;
};

module.exports = { getPBPRosterByTeam };
