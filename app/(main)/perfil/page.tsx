"use client";

import { useUser } from "@stackframe/stack";
import { usePreferences, getThemeColor } from "@/lib/preferences/preferences-context";
import type { BreakMinutes, ColorTheme, FocusMinutes, TextSize } from "@/lib/preferences/types";
import { cn } from "@/lib/utils";
import { useCallback, useState } from "react";

const TEXT_SIZE_OPTIONS: { value: TextSize; label: string }[] = [
  { value: "compact", label: "Compacto A↓" },
  { value: "comfort", label: "Conforto AA" },
  { value: "accessible", label: "Acessível A↑" },
];

const FOCUS_OPTIONS: { value: FocusMinutes }[] = [
  { value: 25 },
  { value: 30 },
  { value: 35 },
];

const BREAK_OPTIONS: { value: BreakMinutes }[] = [
  { value: 2 },
  { value: 5 },
  { value: 10 },
];

const COLOR_THEMES: ColorTheme[] = ["blue", "purple", "yellow", "orange", "green", "gray"];

export default function PerfilPage() {
  const user = useUser();
  const {
    textSize,
    focusMinutes,
    breakMinutes,
    colorTheme,
    setTextSize,
    setFocusMinutes,
    setBreakMinutes,
    setColorTheme,
    save,
    isDirty,
  } = usePreferences();

  const hasName = Boolean(user?.displayName?.trim());
  const displayName = user?.displayName?.trim() || "";
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [savingName, setSavingName] = useState(false);

  const handleStartEditName = useCallback(() => {
    setNameInput(displayName);
    setEditingName(true);
  }, [displayName]);

  const handleSaveName = useCallback(async () => {
    if (!user) {
      setEditingName(false);
      return;
    }
    if (nameInput.trim() === "" && displayName === "") {
      setEditingName(false);
      return;
    }
    if (nameInput.trim() === displayName) {
      setEditingName(false);
      return;
    }
    setSavingName(true);
    try {
      await user.update({ displayName: nameInput.trim() });
      setEditingName(false);
    } catch {
      // keep editing on error
    } finally {
      setSavingName(false);
    }
  }, [user, nameInput, displayName]);

  const handleKeyDownName = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSaveName();
      if (e.key === "Escape") {
        setNameInput(displayName);
        setEditingName(false);
      }
    },
    [handleSaveName, displayName]
  );

  const nameButtonLabel = hasName ? displayName : "Adicionar nome";

  return (
    <div className="min-h-full p-4 sm:p-6 md:p-8">
      <div className="mx-auto w-full max-w-4xl sm:w-[90%]">
        <div className="flex flex-col rounded-2xl bg-[#f8f8f8] p-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:p-6 md:p-10">
          <h1 className="text-xl font-bold text-[#1a1a1a] sm:text-2xl">Perfil</h1>

          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-medium text-[#1a1a1a] sm:size-16"
              style={{ backgroundColor: "var(--mindease-accent, #7eb8da)" }}
              aria-hidden="true"
            >
              {hasName ? displayName.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="perfil-nome" className="sr-only">Seu nome</label>
                  <input
                    id="perfil-nome"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={handleKeyDownName}
                    aria-label="Editar nome"
                    className="rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-[#1a1a1a] outline-none focus:border-[var(--mindease-accent)] focus:ring-2 focus:ring-[var(--mindease-accent)]/20"
                    placeholder="Seu nome"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveName}
                    disabled={savingName}
                    aria-label="Salvar nome"
                    className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:bg-[#333] disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {savingName ? "Salvando…" : "Salvar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(displayName);
                      setEditingName(false);
                    }}
                    aria-label="Cancelar edição do nome"
                    className="text-sm text-[#6b6b6b] underline hover:text-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEditName}
                  aria-label={hasName ? `Editar nome: ${displayName}` : "Adicionar nome"}
                  className="text-left text-base font-medium text-[#1a1a1a] underline decoration-[#1a1a1a]/50 underline-offset-2 hover:decoration-[#1a1a1a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded sm:text-lg"
                >
                  {nameButtonLabel}
                </button>
              )}
            </div>
          </div>

          <section className="mt-8 sm:mt-10 flex flex-1 flex-col" aria-labelledby="preferencias-heading">
            <h2 id="preferencias-heading" className="mb-6 text-lg font-bold text-[#1a1a1a]">Preferências</h2>

            <div className="flex flex-col items-start gap-6">
              <div className="flex w-full flex-col items-start" role="group" aria-label="Tamanho do texto">
                <p className="mb-2 text-sm font-medium text-[#1a1a1a]" id="text-size-label">Tamanho do texto</p>
                <div className="flex w-full gap-2" role="radiogroup" aria-labelledby="text-size-label">
                  {TEXT_SIZE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTextSize(value)}
                      aria-pressed={textSize === value}
                      aria-label={label}
                      className={cn(
                        "min-w-0 flex-1 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        textSize === value
                          ? "bg-[#7eb8da] text-white"
                          : "bg-[#e8e8e8] text-[#1a1a1a] hover:bg-[#e0e0e0]"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start" role="group" aria-label="Quantos minutos de foco?">
                <p className="mb-2 text-sm font-medium text-[#1a1a1a]" id="focus-label">Quantos minutos de foco?</p>
                <div className="flex w-full gap-2" role="radiogroup" aria-labelledby="focus-label">
                  {FOCUS_OPTIONS.map(({ value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFocusMinutes(value)}
                      aria-pressed={focusMinutes === value}
                      aria-label={`${value} minutos`}
                      className={cn(
                        "min-w-0 flex-1 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        focusMinutes === value
                          ? "bg-[#7eb8da] text-white"
                          : "bg-[#e8e8e8] text-[#1a1a1a] hover:bg-[#e0e0e0]"
                      )}
                    >
                      {value}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start" role="group" aria-label="Quantos minutos de pausa?">
                <p className="mb-2 text-sm font-medium text-[#1a1a1a]" id="break-label">Quantos minutos de pausa?</p>
                <div className="flex w-full gap-2" role="radiogroup" aria-labelledby="break-label">
                  {BREAK_OPTIONS.map(({ value }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setBreakMinutes(value)}
                      aria-pressed={breakMinutes === value}
                      aria-label={`${value} minutos`}
                      className={cn(
                        "min-w-0 flex-1 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        breakMinutes === value
                          ? "bg-[#7eb8da] text-white"
                          : "bg-[#e8e8e8] text-[#1a1a1a] hover:bg-[#e0e0e0]"
                      )}
                    >
                      {value}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col items-start" role="group" aria-label="Tema de cor">
                <p className="mb-2 text-sm font-medium text-[#1a1a1a]" id="theme-label">Tema de cor</p>
                <div className="flex flex-wrap gap-3" role="radiogroup" aria-labelledby="theme-label">
                  {COLOR_THEMES.map((theme) => {
                    const hex = getThemeColor(theme);
                    const isSelected = colorTheme === theme;
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => setColorTheme(theme)}
                        aria-pressed={isSelected}
                        aria-label={`Tema ${theme}${isSelected ? ", selecionado" : ""}`}
                        className={cn(
                          "size-10 rounded-full transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                          isSelected && "ring-2 ring-[#4a4a4a] ring-offset-2"
                        )}
                        style={{ backgroundColor: hex }}
                        title={theme}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={!isDirty}
                aria-label="Salvar preferências"
                className="mt-6 w-full rounded-2xl bg-[#1a1a1a] py-3.5 text-sm font-medium text-white hover:bg-[#333] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Salvar preferências
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
