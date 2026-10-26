"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Pede ao servidor os dados mais recentes a cada poucos segundos, sem recarregar a página.
// Só atualiza enquanto a aba está visível, para não gastar à toa.
export default function AtualizarSozinho({ segundos = 5 }) {
  const router = useRouter();

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, segundos * 1000);
    return () => clearInterval(intervalo);
  }, [router, segundos]);

  return null;
}
