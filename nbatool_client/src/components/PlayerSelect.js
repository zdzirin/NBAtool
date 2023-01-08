import { useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import { usePBPRosters } from "../context/PBPContext";
import { getPlayerIDFromLink } from "../pages/Players";
import skeuo from "./styles/skeuomorphism.module.css";

export const PlayerSelect = ({
  selectedPlayer,
  onChange = (e, v) => {
    console.log(e);
    console.log(v);
  },
  style = {},
  multi = false,
}) => {
  const { PBPRoster } = usePBPRosters();
  const [playerSelectData, setPlayerSelectData] = useState([]);

  useEffect(() => {
    setPlayerSelectData(
      PBPRoster.map((player) => {
        return {
          name: player.player,
          value: getPlayerIDFromLink(player.player_link),
        };
      })
    );
  }, [PBPRoster]);

  return (
    <div className={skeuo.skeuoshadow} style={{ color: "#333333", ...style }}>
      <SelectSearch
        value={selectedPlayer}
        options={playerSelectData}
        placeholder="Select Player"
        onChange={onChange}
        multiple={multi}
        search={!multi}
      />
    </div>
  );
};
