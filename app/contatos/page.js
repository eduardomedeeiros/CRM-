import { formatarData } from "../../lib/datas";
import { exigirLogin } from "../../lib/sessao";
import { supabase } from "../../lib/supabase";
import Anotacao from "../Anotacao";
import FormularioAnotacao from "../FormularioAnotacao";
import FollowUp from "../FollowUp";
import FormularioContato from "../FormularioContato";
import Navbar from "../Navbar";
import SeletorEtapa from "../SeletorEtapa";
import styles from "../page.module.css";

// Sempre busca os dados no banco a cada visita, nunca uma cópia guardada.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contatos · Meu CRM",
};

export default async function Contatos() {
  const usuarioLogado = await exigirLogin();

  // Traz cada contato já com as anotações dele, das mais novas para as mais antigas.
  const { data: contatos, error } = await supabase
    .from("contatos")
    .select("id, nome, email, telefone, etapa, anotacoes(id, texto, criado_em)")
    .order("criado_em", { ascending: false })
    .order("id", { ascending: false })
    .order("criado_em", { referencedTable: "anotacoes", ascending: false });

  return (
    <>
      <Navbar usuario={usuarioLogado} ativa="contatos" />

      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Contatos</h1>
            <p className={styles.apoio}>Seus contatos e oportunidades em um só lugar.</p>
          </div>
        </header>

        <section className={styles.cartao}>
          <h2 className={styles.tituloSecao}>Novo contato</h2>
          <FormularioContato />
        </section>

        <section className={styles.cartao}>
          <h2 className={styles.tituloSecao}>Todos os contatos</h2>

          {error && <p className={styles.erro}>Não foi possível carregar os contatos.</p>}

          {!error && contatos.length === 0 && (
            <p className={styles.vazio}>Nenhum contato cadastrado ainda.</p>
          )}

          {!error && contatos.length > 0 && (
            <ul className={styles.lista}>
              {contatos.map((contato) => (
                <li className={styles.item} key={contato.id}>
                  <div className={styles.linha}>
                    <div>
                      <p className={styles.nomeContato}>{contato.nome}</p>
                      <p className={styles.detalhes}>
                        {[contato.email, contato.telefone].filter(Boolean).join(" · ") ||
                          "Sem email ou telefone"}
                      </p>
                    </div>
                    {/* A chave inclui a etapa para o seletor acompanhar mudanças feitas em outro lugar. */}
                    <SeletorEtapa
                      key={`${contato.id}-${contato.etapa}`}
                      contatoId={contato.id}
                      etapa={contato.etapa}
                    />
                  </div>

                  <FollowUp contatoId={contato.id} />

                  <details className={styles.anotacoes}>
                    <summary className={styles.abrirAnotacoes}>
                      Anotações ({contato.anotacoes.length})
                    </summary>
                    <div className={styles.painelAnotacoes}>
                      <FormularioAnotacao contatoId={contato.id} />

                      {contato.anotacoes.length === 0 ? (
                        <p className={styles.semAnotacoes}>Nenhuma anotação ainda.</p>
                      ) : (
                        <ul className={styles.listaAnotacoes}>
                          {contato.anotacoes.map((anotacao) => (
                            <Anotacao
                              key={anotacao.id}
                              anotacao={anotacao}
                              data={formatarData(anotacao.criado_em)}
                            />
                          ))}
                        </ul>
                      )}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
