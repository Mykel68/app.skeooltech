"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault(); // Prevent default prompt
      setDeferredPrompt(e);
      setShowPrompt(true); // Show custom UI
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt as any;
    promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted install prompt");
    } else {
      console.log("User dismissed install prompt");
    }

    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-xl z-50 border">
      <p className="font-medium mb-2">Install SkoolTech on your device</p>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={() => setShowPrompt(false)}>
          Maybe later
        </Button>
        <Button onClick={handleInstall}>Install</Button>
      </div>
    </div>
  );
}
