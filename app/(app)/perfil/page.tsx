import { stackServerApp } from "@/stack/server";

export default async function PerfilPage() {
  const user = await stackServerApp.getUser();

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-[#1a1a1a]">Perfil</h1>
      <div className="mt-6 rounded-2xl bg-white/80 p-6 shadow-sm">
        <p className="text-sm text-[#6b6b6b]">
          <span className="font-medium text-[#1a1a1a]">Nome:</span>{" "}
          {user?.displayName ?? "—"}
        </p>
        <p className="mt-2 text-sm text-[#6b6b6b]">
          <span className="font-medium text-[#1a1a1a]">E-mail:</span>{" "}
          {user?.primaryEmail ?? "—"}
        </p>
      </div>
    </div>
  );
}
