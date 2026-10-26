"use client";

import { useState, useTransition } from "react";
import { editarAnotacao, excluirAnotacao } from "./actions";
import styles from "./page.module.css";

// Uma anotação da lista. Alterna entre três modos: ver, editar e confirmar a exclusão.
export default function Anotacao({ anotacao, data }) {
  const [modo, setModo] = useState("ver");
  const [erro, setErro] = useState(null);
  const [pendente, iniciar] = useTransition();

  const idCampo = `editar-anotacao-${anotacao.id}`;

  function mudarModo(novoModo) {
    setErro(null);
    setModo(novoModo);
  }

  function salvarEdicao(evento) {
    evento.preventDefault();
    const campo = evento.currentTarget.texto;
    if (!campo.value.trim()) {
      setErro("A anotação não pode ficar vazia.");
      campo.focus();
      return;
    }
    iniciar(async () => {
      const resultado = await editarAnotacao(anotacao.id, campo.value);
      if (resultado.erro) {
        setErro(resultado.erro);
      } else {
        mudarModo("ver");
      }
    });
  }

  function confirmarExclusao() {
    iniciar(async () => {
      const resultado = await excluirAnotacao(anotacao.id);
      if (resultado.erro) {
        setErro(resultado.erro);
      }
    });
  }

  return (
    <li className={styles.anotacao}>
      <div className={styles.topoAnotacao}>
        <p className={styles.dataAnotacao}>{data}</p>
        {modo === "ver" && (
          <div className={styles.acoesAnotacao}>
            <button className={styles.botaoTexto} type="button" onClick={() => mudarModo("editar")}>
              Editar
            </button>
            <button className={styles.botaoTexto} type="button" onClick={() => mudarModo("excluir")}>
              Excluir
            </button>
          </div>
        )}
      </div>

      {modo === "editar" ? (
        <form onSubmit={salvarEdicao} noValidate>
          <label className={styles.rotuloOculto} htmlFor={idCampo}>
            Editar anotação
          </label>
          <textarea
            className={`${styles.campo} ${styles.areaTexto} ${styles.campoEdicao}`}
            id={idCampo}
            name="texto"
            rows={3}
            defaultValue={anotacao.texto}
            autoFocus
          />
          <div className={styles.acoes}>
            <button className={`${styles.botao} ${styles.botaoPequeno}`} type="submit" disabled={pendente}>
              {pendente ? "Salvando..." : "Salvar"}
            </button>
            <button
              className={`${styles.botaoSecundario} ${styles.botaoPequeno}`}
              type="button"
              onClick={() => mudarModo("ver")}
              disabled={pendente}
            >
              Cancelar
            </button>
            {erro && (
              <p className={styles.erro} role="alert">
                {erro}
              </p>
            )}
          </div>
        </form>
      ) : (
        <p className={styles.textoAnotacao}>{anotacao.texto}</p>
      )}

      {modo === "excluir" && (
        <div className={styles.confirmacao}>
          <p className={styles.perguntaConfirmacao}>Excluir esta anotação? Não dá para desfazer.</p>
          <div className={styles.acoes}>
            <button
              className={`${styles.botaoPerigo} ${styles.botaoPequeno}`}
              type="button"
              onClick={confirmarExclusao}
              disabled={pendente}
            >
              {pendente ? "Excluindo..." : "Sim, excluir"}
            </button>
            <button
              className={`${styles.botaoSecundario} ${styles.botaoPequeno}`}
              type="button"
              onClick={() => mudarModo("ver")}
              disabled={pendente}
            >
              Cancelar
            </button>
            {erro && (
              <p className={styles.erro} role="alert">
                {erro}
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
