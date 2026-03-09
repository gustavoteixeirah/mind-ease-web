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
    <main className="flex min-h-screen items-center justify-center bg-white p-4 sm:p-6" role="main" aria-label="Página de login MindEase">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="relative hidden min-h-[560px] w-[36%] min-w-[280px] overflow-hidden rounded-l-3xl lg:block" aria-hidden="true">
          <Image
            src="/painel-home.png"
            alt="Ilustração: menos pressão, mais clareza."
            fill
            className="object-cover"
            style={{ objectPosition: "10% center" }}
            sizes="(max-width: 1024px) 0vw, 36vw"
            priority
          />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center bg-[#f0f0f0] px-6 py-10 sm:px-8 sm:py-12" role="region" aria-label="Formulário de acesso">
          <div className="w-full max-w-[380px]">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
