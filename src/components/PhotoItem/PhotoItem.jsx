import styles from "./PhotoItem.module.css";
import { useNavigate } from "react-router-dom";

export const PhotoItem = ({ photo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/photo/${photo.id}`);
  };
  return (
    <li onClick={handleClick} className={styles["list-item"]}>
      <img src={photo.urls.small_s3} alt={photo.slug} className={styles.item} />
    </li>
  );
};
