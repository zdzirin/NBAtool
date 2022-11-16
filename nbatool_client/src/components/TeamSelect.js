import SelectSearch from "react-select-search";

import { ABBREVIATION_TO_TEAM } from "../consts";
import skeuo from "./styles/skeuomorphism.module.css";

// TODO MOVE THIS TO CONSTS
const TEAM_SELECT_DATA = Object.keys(ABBREVIATION_TO_TEAM).map((abbr) => {
  return { name: ABBREVIATION_TO_TEAM[abbr], value: abbr };
});

export const TeamSelect = ({
  value,
  onChange = () => {},
  style = {},
  multi = false,
}) => {
  return (
    <div className={skeuo.skeuoshadow} style={{ color: "#333333", ...style }}>
      <SelectSearch
        options={TEAM_SELECT_DATA}
        value={value}
        placeholder="Select Team"
        onChange={onChange}
        multiple={multi}
        search={!multi}
      />
    </div>
  );
};
