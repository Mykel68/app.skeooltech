import { Suspense } from "react";
import RegistrationPage from "./Register";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegistrationPage />
    </Suspense>
  );
}
