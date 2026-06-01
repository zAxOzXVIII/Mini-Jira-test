"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { TaskPriorityBadge } from "./task-priority-badge";
import type { KanbanTask } from "./types";

type KanbanTaskCardProps = {
  task: KanbanTask;
  isDragging?: boolean;
};

export function KanbanTaskCard({ task, isDragging }: KanbanTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingSelf } =
    useDraggable({
      id: task.id,
      data: { type: "task", task },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const dragging = isDragging ?? isDraggingSelf;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none",
        dragging && "opacity-40"
      )}
      {...listeners}
      {...attributes}
    >
    <Card
      size="sm"
      className={cn(
        "cursor-grab shadow-sm transition-shadow active:cursor-grabbing",
        dragging && "ring-2 ring-primary/30"
      )}
    >
      <CardHeader className="gap-2 pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-sm leading-snug">
            {task.title}
          </CardTitle>
          <TaskPriorityBadge priority={task.priority} className="shrink-0" />
        </div>
        {task.description ? (
          <CardDescription className="line-clamp-2 text-xs">
            {task.description}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardFooter className="border-0 bg-transparent px-4 pt-0 pb-3">
        {task.assignedTo ? (
          <p className="truncate text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {task.assignedTo.name}
            </span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">Sin asignar</p>
        )}
      </CardFooter>
    </Card>
    </div>
  );
}

export function KanbanTaskCardOverlay({ task }: { task: KanbanTask }) {
  return (
    <Card size="sm" className="w-[280px] rotate-2 shadow-lg ring-2 ring-primary/20">
      <CardHeader className="gap-2 pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-sm">{task.title}</CardTitle>
          <TaskPriorityBadge priority={task.priority} className="shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 pb-3">
        {task.assignedTo ? (
          <p className="text-xs text-muted-foreground">{task.assignedTo.name}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
