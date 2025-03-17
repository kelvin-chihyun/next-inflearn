"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/actions/movieActions";
import { ShadSkeleton } from "@next-inflearn/ui";
import { addToFavorites, removeFromFavorites } from "@/actions/favoriteActions";
import { toast } from "sonner";
import { Star, StarOff } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { userAtom, loginModalAtom } from "@/utils/jotai/atoms";
import LoginModal from "./LoginModal";

// MovieCardSkeleton 컴포넌트 추가
export function MovieCardSkeleton() {
  return (
    <div className="col-span-1 relative">
      <ShadSkeleton className="w-full aspect-[2/3]" />{" "}
      {/* 영화 포스터 비율 2:3 */}
    </div>
  );
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const user = useAtomValue(userAtom);
  const [isLoginModalOpen, setIsLoginModalOpen] = useAtom(loginModalAtom);
  // null 체크를 통한 안전한 초기값 설정
  const [isFavorite, setIsFavorite] = useState(() => Boolean(movie?.favorites));
  const [isLoading, setIsLoading] = useState(false);

  // 이미지 URL이 없는 경우를 대비한 fallback 처리
  const imageUrl = movie?.image_url || "https://placehold.co/500";

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(movie.id);
        toast.success("즐겨찾기에서 제거되었습니다.");
      } else {
        await addToFavorites(movie.id);
        toast.success("즐겨찾기에 추가되었습니다.");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      toast.error("로그인이 필요한 기능입니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="col-span-1 relative group">
        {/* Image 부분  */}
        <Image
          src={imageUrl}
          alt={movie?.title || "Movie poster"}
          width={500}
          height={750}
          className="w-full h-auto"
        />
        {/* ,"Follow the mythic journey of Paul Atreides as he unites
        with Chani and the Fremen while on a path of revenge against the
        conspirators who destroyed his family. Facing a choice between the love of
        his life and the fate of the known universe, Paul endeavors to prevent a
        terrible future only he can foresee.",8.3,3437.313,2024-02-27 */}

        {/* Title Dim */}
        <Link href={`/movies/${movie.id}`}>
          <div className="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300">
            <p className="text-xl font-bold text-white">{movie.title}</p>
          </div>
        </Link>

        {/* 즐겨찾기 버튼 */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className={`absolute top-2 right-2 z-20 p-2 rounded-full 
            bg-black/50 opacity-0 group-hover:opacity-100
            hover:bg-black/70 transition-all duration-300
            ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isFavorite ? (
            <Star className="w-5 h-5 text-yellow-400" />
          ) : (
            <StarOff className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
