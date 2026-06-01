import { describe, expect, it } from "vitest";

import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";

import {
  createTaskFormSchema,
  createTaskSchema,
  getTasksSchema,
  updateTaskStatusSchema,
} from "./task";

describe("getTasksSchema", () => {
  it("acepta projectId válido", () => {
    const result = getTasksSchema.safeParse({ projectId: "proj_demo" });
    expect(result.success).toBe(true);
  });

  it("rechaza projectId vacío", () => {
    const result = getTasksSchema.safeParse({ projectId: "" });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskStatusSchema", () => {
  it("acepta cambio de estado válido", () => {
    const result = updateTaskStatusSchema.safeParse({
      taskId: "task_1",
      newStatus: TaskStatus.IN_PROGRESS,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza estados inválidos", () => {
    const result = updateTaskStatusSchema.safeParse({
      taskId: "task_1",
      newStatus: "INVALID",
    });
    expect(result.success).toBe(false);
  });
});

describe("createTaskSchema", () => {
  it("acepta payload completo", () => {
    const result = createTaskSchema.safeParse({
      title: "Nueva tarea",
      description: "Detalle",
      priority: TaskPriority.HIGH,
      projectId: "proj_demo",
      status: TaskStatus.TODO,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza título vacío", () => {
    const result = createTaskSchema.safeParse({
      title: "   ",
      projectId: "proj_demo",
    });
    expect(result.success).toBe(false);
  });

  it("aplica prioridad MEDIA por defecto", () => {
    const result = createTaskSchema.safeParse({
      title: "Solo título",
      projectId: "proj_demo",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe(TaskPriority.MEDIUM);
    }
  });
});

describe("createTaskFormSchema", () => {
  it("acepta formulario mínimo del modal", () => {
    const result = createTaskFormSchema.safeParse({
      title: "Tarea desde modal",
      priority: TaskPriority.LOW,
    });
    expect(result.success).toBe(true);
  });

  it("rechaza título mayor a 200 caracteres", () => {
    const result = createTaskFormSchema.safeParse({
      title: "a".repeat(201),
      priority: TaskPriority.MEDIUM,
    });
    expect(result.success).toBe(false);
  });
});
