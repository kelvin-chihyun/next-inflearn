"use client";

import { useEffect } from "react";
import MovieCard from "./MovieCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchState } from "@/utils/jotai/atoms";
import { useAtomValue } from "jotai";
import {
  Movie,
  searchMovies,
  SearchMoviesResponse,
} from "@/actions/movieActions";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@next-inflearn/ui";

export default function MovieCardList() {
  const searchValue = useAtomValue(searchState);
  // searchState가 객체인 경우 default 값을 추출
  const search =
    typeof searchValue === "string" ? searchValue : searchValue.default;

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<SearchMoviesResponse>({
      initialPageParam: 1,
      queryKey: ["movie", search],
      queryFn: async ({ pageParam }) => {
        const response = await searchMovies({
          search,
          page: pageParam as number,
          pageSize: 12,
        });
        return response;
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    });

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    console.log(inView);
  }, [inView]);

  return (
    <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full">
      {(isFetching || isFetchingNextPage) && <Spinner />}
      {data?.pages.map((page) =>
        page.data.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      )}
      <div ref={ref} />
    </div>
  );
}
