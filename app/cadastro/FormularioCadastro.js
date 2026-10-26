"use client";

import Link from "next/link";
import { useActionState } from "react";
import { cadastrar } from "../actions";
import styles from "../page.module.css";

export default function FormularioCadastro() {
  const [estado, enviar, enviando] = useActionState(cadastrar, { erro: null });

  if (estado.sucesso) {
    return (
      <>
        <p className={styles.sucesso} role="status">
          Cadastro enviado! Assim que o administrador aprovar, você poderá entrar.
        </p>
        <p className={styles.linkAlternativo}>
          <Link href="/login">Ir para o login</Link>
        </p>
      </>
    );
  }

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
          Senha (mínimo 8 caracteres)
        </label>
        <input className={styles.campo} id="senha" name="senha" type="password" autoComplete="new-password" />
      </div>
      <div>
        <label className={styles.rotulo} htmlFor="confirmacao">
          Repita a senha
        </label>
        <input
          className={styles.campo}
          id="confirmacao"
          name="confirmacao"
          type="password"
          autoComplete="new-password"
        />
      </div>

      {estado.erro && (
        <p className={styles.erro} role="alert">
          {estado.erro}
        </p>
      )}

      <button className={`${styles.botao} ${styles.botaoLargo}`} type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : "Criar conta"}
      </button>
    </form>
  );
}
