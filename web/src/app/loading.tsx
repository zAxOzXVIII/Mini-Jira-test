import { KanbanBoardSkeleton } from "@/components/kanban/kanban-skeleton";

export default function Loading() {
  return (
    <div className="min-h-full bg-muted/40">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-6 sm:px-6 lg:px-8">
          <p className="h-3 w-16 animate-pulse rounded bg-muted/70" aria-hidden />
          <div className="h-8 w-52 animate-pulse rounded bg-muted/70 mt-1" aria-hidden />
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <KanbanBoardSkeleton />
      </main>
    </div>
  );
}
