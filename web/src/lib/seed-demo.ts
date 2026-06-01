import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import { DEMO_PROJECT_ID } from "@/lib/constants/project";
import { getPrisma } from "@/lib/prisma";

const DEMO_USERS = [
  {
    id: "user_1",
    email: "ana@demo.local",
    name: "Ana García",
  },
  {
    id: "user_2",
    email: "luis@demo.local",
    name: "Luis Martínez",
  },
  {
    id: "user_3",
    email: "sofia@demo.local",
    name: "Sofía Ruiz",
  },
] as const;

const DEMO_TASKS = [
  {
    id: "task_1",
    title: "Definir alcance del MVP",
    description:
      "Documentar historias de usuario y criterios de aceptación.",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    createdAt: new Date("2026-05-01T10:00:00Z"),
    assignedToId: "user_1" as string | null,
  },
  {
    id: "task_2",
    title: "Diseñar esquema de base de datos",
    description: null,
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date("2026-05-02T14:30:00Z"),
    assignedToId: "user_2",
  },
  {
    id: "task_3",
    title: "Implementar tablero Kanban",
    description: "UI con dnd-kit y tarjetas shadcn.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    createdAt: new Date("2026-05-03T09:15:00Z"),
    assignedToId: "user_1",
  },
  {
    id: "task_4",
    title: "Configurar CI/CD",
    description: null,
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.LOW,
    createdAt: new Date("2026-05-04T11:00:00Z"),
    assignedToId: null,
  },
  {
    id: "task_5",
    title: "Revisión de accesibilidad",
    description: null,
    status: TaskStatus.DONE,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date("2026-04-28T16:45:00Z"),
    assignedToId: "user_3",
  },
  {
    id: "task_6",
    title: "Publicar documentación inicial",
    description: null,
    status: TaskStatus.DONE,
    priority: TaskPriority.LOW,
    createdAt: new Date("2026-04-30T08:20:00Z"),
    assignedToId: "user_2",
  },
] as const;

export async function ensureDemoProject(projectId: string = DEMO_PROJECT_ID) {
  const prisma = getPrisma();
  if (!prisma) return false;

  const existing = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });

  if (existing) return true;

  await prisma.$transaction(async (tx) => {
    await tx.project.create({
      data: {
        id: projectId,
        name: "Proyecto demo",
        description: "Datos de demostración para Mini-Jira",
      },
    });

    for (const user of DEMO_USERS) {
      await tx.user.create({ data: user });
    }

    for (const task of DEMO_TASKS) {
      await tx.task.create({
        data: {
          ...task,
          projectId,
        },
      });
    }
  });

  return true;
}
