"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { Task, TimerState, FocusOrigin, TotalCycles } from "@/types";
import { useUser } from "./UserContext";
import { useTask } from "./TaskContext";

const timerLabel: Record<TimerState, string> = {
  idle: "Iniciar foco",
  focusing: "Em foco",
  on_break: "Em pausa",
  on_long_rest: "Em pausa longa",
  cycle_done: "Iniciar foco",
};

function getNextLabel(
  state: TimerState,
  cycle: number,
  totalCycles: number,
): string {
  switch (state) {
    case "idle":
    case "cycle_done":
      return `Próximo: Pausa curta · Ciclo 1/${totalCycles}`;
    case "focusing":
      return cycle < totalCycles
        ? `Próximo: Pausa curta · Ciclo ${cycle}/${totalCycles}`
        : `Próximo: Pausa longa · Ciclo ${cycle}/${totalCycles}`;
    case "on_break":
      return `Próximo: Foco · Ciclo ${cycle}/${totalCycles}`;
    case "on_long_rest":
      return "Próximo: Novo ciclo";
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// --- Session persistence ---

const SESSION_KEY = "focus_session";

interface PersistedSession {
  activeTask: Task;
  timerState: TimerState;
  currentCycle: number;
  totalCycles: TotalCycles;
  origin: FocusOrigin | null;
  isPaused: boolean;
  startedAt: number | null;
  blockDuration: number;
  pausedAt: number | null;
  totalSeconds: number;
}

function saveSession(data: PersistedSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {}
}

function loadSession(): PersistedSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}

interface FocusContextValue {
  activeTask: Task | null;
  timerState: TimerState;
  currentCycle: number;
  totalCycles: TotalCycles;
  secondsRemaining: number;
  origin: FocusOrigin | null;
  isPaused: boolean;
  isActive: boolean;
  isFocusing: boolean;
  formattedTime: string;
  label: string;
  nextLabel: string;
  progress: number;
  startFocus: (task: Task, origin: FocusOrigin) => void;
  toggleTimer: () => void;
  addFiveMinutes: () => void;
  stopFocus: () => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: ReactNode }) {
  const { preferences } = useUser();
  const { tasks } = useTask();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState<TotalCycles>(4);
  const [origin, setOrigin] = useState<FocusOrigin | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [blockDuration, setBlockDuration] = useState(0);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Refs for values that need to be read inside callbacks without stale closures
  const currentCycleRef = useRef(1);
  const timerStateRef = useRef<TimerState>("idle");
  const isPausedRef = useRef(false);
  const pausedAtRef = useRef<number | null>(null);
  const blockDurationRef = useRef(0);
  const secondsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const totalSecondsRef = useRef(0);

  const sounds = useRef({
    start: typeof Audio !== "undefined" ? new Audio("/sounds/start.mp3") : null,
    focusToBreak:
      typeof Audio !== "undefined"
        ? new Audio("/sounds/focus-to-break.mp3")
        : null,
    breakToFocus:
      typeof Audio !== "undefined"
        ? new Audio("/sounds/break-to-focus.mp3")
        : null,
    longStart:
      typeof Audio !== "undefined" ? new Audio("/sounds/long-start.mp3") : null,
    longEnd:
      typeof Audio !== "undefined" ? new Audio("/sounds/long-end.mp3") : null,
  });

  // --- Keep refs in sync with state ---

  useEffect(() => {
    currentCycleRef.current = currentCycle;
  }, [currentCycle]);
  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    pausedAtRef.current = pausedAt;
  }, [pausedAt]);
  useEffect(() => {
    blockDurationRef.current = blockDuration;
  }, [blockDuration]);
  useEffect(() => {
    secondsRef.current = secondsRemaining;
  }, [secondsRemaining]);
  useEffect(() => {
    startedAtRef.current = startedAt;
  }, [startedAt]);
  useEffect(() => {
    totalSecondsRef.current = totalSeconds;
  }, [totalSeconds]);

  // Hidratar do sessionStorage no mount para restaurar sessão de foco em caso de reload acidental ou navegação temporária para outra página.
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setActiveTask(saved.activeTask);
      setTimerState(saved.timerState);
      setCurrentCycle(saved.currentCycle);
      setTotalCycles(saved.totalCycles);
      setOrigin(saved.origin);
      setIsPaused(saved.isPaused);
      setStartedAt(saved.startedAt);
      setBlockDuration(saved.blockDuration);
      setPausedAt(saved.pausedAt);
      setTotalSeconds(saved.totalSeconds);

      // Sync refs immediately so callbacks are correct before first render
      currentCycleRef.current = saved.currentCycle;
      timerStateRef.current = saved.timerState;
      isPausedRef.current = saved.isPaused;
      pausedAtRef.current = saved.pausedAt;
      blockDurationRef.current = saved.blockDuration;
      startedAtRef.current = saved.startedAt;

      // Recalculate secondsRemaining from wall clock
      if (saved.startedAt && !saved.isPaused) {
        const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
        const remaining = Math.max(saved.blockDuration - elapsed, 0);
        setSecondsRemaining(remaining);
        secondsRef.current = remaining;
      } else if (saved.pausedAt !== null) {
        setSecondsRemaining(saved.pausedAt);
        secondsRef.current = saved.pausedAt;
      } else {
        setSecondsRemaining(saved.blockDuration);
        secondsRef.current = saved.blockDuration;
      }
    }
    setHydrated(true);
  }, []);

  // Persistir no sessionStorage sempre que o estado relevante mudar
  // - sessão ativa, timerState, ciclo

  useEffect(() => {
    if (!hydrated || !activeTask) return;
    saveSession({
      activeTask,
      timerState,
      currentCycle,
      totalCycles,
      origin,
      isPaused,
      startedAt,
      blockDuration,
      pausedAt,
      totalSeconds,
    });
  }, [
    hydrated,
    activeTask,
    timerState,
    currentCycle,
    totalCycles,
    origin,
    isPaused,
    startedAt,
    blockDuration,
    pausedAt,
    totalSeconds,
  ]);

  // Sync totalCycles from preferences
  useEffect(() => {
    if (preferences) setTotalCycles(preferences.pomodoro.totalCycles);
  }, [preferences]);

  // Keep activeTask synced with TaskContext (subtask toggles, etc.)
  useEffect(() => {
    if (!activeTask) return;
    const updated = tasks.find((t) => t.id === activeTask.id);
    if (updated) setActiveTask(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // --- Tick ---

  const tick = useCallback(() => {
    if (startedAt === null || isPausedRef.current) return;
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const remaining = Math.max(blockDurationRef.current - elapsed, 0);
    setSecondsRemaining(remaining);
    secondsRef.current = remaining;
  }, [startedAt]); // only re-create when startedAt changes

  useEffect(() => {
    const running =
      !isPaused &&
      (timerState === "focusing" ||
        timerState === "on_break" ||
        timerState === "on_long_rest");

    if (running) {
      tick();
      intervalRef.current = setInterval(tick, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, timerState, tick]);

  // --- Helpers ---

  const playSound = useCallback((key: keyof typeof sounds.current) => {
    const audio = sounds.current[key];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  const beginBlock = useCallback((durationSeconds: number) => {
    const now = Date.now();
    setStartedAt(now);
    startedAtRef.current = now; // sync imediatamente
    setBlockDuration(durationSeconds);
    setPausedAt(null);
    setSecondsRemaining(durationSeconds);
    setTotalSeconds(durationSeconds);
    blockDurationRef.current = durationSeconds;
    pausedAtRef.current = null;
    secondsRef.current = durationSeconds;
    setTotalSeconds(durationSeconds);
    totalSecondsRef.current = durationSeconds;
  }, []);
  // --- Timer end transition ---

  const handleTimerEnd = useCallback(() => {
    if (!preferences) return;

    const { focusMinutes, shortBreakMinutes, longBreakMinutes } =
      preferences.pomodoro;
    const cycle = currentCycleRef.current;
    const state = timerStateRef.current;

    if (state === "focusing") {
      if (cycle >= totalCycles) {
        playSound("longStart");
        setTimerState("on_long_rest");
        beginBlock(longBreakMinutes * 60);
      } else {
        playSound("focusToBreak");
        setTimerState("on_break");
        beginBlock(shortBreakMinutes * 60);
      }
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }

    if (state === "on_break") {
      playSound("breakToFocus");
      setCurrentCycle((c) => c + 1);
      setTimerState("focusing");
      beginBlock(focusMinutes * 60);
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }

    if (state === "on_long_rest") {
      playSound("longEnd");
      setCurrentCycle(1);
      setTimerState("cycle_done");
      beginBlock(focusMinutes * 60);
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }
  }, [preferences, totalCycles, playSound, beginBlock]);

  useEffect(() => {
    if (
      secondsRemaining === 0 &&
      (timerState === "focusing" ||
        timerState === "on_break" ||
        timerState === "on_long_rest") &&
      !isPaused &&
      startedAt !== null
    ) {
      handleTimerEnd();
    }
  }, [secondsRemaining, timerState, isPaused, startedAt, handleTimerEnd]);

  // --- Public actions ---

  const startFocus = useCallback(
    (task: Task, focusOrigin: FocusOrigin) => {
      setIsPanelOpen(true); // ← add this
      if (activeTask?.id === task.id) {
        setOrigin(focusOrigin);
        return;
      }

      const secs = preferences.pomodoro.focusMinutes * 60;

      setActiveTask(task);
      setOrigin(focusOrigin);
      setTimerState("idle");
      timerStateRef.current = "idle";
      setCurrentCycle(1);
      currentCycleRef.current = 1;
      setTotalCycles(preferences.pomodoro.totalCycles);
      setIsPaused(false);
      isPausedRef.current = false;
      setStartedAt(null);
      setPausedAt(null);
      pausedAtRef.current = null;
      setBlockDuration(secs);
      blockDurationRef.current = secs;
      setSecondsRemaining(secs);
      secondsRef.current = secs;
      setTotalSeconds(secs);
    },
    [preferences, activeTask?.id],
  );

  const toggleTimer = useCallback(() => {
    if (!preferences) return;

    const state = timerStateRef.current;

    if (state === "idle" || state === "cycle_done") {
      playSound("start");
      setTimerState("focusing");
      timerStateRef.current = "focusing";
      beginBlock(blockDurationRef.current); // usa current blockDuration, not preferences
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }

    if (
      state === "focusing" ||
      state === "on_break" ||
      state === "on_long_rest"
    ) {
      if (!isPausedRef.current) {
        // Pause
        const remaining = secondsRef.current;
        setPausedAt(remaining);
        pausedAtRef.current = remaining;
        setIsPaused(true);
        isPausedRef.current = true;
      } else {
        // Resume — shift startedAt so elapsed time accounts for paused duration
        const remaining = pausedAtRef.current ?? secondsRef.current;
        const newStart =
          Date.now() - (blockDurationRef.current - remaining) * 1000;
        setStartedAt(newStart);
        setPausedAt(null);
        pausedAtRef.current = null;
        setIsPaused(false);
        isPausedRef.current = false;
      }
    }
    // No state/ref deps needed — everything read via refs
  }, [preferences, playSound, beginBlock]);

  const addFiveMinutes = useCallback(() => {
    const extra = 300;
    const newBlockDuration = blockDurationRef.current + extra;
    const newTotalSeconds = totalSeconds + extra; // read from state — but use ref instead

    // Update block duration synchronously
    blockDurationRef.current = newBlockDuration;
    setBlockDuration(newBlockDuration);
    setTotalSeconds((t) => t + extra);

    if (isPausedRef.current) {
      const newRemaining = secondsRef.current + extra;
      setPausedAt(newRemaining);
      pausedAtRef.current = newRemaining;
      setSecondsRemaining(newRemaining);
      secondsRef.current = newRemaining;
    } else if (startedAtRef.current === null) {
      // Idle
      const newRemaining = secondsRef.current + extra;
      setSecondsRemaining(newRemaining);
      secondsRef.current = newRemaining;
    } else {
      // Running — shift startedAt back by extra seconds
      const shifted = startedAtRef.current - extra * 1000;
      setStartedAt(shifted);
      startedAtRef.current = shifted;
      // Recalculate remaining based on new startedAt and new blockDuration
      const elapsed = Math.floor((Date.now() - shifted) / 1000);
      const remaining = Math.max(newBlockDuration - elapsed, 0);
      setSecondsRemaining(remaining);
      secondsRef.current = remaining;
    }
  }, []);

  const stopFocus = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    clearSession();
    setActiveTask(null);
    setTimerState("idle");
    timerStateRef.current = "idle";
    setCurrentCycle(1);
    currentCycleRef.current = 1;
    setStartedAt(null);
    setPausedAt(null);
    pausedAtRef.current = null;
    setBlockDuration(0);
    blockDurationRef.current = 0;
    setSecondsRemaining(0);
    secondsRef.current = 0;
    setTotalSeconds(0);
    setOrigin(null);
    setIsPaused(false);
    isPausedRef.current = false;
  }, []);

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  // --- Derived ---

  const isActive = timerState !== "idle" && timerState !== "cycle_done";
  const isFocusing = timerState === "focusing";

  const progress = useMemo(() => {
    if (totalSeconds === 0) return 0;
    return 1 - secondsRemaining / totalSeconds;
  }, [secondsRemaining, totalSeconds]);

  return (
    <FocusContext.Provider
      value={{
        activeTask,
        timerState,
        currentCycle,
        totalCycles,
        secondsRemaining,
        origin,
        isPaused,
        isActive,
        isFocusing,
        formattedTime: formatTime(secondsRemaining),
        label: timerLabel[timerState],
        nextLabel: getNextLabel(timerState, currentCycle, totalCycles),
        progress,
        startFocus,
        toggleTimer,
        addFiveMinutes,
        stopFocus,
        isPanelOpen,
        setIsPanelOpen,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

// --- Hook ---

export function useFocus(): FocusContextValue {
  const ctx = useContext(FocusContext);
  if (!ctx)
    throw new Error("useFocus precisa ser usado dentro de <FocusProvider>");
  return ctx;
}
