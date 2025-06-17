import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { ACCESS_KEY } from "../../const.js";
import styles from "./ListOfPhotos.module.css";
import { PhotoItem } from "../PhotoItem/PhotoItem.jsx";
import { SearchComponent } from "../SearchComponent/SearchComponent.jsx";

export const ListOfPhotos = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    isPending: isPhotosPending,
    error: infiniteError,
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: "images",
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `https://api.unsplash.com/photos?client_id=${ACCESS_KEY}&per_page=9&page=${pageParam}`,
      );
      return res.json();
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 9) return undefined;
      return allPages.length + 1;
    },
  });

  const {
    data: searchPages,
    isPending: isSearchPending,
    error: searchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useInfiniteQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?client_id=${ACCESS_KEY}&query=${debouncedSearch}&page=${pageParam}&per_page=9`,
      );
      if (!res.ok) throw new Error("Ошибка при поиске");
      return res.json();
    },

    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      if (currentPage < lastPage.total_pages) return currentPage + 1;
      return undefined;
    },
    enabled: !!debouncedSearch,
  });

  const loaderRef = useRef();

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (!target.isIntersecting) return;

      if (debouncedSearch) {
        if (hasNextSearchPage && !isFetchingNextSearchPage) {
          fetchNextSearchPage();
        }
      } else {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    },
    [
      debouncedSearch,
      hasNextSearchPage,
      isFetchingNextSearchPage,
      fetchNextSearchPage,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    ],
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  useEffect(() => {
    console.log("search >>> ", searchPages);
  }, [searchPages]);

  return (
    <>
      <SearchComponent search={search} setSearch={setSearch} />

      {debouncedSearch.length > 0 ? (
        <>
          {isSearchPending && <p>Загрузка поиска...</p>}
          {searchError && <p>Ошибка: {searchError.message}</p>}
          <ul className={styles.list}>
            {searchPages?.pages?.flatMap((page) =>
              page?.results?.map((photo) => (
                <PhotoItem key={photo.id} photo={photo} />
              )),
            )}
            <div ref={loaderRef}>
              {isFetchingNextSearchPage && <p>Загрузка ещё...</p>}
            </div>
          </ul>
        </>
      ) : (
        <>
          {isPhotosPending && <p>Загрузка фото...</p>}
          {infiniteError && <p>Ошибка: {infiniteError.message}</p>}
          <ul className={styles.list}>
            {infiniteData?.pages?.map((page) =>
              page?.map((photo) => <PhotoItem key={photo.id} photo={photo} />),
            )}
          </ul>
          <div ref={loaderRef}>
            {isFetchingNextPage && <p>Загрузка ещё...</p>}
          </div>
        </>
      )}
    </>
  );
};
