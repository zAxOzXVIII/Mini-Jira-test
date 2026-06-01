import { TaskStatus, type TaskStatus as TaskStatusType } from "@/generated/prisma/enums";

import { TASK_STATUS_SET } from "@/components/kanban/constants";
import type { PriorityFilter } from "@/components/kanban/kanban-toolbar";
import type { KanbanTask } from "@/components/kanban/types";

export type OptimisticAction =
  | { type: "update-status"; taskId: string; status: TaskStatusType }
  | { type: "add"; task: KanbanTask };

export const COLUMN_LABELS: Record<TaskStatusType, string> = {
  [TaskStatus.TODO]: "Por hacer",
  [TaskStatus.IN_PROGRESS]: "En progreso",
  [TaskStatus.DONE]: "Hecho",
};

export function tasksReducer(
  state: KanbanTask[],
  action: OptimisticAction
): KanbanTask[] {
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

export function resolveTargetStatus(
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

export function filterTasks(
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

export function hasActiveKanbanFilters(
  search: string,
  priorityFilter: PriorityFilter
): boolean {
  return search.trim() !== "" || priorityFilter !== "ALL";
}

export function groupTasksByColumn(
  tasks: KanbanTask[]
): Record<TaskStatusType, KanbanTask[]> {
  const grouped = {
    [TaskStatus.TODO]: [] as KanbanTask[],
    [TaskStatus.IN_PROGRESS]: [] as KanbanTask[],
    [TaskStatus.DONE]: [] as KanbanTask[],
  };

  for (const task of tasks) {
    grouped[task.status].push(task);
  }

  return grouped;
}
