import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default async function DashboardPage() {
	const user = await stackServerApp.getUser();

	if (!user) {
		redirect("/handler/sign-in");
	}

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<Image src="/logo.svg" alt="Mind Ease Logo" width={60} height={60} />
					<div className="flex items-center gap-4"></div>

					<form
						action={async () => {
							"use server";
							await stackServerApp.signOut();
							redirect("/");
						}}
					>
						<Button variant="outline" type="submit">
							Sair
						</Button>
					</form>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<h1 className="text-2xl font-bold">Bem-vindo ao Mind Ease</h1>
						<p className="text-muted-foreground">
							Olá, {user.displayName || user.primaryEmail}!
						</p>
					</div>
				</div>
				{/* Dashboard Content */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
						<CardTitle>Perfil</CardTitle>
						<CardDescription>Suas informações de conta</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<p className="text-sm">
								<span className="font-medium">Email:</span>{" "}
								{user.primaryEmail}
							</p>
							<p className="text-sm">
								<span className="font-medium">Nome:</span>{" "}
								{user.displayName || "Não definido"}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
						<CardTitle>Começando</CardTitle>
						<CardDescription>Inicie sua jornada de bem-estar</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							O conteúdo do seu painel aparecerá aqui.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
						<CardTitle>Recursos</CardTitle>
						<CardDescription>Materiais úteis</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Acesse recursos e ferramentas de bem-estar.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
