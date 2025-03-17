"use server";

import {
  createServerSupabaseClient,
  handleError,
  PostgrestError,
} from "@next-inflearn/supabase";

// Movie 타입 정의

export type Movie = {
  id: number;
  image_url: string;
  overview: string;
  popularity: number;
  release_date: string;
  title: string;
  vote_average: number;
  // Movie 타입에 favorites 필드 추가
  favorites?: {
    // optional field로 추가
    id: number;
  } | null;
};

// SearchMoviesResponse 타입 정의
export type SearchMoviesResponse = {
  data: Movie[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
};

// 에러 케이스를 위한 타입 정의
type SearchMoviesError = {
  data: never[];
  count: number;
  page: null;
  pageSize: null;
  error: PostgrestError;
};

// 성공 케이스를 위한 타입 정의
type SearchMoviesSuccess = {
  data: Movie[];
  page: number;
  pageSize: number;
  hasNextPage: boolean;
};

export async function searchMovies({
  search,
  page,
  pageSize,
}: {
  search: string;
  page: number;
  pageSize: number;
}): Promise<SearchMoviesSuccess> {
  const supabase = await createServerSupabaseClient();

  // 현재 사용자 정보 가져오기
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 타입 안정성을 위해 명시적으로 타입 지정
  //
  const { data, count, error } = await supabase
    .from("movie")
    .select(
      `
      *,
      favorites (
        id
      )
    `,
      { count: "exact" }
    )
    .ilike("title", `%${search}%`)
    .order("favorites.id", { ascending: false, nullsFirst: false }) // searchMovies 함수의 쿼리 수정
    .range((page - 1) * pageSize, page * pageSize - 1);

  const hasNextPage = count ? count > page * pageSize : false;

  if (error) {
    // 에러 발생 시 기본값 반환
    return {
      data: [],
      page,
      pageSize,
      hasNextPage: false,
    };
  }

  // 반환된 데이터를 Movie 타입에 맞게 변환
  const moviesWithFavorites = (data || []).map((movie: any) => ({
    ...movie,
    favorites: movie.favorites?.[0] || null, // favorites 배열의 첫 번째 항목만 사용
  }));

  return {
    data: moviesWithFavorites,
    page,
    pageSize,
    hasNextPage,
  };
}

export async function getMovie(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("movie")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  handleError(error);

  return data;
}
