import styles from "./SearchComponent.module.css";

export const SearchComponent = ({ search, setSearch }) => {
  return (
    <div className={styles["search-container"]}>
      <input
        type="text"
        className={styles["search-input"]}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
