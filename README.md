# Mini-Jira — Flujo de trabajo con Cursor

Sistema de gestión de tickets tipo **Mini-Jira**: tablero Kanban, PostgreSQL, Next.js y guía por fases para construirlo con **Cursor Composer**.

## Repositorio

| Ruta | Descripción |
|------|-------------|
| [`web/`](web/) | Aplicación Next.js (App Router) |
| [`CHECKLIST-PROMPTS-MINI-JIRA-CURSOR.md`](CHECKLIST-PROMPTS-MINI-JIRA-CURSOR.md) | Prompts y checklist por fases (0–4) |
| [`docs/`](docs/) | Arquitectura, tests y roadmap |

## Inicio rápido

```powershell
cd web
copy .env.example .env
# Edita DATABASE_URL (PostgreSQL)
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Sin base de datos configurada, la app funciona en **modo mock** con datos locales.

## Scripts principales (`web/`)

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test:run` | Tests unitarios (Vitest) |
| `npm run db:migrate` | Aplicar migraciones |
| `npm run db:seed` | Datos demo (`proj_demo`) |
| `npm run lint` | ESLint |

## Estado del proyecto

- **Fases 0–4:** completadas (scaffold, Prisma, Kanban, server actions, toolbar y modal).
- **UX:** toasts, skeleton, filtros, `prefers-reduced-motion`.
- **Tests:** lógica Kanban, validaciones Zod, mapeo Prisma y componentes de toolbar.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Testing](docs/TESTING.md)
- [Roadmap y optimizaciones](docs/ROADMAP.md)

## Remoto

GitHub: `git@github.com:zAxOzXVIII/Mini-Jira-test.git`
