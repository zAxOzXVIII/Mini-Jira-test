"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

import type { TaskStatus } from "@/generated/prisma/enums";

import { KANBAN_COLUMNS, TASK_STATUS_SET } from "./constants";
import { KanbanColumnBoard } from "./kanban-column";
import { KanbanTaskCardOverlay } from "./kanban-task-card";
import { MOCK_KANBAN_TASKS } from "./mock-data";
import type { KanbanTask } from "./types";

function resolveTargetStatus(
  overId: string | number,
  tasks: KanbanTask[]
): TaskStatus | null {
  const id = String(overId);
  if (TASK_STATUS_SET.has(id)) {
    return id as TaskStatus;
  }
  const overTask = tasks.find((t) => t.id === id);
  return overTask?.status ?? null;
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanTask[]>(MOCK_KANBAN_TASKS);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const tasksByColumn = useMemo(() => {
    const grouped = Object.fromEntries(
      KANBAN_COLUMNS.map((col) => [col.id, [] as KanbanTask[]])
    ) as Record<TaskStatus, KanbanTask[]>;

    for (const task of tasks) {
      grouped[task.status].push(task);
    }

    return grouped;
  }, [tasks]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }, [tasks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const newStatus = resolveTargetStatus(over.id, tasks);
    if (!newStatus) return;

    const taskId = String(active.id);
    const current = tasks.find((t) => t.id === taskId);
    if (!current || current.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, [tasks]);

  const handleDragCancel = useCallback(() => {
    setActiveTask(null);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 md:gap-5">
        {KANBAN_COLUMNS.map((column) => (
          <KanbanColumnBoard
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id]}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeTask ? <KanbanTaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
