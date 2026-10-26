"use client";

import { useActionState, useState } from "react";
import { criarContato } from "./actions";
import styles from "./page.module.css";

export default function FormularioContato() {
  const [estado, enviar, salvando] = useActionState(criarContato, { erro: null });
  const [erroNome, setErroNome] = useState(null);

  // Bloqueia o envio ainda no navegador quando o nome está vazio.
  function aoEnviar(evento) {
    const nome = evento.currentTarget.nome.value.trim();
    if (!nome) {
      evento.preventDefault();
      setErroNome("Informe o nome do contato para salvar.");
      evento.currentTarget.nome.focus();
      return;
    }
    setErroNome(null);
  }

  const mensagem = erroNome || estado.erro;

  return (
    <form action={enviar} onSubmit={aoEnviar} noValidate>
      <div className={styles.campos}>
        <div>
          <label className={styles.rotulo} htmlFor="nome">
            Nome
          </label>
          <input
            className={styles.campo}
            id="nome"
            name="nome"
            type="text"
            autoComplete="off"
            defaultValue={estado.valores?.nome}
            aria-invalid={erroNome ? "true" : undefined}
            aria-describedby={mensagem ? "erro-formulario" : undefined}
          />
        </div>
        <div>
          <label className={styles.rotulo} htmlFor="email">
            Email
          </label>
          <input
            className={styles.campo}
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            defaultValue={estado.valores?.email}
          />
        </div>
        <div>
          <label className={styles.rotulo} htmlFor="telefone">
            Telefone
          </label>
          <input
            className={styles.campo}
            id="telefone"
            name="telefone"
            type="tel"
            autoComplete="off"
            defaultValue={estado.valores?.telefone}
          />
        </div>
      </div>

      <div className={styles.acoes}>
        <button className={styles.botao} type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar contato"}
        </button>
        {mensagem && (
          <p className={styles.erro} id="erro-formulario" role="alert">
            {mensagem}
          </p>
        )}
      </div>
    </form>
  );
}
