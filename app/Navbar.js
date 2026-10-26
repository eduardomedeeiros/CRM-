import Link from "next/link";
import { sair } from "./actions";
import styles from "./page.module.css";

// Barra de navegação das páginas internas. "ativa" diz qual link destacar.
export default function Navbar({ usuario, ativa }) {
  function classeLink(pagina) {
    return pagina === ativa ? `${styles.navLink} ${styles.navLinkAtivo}` : styles.navLink;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.navInterno}>
        <span className={styles.marca}>Meu CRM</span>

        <div className={styles.navLinks}>
          <Link
            className={classeLink("painel")}
            href="/"
            aria-current={ativa === "painel" ? "page" : undefined}
          >
            Painel
          </Link>
          <Link
            className={classeLink("contatos")}
            href="/contatos"
            aria-current={ativa === "contatos" ? "page" : undefined}
          >
            Contatos
          </Link>
          {usuario.papel === "admin" && (
            <Link
              className={classeLink("usuarios")}
              href="/usuarios"
              aria-current={ativa === "usuarios" ? "page" : undefined}
            >
              Usuários
            </Link>
          )}
        </div>

        <div className={styles.navConta}>
          <span className={styles.navNome}>{usuario.usuario}</span>
          <form action={sair}>
            <button className={`${styles.botaoSecundario} ${styles.botaoPequeno}`} type="submit">
              Sair
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
