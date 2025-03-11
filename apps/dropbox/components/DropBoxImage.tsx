"use client";

import {
  FileObject,
  getImageUrl,
  FileNameConverter,
} from "@next-inflearn/supabase";
import { IconButton } from "@next-inflearn/ui";
import Image from "next/image";

export default function DropboxImage({ image }: { image: FileObject }) {
  // 원본 파일명 복원
  const originalFileName = FileNameConverter.decode(image.name);

  return (
    <div className="relative w-full flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="overflow-hidden rounded-lg">
        <Image
          src={getImageUrl(image.name)}
          alt={originalFileName}
          width={80}
          height={80}
          className="w-full aspect-square object-cover transition-transform hover:scale-105"
        />
      </div>

      {/* FileName - 원본 파일명 표시 */}
      <div className="text-sm text-slate-700 truncate" title={originalFileName}>
        {originalFileName}
      </div>

      <div className="absolute top-3 right-3">
        <IconButton
          onClick={() => {}}
          className="bg-white/80 hover:bg-red-50 text-slate-600 hover:text-red-600 shadow-sm"
          size="sm"
        >
          <i className="fas fa-trash text-sm" />
        </IconButton>
      </div>
    </div>
  );
}
