import * as React from "react"
import { cn } from "@/lib/utils"
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: string
}

export function Badge({ className, status, children, ...props }: BadgeProps) {
  const colorClass = status ? STATUS_COLORS[status] : ''
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        colorClass,
        className
      )}
      {...props}
    >
      {status ? STATUS_LABELS[status] : children}
    </span>
  )
}
