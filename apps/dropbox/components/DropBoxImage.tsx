"use client";

import { deleteFile } from "@/actions/storageActions";
import {
  FileObject,
  getImageUrl,
  FileNameConverter,
} from "@next-inflearn/supabase";
import { IconButton, Spinner } from "@next-inflearn/ui";
import { queryClient } from "@next-inflearn/ui/lib";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { formatDate } from "@next-inflearn/supabase";

export default function DropboxImage({ image }: { image: FileObject }) {
  // 원본 파일명 복원
  const originalFileName = FileNameConverter.decode(image.name);

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
    },
  });

  return (
    <div className="relative w-full flex flex-col gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-md">
      {/* Image */}
      <div className="overflow-hidden rounded-lg">
        <Image
          src={getImageUrl(image.name)}
          alt={originalFileName}
          width={80}
          height={80}
          className="w-full aspect-square object-fit transition-transform hover:scale-105"
        />
      </div>

      {/* File Info */}
      <div className="flex flex-col gap-1">
        <div
          className="text-sm text-slate-700 truncate"
          title={originalFileName}
        >
          {originalFileName}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">
            {formatDate(image.created_at)}
          </span>
          <IconButton
            onClick={() => deleteFileMutation.mutate(image.name)}
            className="bg-white/80 hover:bg-red-50 text-slate-600 hover:text-red-600 shadow-sm w-6 h-6 p-0 flex items-center justify-center"
          >
            {deleteFileMutation.isPending ? (
              <Spinner className="w-3 h-3" />
            ) : (
              <i className="fas fa-trash text-xs" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
