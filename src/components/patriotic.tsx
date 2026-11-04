import { cn } from "@/lib/utils";

/** US flag: 13 stripes, 50 stars, 10:19 proportions. */
export function Flag({ className, wave = true }: { className?: string; wave?: boolean }) {
  const stripeH = 100 / 13;
  const cantonW = 76;
  const cantonH = stripeH * 7;
  const dx = cantonW / 12;
  const dy = cantonH / 10;
  const stars: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    const even = row % 2 === 0;
    const count = even ? 6 : 5;
    for (let c = 0; c < count; c++) {
      const x = dx * (even ? 1 + c * 2 : 2 + c * 2);
      const y = dy * (row + 1);
      stars.push([x, y]);
    }
  }
  const star = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const rad = i % 2 === 0 ? r : r * 0.4;
      const a = (Math.PI / 5) * i - Math.PI / 2;
      pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg
      viewBox="0 0 190 100"
      className={cn(wave && "flag-wave", "drop-shadow-md", className)}
      role="img"
      aria-label="American flag"
    >
      {Array.from({ length: 13 }).map((_, i) => (
        <rect
          key={i}
          x={0}
          y={i * stripeH}
          width={190}
          height={stripeH + 0.2}
          fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"}
        />
      ))}
      <rect x={0} y={0} width={cantonW} height={cantonH} fill="#3C3B6E" />
      {stars.map(([x, y], i) => (
        <polygon key={i} points={star(x, y, 2.1)} fill="#FFFFFF" />
      ))}
    </svg>
  );
}

/** Stylized bald eagle with spread wings. */
export function Eagle({ className, flapping = false }: { className?: string; flapping?: boolean }) {
  const wing =
    "M92 58 C72 40 42 22 6 18 L18 30 L8 35 L24 42 L14 49 L32 54 L24 62 L44 64 L40 72 L60 71 L62 79 L88 76 Z";
  return (
    <svg viewBox="0 0 200 130" className={cn("drop-shadow-lg", className)} role="img" aria-label="Bald eagle">
      <g className={cn(flapping && "wing")}>
        <path d={wing} fill="#4A2E1B" stroke="#2B190D" strokeWidth={1.5} strokeLinejoin="round" />
        <path
          d={wing}
          fill="#4A2E1B"
          stroke="#2B190D"
          strokeWidth={1.5}
          strokeLinejoin="round"
          transform="translate(200 0) scale(-1 1)"
        />
      </g>
      <path d="M86 92 L80 118 L92 110 L100 122 L108 110 L120 118 L114 92 Z" fill="#FFFFFF" stroke="#C9C9C9" strokeWidth={1} />
      <ellipse cx={100} cy={72} rx={17} ry={26} fill="#5A3820" stroke="#2B190D" strokeWidth={1.5} />
      <path d="M90 96 l-4 8 M94 97 l-1 9 M106 97 l1 9 M110 96 l4 8" stroke="#E8A317" strokeWidth={3} strokeLinecap="round" />
      <circle cx={100} cy={40} r={15} fill="#FFFFFF" stroke="#D6D6D6" strokeWidth={1} />
      <path d="M106 40 Q122 40 120 50 Q114 47 107 48 Z" fill="#F2B01E" stroke="#B57D0C" strokeWidth={1} />
      <circle cx={104} cy={36} r={2.2} fill="#1A1A1A" />
      <path d="M99 33 L108 34" stroke="#555" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

export function StarRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-2 text-gold", className)} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={cn(i === 2 ? "size-5" : "size-3.5")} fill="currentColor">
          <path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 18.1 5.8 22l1.7-7.6L2 9.6l7.1-.7z" />
        </svg>
      ))}
    </div>
  );
}
