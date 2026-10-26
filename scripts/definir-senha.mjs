// Cria um administrador já aprovado, ou troca a senha de um usuário existente e o torna admin.
// Serve para criar o primeiro admin ou recuperar o acesso se a senha for esquecida.
// Rode no terminal com: npm run definir-senha

import { createClient } from "@supabase/supabase-js";
import readline from "node:readline";
import { embaralharSenha } from "../lib/senha.js";

function perguntar(pergunta, oculto = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let silenciar = false;
    // Enquanto a senha é digitada, nada aparece na tela.
    rl._writeToOutput = (texto) => {
      if (!silenciar) rl.output.write(texto);
    };
    rl.question(pergunta, (resposta) => {
      rl.close();
      if (oculto) process.stdout.write("\n");
      resolve(resposta);
    });
    silenciar = oculto;
  });
}

const usuario = (await perguntar("Usuário: ")).trim().toLowerCase();
const senha = await perguntar("Senha (não aparece enquanto digita): ", true);
const confirmacao = await perguntar("Repita a senha: ", true);

if (!usuario || senha.length < 8) {
  console.log("\nInforme um usuário e uma senha de pelo menos 8 caracteres. Nada foi alterado.");
  process.exit(1);
}
if (senha !== confirmacao) {
  console.log("\nAs senhas não são iguais. Nada foi alterado.");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const { error } = await supabase
  .from("usuarios")
  .upsert(
    { usuario, senha_hash: embaralharSenha(senha), papel: "admin", status: "aprovado" },
    { onConflict: "usuario" }
  );

if (error) {
  console.log(`\nNão foi possível salvar: ${error.message}`);
  process.exit(1);
}

console.log(`\nPronto! "${usuario}" é admin e a senha embaralhada foi salva no banco.`);
