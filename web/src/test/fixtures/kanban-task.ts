import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import type { KanbanTask } from "@/components/kanban/types";

export function makeKanbanTask(
  overrides: Partial<KanbanTask> = {}
): KanbanTask {
  return {
    id: "task-test-1",
    title: "Tarea de prueba",
    description: null,
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    createdAt: "2026-01-01T12:00:00.000Z",
    projectId: "proj_demo",
    assignedTo: null,
    ...overrides,
  };
}
