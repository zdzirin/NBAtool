import { useEffect, useState } from "react";
import { useGamelogData } from "../context/GamelogContext";
import { SkeuoboxDark, Skeuobutton } from "./SkeuoElements";
import SelectSearch from "react-select-search";

import styles from "./styles/gamelog.module.css";
import table from "./styles/table.module.css";
import skeuo from "./styles/skeuomorphism.module.css";
import { colors } from "../consts";

const EXCLUDED_PROPS = [
  "date_game",
  "team_id",
  "opp_id",
  "game_result",
  "gs",
  "mp",
];

const COLUMN_TO_LABEL = {
  date_game: "Date",
  team_id: "Team",
  opp_id: "Vs.",
  game_result: "Result",
  gs: "gs",
  mp: "mp",
  fg: "fg",
  fga: "fga",
  fg_pct: "fg%",
  fg3: "3pm",
  fg3a: "3pa",
  fg3_pct: "3p%",
  ft: "ft",
  fta: "fta",
  ft_pct: "ft%",
  orb: "or",
  drb: "dr",
  trb: "tr",
  ast: "a",
  stl: "s",
  blk: "b",
  tov: "to",
  pf: "pf",
  pts: "pts",
  game_score: "Game Score",
  plus_minus: "+/-",
};

const PropMap = {
  Points: "pts",
  Rebounds: "trb",
  Assists: "ast",
  Threes: "fg3",
  PRA: ["pts", "trb", "ast"],
  PA: ["pts", "ast"],
  PR: ["pts", "trb"],
  RA: ["trb", "ast"],
  Steals: "stl",
  Blocks: "blk",
  Turnovers: "tov",
};

const PROP_SELECT_DATA = Object.keys(PropMap)
  .filter((e) => !EXCLUDED_PROPS.includes(e))
  .map((col) => {
    return { name: col, value: PropMap[col] };
  });

const OVER_UNDER_SELECT_DATA = [
  { name: "Over", value: "O" },
  { name: "Under", value: "U" },
];

export const Gamelog = ({ name, id, closeModal }) => {
  const {
    getPlayerGamelog,
    addPlayerGamelog,
    GamelogColumns,
    setGamelogColumns,
  } = useGamelogData();

  const [gameLogInfo, setGamelogInfo] = useState([]);

  // Will be used for props.cash functionality
  const [selectedProp, setSelectedProp] = useState("");
  const [overUnder, setOverUnder] = useState("O");
  const [checkValue, setCheckValue] = useState(1.5);
  const [propInfo, setPropInfo] = useState({});
  const [trendInfo, setTrendInfo] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset prop info when values change
  useEffect(() => {
    setPropInfo({});
    setTrendInfo({});
  }, [selectedProp, overUnder, checkValue]);

  const clearValues = () => {
    setSelectedProp("");
    setCheckValue("");
    setPropInfo({});
    setTrendInfo({});
  };

  const checkProp = () => {
    if (!selectedProp || !checkValue || !overUnder || isNaN(checkValue)) {
      alert("Somethings not entered or entered wrong");
      setPropInfo({});
      return;
    }

    let games = 0;
    let gamesHit = 0;
    let gamesHitList = [];
    let trendInfoObj = {};

    let prop = selectedProp;
    if (!Array.isArray(prop)) {
      prop = [prop];
    }

    gameLogInfo.forEach((game, i) => {
      if (!game.gs > 0) {
        return;
      }
      games++;

      let amount = 0;
      prop.forEach((p) => {
        amount += parseInt(game[p]);
      });

      trendInfoObj[game["date_game"]] = amount;

      if (
        (amount > checkValue && overUnder === "O") ||
        (amount < checkValue && overUnder === "U")
      ) {
        gamesHit++;
        gamesHitList.push(i);
      }
    });

    setPropInfo({ games, gamesHit, gamesHitList });
    setTrendInfo(trendInfoObj);
  };
  useEffect(() => {
    const gamelog = getPlayerGamelog(id);
    if (gamelog) {
      setGamelogInfo(gamelog);
      setLoading(false);
      return;
    }

    fetch(`/api/gamelog/${id}`)
      .then((res) => res.json())
      .then((res) => {
        if (GamelogColumns.length === 0) {
          setGamelogColumns(res.statOrder);
        }
        addPlayerGamelog(id, res.gameLog);
        setGamelogInfo(res.gameLog);
      })
      .catch((e) => {
        console.log(`Error fetching gamelog for ${name}`);
        console.log(e);
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <div className={styles.container}>
      <h2 style={{ color: "#e7e0da" }}>{name} Gamelog</h2>
      <span style={{ fontSize: 20, color: "#e7e0da" }}>
        {propInfo.hasOwnProperty("games")
          ? `${name} has hit ${overUnder} ${checkValue} ${selectedProp}'s in ${
              propInfo.gamesHit
            } / ${propInfo.games} games or ${Math.floor(
              (propInfo.gamesHit / propInfo.games) * 100
            )}% of the time.`
          : `Select a stat and enter a value to see how many games ${name} has hit
        that line`}
      </span>
      <div className={styles.prop_select}>
        <div
          className={skeuo.skeuoshadow}
          style={{ width: 150, height: "fit-content" }}
        >
          <SelectSearch
            options={PROP_SELECT_DATA}
            value={selectedProp}
            placeholder="Prop"
            onChange={setSelectedProp}
            search
          />
        </div>

        <div
          className={skeuo.skeuoshadow}
          style={{ width: 100, marginLeft: 10, height: "fit-content" }}
        >
          <SelectSearch
            options={OVER_UNDER_SELECT_DATA}
            value={overUnder}
            placeholder="O/U"
            onChange={setOverUnder}
            search
          />
        </div>

        <div
          className={skeuo.skeuoshadow}
          style={{ width: 60, marginLeft: 10, height: "fit-content" }}
        >
          <input
            className={skeuo.skeuobutton}
            type="number"
            value={checkValue}
            onChange={(e) => setCheckValue(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <div className={styles.prop_select}>
        <div className={skeuo.skeuoshadow} style={{ height: "fit-content" }}>
          <Skeuobutton
            text="Clear"
            onClick={clearValues}
            style={{ margin: 0 }}
          />
        </div>

        <div
          className={skeuo.skeuoshadow}
          style={{ marginLeft: 10, height: "fit-content" }}
        >
          <Skeuobutton
            text="Check Prop"
            onClick={checkProp}
            style={{ margin: 0 }}
          />
        </div>

        <div
          className={skeuo.skeuoshadow}
          style={{ marginLeft: 10, height: "fit-content" }}
        >
          <Skeuobutton text="Close Modal" onClick={closeModal} />
        </div>
      </div>

      {Object.keys(trendInfo).length > 0 && (
        <SkeuoboxDark style={{ marginBottom: 40 }}>
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <TrendInfoBarGraph trendInfo={trendInfo} checkValue={checkValue} />
          </div>
        </SkeuoboxDark>
      )}
      <SkeuoboxDark style={{ marginBottom: 40 }}>
        <div style={{ maxWidth: "100%", overflowX: "auto" }}>
          <table className={table.table + " " + table.gl}>
            <thead>
              <tr>
                {GamelogColumns.map((col, i) => (
                  <th key={col} className={i === 0 && table.sticky}>
                    {COLUMN_TO_LABEL[col]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gameLogInfo.map((game, g) => {
                return (
                  <tr
                    className={
                      propInfo.hasOwnProperty("gamesHitList") &&
                      propInfo.gamesHitList.includes(g) &&
                      table.good
                    }
                    key={g}
                  >
                    {GamelogColumns.map((col, i) => (
                      <td
                        key={i}
                        className={i === 0 && table.sticky}
                        style={{
                          backgroundColor:
                            i === 0 &&
                            (propInfo.hasOwnProperty("gamesHitList") &&
                            propInfo.gamesHitList.includes(g)
                              ? `${colors.green}`
                              : g % 2 === 0
                              ? "#38393a"
                              : "#333333"),
                        }}
                      >
                        {game[col]}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SkeuoboxDark>
    </div>
  );
};

const TrendInfoBarGraph = ({ trendInfo, checkValue }) => {
  let maxValue = Math.max(...Object.values(trendInfo));
  maxValue += maxValue > 20 ? 5 : 2;

  return (
    <div
      style={{
        height: 300,
        display: "flex",
        flexFlow: "row nowrap",
        position: "relative",
        width: "fit-content",
      }}
    >
      {Object.keys(trendInfo).map((key, i) => {
        return (
          <TrendInfoBar
            key={key}
            label={key}
            value={trendInfo[key]}
            checkValue={checkValue}
            maxValue={maxValue}
          />
        );
      })}
      <div
        className={skeuo.skeuoshadow}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: `calc(${(checkValue / maxValue) * 100}% + 25px)`,
          height: 2,
          backgroundColor: colors.logo_orange,
        }}
      />
    </div>
  );
};

const TrendInfoBar = ({ label, value, checkValue, maxValue }) => {
  const propHit = value > checkValue;
  return (
    <div
      style={{
        height: "100%",
        width: "fit-content",
        display: "flex",
        flexDirection: "column",
        alignContent: "end",
        justifyContent: "end",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 18 }}>{value}</span>
      <div
        className={skeuo.skeuoshadow}
        style={{
          width: 15,
          height: `${(value / maxValue) * 100}%`,
          borderRadius: 6,
          border: "1px solid",
          borderColor: propHit ? colors.green : colors.almostWhite,
          backgroundColor: propHit ? colors.green : colors.almostWhite,
        }}
      />
      <div style={{ height: 20, margin: 5, marginBottom: 0 }}>
        <span>{label}</span>
      </div>
    </div>
  );
};
