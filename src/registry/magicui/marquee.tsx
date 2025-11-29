"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function Marquee({
  className,
  children,
  reverse = false,
  pauseOnHover = false,
  ...props
}: MarqueeProps) {
  const [paused, setPaused] = React.useState(false);
  return (
    <div
      {...props}
      className={cn(
        "group relative flex w-full items-center overflow-hidden",
        className
      )}
      onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
    >
      <div
        className={cn(
          "marquee flex min-w-[200%] shrink-0 items-center gap-8 whitespace-nowrap transform-gpu will-change-transform",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animationName: 'marqueeScroll',
          animationDuration: 'var(--duration, 20s)',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {/* Duplicamos el contenido para bucle continuo */}
        <div className="flex items-center gap-8">{children}</div>
        <div className="flex items-center gap-8" aria-hidden>{children}</div>
      </div>
      <style jsx global>{`
        @keyframes marqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .marquee {
          animation-name: marqueeScroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
