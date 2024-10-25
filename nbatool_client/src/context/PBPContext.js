import { createContext, useEffect, useState, useContext } from "react";
import { getYearForResults } from "../consts";

export const PBPContext = createContext();

export const PBPContextProvider = ({ children }) => {
    const [PBPData, setPBPData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [usePrevRosters, setUsePrevRosters] = useState(false);

    useEffect(() => {
        const year = usePrevRosters
            ? getYearForResults() - 1
            : getYearForResults();

        setLoading(true);
        fetch("/api/pbp_roster?year=" + year)
            .then((res) => res.json())
            .then((data) => {
                setPBPData(data);
            })
            .catch((e) => {
                console.log("error fetching PBP data");
                console.log(e);
                setError(e);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [usePrevRosters]);

    return loading ? (
        <h1 style={{ color: "#e7e0da" }}>
            NBATool is loading Play-By-Play Rosters!
        </h1>
    ) : (
        <PBPContext.Provider
            value={{ PBPData, setUsePrevRosters, usePrevRosters }}
        >
            {children}
        </PBPContext.Provider>
    );
};

export const usePBPRosters = () => {
    const { PBPData, setUsePrevRosters, usePrevRosters } =
        useContext(PBPContext);

    const getTeamPBPRoster = (team) => {
        if (!team) return [];
        return PBPData.filter((e) => e.team_id === team).sort(
            (a, b) => Number(b.mp) - Number(a.mp),
        );
    };

    return {
        PBPRoster: PBPData,
        getTeamPBPRoster,
        setUsePrevRosters,
        usePrevRosters,
    };
};
