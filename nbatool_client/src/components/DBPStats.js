import { useState } from "react";
import { useDBPData } from "../context/DBPContext";

import { Skeuobutton } from "./SkeuoElements";

import { ABBREVIATION_TO_TEAM, colors } from "../consts";
import styles from "./styles/dbpstats.module.css";
import skeuo from "./styles/skeuomorphism.module.css";

const DBP_INDEX_TO_STAT = {
  0: "position",
  1: "pts",
  2: "reb",
  3: "ast",
  4: "tpm",
  5: "stl",
  6: "blk",
  7: "to",
};

const POSITIONS = ["PG", "SG", "SF", "PF", "C", "TM"];
export default function DBPStats({ team }) {
  const getTeamDBPData = useDBPData();

  const stats = getTeamDBPData(team);

  // Sorts the stats in the order defined above
  stats.sort(
    (a, b) => POSITIONS.indexOf(a.position) - POSITIONS.indexOf(b.position)
  );

  const [range, setRange] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3
          style={{ marginBottom: 10 }}
        >{`${ABBREVIATION_TO_TEAM[team]} Defense vs Position`}</h3>
        <div style={{ display: "flex", width: "100%", marginBottom: 20 }}>
          <p style={{ margin: 0 }}>Stat Range (Games):</p>
          <Skeuobutton
            active={range === 0}
            onClick={() => setRange(0)}
            text="Season"
          />
          <Skeuobutton
            active={range === 7}
            onClick={() => setRange(7)}
            text="7"
          />
          <Skeuobutton
            active={range === 15}
            onClick={() => setRange(15)}
            text="15"
          />
          <Skeuobutton
            active={range === 30}
            onClick={() => setRange(30)}
            text="30"
          />
        </div>
      </div>
      <table className={styles.table}>
        <thead className={skeuo.skeuoshadow}>
          <tr>
            <th>Pos.</th>
            <th>PTS</th>
            <th>REB</th>
            <th>AST</th>
            <th>TPM</th>
            <th>STL</th>
            <th>BLK</th>
            <th>TO</th>
          </tr>
        </thead>
        <tbody>
          {stats
            .filter((e) => Number.parseInt(e.range) === range)
            .map((e) => {
              return (
                <tr>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                    let stat = DBP_INDEX_TO_STAT[i];
                    let value = e[stat];
                    if (stat == "position") {
                      return <td style={{ fontWeight: 600 }}>{value}</td>;
                    }
                    let color =
                      value.difficulty > 0
                        ? colors.yellow_orange
                        : value.difficulty < 0
                        ? colors.green
                        : "";
                    return (
                      <td
                        style={{
                          position: "relative",
                          borderTop:
                            value.difficulty !== 0 && "3px solid " + color,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                            opacity: 0.25,
                            backgroundColor: value.difficulty !== 0 && color,
                          }}
                        />
                        <div style={{ position: "relative", zIndex: 2 }}>
                          {value.amt}
                          <br />({value.rank})
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

function getRowDataFromElement(e) {}
