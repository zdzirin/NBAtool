import { createContext, useEffect, useState, useContext } from "react";

export const DBPContext = createContext();

export const DBPContextProvider = ({ children }) => {
  const [DBPData, setDBPData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/full_dbp_stats")
      .then((res) => res.json())
      .then((data) => {
        setDBPData(data);
      })
      .catch((e) => {
        console.log("error fetching dbp data");
        console.log(e);
        setError(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading ? (
    <h1 style={{ color: "#e7e0da" }}>NBATool is loading!</h1>
  ) : (
    <DBPContext.Provider value={DBPData}>{children}</DBPContext.Provider>
  );
};

export const useDBPData = () => {
  const DBPData = useContext(DBPContext);

  const getTeamDBPData = (team) => {
    const teamData = [];

    Object.keys(DBPData).forEach((range) => {
      Object.keys(DBPData[range]).forEach((position) => {
        if (position === "ALL") return;

        const data = DBPData[range][position].find((e) => e.team === team);
        if (!data) {
          console.log(`Cant find ${team} in ${range}: ${position}`);
          return;
        }

        teamData.push({ range, position, ...data });
      });
    });

    return teamData;
  };

  return getTeamDBPData;
};
