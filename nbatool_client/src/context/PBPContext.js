import { createContext, useEffect, useState, useContext } from "react";

export const PBPContext = createContext();

export const PBPContextProvider = ({ children }) => {
  const [PBPData, setPBPData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/pbp_roster")
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
  }, []);

  return loading ? (
    <h1 style={{ color: "#e7e0da" }}>
      NBATool is loading Play-By-Play Rosters!
    </h1>
  ) : (
    <PBPContext.Provider value={PBPData}>{children}</PBPContext.Provider>
  );
};

export const usePBPRosters = () => {
  const PBPData = useContext(PBPContext);

  const getTeamPBPRoster = (team) => {
    if (!team) return [];
    return PBPData.filter((e) => e.team_id === team);
  };

  return { PBPRoster: PBPData, getTeamPBPRoster };
};
