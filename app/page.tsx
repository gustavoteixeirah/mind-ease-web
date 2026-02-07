import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await stackServerApp.getUser();
  
  if (user) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logo.svg"
          alt="Mind Ease Logo"
          width={200}
          height={200}
          priority
        />
      </div>
      
      <div className="flex gap-4">
        <Link href="/handler/sign-in">
          <Button size="lg" variant="default">
            Login
          </Button>
        </Link>
        <Link href="/handler/sign-up">
          <Button size="lg" variant="outline">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}