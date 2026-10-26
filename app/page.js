import Link from "next/link";
import { exigirLogin } from "../lib/sessao";
import { supabase } from "../lib/supabase";
import AtualizarSozinho from "./AtualizarSozinho";
import Navbar from "./Navbar";
import styles from "./page.module.css";

// Sempre busca os dados no banco a cada visita, nunca uma cópia guardada.
export const dynamic = "force-dynamic";

const ETAPAS = [
  { valor: "novo", nome: "Novo" },
  { valor: "em contato", nome: "Em contato" },
  { valor: "proposta", nome: "Proposta" },
  { valor: "cliente", nome: "Cliente" },
];

export default async function Painel() {
  const usuarioLogado = await exigirLogin();

  // Só a etapa de cada contato: é tudo o que o painel precisa para contar.
  const { data: contatos, error } = await supabase.from("contatos").select("etapa");

  const total = contatos?.length ?? 0;
  const porEtapa = Object.fromEntries(
    ETAPAS.map((e) => [e.valor, contatos?.filter((c) => c.etapa === e.valor).length ?? 0])
  );

  return (
    <>
      <Navbar usuario={usuarioLogado} ativa="painel" />
      <AtualizarSozinho segundos={5} />

      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Painel</h1>
            <p className={styles.apoio}>Seu funil de vendas em um só olhar.</p>
          </div>
        </header>

        {error ? (
          <p className={styles.erro}>Não foi possível carregar os números do funil.</p>
        ) : (
          <section className={styles.painelNumeros} aria-label="Números do funil">
            <div className={`${styles.cartaoNumero} ${styles.cartaoTotal}`}>
              <p className={styles.rotuloNumero}>Total</p>
              <p className={styles.numero}>{total}</p>
            </div>

            {ETAPAS.map((etapa) => (
              <div
                className={styles.cartaoNumero}
                key={etapa.valor}
                style={{ "--cor": `var(--etapa-${etapa.valor.replace(" ", "-")})` }}
              >
                <p className={styles.rotuloNumero}>
                  <span className={styles.pontoEtapa} aria-hidden="true" />
                  {etapa.nome}
                </p>
                <p className={`${styles.numero} ${styles.numeroEtapa}`}>{porEtapa[etapa.valor]}</p>
              </div>
            ))}
          </section>
        )}

        <p className={styles.linkAlternativo}>
          <Link href="/contatos">Ver todos os contatos</Link>
        </p>
      </main>
    </>
  );
}
