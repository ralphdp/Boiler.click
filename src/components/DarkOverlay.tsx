"use client";

interface DarkOverlayProps {
  opacity?: number;
  className?: string;
}

export function DarkOverlay({
  opacity = 30,
  className = "",
}: DarkOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-[1] dark:bg-black pointer-events-none ${className}`}
      style={{ opacity: `${opacity}%` }}
      aria-hidden="true"
    />
  );
}
