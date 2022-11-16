import styles from "./styles/modal.module.css";

export const Modal = ({ children, isOpen, onClose }) => {
  return (
    <div className={styles.modal}>
      <div>{children}</div>
    </div>
  );
};
