import { useState, useEffect } from "react";
import { ABBREVIATION_TO_TEAM, colors } from "../consts";
import styles from "./styles/pbrroster.module.css";

const POSITION_TO_PCT = {
  PG: "pct_1",
  SG: "pct_2",
  SF: "pct_3",
  PF: "pct_4",
  C: "pct_5",
};

export default function PBPRoster(props) {
  const URL = `/api/pbp_roster/${props.team}`;
  const [roster, setRoster] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");

  const handleSetSelectedPosition = (position) => {
    if (position === selectedPosition) {
      setSelectedPosition("");
    } else {
      setSelectedPosition(position);
    }
  };

  // Loading / Error handling
  const [rosterIsSet, setRosterIsSet] = useState(false);
  const [rosterError, setRosterError] = useState(false);

  useEffect(() => {
    if (rosterIsSet) return;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setRosterIsSet(true);
        setRoster(data);
      })
      .catch((e) => {
        console.log(e);
        setRosterIsSet(true);
      });
  }, [rosterIsSet]);

  useEffect(() => setRosterIsSet(false), [props.team]);

  return !rosterIsSet ? (
    <p>Roster Pending...</p>
  ) : (
    <div className={styles.container}>
      <h3>{`${
        ABBREVIATION_TO_TEAM[props.team]
      } Play By Play Roster: ${selectedPosition}`}</h3>
      <table className={styles.table}>
        <thead>
          <tr className={`${styles.tableRow} ${styles.headerRow}`}>
            <td>Player</td>
            <td>Games</td>
            <td>Minutes</td>
            {["PG", "SG", "SF", "PF", "C"].map((pos) => (
              <td
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  backgroundColor: selectedPosition === pos && "#bbbbbb",
                }}
                onClick={() => handleSetSelectedPosition(pos)}
              >
                {pos}
              </td>
            ))}
            <td className={styles.hide}>On Court +/-</td>
            <td className={styles.hide}>Net +/-</td>
          </tr>
        </thead>
        <tbody>{createTableBodyFromRoster(roster, selectedPosition)}</tbody>
      </table>
    </div>
  );
}

function createTableBodyFromRoster(roster, selectedPosition) {
  let table = [];
  roster.forEach((player) => {
    let fields = Object.keys(player);

    let hasPlayedPosition = false;
    if (!!selectedPosition) {
      hasPlayedPosition =
        parseInt(player[POSITION_TO_PCT[selectedPosition]]) > 10;
    }
    table.push(
      <tr
        className={styles.tableRow}
        style={{
          background: hasPlayedPosition && `${colors.green}40`,
          borderTop: hasPlayedPosition && `2px solid ${colors.green}`,
        }}
      >
        {fields.map((field) => createTableDataFromField(field, player[field]))}
      </tr>
    );
  });
  return table;
}

function createTableDataFromField(field, value) {
  if (field === "player") {
    return (
      <td style={{ textDecoration: "underline" }}>
        <a href={value.link} target="_blank" rel="noreferrer">
          {value.name}
        </a>
      </td>
    );
  } else if (field === "g") {
    return (
      <td>
        <a href={value.link} target="_blank" rel="noreferrer">
          {value.name}
        </a>
      </td>
    );
  } else if (["pct_2", "pct_3", "pct_4"].includes(field)) {
    return field !== "pct_4" ? (
      <td style={{ borderLeft: "1px solid #bbbbbb" }}>{value}</td>
    ) : (
      <td
        style={{
          borderLeft: "1px solid #bbbbbb",
          borderRight: "1px solid #bbbbbb",
        }}
      >
        {value}
      </td>
    );
  } else {
    return (
      <td
        className={
          field === "plus_minus_net" || field === "plus_minus_on"
            ? styles.hide
            : ""
        }
      >
        {value}
      </td>
    );
  }
}
