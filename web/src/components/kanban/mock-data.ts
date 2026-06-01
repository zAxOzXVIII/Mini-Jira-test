import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import { DEMO_PROJECT_ID } from "@/lib/constants/project";

import type { KanbanTask } from "./types";

export { DEMO_PROJECT_ID };

export const MOCK_KANBAN_TASKS: KanbanTask[] = [
  {
    id: "task_1",
    title: "Definir alcance del MVP",
    description: "Documentar historias de usuario y criterios de aceptación.",
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    createdAt: "2026-05-01T10:00:00.000Z",
    projectId: DEMO_PROJECT_ID,
    assignedTo: { id: "user_1", name: "Ana García" },
  },
  {
    id: "task_2",
    title: "Diseñar esquema de base de datos",
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    createdAt: "2026-05-02T14:30:00.000Z",
    projectId: DEMO_PROJECT_ID,
    assignedTo: { id: "user_2", name: "Luis Martínez" },
  },
  {
    id: "task_3",
    title: "Implementar tablero Kanban",
    description: "UI con dnd-kit y tarjetas shadcn.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    createdAt: "2026-05-03T09:15:00.000Z",
    projectId: DEMO_PROJECT_ID,
    assignedTo: { id: "user_1", name: "Ana García" },
  },
  {
    id: "task_4",
    title: "Configurar CI/CD",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.LOW,
    createdAt: "2026-05-04T11:00:00.000Z",
    projectId: DEMO_PROJECT_ID,
  },
  {
    id: "task_5",
    title: "Revisión de accesibilidad",
    status: TaskStatus.DONE,
    priority: TaskPriority.MEDIUM,
    createdAt: "2026-04-28T16:45:00.000Z",
    projectId: DEMO_PROJECT_ID,
    assignedTo: { id: "user_3", name: "Sofía Ruiz" },
  },
  {
    id: "task_6",
    title: "Publicar documentación inicial",
    status: TaskStatus.DONE,
    priority: TaskPriority.LOW,
    createdAt: "2026-04-30T08:20:00.000Z",
    projectId: DEMO_PROJECT_ID,
    assignedTo: { id: "user_2", name: "Luis Martínez" },
  },
];
