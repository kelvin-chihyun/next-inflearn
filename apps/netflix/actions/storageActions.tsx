"use server";

import {
  createServerSupabaseClient,
  CustomError,
  handleError,
  type FileObject,
  FileNameConverter,
} from "@next-inflearn/supabase";

export async function uploadFile(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient();
    const file = formData.get("file") as File;

    if (!file) {
      throw new Error("파일을 선택해주세요.");
    }

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
      .upload(file.name, file, { upsert: true });

    if (error) {
      handleError(error);
      return null;
    }

    return data;
  } catch (error: unknown) {
    handleError(error as CustomError);
    return null;
  }
}

export async function searchFiles(
  search: string = ""
): Promise<FileObject[] | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
      .list(undefined, {
        search,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      handleError(error);
      return null;
    }

    return data;
  } catch (error: unknown) {
    handleError(error as CustomError);
    return null;
  }
}

export async function deleteFile(
  fileName: string
): Promise<FileObject[] | null> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
      .remove([fileName]);

    if (error) {
      handleError(error);
      return null;
    }

    return data;
  } catch (error: unknown) {
    handleError(error as CustomError);
    return null;
  }
}
