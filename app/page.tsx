import Image from "next/image";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { LoginForm } from "../components/login/login-form";

export default async function Page() {
  const user = await stackServerApp.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Painel esquerdo – imagem */}
        <div className="relative hidden min-h-[560px] w-[36%] min-w-[280px] overflow-hidden rounded-l-3xl lg:block">
          <Image
            src="/painel-home.png"
            alt="Menos pressão. Mais clareza."
            fill
            className="object-cover"
            style={{ objectPosition: "10% center" }}
            sizes="(max-width: 1024px) 0vw, 36vw"
            priority
          />
        </div>

        {/* Painel direito – formulário Login / Criar conta */}
        <div className="flex flex-1 flex-col items-center justify-center bg-[#f0f0f0] px-8 py-12">
          <div className="w-full max-w-[380px]">
            <LoginForm />
            <p className="mt-6 text-center text-sm text-[#6b6b6b]">
              <a
                href="/dashboard"
                className="underline underline-offset-2 hover:text-[#1a1a1a]"
              >
                Continuar sem login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
