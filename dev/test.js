import fetch from "node-fetch";
import cheerio from "cheerio";

let team = "CHI";
//let url = `https://www.basketball-reference.com/teams/${team}/2022.html`;
//let url = `https://widgets.sports-reference.com/wg.fcgi?css=1&site=bbr&url=%2Fteams%2FIND%2F2022.html&div=div_pbp`;

let url =
  "https://www.basketball-reference.com/leagues/NBA_2023_play-by-play.html";
const POSITIONS = { 1: "PG", 2: "SG", 3: "SF", 4: "PF", 5: "C" };

let players = [];

const PLAYER_DATA = [
  "player",
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

let player = (
  player,
  g,
  mp,
  pct_1,
  pct_2,
  pct_3,
  pct_4,
  pct_5,
  plus_minus_on,
  plus_minus_net
) => {
  return {
    player,
    g,
    mp,
    pct_1,
    pct_2,
    pct_3,
    pct_4,
    pct_5,
    plus_minus_on,
    plus_minus_net,
  };
};

//console.log(`requesting url ${url}`);
fetch(url)
  .then((res) => res.text())
  .then((data) => {
    let start = data.indexOf("<table");
    let end = data.indexOf("</table>") + 8; // Addint the 8 characters in '</table> to the index to make sure that tag is picked up
    let table = data.substring(start, end);
    console.log(table);
    /*
    const $ = cheerio.load(table);
    $("tbody tr").each((i, el) => players.push(parseRow(el)));
    console.log(players);
    */
  })
  .catch((e) => console.log(e));

const parseRow = (el) => {
  let player = {};
  el.children.forEach((el) => {
    let attr = el.attribs["data-stat"];
    if (PLAYER_DATA.includes(attr)) {
      console.log(attr);
      if (attr == "player" || attr == "g") {
        console.log(el.children[0]);
        player[attr] = el.children[0].children[0].data;
        player["player_link"] = el.children[0].attribs.href;
      } else if (["pct_1", "pct_2", "pct_3", "pct_4", "pct_5"].includes(attr)) {
        player[attr] = el.children.length > 0 ? el.children[0].data : "0%";
      } else {
        player[attr] = el.children[0].data;
      }
    }
  });
  return player;
};
