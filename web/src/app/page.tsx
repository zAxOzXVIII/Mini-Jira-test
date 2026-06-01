import { getTasks } from "@/app/actions/tasks";
import { KanbanBoard, MOCK_KANBAN_TASKS } from "@/components/kanban";
import { DEMO_PROJECT_ID } from "@/lib/constants/project";

export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await getTasks(DEMO_PROJECT_ID);

  const initialTasks = result.success ? result.data : MOCK_KANBAN_TASKS;
  const dataSource = result.success ? ("database" as const) : ("mock" as const);
  const dbNotice =
    !result.success && result.error ? result.error : null;

  return (
    <div className="min-h-full bg-muted/40">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Mini-Jira
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Tablero del proyecto
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Busca y filtra tareas, crea nuevas desde el botón superior y arrastra
            tarjetas entre columnas. Los cambios se guardan cuando la base de
            datos está disponible.
          </p>
          {dbNotice ? (
            <p className="max-w-2xl text-sm text-amber-700 dark:text-amber-300">
              {dbNotice}
            </p>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <KanbanBoard
          initialTasks={initialTasks}
          projectId={DEMO_PROJECT_ID}
          dataSource={dataSource}
        />
      </main>
    </div>
  );
}
