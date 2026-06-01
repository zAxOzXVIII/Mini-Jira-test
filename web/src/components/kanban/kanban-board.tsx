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
import { toast } from "sonner";

import { createTask, updateTaskStatus } from "@/app/actions/tasks";
import { TaskStatus, type TaskStatus as TaskStatusType } from "@/generated/prisma/enums";
import type { CreateTaskFormValues } from "@/lib/validations/task";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { KANBAN_COLUMNS, TASK_STATUS_SET } from "./constants";
import {
  KanbanFilterEmptyState,
  KanbanToolbar,
  type PriorityFilter,
} from "./kanban-toolbar";
import { KanbanColumnBoard } from "./kanban-column";
import { KanbanTaskCardOverlay } from "./kanban-task-card";
import type { KanbanTask } from "./types";

type KanbanBoardProps = {
  initialTasks: KanbanTask[];
  projectId: string;
  dataSource: "database" | "mock";
};

type OptimisticAction =
  | { type: "update-status"; taskId: string; status: TaskStatusType }
  | { type: "add"; task: KanbanTask };

function tasksReducer(state: KanbanTask[], action: OptimisticAction): KanbanTask[] {
  switch (action.type) {
    case "update-status":
      return state.map((t) =>
        t.id === action.taskId ? { ...t, status: action.status } : t
      );
    case "add":
      return [...state, action.task];
    default:
      return state;
  }
}

function resolveTargetStatus(
  overId: string | number,
  tasks: KanbanTask[]
): TaskStatusType | null {
  const id = String(overId);
  if (TASK_STATUS_SET.has(id)) {
    return id as TaskStatusType;
  }
  const overTask = tasks.find((t) => t.id === id);
  return overTask?.status ?? null;
}

const COLUMN_LABELS: Record<TaskStatusType, string> = {
  [TaskStatus.TODO]: "Por hacer",
  [TaskStatus.IN_PROGRESS]: "En progreso",
  [TaskStatus.DONE]: "Hecho",
};

function filterTasks(
  tasks: KanbanTask[],
  search: string,
  priorityFilter: PriorityFilter
): KanbanTask[] {
  const query = search.trim().toLowerCase();
  return tasks.filter((task) => {
    const matchesSearch =
      query === "" || task.title.toLowerCase().includes(query);
    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });
}

export function KanbanBoard({
  initialTasks,
  projectId,
  dataSource,
}: KanbanBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const reducedMotion = useReducedMotion();
  const [optimisticTasks, dispatchOptimistic] = useOptimistic(
    initialTasks,
    tasksReducer
  );
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [isCreating, setIsCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const filteredTasks = useMemo(
    () => filterTasks(optimisticTasks, search, priorityFilter),
    [optimisticTasks, search, priorityFilter]
  );

  const tasksByColumn = useMemo(() => {
    const grouped = Object.fromEntries(
      KANBAN_COLUMNS.map((col) => [col.id, [] as KanbanTask[]])
    ) as Record<TaskStatusType, KanbanTask[]>;

    for (const task of filteredTasks) {
      grouped[task.status].push(task);
    }

    return grouped;
  }, [filteredTasks]);

  const hasActiveFilters = search.trim() !== "" || priorityFilter !== "ALL";
  const showFilterEmpty =
    hasActiveFilters && filteredTasks.length === 0 && optimisticTasks.length > 0;

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setPriorityFilter("ALL");
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = optimisticTasks.find((t) => t.id === event.active.id);
      setActiveTask(task ?? null);
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

      const toastId = toast.loading(`Moviendo a "${COLUMN_LABELS[newStatus]}"…`);

      if (dataSource === "mock") {
        startTransition(() => {
          dispatchOptimistic({ type: "update-status", taskId, status: newStatus });
        });
        toast.success(`Movida a "${COLUMN_LABELS[newStatus]}"`, { id: toastId });
        return;
      }

      startTransition(async () => {
        dispatchOptimistic({ type: "update-status", taskId, status: newStatus });

        const result = await updateTaskStatus(taskId, newStatus);
        if (result.success) {
          toast.success(`Movida a "${COLUMN_LABELS[newStatus]}"`, { id: toastId });
        } else {
          toast.error(result.error, { id: toastId });
          router.refresh();
        }
      });
    },
    [optimisticTasks, dataSource, dispatchOptimistic, router]
  );

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  const handleCreateTask = useCallback(
    async (values: CreateTaskFormValues): Promise<boolean> => {
      const payload = {
        title: values.title,
        description: values.description?.trim() || undefined,
        priority: values.priority,
        projectId,
        status: TaskStatus.TODO,
      };

      const optimisticTask: KanbanTask = {
        id: `temp-${crypto.randomUUID()}`,
        title: payload.title,
        description: payload.description ?? null,
        status: TaskStatus.TODO,
        priority: payload.priority,
        createdAt: new Date().toISOString(),
        projectId,
        assignedTo: null,
      };

      if (dataSource === "mock") {
        startTransition(() => {
          dispatchOptimistic({
            type: "add",
            task: { ...optimisticTask, id: `mock-${crypto.randomUUID()}` },
          });
        });
        toast.success(`Tarea "${payload.title}" creada`);
        return true;
      }

      setIsCreating(true);
      return new Promise((resolve) => {
        startTransition(async () => {
          dispatchOptimistic({ type: "add", task: optimisticTask });

          const result = await createTask(payload);
          setIsCreating(false);

          if (result.success) {
            toast.success(`Tarea "${result.data.title}" creada`);
            router.refresh();
            resolve(true);
          } else {
            toast.error(result.error);
            router.refresh();
            resolve(false);
          }
        });
      });
    },
    [projectId, dataSource, dispatchOptimistic, router]
  );

  return (
    <div className="space-y-4">
      <KanbanToolbar
        search={search}
        onSearchChange={setSearch}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        onCreateTask={handleCreateTask}
        isCreating={isCreating}
      />

      <div
        className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
        aria-live="polite"
        aria-atomic="false"
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
        {isPending ? <span>Guardando…</span> : null}
        <span>
          {filteredTasks.length} de {optimisticTasks.length} tareas visibles
        </span>
        <span className="sr-only">Proyecto {projectId}</span>
      </div>

      {showFilterEmpty ? (
        <KanbanFilterEmptyState onClear={handleClearFilters} />
      ) : null}

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
              hasActiveFilters={hasActiveFilters}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={
            reducedMotion ? null : { duration: 200, easing: "ease" }
          }
        >
          {activeTask ? <KanbanTaskCardOverlay task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
