'use client';

export function HeroAnimations() {
  // Generate 15 particles with random positions and durations
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: `${4 + Math.random() * 4}s`,
    delay: `${Math.random() * 4}s`,
    size: `${1.5 + Math.random() * 1.5}px`,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: 'rgba(240, 85, 85, 0.3)',
            animation: `float ${p.duration} ease-in-out infinite alternate`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
