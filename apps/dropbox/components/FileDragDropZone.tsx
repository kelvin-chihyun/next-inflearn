"use client";

import { ShadButton } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "actions/storageActions";
import { queryClient } from "@next-inflearn/ui/lib";
import { useRef } from "react";
import { toast } from "sonner";

export default function FileDragDropZone() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const uploadImageMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      if (data) {
        toast.success("파일이 성공적으로 업로드되었습니다.", {
          duration: 2000,
        });
        queryClient.invalidateQueries({
          queryKey: ["images"],
        });
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "파일 업로드에 실패했습니다.", {
        duration: 2000,
      });
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) {
          toast.error("파일을 선택해주세요.", { duration: 2000 });
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        await uploadImageMutation.mutateAsync(formData);
      }}
      className="w-full py-16 border-2 border-dashed border-blue-400/50 bg-blue-50/30 rounded-xl flex flex-col items-center justify-center gap-6 transition-all hover:border-blue-500/70 hover:bg-blue-50/50"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 bg-blue-100/50 rounded-full">
          <i className="fas fa-cloud-upload-alt text-2xl text-blue-600"></i>
        </div>
        <p className="text-slate-700 font-medium">파일 업로드</p>
        <p className="text-slate-500 text-sm text-center">
          드래그 앤 드롭으로 파일을 업로드하거나
          <br />
          아래 버튼을 클릭하세요
        </p>
      </div>

      <div className="relative">
        <input
          ref={fileRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <ShadButton
          type="button"
          className="bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm"
        >
          파일 선택
        </ShadButton>
      </div>

      <ShadButton
        disabled={uploadImageMutation.isPending}
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        {uploadImageMutation.isPending ? "업로드 중..." : "업로드"}
      </ShadButton>
    </form>
  );
}
