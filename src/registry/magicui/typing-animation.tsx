"use client";

import * as React from "react";

type TypingAnimationProps = {
  children: React.ReactNode;
  speedMsPerChar?: number;
  startDelayMs?: number;
  showCursorDelayMs?: number;
  onDone?: () => void;
  className?: string;
};

export function TypingAnimation({
  children,
  speedMsPerChar = 28,
  startDelayMs = 0,
  showCursorDelayMs = 0,
  onDone,
  className,
}: TypingAnimationProps) {
  const full = React.useMemo(() => {
    if (typeof children === "string") return children as string;
    return React.Children.toArray(children).join("") as string;
  }, [children]);

  const [count, setCount] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(false);

  React.useEffect(() => {
    const cursorTimer = window.setTimeout(() => {
      setShowCursor(true);
    }, showCursorDelayMs);

    return () => {
      window.clearTimeout(cursorTimer);
    };
  }, [showCursorDelayMs]);

  React.useEffect(() => {
    let t: number | undefined;
    const start = () => {
      let i = 0;
      const tick = () => {
        i += 1;
        setCount(i);
        if (i < full.length) {
          t = window.setTimeout(tick, speedMsPerChar);
        } else if (onDone) {
          onDone();
        }
      };
      t = window.setTimeout(tick, speedMsPerChar);
    };
    const d = window.setTimeout(start, startDelayMs);
    return () => {
      window.clearTimeout(d);
      if (t) window.clearTimeout(t);
    };
  }, [full, speedMsPerChar, startDelayMs, onDone]);

  return (
    <span className={className} aria-label={full}>
      {full.slice(0, count)}
      {showCursor && (
        <span className="inline-block w-[1ch] -translate-y-px animate-caret">|</span>
      )}
      <style jsx>{`
        @keyframes caretBlink { 0%, 60% { opacity: 1 } 60.1%, 100% { opacity: 0 } }
        .animate-caret { animation: caretBlink 1s step-end infinite; }
      `}</style>
    </span>
  );
}
