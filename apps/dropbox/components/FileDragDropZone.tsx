"use client";

import { ShadButton } from "@next-inflearn/ui";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "actions/storageActions";
import { queryClient } from "@next-inflearn/ui/lib";
import { useCallback } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";

export default function FileDragDropZone() {
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
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "파일 업로드에 실패했습니다.", {
        duration: 2000,
      });
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      formData.append("file", acceptedFiles[0] as File); // 첫 번째 파일만 사용
      await uploadImageMutation.mutateAsync(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`w-full py-16 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-6 transition-all ${
        isDragActive
          ? "border-blue-600 bg-blue-50/50"
          : "border-blue-400/50 bg-blue-50/30 hover:border-blue-500/70 hover:bg-blue-50/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        <div className="p-4 bg-blue-100/50 rounded-full">
          <i className="fas fa-cloud-upload-alt text-2xl text-blue-600"></i>
        </div>
        <p className="text-slate-700 font-medium">파일 업로드</p>
        <p className="text-slate-500 text-sm text-center">
          {isDragActive
            ? "파일을 여기에 놓아주세요"
            : "드래그 앤 드롭으로 파일을 업로드하거나\n클릭하여 파일을 선택하세요"}
        </p>
      </div>

      <ShadButton
        disabled={uploadImageMutation.isPending}
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        {uploadImageMutation.isPending ? "업로드 중..." : "업로드"}
      </ShadButton>
    </div>
  );
}
