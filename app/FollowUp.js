"use client";

import { useState, useTransition } from "react";
import { gerarFollowUp } from "./actions";
import styles from "./page.module.css";

// Tenta o jeito moderno de copiar; se o navegador bloquear, usa o jeito antigo,
// que funciona também quando o site é aberto pelo endereço de rede (sem https).
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const campo = document.createElement("textarea");
    campo.value = texto;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    const funcionou = document.execCommand("copy");
    campo.remove();
    return funcionou;
  }
}

// Botão "Gerar follow-up com IA" e a lista dos follow-ups já gerados (guardados no banco).
export default function FollowUp({ contatoId, followups }) {
  const [erro, setErro] = useState(null);
  const [escrevendo, iniciar] = useTransition();

  function gerar() {
    setErro(null);
    iniciar(async () => {
      const resultado = await gerarFollowUp(contatoId);
      if (resultado.erro) setErro(resultado.erro);
    });
  }

  return (
    <div className={styles.followUp}>
      <div className={styles.acoesFollowUp}>
        <button className={styles.botao} type="button" onClick={gerar} disabled={escrevendo}>
          {escrevendo ? "Escrevendo..." : "Gerar follow-up com IA"}
        </button>
        {erro && (
          <p className={styles.erro} role="alert">
            {erro}
          </p>
        )}
      </div>

      {followups.length === 0 ? (
        <p className={styles.semAnotacoes}>Nenhum follow-up gerado ainda.</p>
      ) : (
        <ul className={styles.listaAnotacoes} aria-live="polite">
          {followups.map((followup) => (
            <ItemFollowUp key={followup.id} followup={followup} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ItemFollowUp({ followup }) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState(null);

  async function copiar() {
    setErro(null);
    if (await copiarTexto(followup.texto)) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } else {
      setErro("Não foi possível copiar. Selecione o texto e copie manualmente.");
    }
  }

  return (
    <li className={styles.anotacao}>
      <div className={styles.topoAnotacao}>
        <p className={styles.dataAnotacao}>{followup.data}</p>
        <button className={styles.botaoTexto} type="button" onClick={copiar}>
          {copiado ? "Copiado!" : "Copiar"}
        </button>
      </div>
      <p className={styles.textoAnotacao}>{followup.texto}</p>
      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}
    </li>
  );
}
