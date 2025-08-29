import Button from "@/components/Button/Button";
import styles from "./board.module.css";

export default function Board() {
  return (
    <div className={styles.board}>
      <Button icon="plus"/>
    </div>
  );
}
