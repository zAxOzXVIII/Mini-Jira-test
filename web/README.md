# Mini-Jira — App (`web/`)

Aplicación **Next.js 16** con tablero Kanban, **Prisma 7** + PostgreSQL y UI **shadcn** (base-nova).

## Requisitos

- Node.js 20+ (probado con 22 LTS)
- PostgreSQL 14+ (local, Docker, Neon, etc.)

## Configuración

1. Copia el entorno:

```powershell
copy .env.example .env
```

2. Define `DATABASE_URL` en `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/mini_jira?schema=public"
```

3. Instala y prepara la base de datos:

```powershell
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Arranca:

```powershell
npm run dev
```

## Estructura del código

```
src/
├── app/
│   ├── actions/tasks.ts    # Server Actions (getTasks, updateTaskStatus, createTask)
│   ├── page.tsx            # Página principal (SSR + Kanban)
│   └── loading.tsx         # Skeleton mientras carga
├── components/
│   ├── kanban/             # Tablero, columnas, tarjetas, toolbar, modal
│   └── ui/                 # shadcn (Card, Dialog, Select, …)
├── generated/prisma/       # Cliente Prisma generado (no editar)
├── hooks/
│   └── use-reduced-motion.ts
├── lib/
│   ├── kanban/kanban-utils.ts   # Lógica pura (filtros, reducer, DnD helpers)
│   ├── validations/task.ts      # Esquemas Zod
│   ├── tasks/map-kanban-task.ts
│   ├── seed-demo.ts
│   └── prisma.ts
└── test/                   # Fixtures y setup Vitest
prisma/
├── schema.prisma
└── migrations/
```

## Modelo de datos

| Modelo | Campos principales |
|--------|-------------------|
| **User** | id, email, name, avatar? |
| **Task** | title, description?, status, priority, projectId, assignedToId?, createdAt |
| **Project** | id, name, description? |

Enums: `TaskStatus` (TODO, IN_PROGRESS, DONE), `TaskPriority` (LOW, MEDIUM, HIGH).

Proyecto demo: `proj_demo` (`src/lib/constants/project.ts`).

## Modos de datos

| Modo | Cuándo | Comportamiento |
|------|--------|----------------|
| **database** | `DATABASE_URL` válida y `getTasks` OK | Persistencia real + seed automático si el proyecto no existe |
| **mock** | Sin BD o error de conexión | Datos en memoria; arrastre y creación solo en cliente |

## Server Actions

| Acción | Descripción |
|--------|-------------|
| `getTasks(projectId)` | Lista tareas con asignado |
| `updateTaskStatus(taskId, newStatus)` | Al soltar en otra columna |
| `createTask(input)` | Alta validada con Zod |

Todas devuelven `{ success: true, data }` o `{ success: false, error }`.

## UI / Kanban

- **DnD:** `@dnd-kit/core` entre tres columnas.
- **Optimistic UI:** `useOptimistic` para mover y crear tareas.
- **Toolbar:** búsqueda por título, filtro de prioridad, “Nueva tarea”.
- **Toasts:** `sonner` (éxito/error al mover y crear).
- **Accesibilidad:** labels ARIA, `aria-live`, skeleton de carga, `prefers-reduced-motion`.

## Tests

```powershell
npm run test        # watch
npm run test:run    # una pasada (CI)
```

Ver [../docs/TESTING.md](../docs/TESTING.md).

## Build de producción

```powershell
npm run build
npm run start
```

La ruta `/` es **dinámica** (`force-dynamic`) porque consulta la base de datos en cada request.

## Más información

- [Arquitectura](../docs/ARCHITECTURE.md)
- [Roadmap](../docs/ROADMAP.md)
- [Checklist de prompts](../CHECKLIST-PROMPTS-MINI-JIRA-CURSOR.md)
