"use client";

import { SearchIcon, XIcon } from "lucide-react";

import { TaskPriority } from "@/generated/prisma/enums";

import { Button } from "@/components/ui/button";
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
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onCreateTask: (values: CreateTaskFormValues) => Promise<boolean>;
  isCreating?: boolean;
};

export function KanbanToolbar({
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  hasActiveFilters,
  onClearFilters,
  onCreateTask,
  isCreating,
}: KanbanToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Búsqueda */}
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

        {/* Filtro prioridad */}
        <Select
          value={priorityFilter}
          onValueChange={(v) => onPriorityFilterChange(v as PriorityFilter)}
        >
          <SelectTrigger
            className="w-full sm:w-[200px]"
            aria-label="Filtrar por prioridad"
          >
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

        {/* Limpiar filtros */}
        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="shrink-0 text-muted-foreground hover:text-foreground"
            aria-label="Limpiar filtros activos"
          >
            <XIcon className="mr-1 size-3.5" aria-hidden />
            Limpiar
          </Button>
        ) : null}
      </div>

      <NewTaskDialog onSubmit={onCreateTask} isSubmitting={isCreating} />
    </div>
  );
}

type KanbanFilterEmptyStateProps = {
  className?: string;
  onClear: () => void;
};

export function KanbanFilterEmptyState({
  className,
  onClear,
}: KanbanFilterEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Ninguna tarea coincide con la búsqueda o el filtro de prioridad.
      </p>
      <Button variant="outline" size="sm" onClick={onClear}>
        Limpiar filtros
      </Button>
    </div>
  );
}
