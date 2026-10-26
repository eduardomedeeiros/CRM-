// Ex.: "23 de outubro de 2026 às 14:07", sempre no horário de Brasília.
const formato = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function formatarData(data) {
  return formato.format(new Date(data));
}
