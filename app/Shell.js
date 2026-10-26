"use client";

import Link from "next/link";
import { useState } from "react";
import { sair } from "./actions";
import styles from "./page.module.css";

// Áreas do sistema na navegação lateral. Uma área nova entra como mais um item aqui.
const AREAS = [
  { id: "dashboard", nome: "Dashboard", href: "/" },
  { id: "funil", nome: "Funil", href: "/funil" },
  { id: "contatos", nome: "Contatos", href: "/contatos" },
  { id: "usuarios", nome: "Usuários", href: "/usuarios", soAdmin: true },
];

// Estrutura fixa das telas internas: cabeçalho, navegação lateral e o conteúdo à direita.
// "ativa" diz qual área destacar. Em telas estreitas a navegação vira um menu que abre e fecha.
export default function Shell({ usuario, ativa, children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  const areas = AREAS.filter((a) => !a.soAdmin || usuario.papel === "admin");

  return (
    <div className={styles.shell}>
      <header className={styles.topo}>
        <div className={styles.topoEsquerda}>
          <button
            className={`${styles.botaoSecundario} ${styles.botaoPequeno} ${styles.botaoMenu}`}
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-expanded={menuAberto}
            aria-controls="navegacao"
          >
            {menuAberto ? "Fechar" : "Menu"}
          </button>
          <span className={styles.marca}>Meu CRM</span>
        </div>

        <div className={styles.navConta}>
          <span className={styles.navNome}>{usuario.usuario}</span>
          <form action={sair}>
            <button className={`${styles.botaoSecundario} ${styles.botaoPequeno}`} type="submit">
              Sair
            </button>
          </form>
        </div>
      </header>

      <nav
        id="navegacao"
        className={menuAberto ? `${styles.lateral} ${styles.lateralAberta}` : styles.lateral}
        aria-label="Áreas do sistema"
      >
        <p className={styles.rotuloLateral}>Áreas</p>
        <ul className={styles.listaLateral}>
          {areas.map((area) => (
            <li key={area.id}>
              <Link
                className={area.id === ativa ? `${styles.navLink} ${styles.navLinkAtivo}` : styles.navLink}
                href={area.href}
                aria-current={area.id === ativa ? "page" : undefined}
                onClick={() => setMenuAberto(false)}
              >
                {area.nome}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.conteudo}>{children}</div>
    </div>
  );
}
