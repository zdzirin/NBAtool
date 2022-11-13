import { useState } from "react";

import { SkeuoboxDark, Skeuobutton } from "../components/SkeuoElements";
import DBPStats from "../components/DBPStats";

import page from "./styles/page.module.css";
import { ABBREVIATION_TO_TEAM } from "../consts";
import { TeamSelect } from "../components/TeamSelect";

/*
const TEAM_SELECT_DATA = Object.keys(ABBREVIATION_TO_TEAM).map((abbr) => {
  return { label: abbr, value: abbr };
});
*/

const TEAMS = Object.keys(ABBREVIATION_TO_TEAM);

export const LeagueDefense = () => {
  const [selectedTeams, setSelectedTeams] = useState([]);

  const addSelectedTeam = (team) => {
    setSelectedTeams([...selectedTeams, team]);
  };

  const removeSelectedTeam = (team) => {
    setSelectedTeams([...selectedTeams.filter((t) => t !== team)]);
  };

  const clearSelectedTeams = () => {
    setSelectedTeams([]);
  };

  const selectAllTeams = () => {
    setSelectedTeams(TEAMS);
  };

  return (
    <div className={page.container}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h3 style={{ marginBottom: 10, width: "50%" }}>League Defenses:</h3>
        <TeamSelect
          value={selectedTeams}
          onChange={(e) => setSelectedTeams(e)}
          multi
          style={{ width: 300 }}
        />
      </div>
      <SkeuoboxDark
        style={{
          display: "flex",
          width: "100%",
          boxSizing: "border-box",
          flexFlow: "row wrap",
          justifyContent: "space-around",
          marginBottom: 20,
        }}
      >
        <Skeuobutton
          text="Select All"
          onClick={selectAllTeams}
          style={{ margin: 5 }}
        />
        <Skeuobutton
          text="Clear"
          onClick={clearSelectedTeams}
          style={{ margin: 5 }}
        />
        {TEAMS.map((team) => (
          <Skeuobutton
            text={team}
            active={selectedTeams.includes(team)}
            style={{ margin: 5 }}
            onClick={
              selectedTeams.includes(team)
                ? () => removeSelectedTeam(team)
                : () => addSelectedTeam(team)
            }
          />
        ))}
      </SkeuoboxDark>

      <div className={page.dbp_list_container}>
        {selectedTeams.map((team) => (
          <SkeuoboxDark>
            <DBPStats team={team} />
          </SkeuoboxDark>
        ))}
      </div>
    </div>
  );
};
