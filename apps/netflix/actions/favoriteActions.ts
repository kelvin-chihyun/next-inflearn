"use server";

import { createServerSupabaseClient } from "@next-inflearn/supabase";

// 즐겨찾기 추가
export async function addToFavorites(movieId: number) {
  const supabase = await createServerSupabaseClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: user.id, movie_id: movieId });

  if (error) throw error;
}

// 즐겨찾기 제거
export async function removeFromFavorites(movieId: number) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ user_id: user.id, movie_id: movieId });

  if (error) throw error;
}

// 즐겨찾기 상태 확인
export async function isFavorite(movieId: number) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .match({ user_id: user.id, movie_id: movieId })
    .single();

  return !!data;
}
