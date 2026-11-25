type Photo = { src: string; alt: string };

// Three photos at once: the first stands tall on the left, the other two stack
// on the right. Crops keep each face in frame.
const CELLS = [
  { cls: "row-span-2", pos: "50% 30%" },
  { cls: "", pos: "50% 20%" },
  { cls: "", pos: "50% 15%" },
];

export default function PhotoMosaic({ photos }: { photos: Photo[] }) {
  return (
    <div className="mx-auto grid aspect-[4/5] w-full max-w-md grid-cols-2 grid-rows-2 gap-3">
      {photos.slice(0, 3).map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          alt={p.alt}
          loading="lazy"
          className={`h-full w-full rounded-2xl object-cover ${CELLS[i].cls}`}
          style={{ objectPosition: CELLS[i].pos }}
        />
      ))}
    </div>
  );
}
