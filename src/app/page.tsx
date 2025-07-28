import { Suspense } from "react";
import Home from "./Home";
import InstallPrompt from "@/components/InstallPrompt";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Home />
      <InstallPrompt />
    </Suspense>
  );
}
