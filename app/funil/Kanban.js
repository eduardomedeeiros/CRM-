"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { ETAPAS_DO_FUNIL } from "../../lib/etapas";
import { mudarEtapa } from "../actions";
import FormularioContato from "../FormularioContato";
import styles from "../page.module.css";

// Quadro do funil: uma coluna por etapa. Arrastar um cartão para outra coluna muda a etapa no banco.
export default function Kanban({ contatos: doServidor }) {
  const [contatos, setContatos] = useState(doServidor);
  const [recebidos, setRecebidos] = useState(doServidor);
  const [colunaSobre, setColunaSobre] = useState(null);
  const [erro, setErro] = useState(null);
  const [, iniciar] = useTransition();
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const janela = useRef(null);

  // Quando o servidor manda a lista atualizada (ex.: contato novo), o quadro passa a usá-la.
  if (doServidor !== recebidos) {
    setRecebidos(doServidor);
    setContatos(doServidor);
  }

  useEffect(() => {
    if (cadastroAberto) janela.current.showModal();
  }, [cadastroAberto]);

  function trocarEtapa(id, etapa) {
    setContatos((lista) => lista.map((c) => (c.id === id ? { ...c, etapa } : c)));
  }

  // Move o cartão na hora e salva em seguida. Se não salvar, ele volta para a coluna de antes.
  function mover(id, etapaNova) {
    const contato = contatos.find((c) => c.id === id);
    if (!contato || contato.etapa === etapaNova) return;

    const etapaAnterior = contato.etapa;
    setErro(null);
    trocarEtapa(id, etapaNova);

    iniciar(async () => {
      let resultado;
      try {
        resultado = await mudarEtapa(id, etapaNova);
      } catch {
        resultado = { erro: "Não foi possível mudar a etapa. Tente de novo." };
      }
      if (resultado.erro) {
        trocarEtapa(id, etapaAnterior);
        setErro(`${contato.nome}: ${resultado.erro}`);
      }
    });
  }

  return (
    <>
      <header className={styles.cabecalho}>
        <div>
          <h1 className={styles.titulo}>Funil</h1>
          <p className={styles.apoio}>Arraste um contato para outra coluna para mudar a etapa.</p>
        </div>
        <button className={styles.botao} type="button" onClick={() => setCadastroAberto(true)}>
          Novo contato
        </button>
      </header>

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      <div className={styles.quadro}>
        {ETAPAS_DO_FUNIL.map((etapa) => {
          const daEtapa = contatos.filter((c) => c.etapa === etapa.valor);
          return (
            <section
              key={etapa.valor}
              className={`${styles.coluna} ${colunaSobre === etapa.valor ? styles.colunaSobre : ""}`}
              style={{ "--cor": `var(--etapa-${etapa.valor.replace(" ", "-")})` }}
              aria-label={etapa.nome}
              onDragOver={(e) => {
                e.preventDefault();
                setColunaSobre(etapa.valor);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setColunaSobre(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setColunaSobre(null);
                mover(Number(e.dataTransfer.getData("text/plain")), etapa.valor);
              }}
            >
              <h2 className={styles.topoColuna}>
                <span className={styles.pontoEtapa} aria-hidden="true" />
                {etapa.nome}
                <span className={styles.contadorColuna}>{daEtapa.length}</span>
              </h2>

              {daEtapa.length === 0 ? (
                <p className={styles.colunaVazia}>Nenhum contato nesta etapa.</p>
              ) : (
                <ul className={styles.cartoes}>
                  {daEtapa.map((contato) => (
                    <li
                      key={contato.id}
                      className={styles.cartaoContato}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", String(contato.id));
                        e.dataTransfer.effectAllowed = "move";
                      }}
                    >
                      {/* O link não arrasta sozinho: quem arrasta é o cartão inteiro. */}
                      <Link className={styles.linkCartao} href={`/contatos/${contato.id}`} draggable={false}>
                        <p className={styles.nomeCartao}>{contato.nome}</p>
                        <p className={styles.emailCartao}>{contato.email || "Sem email"}</p>
                        <p className={styles.tempoCartao}>{contato.cadastrado}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {cadastroAberto && (
        <dialog
          ref={janela}
          className={styles.janela}
          aria-labelledby="titulo-novo-contato"
          onClose={() => setCadastroAberto(false)}
        >
          <div className={styles.topoJanela}>
            <h2 id="titulo-novo-contato" className={styles.tituloSecao}>
              Novo contato
            </h2>
            <button className={styles.botaoTexto} type="button" onClick={() => janela.current.close()}>
              Fechar
            </button>
          </div>
          <FormularioContato aoSalvar={() => janela.current?.close()} />
        </dialog>
      )}
    </>
  );
}
