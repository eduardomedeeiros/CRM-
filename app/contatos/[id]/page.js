import Link from "next/link";
import { formatarData, tempoDesde } from "../../../lib/datas";
import { exigirLogin } from "../../../lib/sessao";
import { supabase } from "../../../lib/supabase";
import { idValido } from "../../../lib/validacao";
import Anotacao from "../../Anotacao";
import FollowUp from "../../FollowUp";
import FormularioAnotacao from "../../FormularioAnotacao";
import SeletorEtapa from "../../SeletorEtapa";
import Shell from "../../Shell";
import VoltarSozinho from "../../VoltarSozinho";
import styles from "../../page.module.css";

// Sempre busca os dados no banco a cada visita, nunca uma cópia guardada.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contato · Meu CRM",
};

export default async function PaginaDoContato({ params }) {
  const usuarioLogado = await exigirLogin();
  const { id } = await params;

  // Tudo do contato numa busca só: anotações e follow-ups, dos mais novos para os mais antigos.
  const { data: contato, error } = idValido(id)
    ? await supabase
        .from("contatos")
        .select(
          "id, nome, email, telefone, etapa, criado_em, anotacoes(id, texto, criado_em), followups(id, texto, criado_em)"
        )
        .eq("id", Number(id))
        .order("criado_em", { referencedTable: "anotacoes", ascending: false })
        .order("criado_em", { referencedTable: "followups", ascending: false })
        .maybeSingle()
    : { data: null, error: null };

  return (
    <Shell usuario={usuarioLogado} ativa="contatos">
      <main className={styles.pagina}>
        {error && <p className={styles.erro}>Não foi possível carregar este contato.</p>}

        {!error && !contato && (
          <section className={styles.cartao}>
            <h1 className={styles.tituloSecao}>Este contato não existe mais</h1>
            <p className={styles.vazio}>Ele pode ter sido removido. Voltando para o Funil...</p>
            <p className={styles.linkAlternativo}>
              <Link href="/funil">Voltar agora</Link>
            </p>
            <VoltarSozinho para="/funil" segundos={4} />
          </section>
        )}

        {contato && (
          <>
            <header className={styles.cabecalho}>
              <div>
                <h1 className={styles.titulo}>{contato.nome}</h1>
                <p className={styles.apoio}>
                  {[contato.email, contato.telefone].filter(Boolean).join(" · ") || "Sem email ou telefone"}
                </p>
                <p className={styles.desde}>Cadastrado {tempoDesde(contato.criado_em)}</p>
              </div>
              {/* A chave inclui a etapa para o seletor acompanhar mudanças feitas em outro lugar. */}
              <SeletorEtapa
                key={`${contato.id}-${contato.etapa}`}
                contatoId={contato.id}
                etapa={contato.etapa}
              />
            </header>

            <section className={styles.cartao}>
              <h2 className={styles.tituloSecao}>
                Anotações <span className={styles.contador}>({contato.anotacoes.length})</span>
              </h2>
              <FormularioAnotacao contatoId={contato.id} />

              {contato.anotacoes.length === 0 ? (
                <p className={styles.semAnotacoes}>Nenhuma anotação ainda.</p>
              ) : (
                <ul className={styles.listaAnotacoes}>
                  {contato.anotacoes.map((anotacao) => (
                    <Anotacao key={anotacao.id} anotacao={anotacao} data={formatarData(anotacao.criado_em)} />
                  ))}
                </ul>
              )}
            </section>

            <section className={styles.cartao}>
              <h2 className={styles.tituloSecao}>
                Follow-ups <span className={styles.contador}>({contato.followups.length})</span>
              </h2>
              <FollowUp
                contatoId={contato.id}
                followups={contato.followups.map((f) => ({
                  id: f.id,
                  texto: f.texto,
                  data: formatarData(f.criado_em),
                }))}
              />
            </section>
          </>
        )}
      </main>
    </Shell>
  );
}
