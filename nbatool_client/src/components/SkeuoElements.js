import { useState } from "react";

import styles from "./styles/skeuomorphism.module.css";

export const SkeuoboxDark = ({ className, children, style = {} }) => {
  return (
    <div className={`${styles.skeuobox_dark} ${className}`} style={style}>
      {children}
    </div>
  );
};

export const Skeuobutton = ({
  active,
  text,
  onClick = () => {},
  style = {},
}) => {
  const [clicking, setClicking] = useState(false);

  return (
    <button
      className={`${styles.skeuobutton} ${
        (active || clicking) && styles.pressed
      }`}
      onClick={onClick}
      onMouseUp={() => setClicking(false)}
      onMouseDown={() => setClicking(true)}
      style={style}
    >
      {text}
    </button>
  );
};
