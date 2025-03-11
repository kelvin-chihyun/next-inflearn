import { PostgrestError } from "@supabase/supabase-js";
import { StorageError } from "@supabase/storage-js";
import { toast } from "sonner";

export type CustomError = PostgrestError | StorageError | Error;

export const handleError = (error: CustomError | null) => {
  if (!error) return;

  console.error(error);

  // StorageError 체크
  if (
    "name" in error &&
    (error.name === "StorageError" || error.name === "StorageApiError")
  ) {
    const storageError = error as StorageError;
    switch (storageError.name) {
      case "StorageApiError":
        toast.error(`저장소 오류: ${storageError.message}`, { duration: 2000 });
        break;
      case "AuthError":
        toast.error("인증이 필요합니다.", { duration: 2000 });
        break;
      default:
        toast.error(`파일 처리 오류: ${storageError.message}`, {
          duration: 2000,
        });
    }
    throw error;
  }

  // PostgrestError 체크
  if ("code" in error) {
    const dbError = error as PostgrestError;
    switch (dbError.code) {
      case "23505":
        toast.error("중복된 데이터가 존재합니다.", { duration: 2000 });
        break;
      case "42P01":
        toast.error("테이블이 존재하지 않습니다.", { duration: 2000 });
        break;
      case "42501":
        toast.error("접근 권한이 없습니다.", { duration: 2000 });
        break;
      default:
        toast.error(`데이터베이스 오류: ${dbError.message}`, {
          duration: 2000,
        });
    }
    throw error;
  }

  // 일반 Error
  toast.error(error.message || "알 수 없는 오류가 발생했습니다.", {
    duration: 2000,
  });
  throw error;
};
