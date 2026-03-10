"use client";

import { useUser as useStackUser } from "@stackframe/stack";
import { useUser } from "@/presentation/context/UserContext";
import type {
  TextSize,
  ColorTheme,
  ShortBreakMinutes,
  FocusMinutes,
} from "@/types";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";
import HeaderSimple from "@/components/ui/header-simple";
import { Card } from "@/components/ui/card";
import { RadioButton } from "@/components/ui/radio-button";

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: "compacto", label: "Compacto A↓" },
  { value: "conforto", label: "Conforto AA" },
  { value: "acessivel", label: "Acessível A↑" },
];

const FOCUS_OPTIONS: { value: FocusMinutes; label: string }[] = [
  { value: 25, label: "25m" },
  { value: 30, label: "30m" },
  { value: 35, label: "35m" },
];

const BREAK_OPTIONS: { value: ShortBreakMinutes; label: string }[] = [
  { value: 2, label: "2m" },
  { value: 5, label: "5m" },
  { value: 10, label: "10m" },
];

const COLOR_THEMES: { value: ColorTheme; hex: string; label: string }[] = [
  { value: "default", hex: "#cbe4f7", label: "Azul" },
  { value: "roxo", hex: "#d8d1f5", label: "Roxo" },
  { value: "rosa", hex: "#ecbed5", label: "Rosa" },
  { value: "amarelo", hex: "#f8eecd", label: "Amarelo" },
  { value: "laranja", hex: "#fad5be", label: "Laranja" },
  { value: "verde", hex: "#b6dfce", label: "Verde" },
  { value: "cinza", hex: "#ddd9da", label: "Cinza" },
];

export default function PerfilPage() {
  const stackUser = useStackUser();
  const { preferences, updatePreferences } = useUser();
  const { textSize, colorTheme, pomodoro } = preferences;

  const hasName = Boolean(stackUser?.displayName?.trim());
  const displayName = stackUser?.displayName?.trim() || "";
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [savingName, setSavingName] = useState(false);

  const handleStartEditName = useCallback(() => {
    setNameInput(displayName);
    setEditingName(true);
  }, [displayName]);

  const handleSaveName = useCallback(async () => {
    if (!stackUser) {
      setEditingName(false);
      return;
    }
    if (nameInput.trim() === displayName) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await stackUser.update({ displayName: nameInput.trim() });
      setEditingName(false);
    } catch {
      // keep editing on error
    } finally {
      setSavingName(false);
    }
  }, [stackUser, nameInput, displayName]);

  const handleKeyDownName = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSaveName();
      if (e.key === "Escape") {
        setNameInput(displayName);
        setEditingName(false);
      }
    },
    [handleSaveName, displayName],
  );

  return (
    <div className="flex flex-col h-full">
      <HeaderSimple title="Perfil" />
      <Card className="flex flex-col h-full gap-4 p-4 pt-10 md:pb-10 md:px-6 md:overflow-y-auto">
        {/* Avatar + nome */}
        <div className="flex gap-4 items-center">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-full sm:size-16"
            style={{ backgroundColor: "rgb(var(--user-theme))" }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            {editingName ? (
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="perfil-nome" className="sr-only">
                  Seu nome
                </label>
                <input
                  id="perfil-nome"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={handleKeyDownName}
                  className="rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-[#1a1a1a] outline-none focus:border-[var(--mindease-accent)]"
                  placeholder="Seu nome"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#333] disabled:opacity-50"
                >
                  {savingName ? "Salvando…" : "Salvar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(displayName);
                    setEditingName(false);
                  }}
                  className="text-sm text-[#6b6b6b] underline hover:text-[#1a1a1a]"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEditName}
                aria-label={
                  hasName ? `Editar nome: ${displayName}` : "Adicionar nome"
                }
                className="text-left underline decoration-[#1a1a1a]/50 underline-offset-2 hover:decoration-[#1a1a1a] font-atkinson"
                style={{ fontSize: "var(--title-font-size)" }}
              >
                {hasName ? displayName : "Adicionar nome"}
              </button>
            )}
          </div>
        </div>

        {/* Preferências */}
        <section
          className="mt-8 sm:mt-10 flex flex-1 flex-col pb-20 md:pb-0"
          aria-labelledby="preferencias-heading"
        >
          <h2
            id="preferencias-heading"
            className="mb-6 text-[#1a1a1a] font-atkinson"
            style={{ fontSize: "var(--title-font-size)" }}
          >
            Preferências
          </h2>

          <div className="flex flex-col items-start gap-6">
            {/* Tamanho do texto */}
            <div
              className="flex w-full flex-col gap-2"
              role="group"
              aria-labelledby="text-size-label"
            >
              <p
                id="text-size-label"
                className="text-[#1a1a1a]"
                style={{ fontSize: "var(--body-font-size)" }}
              >
                Tamanho do texto
              </p>
              <div className="flex w-full gap-2">
                {TEXT_SIZE_OPTIONS.map(({ value, label }) => (
                  <RadioButton
                    key={value}
                    id={`text-size-${value}`}
                    value={value}
                    label={label}
                    checked={textSize === value}
                    onChange={(val) => {
                      if (val) updatePreferences({ textSize: val as TextSize });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Minutos de foco */}
            <div
              className="flex w-full flex-col gap-2"
              role="group"
              aria-labelledby="focus-label"
            >
              <p
                id="focus-label"
                className="text-[#1a1a1a]"
                style={{ fontSize: "var(--body-font-size)" }}
              >
                Quantos minutos de foco?
              </p>
              <div className="flex w-full gap-2">
                {FOCUS_OPTIONS.map(({ value, label }) => (
                  <RadioButton
                    key={value}
                    id={`focus-${value}`}
                    value={String(value)}
                    label={label}
                    checked={pomodoro.focusMinutes === value}
                    onChange={(val) => {
                      if (val)
                        updatePreferences({
                          pomodoro: {
                            ...pomodoro,
                            focusMinutes: Number(val) as FocusMinutes,
                          },
                        });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Minutos de pausa */}
            <div
              className="flex w-full flex-col gap-2"
              role="group"
              aria-labelledby="break-label"
            >
              <p
                id="break-label"
                className="text-[#1a1a1a]"
                style={{ fontSize: "var(--body-font-size)" }}
              >
                Quantos minutos de pausa?
              </p>
              <div className="flex w-full gap-2">
                {BREAK_OPTIONS.map(({ value, label }) => (
                  <RadioButton
                    key={value}
                    id={`break-${value}`}
                    value={String(value)}
                    label={label}
                    checked={pomodoro.shortBreakMinutes === value}
                    onChange={(val) => {
                      if (val)
                        updatePreferences({
                          pomodoro: {
                            ...pomodoro,
                            shortBreakMinutes: Number(val) as ShortBreakMinutes,
                          },
                        });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tema de cor */}
            <div
              className="flex w-full flex-col gap-2"
              role="group"
              aria-labelledby="theme-label"
            >
              <p
                id="theme-label"
                className="text-[#1a1a1a]"
                style={{ fontSize: "var(--body-font-size)" }}
              >
                Tema de cor
              </p>
              <div className="flex flex-wrap gap-3">
                {COLOR_THEMES.map(({ value, hex, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updatePreferences({ colorTheme: value })}
                    aria-pressed={colorTheme === value}
                    aria-label={`${label}${colorTheme === value ? ", selecionado" : ""}`}
                    className={cn(
                      "size-10 rounded-full transition-transform hover:scale-110",
                      colorTheme === value &&
                        "ring-2 ring-[#4a4a4a] ring-offset-2",
                    )}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </Card>
    </div>
  );
}
