"use client";

import { useActionState, useState } from "react";
import { criarAnotacao } from "./actions";
import styles from "./page.module.css";

export default function FormularioAnotacao({ contatoId }) {
  const [estado, enviar, salvando] = useActionState(criarAnotacao, { erro: null });
  const [erroTexto, setErroTexto] = useState(null);

  const idCampo = `anotacao-${contatoId}`;
  const idErro = `erro-anotacao-${contatoId}`;

  // Bloqueia o envio ainda no navegador quando a anotação está vazia.
  function aoEnviar(evento) {
    const campo = evento.currentTarget.texto;
    if (!campo.value.trim()) {
      evento.preventDefault();
      setErroTexto("Escreva a anotação antes de salvar.");
      campo.focus();
      return;
    }
    setErroTexto(null);
  }

  const mensagem = erroTexto || estado.erro;

  return (
    <form action={enviar} onSubmit={aoEnviar} noValidate>
      <input type="hidden" name="contatoId" value={contatoId} />
      <label className={styles.rotulo} htmlFor={idCampo}>
        Nova anotação
      </label>
      <textarea
        className={`${styles.campo} ${styles.areaTexto}`}
        id={idCampo}
        name="texto"
        rows={3}
        defaultValue={estado.texto}
        aria-invalid={erroTexto ? "true" : undefined}
        aria-describedby={mensagem ? idErro : undefined}
      />
      <div className={styles.acoes}>
        <button className={styles.botao} type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar anotação"}
        </button>
        {mensagem && (
          <p className={styles.erro} id={idErro} role="alert">
            {mensagem}
          </p>
        )}
      </div>
    </form>
  );
}
