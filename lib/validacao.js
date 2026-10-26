// Regras simples para conferir o que chega dos formulários antes de gravar no banco.

export const LIMITES = {
  nome: 120,
  email: 200,
  telefone: 20,
  anotacao: 5000,
  senha: 200,
};

// Número de registro (contato, anotação, usuário): inteiro e positivo, escrito só com dígitos.
// Recusa formas como "1e3", " 5" ou true, que o Number() aceitaria.
export function idValido(id) {
  if (typeof id !== "number" && typeof id !== "string") return false;
  return /^[1-9]\d*$/.test(String(id)) && Number.isSafeInteger(Number(id));
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Aceita números, espaços, parênteses, hífen, ponto e "+", com pelo menos 8 dígitos.
export function telefoneValido(telefone) {
  return /^[0-9()+\-.\s]+$/.test(telefone) && telefone.replace(/\D/g, "").length >= 8;
}
