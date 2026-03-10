export type TextSize = "compact" | "comfort" | "accessible";
export type FocusMinutes = 25 | 30 | 35;
export type BreakMinutes = 2 | 5 | 10;
export type ColorTheme = "blue" | "purple" | "pink" | "yellow" | "orange" | "green" | "gray";

export interface UserPreferences {
  textSize: TextSize;
  focusMinutes: FocusMinutes;
  breakMinutes: BreakMinutes;
  colorTheme: ColorTheme;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  textSize: "comfort",
  focusMinutes: 25,
  breakMinutes: 5,
  colorTheme: "blue",
};

const STORAGE_KEY = "mindease-preferences";

function parseStored(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
    };
  } catch {
    return null;
  }
}

export function loadPreferences(): UserPreferences {
  return parseStored() ?? DEFAULT_PREFERENCES;
}

export function savePreferences(prefs: UserPreferences): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}
