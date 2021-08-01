import styles from "../styles/system.scss";

Hooks.once("init", function () {
  console.log(styles.hello);
  console.log(`Game System | Initializing the Game System`);
});
