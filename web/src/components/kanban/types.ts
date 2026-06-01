import type { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

export type KanbanAssignee = {
  id: string;
  name: string;
  avatar?: string | null;
};

export type KanbanTask = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  assignedTo?: KanbanAssignee | null;
  projectId: string;
};

export type KanbanColumn = {
  id: TaskStatus;
  title: string;
};
