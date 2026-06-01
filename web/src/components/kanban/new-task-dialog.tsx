"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { TaskPriority } from "@/generated/prisma/enums";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  createTaskFormSchema,
  type CreateTaskFormValues,
} from "@/lib/validations/task";

const PRIORITY_OPTIONS = [
  { value: TaskPriority.LOW, label: "Baja" },
  { value: TaskPriority.MEDIUM, label: "Media" },
  { value: TaskPriority.HIGH, label: "Alta" },
] as const;

const selectFieldClass =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

type NewTaskDialogProps = {
  onSubmit: (values: CreateTaskFormValues) => Promise<boolean>;
  isSubmitting?: boolean;
};

export function NewTaskDialog({ onSubmit, isSubmitting }: NewTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: TaskPriority.MEDIUM,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const priority = watch("priority");

  async function handleCreate(values: CreateTaskFormValues) {
    setSubmitError(null);
    const ok = await onSubmit(values);
    if (ok) {
      reset();
      setOpen(false);
    } else {
      setSubmitError("No se pudo crear la tarea. Inténtalo de nuevo.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSubmitError(null);
          reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="w-full sm:w-auto">
            <PlusIcon data-icon="inline-start" />
            Nueva tarea
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
          <DialogDescription>
            Añade una tarea al tablero. Los campos marcados son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form
          id="new-task-form"
          onSubmit={handleSubmit(handleCreate)}
          className="space-y-4"
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="task-title">Título</FieldLabel>
              <Input
                id="task-title"
                placeholder="Ej. Revisar diseño del login"
                aria-invalid={!!errors.title}
                autoFocus
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="task-description">
                Descripción{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </FieldLabel>
              <textarea
                id="task-description"
                rows={3}
                placeholder="Detalles adicionales…"
                className={cn(
                  selectFieldClass,
                  "min-h-[80px] resize-y py-2"
                )}
                aria-invalid={!!errors.description}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field data-invalid={!!errors.priority}>
              <FieldLabel htmlFor="task-priority">Prioridad</FieldLabel>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setValue("priority", value as TaskPriority, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger
                  id="task-priority"
                  className="w-full"
                  aria-invalid={!!errors.priority}
                >
                  <SelectValue placeholder="Selecciona prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[errors.priority]} />
            </Field>
          </FieldGroup>

          {submitError ? (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          ) : null}
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" form="new-task-form" disabled={isSubmitting}>
            {isSubmitting ? "Creando…" : "Crear tarea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
