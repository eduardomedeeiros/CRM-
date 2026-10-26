# PRD — CRM

## O que é e pra quem

Um CRM simples para organizar contatos e oportunidades de negócio em um só lugar.
É feito para uma pessoa (o administrador) que hoje controla clientes em planilhas, cadernos ou na memória e perde oportunidades por falta de acompanhamento. O administrador pode liberar o acesso de outras pessoas, que passam a trabalhar nos mesmos contatos.
Ele mostra em que etapa cada contato está e ajuda a não esquecer de retomar a conversa, com sugestões de follow-up feitas por IA.

## Funcionalidades da primeira versão

- [x] Cadastro e listagem de contatos
- [x] Funil com etapas: novo, em contato, proposta, cliente
- [x] Anotações por contato
- [x] Login (administrador e usuários aprovados)
- [x] Follow-up gerado por IA
- [x] Painel com os números do funil
- [x] Publicação na internet

### Entregue fora do plano original

- [x] Multiusuário: qualquer pessoa pode criar conta pela tela de cadastro, mas só entra depois que o admin aprova na tela de Usuários. Existem dois papéis: admin (aprova ou recusa cadastros e vê a tela de Usuários) e usuário (usa o CRM normalmente). Todos os aprovados veem os mesmos contatos.

## O que NÃO entra na primeira versão

- Envio automático de e-mails ou mensagens (a IA sugere o follow-up, quem envia é você)
- Integração com WhatsApp, e-mail, agenda ou redes sociais
- Importação ou exportação de planilhas
- Aplicativo de celular (só o site)
- Etapas do funil personalizáveis (as quatro etapas são fixas)
- Relatórios avançados, gráficos detalhados ou previsão de vendas
- Pagamentos, propostas em PDF ou contratos

## Versão 2

- [x] **Kanban do funil:** ver e mover os contatos entre as etapas arrastando.

  PRONTO QUANDO:
  - Abro o Funil e vejo quatro colunas (Novo, Em contato, Proposta, Cliente), cada uma com os contatos daquela etapa e a quantidade no topo.
  - Arrasto um contato de uma coluna para outra e ele fica na coluna nova.
  - Recarrego a página e o contato continua na coluna para onde arrastei.
  - Depois de arrastar, o Dashboard mostra os números já atualizados.
  - Se a mudança não puder ser salva, o contato volta para a coluna de antes e aparece uma mensagem de erro.

- [x] **Página do contato:** tudo de um contato num lugar só (dados, etapa, anotações, follow-ups gerados), com uma busca para chegar nela rápido.

  PRONTO QUANDO:
  - Clico num contato (no Kanban ou na busca) e abro uma página só dele, com nome, email, telefone e etapa.
  - Nessa página consigo mudar a etapa e criar, editar e excluir anotações, como já faço hoje.
  - Gero um follow-up na página, saio, volto depois e ele continua lá, junto com os follow-ups gerados antes.
  - Digito parte do nome, do email ou do telefone na busca e o contato aparece na lista de resultados. Clicando nele, abro a página dele.
  - Quando a busca não encontra nada, aparece um aviso claro em vez de uma lista vazia.

- [x] **Dashboard v2:** os números do funil apresentados como painel de sistema, com um gráfico simples da distribuição por etapa.

  PRONTO QUANDO:
  - Abro o Dashboard e vejo o total de contatos e a quantidade em cada etapa.
  - Vejo um gráfico simples com a distribuição dos contatos pelas quatro etapas, cada uma na sua cor.
  - Os números e o gráfico batem com a quantidade de contatos em cada coluna do Kanban.
  - Mudo um contato de etapa em outra aba e, sem recarregar, o Dashboard se atualiza em poucos segundos.
  - Sem nenhum contato cadastrado, o Dashboard mostra zeros e um aviso, sem gráfico quebrado.

## Fora da v2 (fica pra v3)

- Permissões avançadas (dono por contato, metas por usuário)
- Automações e lembretes agendados
- Integrações com outros sistemas
- Aplicativo de celular
