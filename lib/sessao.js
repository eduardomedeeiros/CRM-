import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";

// O "crachá" de quem fez login: um cookie com o número do usuário, a validade e uma assinatura.
// Só o servidor conhece o SESSAO_SEGREDO, então ninguém consegue falsificar a assinatura.
export const NOME_COOKIE = "sessao";
const DURACAO_SEGUNDOS = 7 * 24 * 60 * 60; // 7 dias

function assinar(valor) {
  return createHmac("sha256", process.env.SESSAO_SEGREDO).update(valor).digest("hex");
}

// Compara dois textos sem dar pistas pelo tempo de resposta.
function iguais(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// Devolve o número do usuário se o crachá for autêntico e estiver no prazo; senão, null.
function lerToken(token) {
  if (!token || !process.env.SESSAO_SEGREDO) return null;
  const [id, expira, assinatura] = token.split(".");
  if (!id || !expira || !assinatura) return null;
  if (!iguais(assinatura, assinar(`${id}.${expira}`))) return null;
  if (Number(expira) <= Date.now()) return null;
  return Number(id);
}

export function tokenValido(token) {
  return lerToken(token) !== null;
}

export async function iniciarSessao(idUsuario) {
  const expira = String(Date.now() + DURACAO_SEGUNDOS * 1000);
  const conteudo = `${idUsuario}.${expira}`;
  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE, `${conteudo}.${assinar(conteudo)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SEGUNDOS,
  });
}

export async function encerrarSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(NOME_COOKIE);
}

// Quem está logado agora, conferido no banco. Usuário removido ou não aprovado não passa.
export async function usuarioAtual() {
  const cookieStore = await cookies();
  const id = lerToken(cookieStore.get(NOME_COOKIE)?.value);
  if (id === null) return null;

  const { data } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, status")
    .eq("id", id)
    .maybeSingle();

  return data?.status === "aprovado" ? data : null;
}

// Usado no começo de cada página e ação: sem login, manda para a tela de login.
export async function exigirLogin() {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/login");
  return usuario;
}

// Igual ao exigirLogin, mas só deixa passar o admin. Os outros voltam para Contatos.
export async function exigirAdmin() {
  const usuario = await exigirLogin();
  if (usuario.papel !== "admin") redirect("/");
  return usuario;
}
