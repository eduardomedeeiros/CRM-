"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Depois de alguns segundos, leva para outra página sozinho (ex.: contato que não existe mais).
export default function VoltarSozinho({ para, segundos = 4 }) {
  const router = useRouter();

  useEffect(() => {
    const espera = setTimeout(() => router.replace(para), segundos * 1000);
    return () => clearTimeout(espera);
  }, [router, para, segundos]);

  return null;
}
