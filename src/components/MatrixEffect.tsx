"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MatrixEffectProps {
  isActive: boolean;
  onClose: () => void;
}

// Character sets
const characterSets = {
  sushi: [
    "サーモン",
    "ご飯",
    "酢",
    "砂糖",
    "塩 少々",
    "のり",
    "醤油で味付け",
    "わさびを添えて",
    "巻き寿司",
    "にぎり寿司",
    "手巻き寿司",
    "エビ",
    "アボカド",
    "キュウリ",
    "ツナ缶 1缶",
    "ごま油",
    "薄く切った刺身",
    "酢飯を作る",
    "具材を巻く",
    "細く切った海苔",
    "酢飯を広げる",
    "刺身をのせる",
    "マグロ",
    "ハマチ",
    "イクラ",
    "カニカマ",
    "ウニ",
    "アナゴ",
    "イカ",
    "タコ",
    "ホタテ",
    "カツオ",
  ],
  matrix: [
    "ｱ",
    "ｲ",
    "ｳ",
    "ｴ",
    "ｵ",
    "ｶ",
    "ｷ",
    "ｸ",
    "ｹ",
    "ｺ",
    "ｻ",
    "ｼ",
    "ｽ",
    "ｾ",
    "ｿ",
    "ﾀ",
    "ﾁ",
    "ﾂ",
    "ﾃ",
    "ﾄ",
    "ﾅ",
    "ﾆ",
    "ﾇ",
    "ﾈ",
    "ﾉ",
    "ﾊ",
    "ﾋ",
    "ﾌ",
    "ﾍ",
    "ﾎ",
    "ﾏ",
    "ﾐ",
    "ﾑ",
    "ﾒ",
    "ﾓ",
    "ﾔ",
    "ﾕ",
    "ﾖ",
    "ﾗ",
    "ﾘ",
    "ﾙ",
    "ﾚ",
    "ﾛ",
    "ﾜ",
    "ｦ",
    "ﾝ",
  ],
  binary: ["0", "1"],
  hex: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"],
  custom: 'ｱｲｳｴｵカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:",.<>?/`~'.split(""),
};

export function MatrixEffect({ isActive, onClose }: MatrixEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastFrameTimeRef = useRef<number>(0);
  const dropsRef = useRef<number[]>([]);
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  // Configuration
  const config = {
    fontSize: 16,
    matrixColor: "#00FF00", // Classic Matrix green
    backgroundOpacity: 0.1,
    frameInterval: 33,
  };

  const [characterSet, setCharacterSet] =
    useState<keyof typeof characterSets>("sushi");
  const preCalculatedCharsRef = useRef<string[]>([]);

  // Pre-calculate characters
  const preCalculateCharacters = useCallback(() => {
    const chars = characterSets[characterSet];
    preCalculatedCharsRef.current = [];

    if (characterSet === "sushi") {
      chars.forEach((phrase) => {
        phrase.split("").forEach((char) => {
          preCalculatedCharsRef.current.push(char);
        });
      });
    } else {
      preCalculatedCharsRef.current = [...chars];
    }
  }, [characterSet]);

  const getRandomCharacter = useCallback(() => {
    return preCalculatedCharsRef.current[
      Math.floor(Math.random() * preCalculatedCharsRef.current.length)
    ];
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const columns = Math.floor(canvas.width / config.fontSize);
    dropsRef.current = Array.from({ length: columns }, () => 0);
  }, [config.fontSize]);

  const drawRef = useRef<(currentTime: number) => void | undefined>(undefined);

  const draw = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // If paused, don't draw but continue the animation loop
    if (isPausedRef.current) {
      animationRef.current = requestAnimationFrame(drawRef.current!);
      return;
    }

    // Frame rate control
    if (currentTime - lastFrameTimeRef.current < config.frameInterval) {
      animationRef.current = requestAnimationFrame(drawRef.current!);
      return;
    }

    lastFrameTimeRef.current = currentTime;

    // Create trail effect
    ctx.fillStyle = `rgba(0, 0, 0, ${config.backgroundOpacity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font
    ctx.font = `${config.fontSize}px monospace`;
    ctx.fillStyle = config.matrixColor;

    // Draw characters
    for (let i = 0; i < dropsRef.current.length; i++) {
      const text = getRandomCharacter();
      const x = i * config.fontSize;
      const y = dropsRef.current[i] * config.fontSize;

      ctx.fillText(text, x, y);

      // Reset drop if it's off screen
      if (y > canvas.height && Math.random() > 0.975) {
        dropsRef.current[i] = 0;
      }

      dropsRef.current[i]++;
    }

    animationRef.current = requestAnimationFrame(drawRef.current!);
  }, [isActive, config.fontSize, config.backgroundOpacity, config.matrixColor, config.frameInterval, getRandomCharacter]);

  // Set the draw function reference
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  const startAnimation = useCallback(() => {
    if (!isActive) return;

    resizeCanvas();
    preCalculateCharacters();
    animationRef.current = requestAnimationFrame(drawRef.current!);
  }, [isActive, resizeCanvas, preCalculateCharacters]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
  }, []);

  // Handle character set changes
  useEffect(() => {
    preCalculateCharacters();
  }, [characterSet, preCalculateCharacters]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          setIsPaused((prev) => {
            const newPaused = !prev;
            isPausedRef.current = newPaused; // Update ref
            console.log(newPaused ? "Matrix paused" : "Matrix resumed");
            return newPaused;
          });
          break;
        case "1":
          setCharacterSet("sushi");
          console.log("Switched to Sushi character set");
          break;
        case "2":
          setCharacterSet("matrix");
          console.log("Switched to Matrix character set");
          break;
        case "3":
          setCharacterSet("binary");
          console.log("Switched to Binary character set");
          break;
        case "4":
          setCharacterSet("hex");
          console.log("Switched to Hex character set");
          break;
        case "5":
          setCharacterSet("custom");
          console.log("Switched to Custom character set");
          break;
      }
    };

    if (isActive) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isActive, onClose]);

  // Start/stop animation based on active state
  useEffect(() => {
    if (isActive) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      stopAnimation();
      setIsPaused(false);
      isPausedRef.current = false;
    };
  }, [isActive, startAnimation, stopAnimation]);

  // Handle canvas click to exit
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = () => {
      if (isActive) {
        onClose();
      }
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, [isActive, onClose]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isActive) {
        resizeCanvas();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, resizeCanvas]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <canvas
        ref={canvasRef}
        onClick={onClose}
        role="img"
        aria-label="Matrix code rain animation"
      />

      {/* Instructions */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center z-10">
        <div>Click anywhere or press ESC to exit • SPACE to pause/resume</div>
        <div className="mt-1">
          Press 1-5 to change character set: 1=Sushi, 2=Matrix, 3=Binary, 4=Hex,
          5=Custom
        </div>
        {isPaused && (
          <div className="mt-2 text-yellow-400 font-semibold">
            PAUSED - Press SPACE to resume
          </div>
        )}
      </div>
    </div>
  );
}