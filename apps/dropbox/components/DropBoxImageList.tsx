"use client";

import DropBoxImage from "./DropBoxImage";

export default function DropBoxImageList() {
  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2">
      <DropBoxImage />
      <DropBoxImage />
      <DropBoxImage />
      <DropBoxImage />
    </section>
  );
}
