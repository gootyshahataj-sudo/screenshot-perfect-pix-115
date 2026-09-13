export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type DetectionKind = "call" | "screen";

export type Detection = {
  id: string;
  kind: DetectionKind;
  title: string;
  subtitle: string;
  confidence: number;
  risk: RiskLevel;
  at: number;
};

const HISTORY_KEY = "smartguard.history.v1";
const SETTINGS_KEY = "smartguard.settings.v1";
export const HISTORY_EVENT = "smartguard:history";
export const SETTINGS_EVENT = "smartguard:settings";

export const seedHistory: Detection[] = [
  {
    id: "seed-1",
    kind: "call",
    title: "Potential Spam",
    subtitle: "+91 98765 43210",
    confidence: 91,
    risk: "HIGH",
    at: Date.now() - 1000 * 60 * 2,
  },
  {
    id: "seed-2",
    kind: "screen",
    title: "Possible phishing",
    subtitle: "Payment request",
    confidence: 94,
    risk: "HIGH",
    at: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "seed-3",
    kind: "call",
    title: "Unknown caller",
    subtitle: "+91 90210 55871",
    confidence: 61,
    risk: "MEDIUM",
    at: Date.now() - 1000 * 60 * 60 * 27,
  },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadHistory(): Detection[] {
  if (!isBrowser()) return seedHistory;
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return seedHistory;
    const parsed = JSON.parse(raw) as Detection[];
    return Array.isArray(parsed) ? parsed : seedHistory;
  } catch {
    return seedHistory;
  }
}

function persistHistory(items: Detection[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(HISTORY_EVENT));
}

export function addDetection(item: Omit<Detection, "id" | "at">) {
  const next = [
    { ...item, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() },
    ...loadHistory(),
  ].slice(0, 40);
  persistHistory(next);
}

export function clearHistory() {
  persistHistory([]);
}

export type Settings = {
  liveProtection: boolean;
  callerIntelligence: boolean;
  screenIntelligence: boolean;
  localHistory: boolean;
  communityReports: boolean;
};

export const defaultSettings: Settings = {
  liveProtection: true,
  callerIntelligence: true,
  screenIntelligence: true,
  localHistory: true,
  communityReports: true,
};

export function loadSettings(): Settings {
  if (!isBrowser()) return defaultSettings;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: Settings) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
}

export function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}
