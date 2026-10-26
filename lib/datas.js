// Ex.: "23 de outubro de 2026 às 14:07", sempre no horário de Brasília.
const formato = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatarData(data) {
  return formato.format(new Date(data));
}

// Ex.: "há 5 minutos", "há 3 dias", "há 2 meses".
const relativo = new Intl.RelativeTimeFormat("pt-BR", { numeric: "always" });
const UNIDADES = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];

export function tempoDesde(data) {
  const segundos = Math.max(0, (Date.now() - new Date(data).getTime()) / 1000);
  for (const [unidade, tamanho] of UNIDADES) {
    if (segundos >= tamanho) return relativo.format(-Math.floor(segundos / tamanho), unidade);
  }
  return "agora mesmo";
}
