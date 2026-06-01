"use server";

import { revalidatePath } from "next/cache";

import {
  createTaskSchema,
  getTasksSchema,
  updateTaskStatusSchema,
  type CreateTaskInput,
} from "@/lib/validations/task";
import { mapTaskToKanban } from "@/lib/tasks/map-kanban-task";
import { ensureDemoProject } from "@/lib/seed-demo";
import { getPrisma } from "@/lib/prisma";

import type { KanbanTask } from "@/components/kanban/types";
import type { TaskStatus } from "@/generated/prisma/enums";

export type TaskActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

const taskInclude = {
  assignedTo: {
    select: { id: true, name: true, avatar: true },
  },
} as const;

export async function getTasks(
  projectId: string
): Promise<TaskActionResult<KanbanTask[]>> {
  const parsed = getTasksSchema.safeParse({ projectId });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return {
      success: false,
      error: "DATABASE_URL no configurada. Usando datos locales de demostración.",
    };
  }

  try {
    await ensureDemoProject(parsed.data.projectId);

    const tasks = await prisma.task.findMany({
      where: { projectId: parsed.data.projectId },
      include: taskInclude,
      orderBy: { createdAt: "asc" },
    });

    return {
      success: true,
      data: tasks.map(mapTaskToKanban),
    };
  } catch (error) {
    console.error("[getTasks]", error);
    return {
      success: false,
      error: "No se pudieron cargar las tareas desde la base de datos.",
    };
  }
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus
): Promise<TaskActionResult<KanbanTask>> {
  const parsed = updateTaskStatusSchema.safeParse({ taskId, newStatus });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return { success: false, error: "Base de datos no disponible." };
  }

  try {
    const task = await prisma.task.update({
      where: { id: parsed.data.taskId },
      data: { status: parsed.data.newStatus },
      include: taskInclude,
    });

    revalidatePath("/");

    return { success: true, data: mapTaskToKanban(task) };
  } catch (error) {
    console.error("[updateTaskStatus]", error);
    return {
      success: false,
      error: "No se pudo actualizar el estado de la tarea.",
    };
  }
}

export async function createTask(
  input: CreateTaskInput
): Promise<TaskActionResult<KanbanTask>> {
  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const prisma = getPrisma();
  if (!prisma) {
    return { success: false, error: "Base de datos no disponible." };
  }

  try {
    await ensureDemoProject(parsed.data.projectId);

    const task = await prisma.task.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description ?? null,
        priority: parsed.data.priority,
        status: parsed.data.status,
        projectId: parsed.data.projectId,
        assignedToId: parsed.data.assignedToId ?? null,
      },
      include: taskInclude,
    });

    revalidatePath("/");

    return { success: true, data: mapTaskToKanban(task) };
  } catch (error) {
    console.error("[createTask]", error);
    return {
      success: false,
      error: "No se pudo crear la tarea.",
    };
  }
}
