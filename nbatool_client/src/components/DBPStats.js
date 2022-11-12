import { useState } from "react";
import { ABBREVIATION_TO_TEAM } from "../consts";
import { Button, ButtonGroup } from "@blueprintjs/core";
import styles from "./styles/dbpstats.module.css";
import { val } from "cheerio/lib/api/attributes";

export default function DBPStats({ team, stats }) {
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
                        ? "coral"
                        : value.difficulty < 0
                        ? "green"
                        : "black";
                    return (
                      <td style={{ color }}>
                        {value.amt}
                        <br />({value.rank})
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
