import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ACCESS_KEY } from "../../const.js";
import { useEffect } from "react";
import styles from "./PhotoDetails.module.css";

export const PhotoDetails = () => {
  const { id } = useParams();
  const { data, isPending, error } = useQuery({
    queryKey: ["photo", id],
    queryFn: () =>
      fetch(
        `https://api.unsplash.com/photos/${id}?client_id=${ACCESS_KEY}`,
      ).then((res) => res.json()),
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isPending) return <p>Loading photo...</p>;
  if (error) return <p>Error loading photo</p>;

  return (
    <div className={styles.root}>
      <h1>{data.alt_description}</h1>
      <img src={data.urls.regular} alt={data.alt_description} />
      <p>Автор: {data.user.name}</p>
    </div>
  );
};
