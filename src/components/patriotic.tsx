import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { STATE_SHAPES } from "@/lib/state-shapes";

const STRIPE_H = 100 / 13;
const CANTON_W = 76;
const CANTON_H = STRIPE_H * 7;

function starPoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.4;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(2)},${(cy + rad * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

const FLAG_STARS: [number, number][] = (() => {
  const dx = CANTON_W / 12;
  const dy = CANTON_H / 10;
  const out: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    const even = row % 2 === 0;
    for (let c = 0; c < (even ? 6 : 5); c++) out.push([dx * (even ? 1 + c * 2 : 2 + c * 2), dy * (row + 1)]);
  }
  return out;
})();

/**
 * The flag is cut into vertical strips that bob out of phase, so a wave travels
 * from the pole to the fly end. Amplitude grows away from the pole (where the
 * cloth is fixed) and each strip darkens as it dips, giving the folds depth.
 */
const RIPPLE_COUNT = 28;
const RIPPLE_PERIOD = 1.8;
const RIPPLE_STRIPS = Array.from({ length: RIPPLE_COUNT }, (_, i) => {
  const w = 190 / RIPPLE_COUNT;
  const x = i * w;
  const t = i / (RIPPLE_COUNT - 1);
  return {
    x,
    w,
    amp: +(0.4 + 4.2 * t).toFixed(2),
    // Negative delays start every strip mid-cycle, phase-shifted by position.
    delay: +(-(1 - t) * RIPPLE_PERIOD * 1.5).toFixed(3),
    stars: FLAG_STARS.filter(([sx]) => sx + 2.2 > x && sx - 2.2 < x + w),
  };
});

/**
 * US flag on a pole. `side="left"` puts the pole on the left (flag flies right);
 * `side="right"` mirrors it so a pair of flags frames content symmetrically,
 * with the canton next to the pole on both sides.
 */
export function Flag({ className, side = "left" }: { className?: string; side?: "left" | "right" }) {
  const flip = side === "right";
  return (
    <svg
      viewBox="0 0 206 150"
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="American flag"
    >
      <g transform={flip ? "translate(206 0) scale(-1 1)" : undefined}>
        <rect x={2} y={4} width={5} height={146} rx={2} fill="#C9A227" />
        <circle cx={4.5} cy={4} r={4.5} fill="#E3C35A" />
        <g transform="translate(9 8)">
          {RIPPLE_STRIPS.map(({ x, w, amp, delay, stars }) => (
            <g
              key={x}
              className="flag-ripple"
              style={{ "--amp": `${amp}px`, animationDelay: `${delay}s` } as CSSProperties}
            >
              {/* A nested svg clips its contents to this vertical strip of the flag. */}
              <svg x={x} y={0} width={w + 0.4} height={100} viewBox={`${x} 0 ${w + 0.4} 100`} overflow="hidden">
                {Array.from({ length: 13 }).map((_, i) => (
                  <rect key={i} x={x} y={i * STRIPE_H} width={w + 0.4} height={STRIPE_H + 0.2} fill={i % 2 === 0 ? "#B22234" : "#FFFFFF"} />
                ))}
                {x < CANTON_W && <rect x={x} y={0} width={Math.min(w + 0.4, CANTON_W - x)} height={CANTON_H} fill="#3C3B6E" />}
                {stars.map(([sx, sy], i) => (
                  <polygon key={i} points={starPoints(sx, sy, 2.1)} fill="#FFFFFF" />
                ))}
                <rect
                  x={x}
                  y={0}
                  width={w + 0.4}
                  height={100}
                  fill="#000"
                  className="flag-shade"
                  style={{ animationDelay: `${delay}s` }}
                />
              </svg>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Bald eagle head in profile, facing right. */
export function EagleHead({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Bald eagle">
      {/* dark brown shoulders */}
      <path d="M10 200 C18 160 46 128 84 118 L124 124 C134 150 132 178 124 200 Z" fill="#3E2716" />
      <path d="M40 200 C50 170 70 150 92 142 L104 160 L88 200 Z" fill="#4E331D" />
      {/* white head and neck, ragged lower edge */}
      <path
        d="M54 136 C44 104 50 66 80 46 C104 30 136 30 156 48 L170 66 C164 76 152 84 140 90 C132 100 126 112 124 126
           L116 134 L112 124 L104 140 L98 126 L90 142 L84 128 L76 144 L72 130 L62 142 Z"
        fill="#F7F5EF"
      />
      {/* feather shading on head */}
      <path d="M70 70 C76 62 84 58 92 56 M64 92 C70 84 78 80 88 78 M66 112 C74 104 84 100 94 100 M84 124 C92 116 102 112 112 112" stroke="#D9D4C7" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* heavy brow */}
      <path d="M114 58 C126 50 142 50 154 56 L150 64 C140 60 128 60 118 64 Z" fill="#D1CBBD" />
      {/* eye */}
      <circle cx={140} cy={68} r={6.5} fill="#E9B824" />
      <circle cx={141} cy={68} r={3.4} fill="#141414" />
      <circle cx={142.4} cy={66.6} r={1} fill="#FFFFFF" />
      {/* hooked beak */}
      <path d="M150 56 C168 50 188 60 192 80 C194 92 188 102 180 108 C182 98 179 91 172 89 C164 93 154 93 144 89 C140 80 142 64 150 56 Z" fill="#F0B22A" />
      <path d="M150 56 C168 50 188 60 192 80 C194 92 188 102 180 108 C182 98 179 91 172 89" fill="none" stroke="#B9800F" strokeWidth={1.5} />
      <path d="M146 89 C156 95 168 95 176 91 C172 99 160 103 150 99 Z" fill="#D69A1C" />
      <path d="M150 60 C156 58 162 60 164 66" fill="none" stroke="#C98D14" strokeWidth={1.4} />
      <ellipse cx={160} cy={66} rx={2.4} ry={1.4} fill="#7A520A" />
    </svg>
  );
}

/** Gold-ringed seal with the eagle head, for the header. */
export function EagleSeal({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative grid aspect-square place-items-center overflow-hidden rounded-full border-4 border-gold bg-[#2A3577] shadow-[0_0_0_6px_oklch(0.22_0.07_265),0_0_0_8px_var(--gold)]",
        className
      )}
    >
      <div className="starfield absolute inset-0 opacity-25" aria-hidden="true" />
      <EagleHead className="relative mt-[18%] w-[92%]" />
    </div>
  );
}

/** Bald eagle soaring with wings spread wide, heading right. */
export function SoaringEagle({ className }: { className?: string }) {
  const wing =
    "M140 52 C120 44 90 37 60 35 C40 34 22 35 10 39 L3 45 L16 46 L5 52 L20 52 L9 59 L26 57 L19 64 L36 61 C60 65 92 67 120 67 L140 67 Z";
  const coverts = "M138 54 C116 48 92 44 68 43 C71 51 75 58 82 62 C102 64 120 65 138 65 Z";
  return (
    <svg viewBox="0 0 300 120" className={cn("drop-shadow-lg", className)} role="img" aria-label="Soaring bald eagle">
      <g className="wing-h">
        <path d={wing} fill="#2E1D10" />
        <path d={coverts} fill="#4A301B" />
      </g>
      <g transform="translate(300 0) scale(-1 1)">
        <g className="wing-h">
          <path d={wing} fill="#2E1D10" />
          <path d={coverts} fill="#4A301B" />
        </g>
      </g>
      {/* white tail fan */}
      <path d="M141 74 L134 101 L142 106 L150 108 L158 106 L166 101 L159 74 Z" fill="#F4F1E8" stroke="#D8D2C2" strokeWidth={1} />
      {/* body */}
      <ellipse cx={150} cy={60} rx={12} ry={19} fill="#3A2414" />
      {/* yellow feet */}
      <path d="M145 76 L143 82 M155 76 L157 82" stroke="#E5A81E" strokeWidth={3} strokeLinecap="round" />
      {/* white head turned right, hooked beak */}
      <ellipse cx={151} cy={39} rx={10} ry={9} fill="#F7F5EF" />
      <path d="M159 36 C165 35 169 38 168 42 C166 41 163 41 160 43 Z" fill="#F0B22A" />
      <circle cx={155} cy={37} r={1.3} fill="#141414" />
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

/** State outline from Census boundaries, filled with currentColor. */
export function StateShape({ abbr, className }: { abbr: string; className?: string }) {
  const d = STATE_SHAPES[abbr];
  if (!d) return null;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={d} fill="currentColor" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

/** State flag thumbnail served from /public/flags. */
export function StateFlag({ abbr, name, className }: { abbr: string; name: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${abbr}.svg`}
      alt={`${name} flag`}
      width={36}
      height={24}
      loading="lazy"
      className={cn("aspect-[3/2] rounded-[3px] object-cover shadow-sm ring-1 ring-black/15", className)}
    />
  );
}
