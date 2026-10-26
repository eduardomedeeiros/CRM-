import { Suspense } from "react";
import { tempoDesde } from "../../lib/datas";
import { exigirLogin } from "../../lib/sessao";
import { supabase } from "../../lib/supabase";
import Shell from "../Shell";
import styles from "../page.module.css";
import Kanban from "./Kanban";

// Sempre busca os dados no banco a cada visita, nunca uma cópia guardada.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Funil · Meu CRM",
};

export default async function Funil() {
  const usuarioLogado = await exigirLogin();

  return (
    <Shell usuario={usuarioLogado} ativa="funil">
      <main className={`${styles.pagina} ${styles.paginaLarga}`}>
        {/* O título aparece na hora; só o quadro espera os dados do banco. */}
        <Suspense fallback={<p className={styles.carregando} role="status">Carregando o funil...</p>}>
          <QuadroDoFunil />
        </Suspense>
      </main>
    </Shell>
  );
}

async function QuadroDoFunil() {
  const { data, error } = await supabase
    .from("contatos")
    .select("id, nome, email, etapa, criado_em")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    return <p className={styles.erro}>Não foi possível carregar os contatos.</p>;
  }

  // O "há quanto tempo" é calculado aqui no servidor, para a tela não mostrar dois valores diferentes.
  const contatos = data.map((c) => ({
    id: c.id,
    nome: c.nome,
    email: c.email,
    etapa: c.etapa,
    cadastrado: tempoDesde(c.criado_em),
  }));

  return <Kanban contatos={contatos} />;
}
