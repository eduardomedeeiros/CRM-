import Link from "next/link";
import { tempoDesde } from "../lib/datas";
import { ETAPAS_DO_FUNIL } from "../lib/etapas";
import { exigirLogin } from "../lib/sessao";
import { supabase } from "../lib/supabase";
import AtualizarSozinho from "./AtualizarSozinho";
import Shell from "./Shell";
import styles from "./page.module.css";

// Sempre busca os dados no banco a cada visita, nunca uma cópia guardada.
export const dynamic = "force-dynamic";

function corDaEtapa(valor) {
  return `var(--etapa-${valor.replace(" ", "-")})`;
}

export default async function Dashboard() {
  const usuarioLogado = await exigirLogin();

  // Uma busca só: serve para contar por etapa e para listar os mais recentes.
  const { data: contatos, error } = await supabase
    .from("contatos")
    .select("id, nome, etapa, criado_em")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false });

  const total = contatos?.length ?? 0;
  const porEtapa = Object.fromEntries(
    ETAPAS_DO_FUNIL.map((e) => [e.valor, contatos?.filter((c) => c.etapa === e.valor).length ?? 0])
  );
  // A maior etapa ocupa a barra inteira; as outras ficam proporcionais a ela.
  const maior = Math.max(1, ...Object.values(porEtapa));
  const recentes = contatos?.slice(0, 5) ?? [];

  return (
    <Shell usuario={usuarioLogado} ativa="dashboard">
      <AtualizarSozinho segundos={5} />

      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Dashboard</h1>
            <p className={styles.apoio}>Seu funil de vendas em um só olhar.</p>
          </div>
        </header>

        {error ? (
          <p className={styles.erro}>Não foi possível carregar os números do funil.</p>
        ) : (
          <>
            <section className={styles.painelNumeros} aria-label="Números do funil">
              <div className={`${styles.cartaoNumero} ${styles.cartaoTotal}`}>
                <p className={styles.rotuloNumero}>Total</p>
                <p className={styles.numero}>{total}</p>
              </div>

              {ETAPAS_DO_FUNIL.map((etapa) => (
                <div className={styles.cartaoNumero} key={etapa.valor} style={{ "--cor": corDaEtapa(etapa.valor) }}>
                  <p className={styles.rotuloNumero}>
                    <span className={styles.pontoEtapa} aria-hidden="true" />
                    {etapa.nome}
                  </p>
                  <p className={`${styles.numero} ${styles.numeroEtapa}`}>{porEtapa[etapa.valor]}</p>
                </div>
              ))}
            </section>

            <div className={styles.gradeDashboard}>
              <section className={styles.cartao}>
                <h2 className={styles.tituloSecao}>Distribuição do funil</h2>

                {total === 0 ? (
                  <p className={styles.semResultado}>
                    Nenhum contato no funil ainda. O gráfico aparece assim que houver contatos.
                  </p>
                ) : (
                  <ul className={styles.grafico}>
                    {ETAPAS_DO_FUNIL.map((etapa) => {
                      const quantidade = porEtapa[etapa.valor];
                      const porcento = Math.round((quantidade / total) * 100);
                      return (
                        <li
                          key={etapa.valor}
                          className={styles.linhaGrafico}
                          style={{ "--cor": corDaEtapa(etapa.valor) }}
                          title={`${etapa.nome}: ${quantidade} ${quantidade === 1 ? "contato" : "contatos"} (${porcento}%)`}
                        >
                          <span className={styles.rotuloGrafico}>{etapa.nome}</span>
                          <span className={styles.trilhaGrafico} aria-hidden="true">
                            <span
                              className={styles.barraGrafico}
                              style={{ width: `${(quantidade / maior) * 100}%` }}
                            />
                          </span>
                          <span className={styles.valorGrafico}>
                            {quantidade} <span className={styles.porcentoGrafico}>{porcento}%</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>

              <section className={styles.cartao}>
                <h2 className={styles.tituloSecao}>Últimos contatos cadastrados</h2>

                {recentes.length === 0 ? (
                  <p className={styles.semResultado}>Nenhum contato cadastrado ainda.</p>
                ) : (
                  <ul className={styles.listaBusca}>
                    {recentes.map((contato) => (
                      <li key={contato.id}>
                        <Link className={styles.resultado} href={`/contatos/${contato.id}`}>
                          <span>
                            <span className={styles.nomeContato}>{contato.nome}</span>
                            <span className={styles.desde}>{tempoDesde(contato.criado_em)}</span>
                          </span>
                          <span className={styles.etiqueta} style={{ "--cor": corDaEtapa(contato.etapa) }}>
                            {ETAPAS_DO_FUNIL.find((e) => e.valor === contato.etapa)?.nome ?? contato.etapa}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}

        <p className={styles.linkAlternativo}>
          <Link href="/funil">Ver todos os contatos</Link>
        </p>
      </main>
    </Shell>
  );
}
