import { useState } from "react";
import { ABBREVIATION_TO_TEAM, colors } from "../consts";
import { Button, ButtonGroup } from "@blueprintjs/core";
import styles from "./styles/dbpstats.module.css";

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
export default function DBPStats({ team, stats }) {
  // Sorts the stats in the order defined above
  stats.sort(
    (a, b) => POSITIONS.indexOf(a.position) - POSITIONS.indexOf(b.position)
  );

  const [range, setRange] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{`${ABBREVIATION_TO_TEAM[team]} Defense vs Position`}</h3>
        <div style={{ display: "flex", marginBottom: 5 }}>
          <p>Stat Range (Games):</p>
          <ButtonGroup>
            <Button active={range === 0} onClick={() => setRange(0)}>
              Season
            </Button>
            <Button active={range === 7} onClick={() => setRange(7)}>
              7
            </Button>
            <Button active={range === 15} onClick={() => setRange(15)}>
              15
            </Button>
            <Button active={range === 30} onClick={() => setRange(30)}>
              30
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Position</th>
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
