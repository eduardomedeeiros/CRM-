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

// Botão "Gerar follow-up" de um contato, com a mensagem pronta para copiar.
export default function FollowUp({ contatoId }) {
  const [texto, setTexto] = useState(null);
  const [erro, setErro] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [escrevendo, iniciar] = useTransition();

  function gerar() {
    setErro(null);
    setCopiado(false);
    iniciar(async () => {
      const resultado = await gerarFollowUp(contatoId);
      if (resultado.erro) {
        setErro(resultado.erro);
      } else {
        setTexto(resultado.texto);
      }
    });
  }

  async function copiar() {
    setErro(null);
    if (await copiarTexto(texto)) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } else {
      setErro("Não foi possível copiar. Selecione o texto e copie manualmente.");
    }
  }

  return (
    <div className={styles.followUp}>
      <button className={styles.botaoTexto} type="button" onClick={gerar} disabled={escrevendo}>
        {escrevendo ? "Escrevendo..." : texto ? "Gerar outro follow-up" : "Gerar follow-up"}
      </button>

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      {texto && (
        <div className={styles.painelFollowUp} aria-live="polite">
          <p className={styles.textoAnotacao}>{texto}</p>
          <div className={styles.acoes}>
            <button className={`${styles.botao} ${styles.botaoPequeno}`} type="button" onClick={copiar}>
              {copiado ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
