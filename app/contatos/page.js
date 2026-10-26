import Link from "next/link";
import { ETAPAS_DO_FUNIL } from "../../lib/etapas";
import { exigirLogin } from "../../lib/sessao";
import { supabase } from "../../lib/supabase";
import FormularioContato from "../FormularioContato";
import Shell from "../Shell";
import styles from "../page.module.css";

export const metadata = {
  title: "Contatos · Meu CRM",
};

export default async function Contatos({ searchParams }) {
  const usuarioLogado = await exigirLogin();

  // Tira os caracteres que o filtro do banco usa como comando, para a busca valer só como texto.
  const { busca } = await searchParams;
  const termo = String(busca ?? "").replace(/[%_,()"\\*]/g, " ").trim().slice(0, 100);

  const { data: encontrados, error } = termo
    ? await supabase
        .from("contatos")
        .select("id, nome, email, telefone, etapa")
        .or(`nome.ilike.%${termo}%,email.ilike.%${termo}%,telefone.ilike.%${termo}%`)
        .order("nome")
        .limit(50)
    : { data: null, error: null };

  return (
    <Shell usuario={usuarioLogado} ativa="contatos">
      <main className={styles.pagina}>
        <header className={styles.cabecalho}>
          <div>
            <h1 className={styles.titulo}>Contatos</h1>
            <p className={styles.apoio}>Busque um contato ou cadastre um novo para acompanhar no funil.</p>
          </div>
        </header>

        <section className={styles.cartao}>
          <h2 className={styles.tituloSecao}>Buscar contato</h2>
          <form className={styles.formBusca} role="search">
            <label className={styles.rotuloOculto} htmlFor="busca">
              Nome, email ou telefone
            </label>
            <input
              className={styles.campo}
              id="busca"
              name="busca"
              type="search"
              placeholder="Nome, email ou telefone"
              autoComplete="off"
              defaultValue={termo}
            />
            <button className={styles.botao} type="submit">
              Buscar
            </button>
          </form>

          {error && <p className={styles.erro}>Não foi possível buscar agora. Tente de novo.</p>}

          {encontrados && encontrados.length === 0 && (
            <p className={styles.semResultado} role="status">
              Nenhum contato encontrado para &ldquo;{termo}&rdquo;. Confira a grafia ou busque por outra parte do
              nome, do email ou do telefone.
            </p>
          )}

          {encontrados && encontrados.length > 0 && (
            <ul className={styles.listaBusca}>
              {encontrados.map((contato) => (
                <li key={contato.id}>
                  <Link className={styles.resultado} href={`/contatos/${contato.id}`}>
                    <span>
                      <span className={styles.nomeContato}>{contato.nome}</span>
                      <span className={styles.detalhes}>
                        {[contato.email, contato.telefone].filter(Boolean).join(" · ") ||
                          "Sem email ou telefone"}
                      </span>
                    </span>
                    <span
                      className={styles.etiqueta}
                      style={{ "--cor": `var(--etapa-${contato.etapa.replace(" ", "-")})` }}
                    >
                      {ETAPAS_DO_FUNIL.find((e) => e.valor === contato.etapa)?.nome ?? contato.etapa}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.cartao}>
          <h2 className={styles.tituloSecao}>Novo contato</h2>
          <FormularioContato />
        </section>
      </main>
    </Shell>
  );
}
