import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/presentation/providers";
import { Toaster } from "@/components/ui/sonner";
import { ToasterWrapper } from "@/components/ui/toaster-wrapper";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

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
      path: "../public/fonts/AtkinsonHyperlegible-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/AtkinsonHyperlegible-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/AtkinsonHyperlegible-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/AtkinsonHyperlegible-BoldItalic.ttf",
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="default"
      className={`${inter.variable} ${atkinson.variable}`}
    >
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} ${atkinson.variable} antialiased`,
          "h-screen md:overflow-hidden",
        )}
      >
        <StackProvider app={stackClientApp} lang="pt-BR">
          <StackTheme>
            <AppProviders>
              <TooltipProvider>
                {/* <FocusPanelWrapper />
              <AppNav /> */}
                {children}
                {/* {modal} */}
              </TooltipProvider>
              <ToasterWrapper />
            </AppProviders>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
