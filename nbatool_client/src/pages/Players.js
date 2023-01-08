import { useState } from "react";
import { Gamelog } from "../components/Gamelog";
import { Modal } from "../components/Modal";
import { SkeuoboxDark } from "../components/SkeuoElements";
import { usePBPRosters } from "../context/PBPContext";

import page from "./styles/page.module.css";
import table from "../components/styles/table.module.css";
import styles from "../components/styles/pbrroster.module.css";

import { PlayerSelect } from "../components/PlayerSelect";

const PLAYER_TO_LABELS = {
  player: "Name",
  team_id: "Team",
  pos: "Pos.",
  g: "G",
  mp: "MP",
  pct_1: "PG",
  pct_2: "SG",
  pct_3: "SF",
  pct_4: "PF",
  pct_5: "C",
  plus_minus_net: "+/-",
  plus_minus_on: "+/- (On)",
};

export const getPlayerIDFromLink = (link) => {
  const split = link.split("/")[3];
  return split.split(".")[0];
};

export const Players = () => {
  const { PBPRoster } = usePBPRosters();
  const [selectedPlayer, setSelectedPlayer] = useState({});

  return (
    <div className={page.container}>
      {selectedPlayer.hasOwnProperty("id") && (
        <Modal>
          <Gamelog
            id={selectedPlayer.id}
            name={selectedPlayer.name}
            closeModal={() => setSelectedPlayer({})}
          />
        </Modal>
      )}
      <SkeuoboxDark>
        <PlayerSelect
          selectedPlayer={selectedPlayer}
          onChange={(e, p) => setSelectedPlayer({ name: p.name, id: p.value })}
          style={{ margin: "10px 10px 20px" }}
        />
        <table className={table.table}>
          <thead>
            <tr>
              {Object.values(PLAYER_TO_LABELS).map((label) => (
                <th
                  className={
                    label === "+/-" ||
                    label === "+/- (On)" ||
                    label === "Pos." ||
                    label === "MP"
                      ? styles.hide
                      : ""
                  }
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PBPRoster.map((player) => (
              <PlayerRow
                player={player}
                setSelectedPlayer={setSelectedPlayer}
              />
            ))}
          </tbody>
        </table>
      </SkeuoboxDark>
    </div>
  );
};

const PlayerRow = ({ player, setSelectedPlayer }) => {
  return (
    <tr>
      {Object.keys(PLAYER_TO_LABELS).map((key, i) => {
        let playerID = getPlayerIDFromLink(player.player_link);
        const onClick = () =>
          setSelectedPlayer({ name: player.player, id: playerID });

        if (key === "player" || key === "team_id") {
          return (
            <td
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={onClick}
            >
              {player[key]}
            </td>
          );
        }

        if (
          key === "plus_minus_net" ||
          key === "plus_minus_on" ||
          key === "pos" ||
          key === "mp"
        ) {
          return <td className={styles.hide}>{player[key]}</td>;
        }
        return <td>{player[key]}</td>;
      })}
    </tr>
  );
};
