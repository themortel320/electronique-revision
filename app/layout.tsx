import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AppShell } from "@/components/app-shell";
import { StarField } from "@/components/star-field";

export const metadata: Metadata = {
  title: "ElectroLab — Révision Électronique",
  description: "Plateforme interactive pour maîtriser les bases de l'électronique.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {/* Étoiles en arrière-plan (z-0, under tout le contenu) */}
        <StarField />

        {/* Contenu principal (z-10+) */}
        <div className="relative z-10">
          <Navbar />
          <AppShell>
            <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          </AppShell>
        </div>
      </body>
    </html>
  );
}
