"use client";

import { Suspense } from "react";
import AddMedicament from "../../../src/components/add_medicament";

export default function AddMedicamentPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AddMedicament />
    </Suspense>
  );
}
