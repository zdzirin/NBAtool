import { useState, useEffect } from "react";
import { ABBREVIATION_TO_TEAM } from "../consts";
import styles from "./styles/pbrroster.module.css";

export default function PBPRoster(props) {
  const URL = `/api/pbp_roster/${props.team}`;
  const [roster, setRoster] = useState([]);
  const [rosterIsSet, setRosterIsSet] = useState(false);
  const [rosterError, setRosterError] = useState(false);

  useEffect(() => {
    if (rosterIsSet) return;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
      <h3>{`${ABBREVIATION_TO_TEAM[props.team]} Play By Play Roster`}</h3>
      <table className={styles.table}>
        <thead>
          <tr className={`${styles.tableRow} ${styles.headerRow}`}>
            <td>Player</td>
            <td>Games</td>
            <td>Minutes</td>
            <td>PG</td>
            <td>SG</td>
            <td>SF</td>
            <td>PF</td>
            <td>C</td>
            <td className={styles.hide}>On Court +/-</td>
            <td className={styles.hide}>Net +/-</td>
          </tr>
        </thead>
        <tbody>{createTableBodyFromRoster(roster)}</tbody>
      </table>
    </div>
  );
}

function createTableBodyFromRoster(roster) {
  let table = [];
  roster.forEach((player) => {
    let fields = Object.keys(player);
    table.push(
      <tr className={styles.tableRow}>
        {fields.map((field) => createTableDataFromField(field, player[field]))}
      </tr>
    );
  });
  return table;
}

function createTableDataFromField(field, value) {
  if (field === "player") {
    return (
      <td>
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
