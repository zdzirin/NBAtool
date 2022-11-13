import { useState } from "react";

import { AutoComplete } from "react-lite-ui";
import PBPRoster from "./PBPRoster";
import DBPStats from "./DBPStats";

import { SkeuoboxDark, Skeuobutton } from "./SkeuoElements";
import styles from "./styles/matchup.module.css";
import skeuo from "./styles/skeuomorphism.module.css";
import theme from "../theme.scss";

import { ABBREVIATION_TO_TEAM } from "../consts";

export const Matchup = ({ remove }) => {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  return (
    <SkeuoboxDark style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 10,
        }}
      >
        <h2 style={{ margin: "0px 0px 10px" }}>Matchup:</h2>
        <Skeuobutton text="Remove Matchup" onClick={remove} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 10,
        }}
      >
        <TeamSelect value={teamA} onChange={(e) => setTeamA(e.value)} />
        <TeamSelect value={teamB} onChange={(e) => setTeamB(e.value)} />
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

// TODO MOVE THIS TO CONSTS
const TEAM_SELECT_DATA = Object.keys(ABBREVIATION_TO_TEAM).map((abbr) => {
  return { label: ABBREVIATION_TO_TEAM[abbr], value: abbr };
});

export const TeamSelect = ({ value, onChange }) => {
  return (
    <div className={skeuo.skeuoshadow} style={{ color: "#333333" }}>
      <AutoComplete
        theme={theme}
        placeholder="Select Team"
        data={TEAM_SELECT_DATA}
        style={{ width: "100%" }}
        onChange={onChange}
      />
    </div>
  );
};
