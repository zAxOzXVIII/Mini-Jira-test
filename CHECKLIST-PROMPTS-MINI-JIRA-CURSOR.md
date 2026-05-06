# Checklist: Mini-Jira en Cursor (Composer + fases)

**Objetivo:** Construir un **Sistema de Gestión de Tickets (Mini-Jira)** sin saturar la IA. Usa **Modo Composer** (`Ctrl + I` en Windows / `Cmd + I` en macOS) y avanza **fase a fase**. Evita pedir “todo el proyecto” en un solo mensaje.

---

## Checklist rápido (antes de empezar)

*Última actualización: 2026-05-06.*

- [x] Carpeta de proyecto vacía o repositorio nuevo listo — *Raíz con checklist + app en **`web/`** (`package.json` en `web`).*
- [x] Node.js LTS instalado — *Detectado: **Node v22.22.0**, **npm 11.6.2** (válido para Next.js actual).*
- [ ] PostgreSQL accesible (local o remoto) y URL de conexión preparada — *No se encontró `psql` en el PATH; confirma tu instancia (local, Docker, Neon, etc.) y define `DATABASE_URL` antes de migrar.*
- [ ] Composer abierto y, en pasos 2+, archivos clave referenciados con `@` (ver sección Tips) — *Hábito de trabajo; márcalo cuando empieces Fase 2+.*

---

## Fase 0 — Dependencias y entorno (opcional pero recomendable)

**Estado:** **completada** en `web/` — Next.js 16 (App Router, TS, Tailwind 4), Prisma 7 inicializado, shadcn (estilo base-nova), paquetes Kanban/formulario instalados, `npm run build` OK. Los comandos siguientes sirven de referencia o para repetir en otra máquina.

### A) Crear el proyecto Next.js (App Router + TS + Tailwind)

En la raíz del repo conviene la subcarpeta **`web`** si no quieres mezclar con otros archivos (p. ej. este checklist).

```powershell
cd "d:\Documentos\Programacion_doc\NodeJS\Flujo_Trabajo_Jira"
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --yes
cd web
```

*(Alternativa: scaffold en la raíz con `--yes` si tu plantilla lo permite y aceptas archivos junto al checklist.)*

### B) Prisma (después de `cd web` o raíz del app)

```powershell
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

Luego configura `.env` con `DATABASE_URL` y tu `schema.prisma`. Tras definir modelos:

```powershell
npx prisma generate
npx prisma migrate dev --name init
```

*(Si solo quieres prototipo sin migraciones formales aún: `npx prisma db push`.)*

### C) shadcn/ui

```powershell
npx shadcn@latest init
```

Componentes añadidos para fases posteriores:

```powershell
npx shadcn@latest add card badge button dialog input label select form --yes
npx shadcn@latest add field --yes
```

*Nota:* con el estilo **base-nova**, el CLI puede no crear `form.tsx`; **`field`** (+ `label`, `input`) cubre formularios accesibles con **react-hook-form** y **Zod**.

### D) Kanban, formularios y validación

```powershell
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities zod react-hook-form @hookform/resolvers
```

### E) Post-instalación que suele olvidarse

| Paso | Comando / nota |
|------|------------------|
| Cliente Prisma tras cambiar schema | `npm run db:generate` o `npx prisma generate` |
| BD alineada con schema | `npx prisma migrate dev` o `db push` (requiere `DATABASE_URL` válida) |
| Arranque dev | `cd web` → `npm run dev` |
| Plantilla de conexión | Copia `web/.env.example` → `web/.env` y ajusta `DATABASE_URL` |

**Prompt sugerido (cuando ya exista `package.json`):**

> Lista los comandos de terminal para instalar todas las dependencias del proyecto (Next.js, Prisma, Tailwind, shadcn, dnd-kit, zod, react-hook-form) según el `package.json` actual. Indica si falta algún paso de inicialización (por ejemplo `prisma generate`).

**Fase 0 — checklist**

- [x] Comandos documentados (scaffold + Prisma + shadcn + dnd-kit + form/zod)
- [x] Node/npm verificados en terminal
- [x] `create-next-app` ejecutado y carpeta **`web/`** creada con dependencias instaladas
- [x] Prisma inicializado (`prisma/`, `prisma.config.ts`, `npx prisma generate` ejecutado)
- [x] shadcn inicializado + UI: button, card, badge, dialog, input, label, select, field, separator
- [x] `@dnd-kit/*`, `zod`, `react-hook-form`, `@hookform/resolvers` instalados
- [x] `web/.env.example` con plantilla de `DATABASE_URL`
- [ ] **`DATABASE_URL` real y PostgreSQL accesible** — *sigue pendiente hasta que configures tu instancia (Fase 1 / migraciones)*

**Trabajar siempre desde la app:** `cd web` antes de `npm run dev`, Prisma o shadcn.

---

## Fase 1 — Arquitectura y base de datos

**Meta:** Cimientos del repo: stack, Prisma, esquema y carpetas base.

**Checklist de verificación**

- [ ] Next.js (App Router) + TypeScript
- [ ] Tailwind CSS configurado
- [ ] shadcn/ui inicializado (o plan claro para añadirlo)
- [ ] Prisma + PostgreSQL con `schema.prisma` coherente
- [ ] Entidades mínimas:
  - [ ] **User:** `id`, `email`, `name`, `avatar`
  - [ ] **Project:** `id`, `name`, `description`
  - [ ] **Task:** `id`, `title`, `description`, `status` (enum: `TODO`, `IN_PROGRESS`, `DONE`), `priority` (enum: `LOW`, `MEDIUM`, `HIGH`), relación a **User** (asignado), relación a **Project**, `createdAt`
- [ ] Estructura: `src/app`, `src/components`, `src/lib`
- [ ] Migración inicial aplicada o instrucciones claras para `migrate dev`

**Prompt mejorado (copiar en Composer):**

> Actúa como arquitecto de software senior. Crea un proyecto **Next.js** con **App Router** y **TypeScript**, **Tailwind CSS** y **shadcn/ui**. Configura **Prisma** con **PostgreSQL** y el siguiente modelo de datos:
>
> 1. **User:** id, email, name, avatar (nullable si aplica).
> 2. **Project:** id, name, description.
> 3. **Task:** id, title, description, status (enum TODO | IN_PROGRESS | DONE), priority (enum LOW | MEDIUM | HIGH), asignación a User, pertenencia a Project, createdAt.
>
> Incluye relaciones correctas (foreign keys), índices razonables para consultas por `projectId` y `status`, y enums en Prisma. Genera configuración mínima funcional, `schema.prisma`, cliente Prisma en `src/lib`, y la estructura de carpetas `src/app`, `src/components`, `src/lib`. No implementes aún el Kanban completo: solo base lista para las siguientes fases.
>
> **Contexto:** adjunta `@prisma/schema.prisma` o la ruta equivalente si ya existe un borrador.

---

## Fase 2 — UI del tablero Kanban

**Meta:** Tablero visual con DnD entre columnas, sin obligar a que toda la persistencia esté perfecta en el primer intento.

**Checklist de verificación**

- [ ] Componente(s) bajo `src/components/kanban`
- [ ] **@dnd-kit/core** (y lo que haga falta de dnd-kit) para arrastrar entre columnas
- [ ] Tres columnas: TODO, IN_PROGRESS, DONE
- [ ] Tarjetas con **Card** de shadcn
- [ ] Badges de prioridad con color consistente
- [ ] Layout **responsive** y aspecto moderno

**Prompt mejorado:**

> Sobre el esquema Prisma y los tipos existentes, crea un **Kanban** en `src/components/kanban` usando **@dnd-kit/core**. Cada columna es un contenedor con su lista de tareas. Las tarjetas usan **Card** de shadcn, muestran título, prioridad con **badge** por color, y asignado si existe. El diseño debe ser responsive. Si hace falta, define tipos de props claros y datos mock mínimos hasta conectar server actions.
>
> **Contexto:** `@prisma/schema.prisma` y, si existe, `@src/app/...` página donde montarás el tablero.

---

## Fase 3 — Server Actions y datos reales

**Meta:** CRUD mínimo para el tablero + sensación de inmediatez con optimistic UI.

**Checklist de verificación**

- [ ] `getTasks(projectId)` — listar tareas del proyecto
- [ ] `updateTaskStatus(taskId, newStatus)` — al soltar en otra columna
- [ ] `createTask(data)` — alta de tareas
- [ ] Validación de entrada en servidor (Zod o equivalente donde encaje)
- [ ] **useOptimistic** para mover tarjetas al instante y revertir o reconciliar si falla la acción

**Prompt mejorado:**

> Implementa **Server Actions** en Next.js para:
>
> 1. `getTasks(projectId)`
> 2. `updateTaskStatus(taskId, newStatus)`
> 3. `createTask(data)` con validación (Zod) de los campos requeridos.
>
> Conecta el Kanban a estas acciones. Usa **`useOptimistic`** para que el cambio de columna se vea instantáneo; si la acción falla, muestra feedback al usuario y deja el estado coherente con el servidor.
>
> **Contexto:** `@src/components/kanban/...` y `@prisma/schema.prisma`.

---

## Fase 4 — Barra de herramientas, búsqueda y modal “Nueva tarea”

**Meta:** Pulido “pro”: filtros locales o server-side según volumen (deja claro en el prompt si quieres filtrar en cliente con las tareas ya cargadas).

**Checklist de verificación**

- [ ] Barra sobre el Kanban: búsqueda por título en tiempo real
- [ ] Filtro por prioridad (select / dropdown)
- [ ] Botón “Nueva tarea” → **Dialog** shadcn
- [ ] Formulario con **react-hook-form** + **Zod** (schema compartido o duplicado controlado con el servidor)

**Prompt mejorado:**

> Añade una barra de herramientas encima del Kanban con: (1) input de búsqueda que filtre por título en tiempo real sobre la lista actual, (2) filtro por prioridad, (3) botón “Nueva tarea” que abre un **Dialog** con formulario validado por **Zod** y **react-hook-form**, reutilizando el mismo criterio de validación que `createTask` en lo posible. Mantén accesibilidad básica del modal (foco, cierre con Escape).
>
> **Contexto:** componentes del Kanban y server actions existentes.

---

## Tips para que Cursor rinde mejor

| Acción | Detalle |
|--------|---------|
| **Referencias `@`** | En fases 2–4 incluye `@ruta/al/archivo` (p. ej. schema Prisma, layout, componentes Kanban) para anclar el contexto. |
| **Errores de tipos / DnD** | Selecciona el error o el código y usa **Cmd/Ctrl + K** con un mensaje concreto, p. ej.: *Fix this error: types mismatched in the DnD onDragEnd handler vs Task status enum.* |
| **Iteración corta** | Un fallo → un prompt acotado; evita mezclar “arregla Prisma y rediseña el Kanban” en el mismo mensaje. |
| **Terminal** | Pide comandos explícitos (`install`, `prisma migrate`, `db push`) cuando cambie el esquema o dependencias. |

---

## Variante stack (elegir una)

- **PostgreSQL + Prisma (este documento):** ideal si quieres ORM, migraciones y modelo relacional en el repo.
- **Supabase:** sustituye la fase 1 por “Auth + Postgres gestionado + cliente `@supabase/supabase-js` o API”; las fases 2–4 pueden mantenerse cambiando la capa de datos (RPC, tablas, RLS). Si quieres este camino, pide en Composer: *“Reemplaza Prisma por Supabase manteniendo los mismos conceptos User/Project/Task y RLS mínima por projectId.”*

---

## Resumen

1. Composer + **prompts por fase** reducen alucinaciones y errores de integración.  
2. Este checklist te permite **marcar** cada bloque antes de pasar al siguiente.  
3. Usa **`@archivos`** y mensajes de error **específicos** para arreglos rápidos.
