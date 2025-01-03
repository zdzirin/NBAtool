import { useState } from "react";
import { SkeuoboxDark, Skeuobutton } from "./SkeuoElements";

import styles from "./styles/header.module.css";
import logo from "../images/nbatool-logo.svg";
import { useDBPData } from "../context/DBPContext";
import { usePBPRosters } from "../context/PBPContext";

export const Header = ({ page, pages, setPage }) => {
    const [hide, setHide] = useState(false);

    const { usePrevRosters, setUsePrevRosters } = usePBPRosters();
    const { usePrevDBP, setUsePrevDBP } = useDBPData();

    return (
        <>
            {hide ? (
                <>
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            padding: 23.5,
                        }}
                    >
                        <LogoButton onClick={() => setHide(false)} />
                    </div>
                    <div style={{ height: 123 }} />
                </>
            ) : (
                <SkeuoboxDark className={styles.header}>
                    <div className={styles.title}>
                        <LogoButton onClick={() => setHide(true)} />
                        <div>
                            <h1 style={{ margin: "0px 0px 10px" }}>NBAtool</h1>
                            <div>
                                Giving you quick access to play-by-play
                                positional statistics, and team defensive data
                                by position to predict any NBA matchup. <br />
                                <b>
                                    <br />
                                    Click on a players name or the number with
                                    an exclamation point to view that players
                                    gamelog and check how often they've hit a
                                    prop!
                                </b>
                            </div>
                        </div>
                    </div>
                </SkeuoboxDark>
            )}
            <div style={{ margin: 16 }}>
                {pages.map((p) => (
                    <Skeuobutton
                        active={p === page}
                        text={p}
                        style={{ marginRight: 10 }}
                        onClick={() => setPage(p)}
                    />
                ))}
            </div>
            <div style={{ margin: 16, color: "#e7e0da" }}>
                <div style={{ display: "flex", gap: 4 }}>
                    <input
                        type="checkbox"
                        id="usePrevRosters"
                        checked={usePrevRosters}
                        onChange={(e) => setUsePrevRosters(!usePrevRosters)}
                    />
                    <label htmlFor="usePrevRosters">
                        Use Previous Year's Rosters
                    </label>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    <input
                        type="checkbox"
                        id="usePrevDBP"
                        checked={usePrevDBP}
                        onChange={(e) => setUsePrevDBP(!usePrevDBP)}
                    />
                    <label htmlFor="usePrevDBP">
                        Use Previous Year's Defense
                    </label>
                </div>
            </div>
        </>
    );
};

const LogoButton = ({ onClick }) => (
    <Skeuobutton
        text={
            <img
                src={logo}
                alt="NBAtool logo (Basketball in a toolbox)"
                width={64}
                height={64}
            />
        }
        onClick={onClick}
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
);
