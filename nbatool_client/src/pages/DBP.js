import { useState } from "react";
import DBPStats from "../components/DBPStats";
import { ABBREVIATION_TO_TEAM } from "../consts";
import main_styles from "./styles/home.module.css";

import logo from "../images/nbatool-logo.svg";
import { Button } from "@blueprintjs/core";
const teams = Object.keys(ABBREVIATION_TO_TEAM);

export default function DBP({ getTeamDBPData }) {
  const [selectedTeams, setSelectedTeams] = useState([]);

  return (
    <div className={main_styles.container}>
      <div className={main_styles.header}>
        <div className={main_styles.title}>
          <img src={logo} width={64} height={64} />
          <h1>NBA Matchup Research Tool</h1>
        </div>
        <TeamButtons
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {selectedTeams.map((team) => (
          <div
            style={{
              width: "45%",
              minWidth: 300,
              maxWidth: 400,
              margin: "auto",
            }}
          >
            <DBPStats stats={getTeamDBPData(team)} team={team} />
          </div>
        ))}
      </div>
    </div>
  );
}

const TeamButtons = ({ selectedTeams, setSelectedTeams }) => {
  const addSelectedTeam = (team) => {
    const newSelectedTeams = [...selectedTeams, team];
    setSelectedTeams(newSelectedTeams);
  };

  const removeSelectedTeam = (team) => {
    const newSelectedTeams = selectedTeams.filter((t) => t !== team);
    setSelectedTeams(newSelectedTeams);
  };

  const clearSelectedTeams = () => {
    setSelectedTeams([]);
  };

  const selectAllTeams = () => {
    setSelectedTeams(teams);
  };

  return (
    <div>
      {["All", "None", ...teams].map((team) => {
        const isSelected = selectedTeams.includes(team);
        let onClick = isSelected
          ? () => removeSelectedTeam(team)
          : () => addSelectedTeam(team);

        if (team === "All") {
          onClick = selectAllTeams;
        } else if (team === "None") {
          onClick = clearSelectedTeams;
        }

        return (
          <Button
            active={isSelected}
            onClick={() => {
              onClick();
            }}
            style={{ marginLeft: 5, marginBottom: 5 }}
          >
            {team}
          </Button>
        );
      })}
    </div>
  );
};
