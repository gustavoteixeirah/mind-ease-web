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
							Sign Out
						</Button>
					</form>
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<div>
						<h1 className="text-2xl font-bold">Welcome to Mind Ease</h1>
						<p className="text-muted-foreground">
							Hello, {user.displayName || user.primaryEmail}!
						</p>
					</div>
				</div>
				{/* Dashboard Content */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card>
						<CardHeader>
							<CardTitle>Profile</CardTitle>
							<CardDescription>Your account information</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p className="text-sm">
									<span className="font-medium">Email:</span>{" "}
									{user.primaryEmail}
								</p>
								<p className="text-sm">
									<span className="font-medium">Name:</span>{" "}
									{user.displayName || "Not set"}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Getting Started</CardTitle>
							<CardDescription>Start your wellness journey</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Your dashboard content will appear here.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Resources</CardTitle>
							<CardDescription>Helpful materials</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Access wellness resources and tools.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
