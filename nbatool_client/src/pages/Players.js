import { usePBPRosters } from "../context/PBPContext";
import page from "./styles/page.module.css";

export const Players = ({}) => {
  const { PBPRoster } = usePBPRosters();

  return <div className={page.container}></div>;
};
