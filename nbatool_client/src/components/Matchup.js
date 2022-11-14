import { useState } from "react";

import { TeamSelect } from "./TeamSelect";
import PBPRoster from "./PBPRoster";
import DBPStats from "./DBPStats";

import { SkeuoboxDark, Skeuobutton } from "./SkeuoElements";
import styles from "./styles/matchup.module.css";

export const Matchup = ({ remove }) => {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  return (
    <SkeuoboxDark style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: "0px 0px 10px" }}>Matchup</h2>
        <Skeuobutton text="Remove Matchup" onClick={remove} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          marginBottom: 30,
        }}
      >
        <TeamSelect
          value={teamA}
          onChange={(e) => setTeamA(e)}
          style={{ marginRight: 5 }}
        />
        <TeamSelect
          value={teamB}
          onChange={(e) => setTeamB(e)}
          style={{ marginLeft: 5 }}
        />
      </div>
      <div className={styles.side_by_side_container}>
        <SkeuoboxDark>
          {!!teamA && !!teamB && <PBPRoster team={teamA} constrain />}
        </SkeuoboxDark>
        <SkeuoboxDark>
          {!!teamA && !!teamB && <DBPStats team={teamB} />}
        </SkeuoboxDark>
      </div>
      <div className={styles.side_by_side_container}>
        <SkeuoboxDark>
          {!!teamA && !!teamB && <PBPRoster team={teamB} constrain />}
        </SkeuoboxDark>
        <SkeuoboxDark>
          {!!teamA && !!teamB && <DBPStats team={teamA} />}
        </SkeuoboxDark>
      </div>
    </SkeuoboxDark>
  );
};
