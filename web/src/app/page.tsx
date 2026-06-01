import { KanbanBoard } from "@/components/kanban";

export default function Home() {
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
            Arrastra las tarjetas entre columnas. Los datos son de demostración hasta conectar la base de datos (Fase 3).
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <KanbanBoard />
      </main>
    </div>
  );
}
