"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";

import { KanbanTaskCard } from "./kanban-task-card";
import type { KanbanColumn, KanbanTask } from "./types";

type KanbanColumnProps = {
  column: KanbanColumn;
  tasks: KanbanTask[];
};

export function KanbanColumnBoard({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", status: column.id },
  });

  return (
    <section
      className="flex min-h-[420px] min-w-[280px] flex-1 flex-col rounded-xl border bg-muted/30"
      aria-label={column.title}
    >
      <header className="flex items-center justify-between border-b bg-card/80 px-4 py-3 backdrop-blur-sm">
        <h2 className="text-sm font-semibold tracking-tight">{column.title}</h2>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {tasks.length}
        </span>
      </header>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 p-3 transition-colors",
          isOver && "bg-primary/5 ring-2 ring-inset ring-primary/20"
        )}
      >
        {tasks.length === 0 ? (
          <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center text-xs text-muted-foreground">
            Arrastra una tarea aquí
          </p>
        ) : (
          tasks.map((task) => <KanbanTaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}
