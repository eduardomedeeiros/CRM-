"use client";

import { useActionState } from "react";
import { entrar } from "../actions";
import styles from "../page.module.css";

export default function FormularioLogin() {
  const [estado, enviar, entrando] = useActionState(entrar, { erro: null });

  return (
    <form action={enviar} className={styles.formLogin}>
      <div>
        <label className={styles.rotulo} htmlFor="usuario">
          Usuário
        </label>
        <input
          className={styles.campo}
          id="usuario"
          name="usuario"
          type="text"
          autoComplete="username"
          defaultValue={estado.usuario}
          autoFocus
        />
      </div>
      <div>
        <label className={styles.rotulo} htmlFor="senha">
          Senha
        </label>
        <input
          className={styles.campo}
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
        />
      </div>

      {estado.erro && (
        <p className={styles.erro} role="alert">
          {estado.erro}
        </p>
      )}

      <button className={`${styles.botao} ${styles.botaoLargo}`} type="submit" disabled={entrando}>
        {entrando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
