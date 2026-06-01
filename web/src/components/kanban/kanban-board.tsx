"use client";

import {
  useCallback,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import { updateTaskStatus } from "@/app/actions/tasks";
import type { TaskStatus } from "@/generated/prisma/enums";

import { KANBAN_COLUMNS, TASK_STATUS_SET } from "./constants";
import { KanbanColumnBoard } from "./kanban-column";
import { KanbanTaskCardOverlay } from "./kanban-task-card";
import type { KanbanTask } from "./types";

type KanbanBoardProps = {
  initialTasks: KanbanTask[];
  projectId: string;
  dataSource: "database" | "mock";
};

type OptimisticAction = {
  type: "update-status";
  taskId: string;
  status: TaskStatus;
};

function tasksReducer(
  state: KanbanTask[],
  action: OptimisticAction
): KanbanTask[] {
  if (action.type === "update-status") {
    return state.map((t) =>
      t.id === action.taskId ? { ...t, status: action.status } : t
    );
  }
  return state;
}

function resolveTargetStatus(
  overId: string | number,
  tasks: KanbanTask[]
): TaskStatus | null {
  const id = String(overId);
  if (TASK_STATUS_SET.has(id)) {
    return id as TaskStatus;
  }
  const overTask = tasks.find((t) => t.id === id);
  return overTask?.status ?? null;
}

export function KanbanBoard({
  initialTasks,
  projectId,
  dataSource,
}: KanbanBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticTasks, dispatchOptimistic] = useOptimistic(
    initialTasks,
    tasksReducer
  );
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const tasksByColumn = useMemo(() => {
    const grouped = Object.fromEntries(
      KANBAN_COLUMNS.map((col) => [col.id, [] as KanbanTask[]])
    ) as Record<TaskStatus, KanbanTask[]>;

    for (const task of optimisticTasks) {
      grouped[task.status].push(task);
    }

    return grouped;
  }, [optimisticTasks]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = optimisticTasks.find((t) => t.id === event.active.id);
      setActiveTask(task ?? null);
      setError(null);
    },
    [optimisticTasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const newStatus = resolveTargetStatus(over.id, optimisticTasks);
      if (!newStatus) return;

      const taskId = String(active.id);
      const current = optimisticTasks.find((t) => t.id === taskId);
      if (!current || current.status === newStatus) return;

      if (dataSource === "mock") {
        startTransition(() => {
          dispatchOptimistic({
            type: "update-status",
            taskId,
            status: newStatus,
          });
        });
        return;
      }

      startTransition(async () => {
        setError(null);
        dispatchOptimistic({
          type: "update-status",
          taskId,
          status: newStatus,
        });

        const result = await updateTaskStatus(taskId, newStatus);
        if (!result.success) {
          setError(result.error);
          router.refresh();
        }
      });
    },
    [optimisticTasks, dataSource, dispatchOptimistic, router]
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  return (
    <div className="space-y-4">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div
        className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
        aria-live="polite"
      >
        <span
          className={
            dataSource === "database"
              ? "rounded-full bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200"
          }
        >
          {dataSource === "database" ? "Base de datos" : "Datos locales (mock)"}
        </span>
        {isPending ? <span>Guardando cambios…</span> : null}
        <span className="sr-only">Proyecto {projectId}</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 md:gap-5">
          {KANBAN_COLUMNS.map((column) => (
            <KanbanColumnBoard
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeTask ? <KanbanTaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
