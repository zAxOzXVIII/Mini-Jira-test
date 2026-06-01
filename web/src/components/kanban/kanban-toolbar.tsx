"use client";

import { SearchIcon } from "lucide-react";

import { TaskPriority } from "@/generated/prisma/enums";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { NewTaskDialog } from "./new-task-dialog";
import type { CreateTaskFormValues } from "@/lib/validations/task";

export type PriorityFilter = TaskPriority | "ALL";

const PRIORITY_FILTER_OPTIONS: { value: PriorityFilter; label: string }[] = [
  { value: "ALL", label: "Todas las prioridades" },
  { value: TaskPriority.HIGH, label: "Alta" },
  { value: TaskPriority.MEDIUM, label: "Media" },
  { value: TaskPriority.LOW, label: "Baja" },
];

type KanbanToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (value: PriorityFilter) => void;
  onCreateTask: (values: CreateTaskFormValues) => Promise<boolean>;
  isCreating?: boolean;
};

export function KanbanToolbar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onCreateTask,
  isCreating,
}: KanbanToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-[200px] flex-1 sm:max-w-sm">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Buscar por título…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
            aria-label="Buscar tareas por título"
          />
        </div>

        <Select
          value={priorityFilter}
          onValueChange={(value) =>
            onPriorityFilterChange(value as PriorityFilter)
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filtrar por prioridad">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <NewTaskDialog onSubmit={onCreateTask} isSubmitting={isCreating} />
    </div>
  );
}

export function KanbanFilterEmptyState({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground",
        className
      )}
    >
      Ninguna tarea coincide con la búsqueda o el filtro de prioridad.
    </p>
  );
}
