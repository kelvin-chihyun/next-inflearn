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

  const { data, count, error } = await supabase
    .from("movie")
    .select("*", { count: "exact" })
    .like("title", `%${search}%`)
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

  return {
    data: data || [],
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
