# Testing — Mini-Jira

## Stack

- **[Vitest](https://vitest.dev/)** — runner y assertions
- **[@testing-library/react](https://testing-library.com/react)** — componentes
- **jsdom** — entorno DOM

Configuración: `web/vitest.config.ts`, setup en `web/src/test/setup.ts`.

## Comandos

```powershell
cd web
npm run test       # modo watch (desarrollo)
npm run test:run   # una ejecución (CI / pre-commit)
```

## Qué está cubierto

| Archivo | Qué prueba |
|---------|------------|
| `src/lib/kanban/kanban-utils.test.ts` | Filtros, DnD helpers, reducer, agrupación |
| `src/lib/validations/task.test.ts` | Esquemas Zod (get/update/create) |
| `src/lib/tasks/map-kanban-task.test.ts` | Mapeo Prisma → KanbanTask |
| `src/components/kanban/kanban-toolbar.test.tsx` | Toolbar y estado vacío de filtros |

**27 tests** en total (lógica pura + UI acotada).

## Fixtures

`src/test/fixtures/kanban-task.ts` — factory `makeKanbanTask(overrides)` para datos de prueba consistentes.

## Qué no está cubierto (aún)

- Server Actions con Prisma mockeado (integración).
- `KanbanBoard` completo (DnD + router + toasts).
- E2E con Playwright (flujo arrastrar → persistir → recargar).

## Añadir un test

1. Coloca el archivo junto al módulo: `mi-modulo.test.ts` o `MiComponente.test.tsx`.
2. Importa desde `@/` (alias configurado en Vitest).
3. Para componentes con Dialog/Select, usa `cleanup()` en `afterEach` si hay varios `render`.

Ejemplo mínimo:

```ts
import { describe, expect, it } from "vitest";
import { filterTasks } from "@/lib/kanban/kanban-utils";
import { makeKanbanTask } from "@/test/fixtures/kanban-task";

describe("mi caso", () => {
  it("filtra por título", () => {
    const tasks = [makeKanbanTask({ title: "Login" })];
    expect(filterTasks(tasks, "login", "ALL")).toHaveLength(1);
  });
});
```

## CI sugerido

```yaml
- run: cd web && npm ci && npm run test:run && npm run build
```
