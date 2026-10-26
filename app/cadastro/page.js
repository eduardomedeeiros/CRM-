import Link from "next/link";
import styles from "../page.module.css";
import FormularioCadastro from "./FormularioCadastro";

export const metadata = {
  title: "Criar conta · Meu CRM",
};

export default function Cadastro() {
  return (
    <main className={styles.paginaLogin}>
      <section className={styles.cartao}>
        <h1 className={styles.tituloLogin}>Criar conta</h1>
        <p className={styles.apoioLogin}>Seu acesso será liberado depois da aprovação do administrador.</p>
        <FormularioCadastro />
      </section>
      <p className={styles.linkAlternativo}>
        Já tem cadastro? <Link href="/login">Entrar</Link>
      </p>
    </main>
  );
}
