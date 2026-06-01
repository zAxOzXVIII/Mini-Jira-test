import { TaskPriority } from "@/generated/prisma/enums";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  [TaskPriority.LOW]: {
    label: "Baja",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  [TaskPriority.MEDIUM]: {
    label: "Media",
    className:
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  [TaskPriority.HIGH]: {
    label: "Alta",
    className:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  },
};

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
  className?: string;
};

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
