import { TaskStatus } from "@/generated/prisma/enums";

import type { KanbanColumn } from "./types";

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: TaskStatus.TODO, title: "Por hacer" },
  { id: TaskStatus.IN_PROGRESS, title: "En progreso" },
  { id: TaskStatus.DONE, title: "Hecho" },
];

export const TASK_STATUS_SET = new Set<string>([
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
]);
