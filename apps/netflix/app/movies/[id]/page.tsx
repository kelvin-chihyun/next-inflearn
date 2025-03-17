import { getMovie, Movie } from "@/actions/movieActions";
import UI from "./ui";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const movie = await getMovie(params.id);
    return {
      title: movie?.title,
      description: movie?.overview,
      openGraph: {
        images: [movie?.image_url],
      },
    };
  } catch (error) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found",
    };
  }
}

export default async function MovieDetail({
  params,
}: {
  params: { id: string };
}) {
  try {
    const movie = await getMovie(params.id);
    return (
      <main className="py-16 flex items-center bg-blue-50 w-full absolute top-0 bottom-0 left-0 right-0">
        {movie ? <UI movie={movie} /> : <div>Movie does not exists</div>}
      </main>
    );
  } catch (error) {
    notFound();
  }
}
