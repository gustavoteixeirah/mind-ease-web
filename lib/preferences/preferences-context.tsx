"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type BreakMinutes,
  type ColorTheme,
  type FocusMinutes,
  type TextSize,
  type UserPreferences,
  DEFAULT_PREFERENCES,
  loadPreferences,
  savePreferences,
} from "./types";

interface PreferencesContextValue extends UserPreferences {
  setTextSize: (v: TextSize) => void;
  setFocusMinutes: (v: FocusMinutes) => void;
  setBreakMinutes: (v: BreakMinutes) => void;
  setColorTheme: (v: ColorTheme) => void;
  save: () => void;
  isDirty: boolean;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const initialFromStorage = (): UserPreferences => {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  return loadPreferences();
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    const loaded = initialFromStorage();
    setPrefs(loaded);
    setSaved(loaded);
    applyPreferencesToDocument(loaded);
  }, []);

  const setTextSize = useCallback((textSize: TextSize) => {
    setPrefs((p) => ({ ...p, textSize }));
  }, []);
  const setFocusMinutes = useCallback((focusMinutes: FocusMinutes) => {
    setPrefs((p) => ({ ...p, focusMinutes }));
  }, []);
  const setBreakMinutes = useCallback((breakMinutes: BreakMinutes) => {
    setPrefs((p) => ({ ...p, breakMinutes }));
  }, []);
  const setColorTheme = useCallback((colorTheme: ColorTheme) => {
    setPrefs((p) => ({ ...p, colorTheme }));
  }, []);

  const save = useCallback(() => {
    savePreferences(prefs);
    setSaved(prefs);
    applyPreferencesToDocument(prefs);
  }, [prefs]);

  const isDirty =
    prefs.textSize !== saved.textSize ||
    prefs.focusMinutes !== saved.focusMinutes ||
    prefs.breakMinutes !== saved.breakMinutes ||
    prefs.colorTheme !== saved.colorTheme;

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...prefs,
      setTextSize,
      setFocusMinutes,
      setBreakMinutes,
      setColorTheme,
      save,
      isDirty,
    }),
    [
      prefs,
      setTextSize,
      setFocusMinutes,
      setBreakMinutes,
      setColorTheme,
      save,
      isDirty,
    ]
  );

  useEffect(() => {
    applyPreferencesToDocument(prefs);
  }, [prefs.textSize, prefs.colorTheme]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

const THEME_COLORS: Record<ColorTheme, string> = {
  blue: "#7eb8da",
  purple: "#c4b5fd",
  pink: "#f9a8d4",
  yellow: "#fde047",
  orange: "#fdba74",
  green: "#86efac",
  gray: "#d4d4d4",
};

export function getThemeColor(theme: ColorTheme): string {
  return THEME_COLORS[theme] ?? THEME_COLORS.blue;
}

function applyPreferencesToDocument(prefs: UserPreferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--mindease-accent", getThemeColor(prefs.colorTheme));
  const sizeMap = { compact: "14px", comfort: "16px", accessible: "18px" } as const;
  const baseSize = sizeMap[prefs.textSize];
  root.style.setProperty("--mindease-base-font-size", baseSize);
  root.style.fontSize = baseSize;
}
