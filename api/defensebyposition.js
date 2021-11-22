import fetch from "node-fetch";
import cheerio from "cheerio";
import {
  DBP_INDEX_TO_STAT,
  ABBREVIATION_TO_TEAM,
  TEAM_TO_ABBREVIATION,
} from "../consts.js";

let url =
  "https://www.fantasypros.com/daily-fantasy/nba/fanduel-defense-vs-position.php";

async function getTeamData(team) {
  let teamData = [];
  let res = await fetch(url);
  let data = await res.text();
  let start = data.indexOf("<table");
  let end = data.indexOf("</table>") + 8; // Adding the 8 characters in '</table> to the index to make sure that tag is picked up
  let table = data.substring(start, end);
  const $ = cheerio.load(table);
  $("table tbody tr").each((i, e) => {
    let classes = e.attribs.class.split(" ");
    let position = classes[1];
    let range = classes[0].split("-")[1];
    let teamMatched = true;
    let row = { position, range };

    e.children.forEach((e, i) => {
      if (!team) return;
      if (i === 0) {
        teamMatched = TEAM_TO_ABBREVIATION[e.children[1].data] == team;
      } else if (i < 8) {
        let elClass = e.attribs.class.split(" ");
        let difficulty =
          elClass.length > 1 ? (elClass[1] === "hard" ? 1 : -1) : 0;
        let amt = e.children[0].children[0].data;
        row[DBP_INDEX_TO_STAT[i]] = { difficulty, amt };
      }
    });
    if (teamMatched) teamData.push(row);
  });
  return teamData;
}

export async function getDBPByTeam(team) {
  let data = await getTeamData(team);
  return data;
}
