import { useState } from "react";

import { Skeuobutton } from "../components/SkeuoElements";
import { Matchup } from "../components/Matchup";

import page from "./styles/page.module.css";

export const Matchups = () => {
  const [matchups, setMatchups] = useState([0]);

  const addMatchup = () => {
    setMatchups([...matchups, matchups.length]);
  };

  const removeMatchup = (matchup) => {
    setMatchups(matchups.filter((m) => m !== matchup));
  };

  return (
    <div className={page.container}>
      {matchups.map((m) => {
        return <Matchup key={m} remove={() => removeMatchup(m)} />;
      })}
      <Skeuobutton text="Add Matchup" onClick={addMatchup} />
    </div>
  );
};
