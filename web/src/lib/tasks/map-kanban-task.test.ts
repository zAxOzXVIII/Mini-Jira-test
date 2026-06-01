import { describe, expect, it } from "vitest";

import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import { mapTaskToKanban } from "./map-kanban-task";

describe("mapTaskToKanban", () => {
  it("mapea campos y serializa createdAt", () => {
    const createdAt = new Date("2026-03-15T10:30:00.000Z");
    const result = mapTaskToKanban({
      id: "task_1",
      title: "Mi tarea",
      description: "Descripción",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      createdAt,
      projectId: "proj_demo",
      assignedTo: {
        id: "user_1",
        name: "Ana",
        avatar: null,
      },
    });

    expect(result).toEqual({
      id: "task_1",
      title: "Mi tarea",
      description: "Descripción",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      createdAt: createdAt.toISOString(),
      projectId: "proj_demo",
      assignedTo: { id: "user_1", name: "Ana", avatar: null },
    });
  });

  it("deja assignedTo en null si no hay asignado", () => {
    const result = mapTaskToKanban({
      id: "task_2",
      title: "Sin asignar",
      description: null,
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      createdAt: new Date(),
      projectId: "proj_demo",
      assignedTo: null,
    });

    expect(result.assignedTo).toBeNull();
  });
});
