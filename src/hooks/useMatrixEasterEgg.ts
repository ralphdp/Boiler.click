"use client";

import { useEffect, useRef, useState } from "react";

interface UseMatrixEasterEggProps {
  isHovered: boolean;
  onActivate: () => void;
}

export function useMatrixEasterEgg({
  isHovered,
  onActivate,
}: UseMatrixEasterEggProps) {
  const [typedSequence, setTypedSequence] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only listen for keys when hovering
      if (!isHovered) return;

      // Clear timeout on any key press
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Add the pressed key to the sequence
      const newSequence = (typedSequence + e.key.toLowerCase()).slice(-6); // Keep last 6 characters
      setTypedSequence(newSequence);

      // Check if "matrix" is typed
      if (newSequence.includes("matrix")) {
        onActivate();
        setTypedSequence(""); // Reset sequence
        return;
      }

      // Set timeout to reset sequence after 2 seconds of inactivity
      timeoutRef.current = setTimeout(() => {
        setTypedSequence("");
      }, 2000);
    };

    // Only add listener when hovering
    if (isHovered) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered, typedSequence, onActivate]);

  // Reset sequence when not hovering
  useEffect(() => {
    if (!isHovered) {
      setTypedSequence("");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isHovered]);

  return { typedSequence };
}
