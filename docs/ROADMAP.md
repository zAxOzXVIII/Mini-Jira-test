# Roadmap y optimizaciones — Mini-Jira

Revisión tras completar fases 0–4, mejoras UX y tests iniciales.

## Completado

- [x] Fases 0–4 del checklist
- [x] Toasts, skeleton, limpiar filtros, mensajes de columna
- [x] `prefers-reduced-motion`
- [x] Extracción de lógica a `kanban-utils.ts`
- [x] Tests unitarios (27) con Vitest
- [x] Documentación (README, arquitectura, testing)

## Alta prioridad (siguiente iteración)

| Mejora | Beneficio | Esfuerzo |
|--------|-----------|----------|
| **Autenticación** | Seguridad real; multi-proyecto por usuario | Alto |
| **Detalle de tarea** (panel o modal al clic) | Ver/editar descripción, asignado, fecha | Medio |
| **Mover con teclado** (menú “Mover a…”) | Accesibilidad sin ratón | Medio |
| **Tests E2E** (Playwright) | Regresión del flujo DnD + BD | Medio |
| **Tests de Server Actions** | Mock Prisma; cubrir `getTasks` / `createTask` | Medio |

## Media prioridad

| Mejora | Detalle |
|--------|---------|
| **Atajos de teclado** | `/` → búsqueda, `N` → nueva tarea |
| **Asignar usuario en el modal** | Select de usuarios del proyecto |
| **Avatares en tarjetas** | Campo `avatar` ya existe en el modelo |
| **Fechas relativas** | “hace 2 días” con `date-fns` o `Intl.RelativeTimeFormat` |
| **Persistir filtros** | `sessionStorage` al recargar |
| **Evitar `router.refresh()` completo** | Reconciliar solo la tarea afectada (menos parpadeo) |
| **Índice de búsqueda** | Si crece el volumen: filtrar en servidor o debounce + API |

## Optimizaciones técnicas

| Área | Situación actual | Propuesta |
|------|------------------|-----------|
| **Bundle** | shadcn + dnd-kit + sonner | Analizar con `@next/bundle-analyzer` |
| **Prisma en dev** | Singleton global | Correcto para Next; en serverless valorar connection limit |
| **Página `/`** | `force-dynamic` siempre | OK para MVP; cache por `projectId` si la lectura es pesada |
| **Mock en build** | `getPrisma()` null sin env | Correcto; documentado |
| **Tipos** | `PriorityFilter` en toolbar | Mover a `types.ts` para evitar acoplamiento lib → componente |
| **Duplicación Zod** | `createTask` vs `createTaskFormSchema` | Unificar con `.pick()` / `.omit()` del schema base |

## Deuda / calidad

- [ ] Resolver vulnerabilidades `npm audit` (evaluar sin `--force` destructivo).
- [ ] Añadir `test:coverage` con `@vitest/coverage-v8` y umbral mínimo en CI.
- [ ] ESLint en pre-commit (husky + lint-staged).
- [ ] Variables de entorno validadas con Zod al arranque (`env.ts`).

## UX pendiente (de la revisión anterior)

- [ ] Confirmación al soltar en columna “Hecho” (tareas HIGH).
- [ ] Deshabilitar DnD con filtros activos **o** banner explicativo persistente.
- [ ] `TouchSensor` con delay para mejorar drag en móvil vs scroll horizontal.
- [ ] Banner mock/BD dismissible tras primera visita.

## Cómo priorizar

1. **Demo/portfolio:** detalle de tarea + E2E básico + README despliegue.
2. **Uso real:** auth + asignación + tests de actions.
3. **Equipo/CI:** coverage + lint en PR + Playwright en pipeline.
