import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

export const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = ['#00A651', '#FF6B35', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];
    const generated: Particle[] = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: -10 - Math.random() * 20,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speedX: (Math.random() - 0.5) * 2,
      speedY: 2 + Math.random() * 4,
      opacity: 1,
    }));

    setParticles(generated);

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + p.speedY,
            x: p.x + p.speedX,
            rotation: p.rotation + 4,
            opacity: p.y > 70 ? Math.max(0, p.opacity - 0.03) : p.opacity,
          }))
          .filter((p) => p.y < 110 && p.opacity > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-xs shadow-xs"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};
