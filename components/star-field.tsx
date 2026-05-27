"use client";

import { useEffect, useState } from "react";

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  type: "dot" | "cross" | "sparkle";
  hue: number; // 0=white, 1=blue, 2=purple, 3=yellow
};

// Générateur pseudo-aléatoire déterministe pour éviter l'hydration mismatch
function pr(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: pr(i * 3 + 0) * 100,
    y: pr(i * 3 + 1) * 100,
    size: pr(i * 3 + 2) * 3 + 1,
    delay: pr(i * 5) * 7,
    duration: pr(i * 7) * 4 + 2.5,
    type: i < 6 ? "sparkle" : i < 16 ? "cross" : "dot",
    hue: Math.floor(pr(i * 11) * 4),
  }));
}

const HUE_COLORS = [
  "rgb(255,255,255)",
  "rgb(147,197,253)", // blue-300
  "rgb(196,181,253)", // violet-300
  "rgb(253,230,138)", // yellow-200
];

export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStars(generateStars(60));
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.12] transition-opacity duration-700 dark:opacity-100"
    >
      {stars.map((star) => {
        const color = HUE_COLORS[star.hue];

        if (star.type === "sparkle") {
          // Grande étoile ✦ animée
          return (
            <div
              key={star.id}
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                fontSize: `${star.size * 5 + 8}px`,
                color,
                animation: `sparkleAnim ${star.duration + 2}s ${star.delay}s ease-in-out infinite, starFloat ${star.duration * 1.5}s ${star.delay * 0.5}s ease-in-out infinite`,
                lineHeight: 1,
                textShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
                userSelect: "none",
              }}
            >
              ✦
            </div>
          );
        }

        if (star.type === "cross") {
          // Petite croix stylisée (deux barres)
          const sz = star.size * 1.5 + 3;
          return (
            <div
              key={star.id}
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${sz}px`,
                height: `${sz}px`,
                animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
              }}
            >
              {/* Barre horizontale */}
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: "1.5px",
                  background: color,
                  transform: "translateY(-50%)",
                  borderRadius: "2px",
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
              {/* Barre verticale */}
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "1.5px",
                  background: color,
                  transform: "translateX(-50%)",
                  borderRadius: "2px",
                  boxShadow: `0 0 4px ${color}`,
                }}
              />
            </div>
          );
        }

        // Point simple
        return (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${star.size * 2}px ${color}`,
              animation: `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
