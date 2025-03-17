"use client";

import { useEffect } from "react";
import MovieCard, { MovieCardSkeleton } from "./MovieCard";
import { searchState } from "@/utils/jotai/atoms";
import { useAtomValue } from "jotai";
import {
  Movie,
  searchMovies,
  SearchMoviesResponse,
} from "@/actions/movieActions";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@next-inflearn/ui";
import { useInfiniteQuery } from "@next-inflearn/ui/lib";

const PAGE_SIZE = 12;
const INITIAL_PAGE = 1;

export default function MovieCardList() {
  // Jotai atom에서 검색어 상태를 가져옴
  const searchValue = useAtomValue(searchState);
  // searchState가 객체인 경우 default 값을 추출
  const search =
    typeof searchValue === "string" ? searchValue : searchValue.default;

  // 무한 스크롤을 위한 TanStack Query 설정
  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<SearchMoviesResponse>({
      initialPageParam: INITIAL_PAGE, // 초기 페이지 파라미터 설정
      queryKey: ["movie", search], // 캐시 키 설정 (검색어가 변경되면 새로운 쿼리 실행)
      queryFn: async ({ pageParam }) => {
        // 서버에서 영화 데이터를 가져오는 함수
        const response = await searchMovies({
          search,
          page: pageParam as number,
          pageSize: PAGE_SIZE, // 한 페이지당 12개의 영화를 가져옴
        });
        return response;
      },
      // 다음 페이지 존재 여부를 확인하고 다음 페이지 번호를 반환
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    });

  // Intersection Observer 설정 (무한 스크롤을 위한 요소 감지)
  const { ref, inView } = useInView({
    threshold: 0, // 요소가 화면에 조금이라도 보이면 감지
  });

  // 무한 스크롤 로직
  useEffect(() => {
    // 감지된 요소가 보이고, 다음 페이지가 있으며, 현재 fetching 중이 아닐 때
    if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage(); // 다음 페이지 데이터 로드
    }
  }, [inView, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

  // 디버깅을 위한 inView 상태 로깅
  useEffect(() => {
    console.log(inView);
  }, [inView]);

  return (
    // 영화 카드 그리드 레이아웃
    <div className="grid gap-1 md:grid-cols-4 grid-cols-3 w-full h-full">
      {/* 초기 로딩 상태 */}
      {isFetching && !data && (
        <div className="col-span-full flex justify-center">
          <Spinner />
        </div>
      )}

      {/* 영화 카드 목록 렌더링 */}
      {data?.pages.map((page) =>
        page.data.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      )}

      {/* 다음 페이지 로딩 상태 */}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center">
          <Spinner />
        </div>
      )}

      {/* Intersection Observer를 위한 감지 요소 */}
      <div ref={ref} className="col-span-full h-1" />
    </div>
  );
}
