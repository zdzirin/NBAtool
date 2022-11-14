import { useState, useEffect } from "react";
import { ABBREVIATION_TO_TEAM, colors } from "../consts";

import styles from "./styles/pbrroster.module.css";
import skeuo from "./styles/skeuomorphism.module.css";

const POSITION_TO_PCT = {
  PG: "pct_1",
  SG: "pct_2",
  SF: "pct_3",
  PF: "pct_4",
  C: "pct_5",
};

export default function PBPRoster({ team, constrain = false }) {
  const URL = `/api/pbp_roster/${team}`;
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

  useEffect(() => setRosterIsSet(false), [team]);

  return !rosterIsSet ? (
    <p>Roster Pending...</p>
  ) : (
    <div className={styles.container}>
      <h3
        style={{ marginBottom: 20 }}
      >{`${ABBREVIATION_TO_TEAM[team]} Play By Play Roster`}</h3>
      <table className={styles.table}>
        <thead
          style={{
            display: constrain && !(window.innerWidth < 1065) && "block",
            paddingRight: constrain && !(window.innerWidth < 1065) && 15,
          }}
        >
          <tr
            className={`${styles.tableRow} ${styles.headerRow} ${
              skeuo.skeuoshadow
            } ${
              constrain &&
              !(window.innerWidth < 1065) &&
              styles.constrain_header
            }`}
          >
            <td>Player</td>
            <td>GP</td>
            <td>Mins</td>
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
        <tbody
          className={
            constrain && !(window.innerWidth < 1065) && styles.constrain
          }
        >
          {createTableBodyFromRoster(roster, selectedPosition)}
        </tbody>
      </table>
    </div>
  );
}

function createTableBodyFromRoster(roster, selectedPosition) {
  let table = [];
  roster.forEach((player) => {
    let fields = Object.keys(player);

    let color = false;
    if (!!selectedPosition) {
      const minutesPlayed = parseInt(player[POSITION_TO_PCT[selectedPosition]]);
      if (minutesPlayed > 0) {
        color = colors.logo_orange;
      }
      if (minutesPlayed >= 10) {
        color = colors.yellow_orange;
      }
      if (minutesPlayed >= 33) {
        color = colors.green;
      }
    }

    table.push(
      <tr
        className={styles.tableRow}
        style={{
          background: !!color && `${color}40`,
          borderTop: !!color && `2px solid ${color}`,
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
  } else if (["pct_2", "pct_4"].includes(field)) {
    return (
      <td
        style={{
          borderLeft: "0.5px solid #e7e0da",
          borderRight: "0.5px solid #e7e0da",
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
        {trumPlusMinusValue(value)}
      </td>
    );
  }
}

const trumPlusMinusValue = (value) => {
  value = `${value}`;
  value = value.substring(0, 4);
  if (value[3] === ".") {
    value = value.substring(0, 3);
  }
  return value;
};
