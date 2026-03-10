"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { UserRecord, UserPreferences, EnergyLevel } from "@/types";
import { getCurrentUserId } from "@/utils/users";

// -- Preferências Default ---

const defaultPreferences: UserPreferences = {
  textSize: "conforto",
  colorTheme: "default",
  pomodoro: {
    focusMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    totalCycles: 4,
  },
};

interface UserContextValue {
  // State
  userId: string | null;
  preferences: UserPreferences;
  todayEnergy: EnergyLevel | null;
  isLoading: boolean;

  // Actions
  setTodayEnergy: (level: EnergyLevel) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
  userId: string;
}

export function UserProvider({ children, userId }: UserProviderProps) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [todayEnergy, setTodayEnergyState] = useState<EnergyLevel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: cria entrada no db se for o primeiro login, carregar preferências + energia de hoje --- IGNORE ---
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        // getOrCreateUser — safe to call on every mount
        const userRes = await fetch("/api/users/init", { method: "POST" });
        const userRecord: UserRecord = await userRes.json();
        setPreferences(userRecord.preferences);

        // Load today's energy separately
        const today = new Date().toISOString().split("T")[0];
        const energyRes = await fetch(`/api/energy?date=${today}`);
        const energyData = await energyRes.json();
        setTodayEnergyState(energyData.level ?? null);
      } catch (err) {
        console.error("Failed to initialize user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [userId]);

  const setTodayEnergy = useCallback(
    async (level: EnergyLevel) => {
      if (!userId) return;

      // Optimistic update
      setTodayEnergyState(level);

      const today = new Date().toISOString().split("T")[0];

      await fetch("/api/energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, level }),
        // userId comes from Stack Auth server-side, not from the body
      });
    },
    [userId],
  );

  const updatePreferences = useCallback(
    async (partial: Partial<UserPreferences>) => {
      if (!userId) return;

      const updated: UserPreferences = {
        ...preferences,
        ...partial,
        // Deep merge pomodoro separately so partial updates don't wipe other fields
        pomodoro: {
          ...preferences.pomodoro,
          ...(partial.pomodoro ?? {}),
        },
      };

      // Optimistic update
      setPreferences(updated);

      await fetch("/api/users/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: updated }),
        // userId comes from Stack Auth server-side
      });
    },
    [userId, preferences],
  );

  return (
    <UserContext.Provider
      value={{
        userId,
        preferences,
        todayEnergy,
        isLoading,
        setTodayEnergy,
        updatePreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// --- Hook de acesso ao contexto ---
export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
