import { describe, expect, it } from "vitest";

import { TaskPriority, TaskStatus } from "@/generated/prisma/enums";
import { makeKanbanTask } from "@/test/fixtures/kanban-task";

import {
  filterTasks,
  groupTasksByColumn,
  hasActiveKanbanFilters,
  resolveTargetStatus,
  tasksReducer,
} from "./kanban-utils";

describe("filterTasks", () => {
  const tasks = [
    makeKanbanTask({ id: "1", title: "Implementar login", priority: TaskPriority.HIGH }),
    makeKanbanTask({ id: "2", title: "Diseñar base de datos", priority: TaskPriority.LOW }),
    makeKanbanTask({ id: "3", title: "Revisar login OAuth", priority: TaskPriority.HIGH, status: TaskStatus.DONE }),
  ];

  it("devuelve todas las tareas sin filtros", () => {
    expect(filterTasks(tasks, "", "ALL")).toHaveLength(3);
  });

  it("filtra por título sin distinguir mayúsculas", () => {
    expect(filterTasks(tasks, "login", "ALL")).toHaveLength(2);
    expect(filterTasks(tasks, "LOGIN", "ALL")).toHaveLength(2);
  });

  it("filtra por prioridad", () => {
    expect(filterTasks(tasks, "", TaskPriority.HIGH)).toHaveLength(2);
    expect(filterTasks(tasks, "", TaskPriority.LOW)).toHaveLength(1);
  });

  it("combina búsqueda y prioridad", () => {
    expect(filterTasks(tasks, "login", TaskPriority.HIGH)).toHaveLength(2);
    expect(filterTasks(tasks, "base", TaskPriority.HIGH)).toHaveLength(0);
  });

  it("ignora espacios en la búsqueda", () => {
    expect(filterTasks(tasks, "  login  ", "ALL")).toHaveLength(2);
  });
});

describe("resolveTargetStatus", () => {
  const tasks = [
    makeKanbanTask({ id: "a", status: TaskStatus.TODO }),
    makeKanbanTask({ id: "b", status: TaskStatus.IN_PROGRESS }),
  ];

  it("resuelve el id de columna directamente", () => {
    expect(resolveTargetStatus(TaskStatus.DONE, tasks)).toBe(TaskStatus.DONE);
  });

  it("resuelve el estado de la tarea sobre la que se suelta", () => {
    expect(resolveTargetStatus("b", tasks)).toBe(TaskStatus.IN_PROGRESS);
  });

  it("devuelve null si el destino no es válido", () => {
    expect(resolveTargetStatus("desconocido", tasks)).toBeNull();
  });
});

describe("tasksReducer", () => {
  const tasks = [
    makeKanbanTask({ id: "1", status: TaskStatus.TODO }),
    makeKanbanTask({ id: "2", status: TaskStatus.TODO }),
  ];

  it("actualiza el estado de una tarea", () => {
    const next = tasksReducer(tasks, {
      type: "update-status",
      taskId: "1",
      status: TaskStatus.DONE,
    });
    expect(next.find((t) => t.id === "1")?.status).toBe(TaskStatus.DONE);
    expect(next.find((t) => t.id === "2")?.status).toBe(TaskStatus.TODO);
  });

  it("añade una tarea al final", () => {
    const newTask = makeKanbanTask({ id: "3", title: "Nueva" });
    const next = tasksReducer(tasks, { type: "add", task: newTask });
    expect(next).toHaveLength(3);
    expect(next[2].title).toBe("Nueva");
  });
});

describe("groupTasksByColumn", () => {
  it("agrupa tareas por columna", () => {
    const grouped = groupTasksByColumn([
      makeKanbanTask({ id: "1", status: TaskStatus.TODO }),
      makeKanbanTask({ id: "2", status: TaskStatus.DONE }),
      makeKanbanTask({ id: "3", status: TaskStatus.TODO }),
    ]);
    expect(grouped[TaskStatus.TODO]).toHaveLength(2);
    expect(grouped[TaskStatus.DONE]).toHaveLength(1);
    expect(grouped[TaskStatus.IN_PROGRESS]).toHaveLength(0);
  });
});

describe("hasActiveKanbanFilters", () => {
  it("detecta búsqueda o filtro activos", () => {
    expect(hasActiveKanbanFilters("", "ALL")).toBe(false);
    expect(hasActiveKanbanFilters("x", "ALL")).toBe(true);
    expect(hasActiveKanbanFilters("", TaskPriority.HIGH)).toBe(true);
    expect(hasActiveKanbanFilters("  ", "ALL")).toBe(false);
  });
});
