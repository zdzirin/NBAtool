import { useState, useEffect } from "react";
import { ABBREVIATION_TO_TEAM } from "../consts";
import styles from "./styles/dbpstats.module.css";

export default function DBPStats(props) {
  const URL = `/dbp_stats/${props.team}`;
  const [stats, setStats] = useState([]);
  const [statsSet, setStatsSet] = useState(false);
  const [range, setRange] = useState(0);

  useEffect(() => {
    if (statsSet) return;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStatsSet(true);
        setStats(data);
      })
      .catch((e) => {
        console.log(e);
        setStatsSet(true);
      });
  }, [statsSet]);

  useEffect(() => setStatsSet(false), [props.team]);

  return !statsSet ? (
    <p>Defense By Position Stats Pending...</p>
  ) : (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>{`${ABBREVIATION_TO_TEAM[props.team]} Defense vs Position`}</h3>
        <div>
          <p>Stat Range (Days):</p>
          <button onClick={() => setRange(0)}>Season</button>
          <button onClick={() => setRange(7)}>7</button>
          <button onClick={() => setRange(15)}>15</button>
          <button onClick={() => setRange(30)}>30</button>
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
                    return <td style={{ color }}>{value.amt}</td>;
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
