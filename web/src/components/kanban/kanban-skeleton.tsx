import { cn } from "@/lib/utils";

const SKELETON_COLUMNS = [
  { title: "Por hacer", cards: 2 },
  { title: "En progreso", cards: 3 },
  { title: "Hecho", cards: 1 },
];

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/70 dark:bg-muted/40",
        className
      )}
      aria-hidden
    />
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <SkeletonPulse className="h-4 w-3/4" />
        <SkeletonPulse className="h-5 w-12 shrink-0 rounded-full" />
      </div>
      <SkeletonPulse className="h-3 w-full" />
      <SkeletonPulse className="h-3 w-1/2" />
      <div className="pt-1">
        <SkeletonPulse className="h-3 w-1/3" />
      </div>
    </div>
  );
}

function SkeletonColumn({
  title,
  cards,
}: {
  title: string;
  cards: number;
}) {
  return (
    <section
      className="flex min-h-[420px] min-w-[280px] flex-1 flex-col rounded-xl border bg-muted/30"
      aria-label={`Cargando columna ${title}`}
    >
      <header className="flex items-center justify-between border-b bg-card/80 px-4 py-3">
        <SkeletonPulse className="h-4 w-24" />
        <SkeletonPulse className="h-5 w-7 rounded-full" />
      </header>
      <div className="flex flex-1 flex-col gap-3 p-3">
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

function SkeletonToolbar() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <SkeletonPulse className="h-8 w-full sm:max-w-sm" />
        <SkeletonPulse className="h-8 w-full sm:w-[200px]" />
      </div>
      <SkeletonPulse className="h-8 w-full sm:w-32" />
    </div>
  );
}

export function KanbanBoardSkeleton() {
  return (
    <div className="space-y-4" aria-label="Cargando tablero…" aria-busy="true">
      <SkeletonToolbar />
      <div className="flex gap-4 overflow-x-hidden pb-4 md:gap-5">
        {SKELETON_COLUMNS.map((col) => (
          <SkeletonColumn key={col.title} title={col.title} cards={col.cards} />
        ))}
      </div>
    </div>
  );
}
