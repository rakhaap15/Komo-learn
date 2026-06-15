"use client";

import { Button } from "@/components/ui/button";

export const PrintButton = () => {
  return (
    <Button onClick={() => window.print()} className="mb-6">
      Cetak / Simpan PDF
    </Button>
  );
};