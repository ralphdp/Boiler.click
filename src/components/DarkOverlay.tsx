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
      className={`absolute inset-0 z-[1] dark:bg-black ${className}`}
      style={{ opacity: `${opacity}%` }}
      aria-hidden="true"
    />
  );
}
