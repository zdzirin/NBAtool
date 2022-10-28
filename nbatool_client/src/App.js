import "./App.css";
import Home from "./pages/Home";
import DBP from "./pages/DBP";

import { useState } from "react";
function App() {
  const [dbpMode, setDbpMode] = useState(false);

  const toggleDbpMode = () => setDbpMode(!dbpMode);

  return (
    <>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        <button onClick={toggleDbpMode}>
          {dbpMode
            ? "Switch To Matchup Mode"
            : "Switch to (new!) Team DBP Mode"}
        </button>
      </div>
      {dbpMode ? <DBP /> : <Home />}
      <footer style={{ padding: 10, fontSize: 10 }}>
        <div>
          Icons made by{" "}
          <a
            href="https://www.flaticon.com/authors/smashicons"
            title="Smashicons"
          >
            Smashicons
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
        <div>
          Defensive data from{" "}
          <a href="https://www.fantasypros.com/daily-fantasy/nba/fanduel-defense-vs-position.php">
            FantasyPros
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
