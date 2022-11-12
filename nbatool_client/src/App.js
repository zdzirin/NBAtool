import "./App.css";
import Home from "./pages/Home";
import DBP from "./pages/DBP";

import { useEffect, useState } from "react";
import { Button } from "@blueprintjs/core";
import DBPStats from "./components/DBPStats";

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [dbpMode, setDbpMode] = useState(false);
  const toggleDbpMode = () => setDbpMode(!dbpMode);

  const [DBPData, setDBPData] = useState({});

  useEffect(() => {
    fetch("/api/full_dbp_stats")
      .then((res) => res.json())
      .then((data) => {
        setDBPData(data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
        setLoading(false);
      });
  }, []);

  const getTeamDBPData = (team) => {
    const teamData = [];

    Object.keys(DBPData).forEach((range) => {
      Object.keys(DBPData[range]).forEach((position) => {
        if (position === "all") return;

        const data = DBPData[range][position].find((e) => e.team === team);
        if (!data) {
          console.log(`Cant find ${team} in ${range}: ${position}`);
          return;
        }

        teamData.push({ range, position, ...data });
      });
    });

    return teamData;
  };

  return loading ? (
    <h1>NBATool is loading!</h1>
  ) : error ? (
    <>
      <h1>NBATool couldn't load! D:</h1>
      <p>
        Try refreshing <br /> or coming back in a couple minutes <br /> if that
        doesn't work... uh oh{" "}
      </p>
    </>
  ) : (
    <>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        <Button onClick={toggleDbpMode}>
          {dbpMode
            ? "Switch To Matchup Mode"
            : "Switch to (new!) Team DBP Mode"}
        </Button>
      </div>
      {dbpMode ? (
        <DBP getTeamDBPData={getTeamDBPData} />
      ) : (
        <Home getTeamDBPData={getTeamDBPData} />
      )}
      <footer style={{ padding: 10, fontSize: 10 }}>
        <div>
          Position Data Provided By{" "}
          <a href="https://www.basketball-reference.com/">
            Basketball-Reference.com
          </a>
        </div>
        <div>
          Defensive Data Provided By{" "}
          <a href="https://www.fantasypros.com/daily-fantasy/nba/fanduel-defense-vs-position.php">
            FantasyPros.com
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
