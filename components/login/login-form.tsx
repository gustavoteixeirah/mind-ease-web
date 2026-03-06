"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStackApp } from "@stackframe/stack";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const app = useStackApp();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const result = await app.signInWithCredential({ email, password });
        if (result.status === "error") {
          setError(result.error.message);
          return;
        }
        router.push("/dashboard");
        router.refresh();
      } else {
        const result = await app.signUpWithCredential({ email, password });
        if (result.status === "error") {
          setError(result.error.message);
          return;
        }
        if (fullName.trim()) {
          try {
            const user = await app.getUser();
            if (user) await user.update({ displayName: fullName.trim() });
          } catch {
            // ignora se não conseguir atualizar o nome
          }
        }
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-10 flex justify-center">
        <Image
          src="/logo.svg"
          alt="MindEase"
          width={160}
          height={52}
          priority
          className="h-auto w-[160px] text-black"
        />
      </div>

      <div className="mb-8 flex rounded-full bg-[#e0e0e0] p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",
            mode === "login"
              ? "bg-white text-[#1a1a1a] shadow-sm"
              : "text-[#6b6b6b]"
          )}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "flex-1 rounded-full py-2.5 text-sm font-medium transition-colors",
            mode === "signup"
              ? "bg-white text-[#1a1a1a] shadow-sm"
              : "text-[#6b6b6b]"
          )}
        >
          Criar conta
        </button>
      </div>

      <h2 className="mb-6 text-base font-semibold text-[#1a1a1a]">
        {mode === "login" ? "Bem-vindo(a) de volta." : "Comece sua jornada."}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium text-[#1a1a1a]">
              Nome completo
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="h-12 rounded-lg border-[#d0d0d0] bg-white text-[#1a1a1a] placeholder:text-[#9a9a9a]"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-[#1a1a1a]">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nome@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="h-12 rounded-lg border-[#d0d0d0] bg-white text-[#1a1a1a] placeholder:text-[#9a9a9a]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium text-[#1a1a1a]">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              className="h-12 rounded-lg border-[#d0d0d0] bg-white pr-11 text-[#1a1a1a] placeholder:text-[#9a9a9a]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#1a1a1a]"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-12 w-full rounded-lg bg-[#1a1a1a] text-white hover:bg-[#333]"
        >
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[#6b6b6b]">
        {mode === "login" ? (
          <>
            Primeiro acesso?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-medium text-[#1a1a1a] underline underline-offset-2 hover:opacity-80"
            >
              Criar conta
            </button>
          </>
        ) : (
          <>
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-medium text-[#1a1a1a] underline underline-offset-2 hover:opacity-80"
            >
              Fazer login
            </button>
          </>
        )}
      </p>
    </div>
  );
}
