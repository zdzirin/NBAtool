import { useState } from "react";
import { ABBREVIATION_TO_TEAM } from "../consts";
import PBPRoster from "../components/PBPRoster";
import DBPStats from "../components/DBPStats";

import logo from "../images/bet.png";
import styles from "./styles/home.module.css";

export default function Home(props) {
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);

  return (
    <div className={styles.container}>
      <HomeHeader setTeam1={setTeam1} setTeam2={setTeam2} />
      <Matchup team1={team1} team2={team2} />
      <Matchup team1={team2} team2={team1} />
    </div>
  );
}

export const HomeHeader = (props) => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <img src={logo} width={64} height={64} />
        <h1>NBA Matchup Research Tool</h1>
      </div>
      <div className={styles.selectRow}>
        <div>
          <label for="team1">Team 1:</label>
          <select name="team1" onChange={(e) => props.setTeam1(e.target.value)}>
            <option key={0} value={null}>
              None
            </option>
            {Object.keys(ABBREVIATION_TO_TEAM).map((el) => (
              <option key={el} value={el}>
                {ABBREVIATION_TO_TEAM[el]}
              </option>
            ))}
          </select>
        </div>
        <p>vs.</p>
        <div>
          <label for="team2">Team 2:</label>
          <select name="team2" onChange={(e) => props.setTeam2(e.target.value)}>
            <option key={0} value={null}>
              None
            </option>
            {Object.keys(ABBREVIATION_TO_TEAM).map((el) => (
              <option value={el}>{ABBREVIATION_TO_TEAM[el]}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

const Matchup = (props) => {
  if (!props.team1 || !props.team2) return null;

  return (
    <>
      <h2>{`${ABBREVIATION_TO_TEAM[props.team1]} vs. ${
        ABBREVIATION_TO_TEAM[props.team2]
      }`}</h2>
      <div className={styles.matchup}>
        <div className={styles.tableContainer}>
          <PBPRoster team={props.team1} />
        </div>
        <div className={styles.spacer}></div>
        <div className={styles.tableContainer}>
          <DBPStats team={props.team2} />
        </div>
      </div>
    </>
  );
};
