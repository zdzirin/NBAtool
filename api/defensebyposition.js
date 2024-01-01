const fetch = require("node-fetch");
const cheerio = require("cheerio");
const { DBP_INDEX_TO_STAT, TEAM_TO_ABBREVIATION } = require("../consts.js");

let url =
  "https://www.fantasypros.com/daily-fantasy/nba/fanduel-defense-vs-position.php";

function findRankings(dbpData) {
  const ranges = Object.keys(dbpData);
  const positions = Object.keys(dbpData[ranges[0]]);
  let statsObj = dbpData[ranges[0]][positions[0]][0];
  delete statsObj.team;
  const stats = Object.keys(statsObj);

  // For each position in each range, sort and add rankings
  ranges.forEach((range) => {
    positions.forEach((position) => {
      let row = [...dbpData[range][position]];

      // For each stat sort and apply rankings
      stats.forEach((stat) => {
        row = row
          .sort((a, b) => {
            return a[stat].amt - b[stat].amt;
          })
          .map((e, i) => {
            return { ...e, [stat]: { ...e[stat], rank: i + 1 } };
          });
      });

      dbpData[range][position] = row;
    });
  });
}

async function getFullData() {
  // Fetch DBP data from host
  let res = await fetch(url);
  let data = await res.text();

  // Find indexes of table in string ang get table substring
  let start = data.indexOf("<table");
  let end = data.indexOf("</table>") + 8; // Adding the 8 characters in '</table> to the index to make sure that tag is picked up
  let table = data.substring(start, end);

  const $ = cheerio.load(table);

  let dbpData = {};

  // Iterate through each table row and extract team data
  $("table tbody tr").each((i, e) => {
    // Get row info
    let classes = e.attribs.class.split(" ");
    let position = classes[1];
    let range = classes[0].split("-")[1];

    // Create entries for storing row in dbpData if not already created
    if (!dbpData.hasOwnProperty(range)) {
      dbpData[range] = {};
      dbpData[range][position] = [];
    } else if (!dbpData[range].hasOwnProperty(position)) {
      dbpData[range][position] = [];
    }

    let row = {};

    // Iterate through each table cell and extract data
    e.children.forEach((e, i) => {
      if (i === 0) {
        // Get team
        row.team = TEAM_TO_ABBREVIATION[e.children[1].data];
      } else if (i > 1 && i < 9) {
        // 1 === # of games played which we don't care about
        // Get stat data
        let elClass = e.attribs.class.split(" ");
        let difficulty =
          elClass.length > 1 ? (elClass[1] === "hard" ? 1 : -1) : 0;
        let amt = e.children[0].children[0].data;
        row[DBP_INDEX_TO_STAT[i - 1]] = { difficulty, amt };
      }
    });

    dbpData[range][position].push(row);
  });

  findRankings(dbpData);
  return dbpData;
}

async function getTeamData(team) {
  let teamData = [];
  // Get the team data html
  let res = await fetch(url);
  let data = await res.text();

  // Find the table in the html
  let start = data.indexOf("<table");
  let end = data.indexOf("</table>") + 8; // Adding the 8 characters in '</table> to the index to make sure that tag is picked up
  let table = data.substring(start, end);

  // Load the table into cheerio and iterate through each row
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

async function getDBPByTeam(team) {
  let data = await getTeamData(team);
  return data;
}

async function getDBPFull() {
  let data = await getFullData();
  return data;
}

module.exports = { getDBPByTeam, getDBPFull };
