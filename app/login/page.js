import Link from "next/link";
import styles from "../page.module.css";
import FormularioLogin from "./FormularioLogin";

export const metadata = {
  title: "Entrar · Meu CRM",
};

export default function Login() {
  return (
    <main className={styles.paginaLogin}>
      <section className={styles.cartao}>
        <h1 className={styles.tituloLogin}>Meu CRM</h1>
        <p className={styles.apoioLogin}>Entre para continuar.</p>
        <FormularioLogin />
      </section>
      <p className={styles.linkAlternativo}>
        Não tem conta? <Link href="/cadastro">Criar conta</Link>
      </p>
    </main>
  );
}
