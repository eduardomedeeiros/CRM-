import { GoogleGenAI } from "@google/genai";
import { formatarData } from "./datas";

// Apelido que aponta sempre para a versão Flash-Lite mais recente do Gemini:
// a mais rápida e a que menos sofre com fila no plano gratuito.
const MODELO = "gemini-flash-lite-latest";

const INSTRUCOES = `Você escreve mensagens de follow-up que um pequeno negócio envia aos seus contatos e clientes.

Regras:
- Português do Brasil, tom profissional, caloroso e direto.
- Mensagem curta: de 2 a 4 frases, natural, como se escrita por uma pessoa. Pronta para enviar por WhatsApp ou e-mail.
- Chame o contato pelo primeiro nome.
- Use a etapa do funil e as anotações para retomar a conversa de onde parou e proponha um próximo passo concreto.
- A anotação mais recente mostra onde a conversa parou: a mensagem precisa fazer referência a ela.
- Não invente fatos, datas ou valores que não estejam nas anotações, nem sugira dias ou horários específicos.
- Sem emojis, sem assunto, sem assinatura e sem campos entre colchetes para preencher.
- Responda apenas com o texto da mensagem.`;

const ETAPAS = {
  novo: "novo (ainda não houve conversa de verdade)",
  "em contato": "em contato (a conversa já começou)",
  proposta: "proposta (uma proposta foi enviada e aguarda retorno)",
  cliente: "cliente (já fechou negócio; o objetivo é manter o relacionamento)",
};

// Pede ao Gemini uma mensagem de follow-up para o contato. Roda só no servidor.
export async function escreverFollowUp(contato) {
  const anotacoes = contato.anotacoes.length
    ? contato.anotacoes.map((a) => `- ${formatarData(a.criado_em)}: ${a.texto}`).join("\n")
    : "Nenhuma anotação registrada.";

  const pedido = `Nome do contato: ${contato.nome}
Etapa do funil: ${ETAPAS[contato.etapa] ?? contato.etapa}

Anotações, da mais antiga para a mais recente:
${anotacoes}

Escreva a mensagem de follow-up para esse contato.`;

  // A chave GEMINI_API_KEY vem do .env.local.
  const ia = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const resposta = await ia.models.generateContent({
    model: MODELO,
    contents: pedido,
    config: { systemInstruction: INSTRUCOES },
  });

  const texto = resposta.text?.trim();
  if (!texto) {
    throw new Error("A IA não devolveu texto.");
  }
  return texto;
}
