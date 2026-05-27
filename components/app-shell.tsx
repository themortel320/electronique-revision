"use client";

import { getPseudo } from "@/lib/user";
import { useEffect, useState } from "react";
import { OnboardingModal } from "./onboarding-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const pseudo = getPseudo();
    setNeedsOnboarding(!pseudo);
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      {needsOnboarding && (
        <OnboardingModal onDone={() => setNeedsOnboarding(false)} />
      )}
      {children}
    </>
  );
}
