"use client";

import { useState, useTransition } from "react";
import { ETAPAS_DO_FUNIL } from "../lib/etapas";
import { mudarEtapa } from "./actions";
import styles from "./page.module.css";

// Etiqueta colorida da etapa que também funciona como seletor para mudar o contato de etapa.
export default function SeletorEtapa({ contatoId, etapa }) {
  const [etapaAtual, setEtapaAtual] = useState(etapa);
  const [erro, setErro] = useState(null);
  const [salvando, iniciar] = useTransition();

  function aoMudar(evento) {
    const nova = evento.target.value;
    const anterior = etapaAtual;
    setEtapaAtual(nova);
    setErro(null);
    iniciar(async () => {
      const resultado = await mudarEtapa(contatoId, nova);
      if (resultado.erro) {
        setEtapaAtual(anterior);
        setErro(resultado.erro);
      }
    });
  }

  return (
    <div className={styles.blocoEtapa}>
      <span
        className={styles.seletorEtapa}
        style={{ "--cor": `var(--etapa-${etapaAtual.replace(" ", "-")})` }}
      >
        <select
          className={styles.campoEtapa}
          value={etapaAtual}
          onChange={aoMudar}
          disabled={salvando}
          aria-label="Etapa do funil"
        >
          {ETAPAS_DO_FUNIL.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.nome}
            </option>
          ))}
        </select>
      </span>
      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}
    </div>
  );
}
