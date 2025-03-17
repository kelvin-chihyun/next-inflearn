"use client";

import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/actions/movieActions";
import { ShadSkeleton } from "@next-inflearn/ui";

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
  return (
    <div className="col-span-1 relative">
      {/* Image 부분  */}
      <Image src={movie.image_url} alt="Movie Image" width={500} height={750} />
      {/* ,"Follow the mythic journey of Paul Atreides as he unites
      with Chani and the Fremen while on a path of revenge against the
      conspirators who destroyed his family. Facing a choice between the love of
      his life and the fate of the known universe, Paul endeavors to prevent a
      terrible future only he can foresee.",8.3,3437.313,2024-02-27 */}

      {/* Title Dim */}
      <Link href={`/movies/${movie.id}`}>
        <div className="absolute flex items-center justify-center top-0 bottom-0 left-0 right-0 z-10 bg-black opacity-0 hover:opacity-80 transition-opacity duration-300">
          <p className="text-xl font-bold text-white">{movie.title}</p>
        </div>
      </Link>
    </div>
  );
}
