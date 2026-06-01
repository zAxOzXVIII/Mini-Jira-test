import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { KanbanFilterEmptyState, KanbanToolbar } from "./kanban-toolbar";

afterEach(() => {
  cleanup();
});

describe("KanbanToolbar", () => {
  const defaultProps = {
    search: "",
    onSearchChange: vi.fn(),
    priorityFilter: "ALL" as const,
    onPriorityFilterChange: vi.fn(),
    hasActiveFilters: false,
    onClearFilters: vi.fn(),
    onCreateTask: vi.fn().mockResolvedValue(true),
  };

  it("muestra el input de búsqueda y el botón nueva tarea", () => {
    render(<KanbanToolbar {...defaultProps} />);
    expect(screen.getByLabelText(/buscar tareas/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /nueva tarea/i })).toBeInTheDocument();
  });

  it("muestra limpiar filtros solo cuando hay filtros activos", () => {
    const { rerender } = render(<KanbanToolbar {...defaultProps} />);
    expect(screen.queryByRole("button", { name: /limpiar filtros/i })).not.toBeInTheDocument();

    rerender(
      <KanbanToolbar {...defaultProps} hasActiveFilters search="login" />
    );
    expect(screen.getByRole("button", { name: /limpiar filtros/i })).toBeInTheDocument();
  });

  it("llama onSearchChange al escribir", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    render(<KanbanToolbar {...defaultProps} onSearchChange={onSearchChange} />);

    await user.type(screen.getByPlaceholderText(/buscar por título/i), "kanban");
    expect(onSearchChange).toHaveBeenCalled();
  });
});

describe("KanbanFilterEmptyState", () => {
  it("muestra mensaje y botón para limpiar", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<KanbanFilterEmptyState onClear={onClear} />);

    expect(screen.getByText(/ninguna tarea coincide/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /limpiar filtros/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
