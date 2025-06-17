import styles from "./Header.module.css";
import Logo from "../../../public/OBJECTS.svg";
import Like from "../../../public/Like.svg";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <img
          src={Logo}
          alt="Логотип"
          style={{ paddingTop: 38, paddingBottom: 38 }}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Like} alt="Избранное" style={{ marginRight: 5 }} />
          <p style={{ color: "white" }}>Избранное</p>
        </div>
      </div>
    </header>
  );
};
