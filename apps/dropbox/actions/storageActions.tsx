"use server";

import {
  createServerSupabaseClient,
  PostgrestError,
  StorageError,
  FileObject,
} from "@next-inflearn/supabase";

function handleError(error: PostgrestError | StorageError | null) {
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function uploadFile(formData: FormData) {
  const supabase = await createServerSupabaseClient();
  const file = formData.get("file") as File;

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
    .upload(file.name, file, { upsert: true });

  handleError(error);

  return data;
}

export async function searchFiles(
  search: string = ""
): Promise<FileObject[] | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET as string)
    .list(undefined, {
      search,
      sortBy: { column: "name", order: "asc" },
    });

  handleError(error);

  return data;
}
