"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@google/genai";
import { redirect } from "next/navigation";
import { ETAPAS_DO_FUNIL } from "../lib/etapas";
import { escreverFollowUp } from "../lib/followup";
import { embaralharSenha, senhaConfere } from "../lib/senha";
import { encerrarSessao, exigirAdmin, exigirLogin, iniciarSessao } from "../lib/sessao";
import { supabase } from "../lib/supabase";
import { LIMITES, emailValido, idValido, telefoneValido } from "../lib/validacao";

// Confere usuário e senha. Se estiverem certos e o cadastro estiver aprovado, abre o CRM.
export async function entrar(estadoAnterior, formData) {
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  // Senha gigante não é senha de ninguém e só deixaria o servidor lento ao embaralhar.
  if (!usuario || !senha || senha.length > LIMITES.senha) {
    return { erro: "Usuário ou senha inválidos.", usuario };
  }

  const { data: encontrado } = await supabase
    .from("usuarios")
    .select("id, senha_hash, status")
    .eq("usuario", usuario)
    .maybeSingle();

  if (!encontrado || !senhaConfere(senha, encontrado.senha_hash)) {
    return { erro: "Usuário ou senha inválidos.", usuario };
  }

  if (encontrado.status !== "aprovado") {
    return { erro: "Seu cadastro ainda está aguardando aprovação do administrador.", usuario };
  }

  await iniciarSessao(encontrado.id);
  redirect("/");
}

// Cria um cadastro novo. Ele nasce pendente e só entra depois que o admin aprovar.
export async function cadastrar(estadoAnterior, formData) {
  const usuario = String(formData.get("usuario") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");
  const confirmacao = String(formData.get("confirmacao") ?? "");

  if (!/^[a-z0-9._-]{3,30}$/.test(usuario)) {
    return {
      erro: "O usuário deve ter de 3 a 30 caracteres: letras sem acento, números, ponto, hífen ou sublinhado.",
      usuario,
    };
  }
  if (senha.length < 8 || senha.length > LIMITES.senha) {
    return { erro: `A senha deve ter de 8 a ${LIMITES.senha} caracteres.`, usuario };
  }
  if (senha !== confirmacao) {
    return { erro: "As senhas não são iguais.", usuario };
  }

  const { error } = await supabase
    .from("usuarios")
    .insert({ usuario, senha_hash: embaralharSenha(senha) });

  if (error?.code === "23505") {
    return { erro: "Esse usuário já existe. Escolha outro.", usuario };
  }
  if (error) {
    return { erro: "Não foi possível concluir o cadastro. Tente de novo.", usuario };
  }

  return { sucesso: true };
}

// Apaga o "crachá" e volta para a tela de login.
export async function sair() {
  await encerrarSessao();
  redirect("/login");
}

// Libera o acesso de um cadastro pendente. Só o admin pode.
export async function aprovarUsuario(id) {
  await exigirAdmin();
  if (!idValido(id)) return;
  await supabase.from("usuarios").update({ status: "aprovado" }).eq("id", id).eq("status", "pendente");
  revalidatePath("/usuarios");
}

// Descarta um cadastro pendente. Só o admin pode, e só vale para quem ainda está pendente.
export async function recusarUsuario(id) {
  await exigirAdmin();
  if (!idValido(id)) return;
  await supabase.from("usuarios").delete().eq("id", id).eq("status", "pendente");
  revalidatePath("/usuarios");
}

// Recebe os dados do formulário, grava no banco e pede para a página se atualizar.
export async function criarContato(estadoAnterior, formData) {
  await exigirLogin();

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const telefone = String(formData.get("telefone") ?? "").trim();
  // Devolvidos junto com o erro para o formulário não apagar o que foi digitado.
  const valores = { nome, email, telefone };

  if (!nome) {
    return { erro: "Informe o nome do contato para salvar.", valores };
  }
  if (nome.length > LIMITES.nome) {
    return { erro: `O nome pode ter no máximo ${LIMITES.nome} caracteres.`, valores };
  }
  if (email && (email.length > LIMITES.email || !emailValido(email))) {
    return { erro: "Informe um email válido, como nome@empresa.com.", valores };
  }
  if (telefone && (telefone.length > LIMITES.telefone || !telefoneValido(telefone))) {
    return { erro: "Informe um telefone válido, como (11) 98765-4321.", valores };
  }

  const { error } = await supabase.from("contatos").insert({
    nome,
    email: email || null,
    telefone: telefone || null,
  });

  if (error) {
    return { erro: "Não foi possível salvar o contato. Tente de novo.", valores };
  }

  revalidatePath("/contatos");
  return { erro: null };
}

// Move o contato para outra etapa do funil.
export async function mudarEtapa(contatoId, etapa) {
  await exigirLogin();

  if (!idValido(contatoId) || !ETAPAS_DO_FUNIL.some((e) => e.valor === etapa)) {
    return { erro: "Etapa inválida." };
  }

  const { error } = await supabase.from("contatos").update({ etapa }).eq("id", contatoId);

  if (error) {
    return { erro: "Não foi possível mudar a etapa. Tente de novo." };
  }

  revalidatePath("/contatos");
  revalidatePath("/");
  return { erro: null };
}

// Grava uma anotação ligada ao contato. A data de escrita é preenchida pelo banco.
export async function criarAnotacao(estadoAnterior, formData) {
  await exigirLogin();

  const contatoId = Number(formData.get("contatoId"));
  const texto = String(formData.get("texto") ?? "").trim();

  if (!idValido(contatoId)) {
    return { erro: "Não encontramos esse contato. Recarregue a página e tente de novo." };
  }
  if (!texto) {
    return { erro: "Escreva a anotação antes de salvar." };
  }
  if (texto.length > LIMITES.anotacao) {
    return { erro: `A anotação pode ter no máximo ${LIMITES.anotacao} caracteres.`, texto };
  }

  const { error } = await supabase.from("anotacoes").insert({
    contato_id: contatoId,
    texto,
  });

  if (error) {
    return { erro: "Não foi possível salvar a anotação. Tente de novo.", texto };
  }

  revalidatePath("/contatos");
  return { erro: null };
}

// Troca o texto de uma anotação. A data de escrita original é mantida.
export async function editarAnotacao(id, textoNovo) {
  await exigirLogin();

  const texto = String(textoNovo ?? "").trim();

  if (!idValido(id)) {
    return { erro: "Não encontramos essa anotação. Recarregue a página e tente de novo." };
  }
  if (!texto) {
    return { erro: "A anotação não pode ficar vazia." };
  }
  if (texto.length > LIMITES.anotacao) {
    return { erro: `A anotação pode ter no máximo ${LIMITES.anotacao} caracteres.` };
  }

  const { error } = await supabase.from("anotacoes").update({ texto }).eq("id", id);

  if (error) {
    return { erro: "Não foi possível salvar a alteração. Tente de novo." };
  }

  revalidatePath("/contatos");
  return { erro: null };
}

// Busca o contato no banco e pede à IA uma mensagem de follow-up para ele.
export async function gerarFollowUp(contatoId) {
  await exigirLogin();

  if (!idValido(contatoId)) {
    return { erro: "Não encontramos esse contato. Recarregue a página e tente de novo." };
  }

  const { data: contato } = await supabase
    .from("contatos")
    .select("nome, etapa, anotacoes(texto, criado_em)")
    .eq("id", contatoId)
    .order("criado_em", { referencedTable: "anotacoes", ascending: true })
    .maybeSingle();

  if (!contato) {
    return { erro: "Não encontramos esse contato. Recarregue a página e tente de novo." };
  }

  try {
    return { texto: await escreverFollowUp(contato) };
  } catch (erro) {
    // O detalhe técnico fica só no terminal do servidor; a tela recebe uma mensagem simples.
    if (erro instanceof ApiError && (erro.status === 400 || erro.status === 403)) {
      console.error(`Follow-up: chave do Gemini ausente ou inválida (erro ${erro.status}).`);
    } else if (erro instanceof ApiError && erro.status === 429) {
      console.error("Follow-up: limite do plano gratuito do Gemini atingido.");
    } else if (erro instanceof ApiError) {
      console.error(`Follow-up: erro ${erro.status} da API do Gemini.`);
    } else {
      console.error("Follow-up:", erro.message);
    }
    return { erro: "Não foi possível gerar o follow-up agora. Tente de novo em instantes." };
  }
}

// Apaga a anotação de vez no banco.
export async function excluirAnotacao(id) {
  await exigirLogin();

  if (!idValido(id)) {
    return { erro: "Não encontramos essa anotação. Recarregue a página e tente de novo." };
  }

  const { error } = await supabase.from("anotacoes").delete().eq("id", id);

  if (error) {
    return { erro: "Não foi possível excluir a anotação. Tente de novo." };
  }

  revalidatePath("/contatos");
  return { erro: null };
}
