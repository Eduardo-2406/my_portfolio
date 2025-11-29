"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & { value?: number };

const ProgressBase = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, ...props }, ref) => {
  const indicatorStyle = React.useMemo(() => ({ transform: `translateX(-${100 - (value ?? 0)}%)` }), [value]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      data-slot="progress"
      className={cn(
        "bg-foreground/20 dark:bg-foreground/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary dark:bg-primary h-full w-full flex-1 transition-all"
        style={indicatorStyle}
      />
    </ProgressPrimitive.Root>
  )
});

ProgressBase.displayName = 'ProgressBase';

const Progress = React.memo(ProgressBase);

export { Progress }
