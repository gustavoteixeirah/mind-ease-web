import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/presentation/providers";
import { Toaster } from "sonner";
import { FocusPanelWrapper } from "@/components/foco/FocusPanelWrapper";
import { AppNav } from "@/components/navigation/AppNav";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const atkinson = localFont({
  src: [
    {
      path: "/fonts/AtkinsonHyperlegible-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "/fonts/AtkinsonHyperlegible-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "/fonts/AtkinsonHyperlegible-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "/fonts/AtkinsonHyperlegible-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mind Ease",
  description: "Sua jornada de bem-estar",
  icons: {
    icon: "/mindEase-icon-preto.svg",
  },
};

export default function RootLayout({
  children,
  modal, // Next.js vai injetar o @modal aqui
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="blue"
      user-font="conforto"
      className={`${inter.variable} ${atkinson.variable}`}
    >
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} ${atkinson.variable} antialiased`,
          "md:flex md:flex-row-reverse md:p-10 md:pl-30 md:gap-3 md:h-screen md:overflow-hidden",
        )}
      >
        <StackProvider app={stackClientApp} lang="pt-BR">
          <StackTheme>
            <AppProviders>
              <FocusPanelWrapper />
              <AppNav />
              {children}
              {modal}
              <Toaster richColors position="top-right" />
            </AppProviders>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
