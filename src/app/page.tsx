import { BingoBoard } from "@/components/bingo-board";
import { EagleSeal, Flag, StarRow } from "@/components/patriotic";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="starfield pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 pt-8 pb-16 sm:pt-12">
        <header className="mb-8 text-center">
          <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <Flag side="left" className="w-full max-w-36 justify-self-end" />
            <EagleSeal className="w-28 sm:w-36" />
            <Flag side="right" className="w-full max-w-36 justify-self-start" />
          </div>
          <StarRow className="mb-3" />
          <h1 className="font-display text-4xl leading-tight text-white drop-shadow-[0_3px_0_var(--flag-red)] sm:text-6xl">
            Senate Call Bingo
          </h1>
          <p className="mt-2 text-sm tracking-[0.3em] text-gold uppercase sm:text-base">Election night 2026</p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">
            Nine of the twelve closest Senate races. A square counts the moment CNN or Fox projects a winner. First to
            three in a row wins. Everyone gets their own random card, with the safest early call locked in the center.
          </p>
        </header>

        <BingoBoard />

        <footer className="mt-10 text-center text-xs text-white/50">
          Poll times are the latest scheduled close in each state, Eastern Time. Ratings from the Cook Political
          Report&apos;s fall 2026 updates. Your card saves in this browser.
        </footer>
      </div>
    </main>
  );
}
