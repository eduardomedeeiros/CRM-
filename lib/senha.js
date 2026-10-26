import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Embaralha a senha com um "sal" aleatório. O resultado é "sal:senhaEmbaralhada".
export function embaralharSenha(senha) {
  const sal = randomBytes(16).toString("hex");
  return `${sal}:${scryptSync(senha, sal, 64).toString("hex")}`;
}

// Embaralha a senha digitada do mesmo jeito e compara com a guardada.
export function senhaConfere(senha, senhaGuardada) {
  const [sal, hash] = (senhaGuardada ?? "").split(":");
  if (!sal || !hash) return false;
  const digitada = scryptSync(senha, sal, 64);
  const guardada = Buffer.from(hash, "hex");
  return digitada.length === guardada.length && timingSafeEqual(digitada, guardada);
}
