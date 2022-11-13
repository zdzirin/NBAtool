import { useState } from "react";

import { Header } from "./components/Header";

import "./App.css";
import { Matchups } from "./pages/Matchups";
import { LeagueDefense } from "./pages/LeagueDefense";

const PAGES = ["Matchups", "League Defenses"];
function App() {
  const [page, setPage] = useState(PAGES[0]);
  return (
    <>
      <Header pages={PAGES} page={page} setPage={setPage} />
      {page === "Matchups" && <Matchups />}
      {page === "League Defenses" && <LeagueDefense />}
      <footer style={{ fontSize: 10, color: "#fff" }}>
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
