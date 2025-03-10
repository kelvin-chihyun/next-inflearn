"use client";

import { useQuery } from "@tanstack/react-query";
import DropBoxImage from "./DropBoxImage";
import { Spinner } from "@next-inflearn/ui";
import { searchFiles } from "@/actions/storageActions";
export default function DropBoxImageList({
  searchInput,
}: {
  searchInput: string;
}) {
  const searchImagesQuery = useQuery({
    queryKey: ["images", searchInput],
    queryFn: () => searchFiles(searchInput),
  });
  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2">
      {searchImagesQuery.isLoading && <Spinner />}
      {searchImagesQuery.data &&
        searchImagesQuery.data.map((image) => (
          <DropBoxImage key={image.id} image={image} />
        ))}
    </section>
  );
}
