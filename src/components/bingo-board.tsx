"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ArrowLeftRight, Check, Clock, MousePointerClick, Shuffle, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Eagle, Flag, StarRow } from "@/components/patriotic";
import { CENTER, LINES, RACES, START_BENCH, START_GRID, dealCard, randomPlayerName, type RaceKey } from "@/lib/races";
import { cn } from "@/lib/utils";

type Network = "CNN" | "Fox";
type Call = { time: string; network: Network };
type Where = "grid" | "bench";
type Selection = { key: RaceKey; where: Where; index: number } | null;

type Saved = {
  grid: RaceKey[];
  bench: RaceKey[];
  calls: Partial<Record<RaceKey, Call>>;
  player: string;
};

const STORAGE_KEY = "senate-bingo-2026";
const COLORS = ["#B22234", "#FFFFFF", "#3C3B6E", "#F2C14E"];

function burstFrom(el: HTMLElement | null) {
  const rect = el?.getBoundingClientRect();
  const origin = rect
    ? {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      }
    : { x: 0.5, y: 0.5 };
  confetti({ particleCount: 70, spread: 75, startVelocity: 32, origin, colors: COLORS, scalar: 0.9 });
  confetti({ particleCount: 18, spread: 100, startVelocity: 26, origin, colors: COLORS, shapes: ["star"], scalar: 1.3 });
}

function fireworks() {
  const end = Date.now() + 3200;
  const tick = () => {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: COLORS, shapes: ["star", "square"] });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: COLORS, shapes: ["star", "square"] });
    if (Date.now() < end) requestAnimationFrame(tick);
  };
  tick();
  confetti({ particleCount: 180, spread: 140, startVelocity: 45, origin: { y: 0.55 }, colors: COLORS, shapes: ["star"], scalar: 1.4 });
}

export function BingoBoard() {
  const [grid, setGrid] = useState<RaceKey[]>(START_GRID);
  const [bench, setBench] = useState<RaceKey[]>(START_BENCH);
  const [calls, setCalls] = useState<Partial<Record<RaceKey, Call>>>({});
  const [player, setPlayer] = useState("");
  const [mode, setMode] = useState<"mark" | "swap">("mark");
  const [network, setNetwork] = useState<Network>("CNN");
  const [selection, setSelection] = useState<Selection>(null);
  const [eagles, setEagles] = useState<number[]>([]);
  const [popKey, setPopKey] = useState<RaceKey | null>(null);
  const [loaded, setLoaded] = useState(false);
  const tileRefs = useRef<Partial<Record<RaceKey, HTMLButtonElement | null>>>({});
  const seenWins = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  // Restore this visitor's card from localStorage, or deal a fresh random one. This has to run
  // after mount: the server prerenders a neutral board and can't know the visitor's card.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const s = raw ? (JSON.parse(raw) as Saved) : null;
      if (s && Array.isArray(s.grid) && s.grid.length === 9 && Array.isArray(s.bench)) {
        setGrid(s.grid);
        setBench(s.bench);
        setCalls(s.calls ?? {});
        setPlayer(typeof s.player === "string" && s.player ? s.player : randomPlayerName());
        setLoaded(true);
        return;
      }
    } catch {}
    const card = dealCard();
    setGrid(card.grid);
    setBench(card.bench);
    setPlayer(randomPlayerName());
    setLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ grid, bench, calls, player } satisfies Saved));
    } catch {}
  }, [grid, bench, calls, player, loaded]);

  const winningLines = useMemo(
    () => LINES.filter((line) => line.every((i) => calls[grid[i]])),
    [calls, grid]
  );
  const winCells = useMemo(() => new Set(winningLines.flat()), [winningLines]);
  const calledCount = grid.filter((k) => calls[k]).length;

  const launchEagle = useCallback(() => {
    const id = Date.now() + Math.random();
    setEagles((e) => [...e, id]);
    setTimeout(() => setEagles((e) => e.filter((x) => x !== id)), 3800);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const keys = winningLines.map((l) => l.map((i) => grid[i]).join("-"));
    const fresh = keys.filter((k) => !seenWins.current.has(k));
    seenWins.current = new Set(keys);
    // Wins restored from storage on first load don't re-trigger the celebration.
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    if (fresh.length > 0) {
      fireworks();
      launchEagle();
      setTimeout(launchEagle, 700);
    }
  }, [winningLines, grid, loaded, launchEagle]);

  function handleTile(key: RaceKey, where: Where, index: number) {
    if (mode === "mark") {
      if (where !== "grid") return;
      const next = { ...calls };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = {
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          network,
        };
        burstFrom(tileRefs.current[key] ?? null);
        setPopKey(key);
        setTimeout(() => setPopKey(null), 500);
      }
      setCalls(next);
      return;
    }
    if (!selection) {
      setSelection({ key, where, index });
      return;
    }
    if (selection.key === key) {
      setSelection(null);
      return;
    }
    const nextGrid = [...grid];
    const nextBench = [...bench];
    const a = selection.where === "grid" ? nextGrid : nextBench;
    const b = where === "grid" ? nextGrid : nextBench;
    const tmp = a[selection.index];
    a[selection.index] = b[index];
    b[index] = tmp;
    setGrid(nextGrid);
    setBench(nextBench);
    setSelection(null);
  }

  function newCard() {
    if (calledCount > 0 && !window.confirm("Deal a new card? Your marked calls will be cleared.")) return;
    const card = dealCard();
    setGrid(card.grid);
    setBench(card.bench);
    setCalls({});
    setSelection(null);
    seenWins.current = new Set();
  }

  const tile = (key: RaceKey, where: Where, index: number) => {
    const race = RACES[key];
    const call = calls[key];
    const isCenter = where === "grid" && index === 4 && key === CENTER;
    const inWin = where === "grid" && winCells.has(index);
    const selected = selection?.key === key;
    return (
      <button
        key={key}
        ref={(el) => {
          tileRefs.current[key] = el;
        }}
        type="button"
        onClick={() => handleTile(key, where, index)}
        aria-pressed={where === "grid" ? Boolean(call) : undefined}
        className={cn(
          "group relative flex min-h-32 flex-col justify-between overflow-hidden rounded-xl border-2 p-3 text-left transition-all sm:min-h-36 sm:p-4",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60",
          call
            ? "border-called bg-called-bg text-[oklch(0.32_0.09_150)]"
            : "border-border bg-card text-card-foreground hover:-translate-y-0.5 hover:border-navy/40 hover:shadow-md",
          isCenter && !call && "border-flag-red/60",
          inWin && "ring-4 ring-gold shadow-[0_0_24px_oklch(0.82_0.15_85/0.6)]",
          selected && "ring-4 ring-flag-red",
          popKey === key && "pop",
          where === "bench" && "min-h-24 sm:min-h-28 opacity-90"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "font-display pointer-events-none absolute -right-1 -bottom-3 text-6xl leading-none sm:text-7xl",
            call ? "text-called/20" : "text-navy/[0.07]"
          )}
        >
          {race.abbr}
        </span>
        <div className="relative">
          <div className="flex items-start justify-between gap-1">
            <span className="text-[15px] leading-tight font-bold sm:text-base">{race.name}</span>
            {isCenter && (
              <span className="rounded-full bg-flag-red px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                Center
              </span>
            )}
          </div>
          <div className={cn("mt-1 text-xs", call ? "opacity-80" : "text-muted-foreground")}>
            Polls close {race.close} ET · {race.rating}
          </div>
        </div>
        <div className="relative mt-3 flex flex-col gap-1">
          {call ? (
            <Badge className="bg-called text-white">
              <Check /> Called {call.time} · {call.network}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-muted/60 text-muted-foreground">
              <Clock /> Not called
            </Badge>
          )}
          <span className={cn("text-[11px]", call ? "opacity-75" : "text-muted-foreground")}>{race.note}</span>
        </div>
      </button>
    );
  };

  return (
    <div className="relative">
      {eagles.map((id) => (
        <div key={id} className="pointer-events-none fixed top-[18vh] left-0 z-50 eagle-soar">
          <Eagle flapping className="w-40 sm:w-56" />
        </div>
      ))}

      <Card className="relative gap-4 overflow-hidden border-0 py-0 shadow-2xl">
        <div className="stripes h-3 w-full" aria-hidden="true" />
        <CardHeader className="gap-3 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-navy text-lg">{loaded && player ? `${player}'s card` : "Dealing your card…"}</CardTitle>
              <CardDescription>
                {calledCount} of 9 called · {9 - calledCount} still out
              </CardDescription>
            </div>
            <input
              value={player}
              onChange={(e) => setPlayer(e.target.value.slice(0, 24))}
              placeholder="Your name"
              aria-label="Player name"
              className="h-9 w-56 max-w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [--background:white] [--foreground:var(--navy)]"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(v) => {
                if (v) {
                  setMode(v as "mark" | "swap");
                  setSelection(null);
                }
              }}
              className="bg-white"
            >
              <ToggleGroupItem value="mark" aria-label="Mark calls">
                <MousePointerClick /> Mark calls
              </ToggleGroupItem>
              <ToggleGroupItem value="swap" aria-label="Rearrange">
                <ArrowLeftRight /> Rearrange
              </ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup
              type="single"
              value={network}
              onValueChange={(v) => v && setNetwork(v as Network)}
              className="bg-white"
            >
              <ToggleGroupItem value="CNN">CNN</ToggleGroupItem>
              <ToggleGroupItem value="Fox">Fox</ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={newCard}
              className="ml-auto bg-white text-navy hover:bg-muted"
            >
              <Shuffle /> New card
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            {mode === "mark"
              ? "Tap a square the moment CNN or Fox projects a winner. Tap again to undo."
              : "Tap two squares to swap them. Bench races can be swapped onto your card."}
          </p>
        </CardHeader>

        <CardContent className="pb-2">
          <div
            className={cn("grid grid-cols-3 gap-2 transition-opacity duration-300 sm:gap-3", !loaded && "opacity-0")}
            aria-busy={!loaded}
          >
            {grid.map((k, i) => tile(k, "grid", i))}
          </div>

          {winningLines.length > 0 && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-gold bg-[oklch(0.97_0.05_90)] p-3 text-navy">
              <Trophy className="size-6 shrink-0 text-[oklch(0.6_0.14_75)]" />
              <div>
                <div className="font-display text-xl">Bingo!</div>
                <div className="text-sm">
                  {winningLines.map((l) => l.map((i) => RACES[grid[i]].abbr).join(" · ")).join("   |   ")}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">Bench</div>
            <div className={cn("grid grid-cols-3 gap-2 sm:gap-3", !loaded && "opacity-0")}>
              {bench.map((k, i) => tile(k, "bench", i))}
            </div>
          </div>
        </CardContent>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-6 py-3 text-xs text-muted-foreground">
          <Legend swatch="bg-card border-border" label="Not called" />
          <Legend swatch="bg-called-bg border-called" label="Called" />
          <Legend swatch="bg-card border-gold ring-2 ring-gold" label="Part of a bingo" />
        </div>
        <div className="stripes h-3 w-full" aria-hidden="true" />
      </Card>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Flag className="w-16" />
        <StarRow />
        <Flag className="w-16 -scale-x-100" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-3 rounded-sm border-2", swatch)} />
      {label}
    </span>
  );
}
