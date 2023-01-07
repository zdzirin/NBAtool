import { useState, useEffect } from "react";
import { ABBREVIATION_TO_TEAM, colors } from "../consts";
import { usePBPRosters } from "../context/PBPContext";

import styles from "./styles/pbrroster.module.css";
import skeuo from "./styles/skeuomorphism.module.css";
import table from "./styles/table.module.css";

const POSITION_TO_PCT = {
  PG: "pct_1",
  SG: "pct_2",
  SF: "pct_3",
  PF: "pct_4",
  C: "pct_5",
};

export default function PBPRoster({
  team,
  setSelectedPlayer = (player) => {},
  constrain = false,
}) {
  const { getTeamPBPRoster } = usePBPRosters();
  const [roster, setRoster] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");

  const handleSetSelectedPosition = (position) => {
    if (position === selectedPosition) {
      setSelectedPosition("");
    } else {
      setSelectedPosition(position);
    }
  };

  useEffect(() => setRoster(getTeamPBPRoster(team)), [team]);

  const PositionLabel = ({ pos }) => (
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
  );

  return (
    <div className={styles.container}>
      <h3
        style={{ marginBottom: 20 }}
      >{`${ABBREVIATION_TO_TEAM[team]} Play By Play Roster`}</h3>
      <table className={table.table}>
        <thead
          style={{
            display: constrain && !(window.innerWidth < 1065) && "block",
            paddingRight: constrain && !(window.innerWidth < 1065) && 15,
          }}
        >
          <tr
            className={
              constrain &&
              !(window.innerWidth < 1065) &&
              styles.constrain_header
            }
          >
            <td>Player</td>
            <td>Pos.</td>
            <td>GP</td>
            <td>Mins</td>
            {["PG", "SG", "SF", "PF", "C"].map((pos) => (
              <PositionLabel pos={pos} />
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
          {createTableBodyFromRoster(
            roster,
            selectedPosition,
            setSelectedPlayer
          )}
        </tbody>
      </table>
    </div>
  );
}

function createTableBodyFromRoster(
  roster,
  selectedPosition,
  setSelectedPlayer
) {
  let table = [];
  roster.forEach((player) => {
    const thisPlayer = { ...player };

    let playerID = thisPlayer.player_link.split("/")[3];
    playerID = playerID.substring(0, playerID.indexOf("."));

    delete thisPlayer.player_link;
    delete thisPlayer.team_id;
    let fields = Object.keys(thisPlayer);

    const selectedPlayer = { name: thisPlayer.player, id: playerID };
    const onClick = () => setSelectedPlayer(selectedPlayer);

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
        style={{
          background: !!color && `${color}40`,
          borderTop: !!color && `2px solid ${color}`,
        }}
      >
        {fields.map((field) =>
          createTableDataFromField(field, thisPlayer[field], onClick)
        )}
      </tr>
    );
  });
  return table;
}

function createTableDataFromField(field, value, onClick) {
  if (field === "player") {
    return (
      <td
        onClick={onClick}
        style={{ fontWeight: 500, textDecoration: "underline" }}
      >
        {value}
      </td>
    );
  }

  if (field === "pos") {
    return <td onClick={onClick}>{value}</td>;
  }

  if (field === "g") {
    return (
      <td onClick={onClick} style={{ textDecoration: "underline" }}>
        {value}!
      </td>
    );
  }

  if (["pct_2", "pct_4"].includes(field)) {
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
  }

  return (
    <td
      className={
        field === "plus_minus_net" || field === "plus_minus_on"
          ? styles.hide
          : ""
      }
    >
      {trimPlusMinusValue(value)}
    </td>
  );
}

const trimPlusMinusValue = (value) => {
  value = `${value}`;
  value = value.substring(0, 4);
  if (value[3] === ".") {
    value = value.substring(0, 3);
  }
  return value;
};
