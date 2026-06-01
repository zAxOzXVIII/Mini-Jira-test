import type { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import type { KanbanTask } from "@/components/kanban/types";

export type TaskWithAssignee = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  projectId: string;
  assignedTo: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
};

export function mapTaskToKanban(task: TaskWithAssignee): KanbanTask {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    createdAt: task.createdAt.toISOString(),
    projectId: task.projectId,
    assignedTo: task.assignedTo
      ? {
          id: task.assignedTo.id,
          name: task.assignedTo.name,
          avatar: task.assignedTo.avatar,
        }
      : null,
  };
}
