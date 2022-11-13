import { useState } from "react";
import { SkeuoboxDark, Skeuobutton } from "./SkeuoElements";

import styles from "./styles/header.module.css";
import logo from "../images/nbatool-logo.svg";

export const Header = ({ page, pages, setPage }) => {
  const [hide, setHide] = useState(false);

  return hide ? (
    <>
      <div style={{ position: "fixed", top: 0, left: 0, padding: 23.5 }}>
        <Skeuobutton
          text={
            <img
              src={logo}
              alt="NBAtool logo (Basketball in a toolbox)"
              width={64}
              height={64}
            />
          }
          onClick={() => setHide(false)}
          style={{
            width: 85,
            height: 85,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
      </div>
      <div style={{ height: 123 }} />
    </>
  ) : (
    <SkeuoboxDark className={styles.header}>
      <div className={styles.title}>
        <Skeuobutton
          text={
            <img
              src={logo}
              alt="NBAtool logo (Basketball in a toolbox)"
              width={64}
              height={64}
            />
          }
          onClick={() => setHide(true)}
          style={{
            width: 85,
            height: 85,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        />
        <div>
          <h1 style={{ margin: 0 }}>NBAtool</h1>
          <div>
            Giving you quick access to play-by-play positional statistics, and
            team defensive data by position to predict any NBA matchup.{" "}
          </div>
        </div>
      </div>
      <div>
        {pages.map((p) => (
          <Skeuobutton
            active={p === page}
            text={p}
            style={{ marginRight: 10 }}
            onClick={() => setPage(p)}
          />
        ))}
      </div>
    </SkeuoboxDark>
  );
};
