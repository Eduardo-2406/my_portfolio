"use client";

import { cn } from "@/lib/utils";

interface CrossedLLogoProps {
  className?: string;
  size?: number;
}

export function CrossedLLogo({ className, size = 32 }: CrossedLLogoProps) {
  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: size, height: size }}
      aria-label="Logo"
    >
      <div className="relative h-full w-full">
        {/* Marco L superior-izquierda - movido hacia el centro */}
        <div className="absolute left-[30%] top-[30%] h-[75%] w-0.5 bg-gradient-to-b from-primary/80 via-primary/60 to-transparent" />
        <div className="absolute left-[30%] top-[30%] h-0.5 w-[75%] bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
        
        {/* Marco L inferior-derecha (cruzado) - movido hacia el centro */}
        <div className="absolute right-[30%] bottom-[30%] h-[75%] w-0.5 bg-gradient-to-t from-primary/80 via-primary/60 to-transparent" />
        <div className="absolute right-[30%] bottom-[30%] h-0.5 w-[75%] bg-gradient-to-l from-primary/80 via-primary/60 to-transparent" />
      </div>
    </div>
  );
}
