import { formatarData } from "../../lib/datas";
import { exigirAdmin } from "../../lib/sessao";
import { supabase } from "../../lib/supabase";
import { aprovarUsuario, recusarUsuario } from "../actions";
import Navbar from "../Navbar";
import styles from "../page.module.css";

// Sempre busca os dados no banco a cada visita, nunca uma cópia guardada.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Usuários · Meu CRM",
};

const PAPEIS = {
  admin: "Admin",
  usuario: "Usuário",
};

export default async function Usuarios() {
  const usuarioLogado = await exigirAdmin();

  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, status, criado_em")
    .order("criado_em", { ascending: false });

  const pendentes = usuarios?.filter((u) => u.status === "pendente") ?? [];
  const aprovados = usuarios?.filter((u) => u.status === "aprovado") ?? [];

  return (
    <>
      <Navbar usuario={usuarioLogado} ativa="usuarios" />

      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Usuários</h1>
            <p className={styles.apoio}>Aprove novos cadastros e veja quem tem acesso.</p>
          </div>
        </header>

        {error && <p className={styles.erro}>Não foi possível carregar os usuários.</p>}

        <section className={styles.cartao}>
          <h2 className={styles.tituloSecao}>Aguardando aprovação</h2>

          {pendentes.length === 0 ? (
            <p className={styles.vazio}>Nenhum cadastro aguardando aprovação.</p>
          ) : (
            <ul className={styles.lista}>
              {pendentes.map((u) => (
                <li className={styles.item} key={u.id}>
                  <div className={styles.linha}>
                    <div>
                      <p className={styles.nomeContato}>{u.usuario}</p>
                      <p className={styles.detalhes}>Cadastrado em {formatarData(u.criado_em)}</p>
                    </div>
                    <div className={styles.acoesUsuario}>
                      <form action={aprovarUsuario.bind(null, u.id)}>
                        <button className={`${styles.botao} ${styles.botaoPequeno}`} type="submit">
                          Aprovar
                        </button>
                      </form>
                      <form action={recusarUsuario.bind(null, u.id)}>
                        <button className={`${styles.botaoSecundario} ${styles.botaoPequeno}`} type="submit">
                          Recusar
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.cartao}>
          <h2 className={styles.tituloSecao}>Com acesso</h2>

          <ul className={styles.lista}>
            {aprovados.map((u) => (
              <li className={styles.item} key={u.id}>
                <div className={styles.linha}>
                  <div>
                    <p className={styles.nomeContato}>{u.usuario}</p>
                    <p className={styles.detalhes}>Cadastrado em {formatarData(u.criado_em)}</p>
                  </div>
                  <span className={styles.etiquetaNeutra}>{PAPEIS[u.papel]}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
