import { z } from "zod";

import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

const taskStatusSchema = z.enum([
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.DONE,
]);

const taskPrioritySchema = z.enum([
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
]);

export const getTasksSchema = z.object({
  projectId: z.string().min(1, "projectId es obligatorio"),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1, "taskId es obligatorio"),
  newStatus: taskStatusSchema,
});

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(200),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  priority: taskPrioritySchema.default(TaskPriority.MEDIUM),
  projectId: z.string().min(1, "projectId es obligatorio"),
  assignedToId: z.string().min(1).optional(),
  status: taskStatusSchema.default(TaskStatus.TODO),
});

/** Formulario del modal (mismas reglas que `createTask` en el servidor). */
export const createTaskFormSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(200),
  description: z
    .string()
    .trim()
    .max(2000, "Máximo 2000 caracteres")
    .optional(),
  priority: taskPrioritySchema,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type CreateTaskFormValues = z.infer<typeof createTaskFormSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
