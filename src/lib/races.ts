export type RaceKey = "GA" | "OH" | "IA" | "NH" | "NC" | "NE" | "TX" | "MI" | "ME" | "AK" | "SC" | "FL";

export type Race = {
  name: string;
  abbr: string;
  /** Latest scheduled poll close in the state, Eastern Time. */
  close: string;
  rating: string;
  note: string;
};

export const RACES: Record<RaceKey, Race> = {
  GA: { name: "Georgia", abbr: "GA", close: "7:00 PM", rating: "Lean D", note: "Runoff if under 50%" },
  OH: { name: "Ohio", abbr: "OH", close: "7:30 PM", rating: "Toss\u2011up", note: "Fast count" },
  IA: { name: "Iowa", abbr: "IA", close: "9:00 PM", rating: "Toss\u2011up", note: "Fast count" },
  NH: { name: "New Hampshire", abbr: "NH", close: "8:00 PM", rating: "Lean D", note: "Small, quick state" },
  NC: { name: "North Carolina", abbr: "NC", close: "7:30 PM", rating: "Lean D", note: "Safest early call" },
  NE: { name: "Nebraska", abbr: "NE", close: "9:00 PM", rating: "Likely R", note: "Independent challenger" },
  TX: { name: "Texas", abbr: "TX", close: "9:00 PM", rating: "Toss\u2011up", note: "El Paso closes last" },
  MI: { name: "Michigan", abbr: "MI", close: "9:00 PM", rating: "Toss\u2011up", note: "Western UP closes last" },
  ME: { name: "Maine", abbr: "ME", close: "8:00 PM", rating: "Toss\u2011up", note: "Ranked-choice risk" },
  AK: { name: "Alaska", abbr: "AK", close: "1:00 AM", rating: "Toss\u2011up", note: "RCV, can take weeks" },
  SC: { name: "South Carolina", abbr: "SC", close: "7:00 PM", rating: "Toss\u2011up", note: "Graham's seat, early close" },
  FL: { name: "Florida", abbr: "FL", close: "8:00 PM", rating: "Battleground", note: "Special; Trump +13 in 2024" },
};

export const START_GRID: RaceKey[] = ["GA", "OH", "IA", "NH", "NC", "NE", "TX", "MI", "ME"];
export const START_BENCH: RaceKey[] = ["AK", "SC", "FL"];

/** The most secure early call always sits in the center square. */
export const CENTER: RaceKey = "NC";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Deal a random card: center fixed, the other eight drawn from the remaining nine races. */
export function dealCard(): { grid: RaceKey[]; bench: RaceKey[] } {
  const others = shuffle((Object.keys(RACES) as RaceKey[]).filter((k) => k !== CENTER));
  const picked = others.slice(0, 8);
  const grid = [...picked.slice(0, 4), CENTER, ...picked.slice(4)];
  return { grid, bench: others.slice(8) };
}

const ADJ = ["Bald", "Star-Spangled", "Liberty", "Swing", "Ballot", "Grand", "Bellwether", "Battleground", "Red-White-Blue", "Filibuster"];
const NOUN = ["Eagle", "Bison", "Pollster", "Delegate", "Senator", "Whip", "Caucus", "Precinct", "Patriot", "Gavel"];

export function randomPlayerName(): string {
  const a = ADJ[Math.floor(Math.random() * ADJ.length)];
  const n = NOUN[Math.floor(Math.random() * NOUN.length)];
  return `${a} ${n} ${Math.floor(10 + Math.random() * 90)}`;
}

export const LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
