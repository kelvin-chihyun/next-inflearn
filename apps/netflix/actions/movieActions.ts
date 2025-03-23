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

  // 기본 쿼리 설정
  let query = supabase
    .from("movie")
    .select(
      user
        ? `
        *,
        favorites!left (
          id
        )
      `
        : "*", // 로그인하지 않은 경우 favorites 정보를 가져오지 않음
      { count: "exact" }
    )
    .ilike("title", `%${search}%`)
    .order("popularity", { ascending: false });

  // 로그인한 경우에만 favorites 필터링 추가
  if (user) {
    query = query.eq("favorites.user_id", user.id);
  }

  const { data, count, error } = await query.range(
    (page - 1) * pageSize,
    page * pageSize - 1
  );

  const hasNextPage = count ? count > page * pageSize : false;

  if (error) {
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
    favorites: user ? movie.favorites?.[0] || null : null,
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
