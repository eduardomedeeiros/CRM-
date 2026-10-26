# Identidade visual do CRM · v2 Dark Tech

Estas regras valem para TODAS as telas do projeto, incluindo login, cadastro e usuários.

## Clima

Ferramenta técnica e precisa, escura, de quem trabalha à noite. Um produto profissional, não um template.

## Cores

| Uso | Cor |
| --- | --- |
| Fundo da página (quase-preto azulado) | `#0D1117` |
| Superfícies (cartões, painéis, navegação) | `#151B24` |
| Superfícies elevadas (modais, menus) | `#1B222E` |
| Borda visível | `#262F3D` |
| Texto principal (claro) | `#E6EAF2` |
| Texto de apoio | `#94A0B8` |
| Destaque: ações e elementos ativos (azul elétrico) | `#4D8DFF` |
| Destaque no hover (mais claro) | `#6BA1FF` |

Só existe UMA cor de destaque: o azul elétrico. Nenhuma outra cor de marca.

Contraste sempre confortável de ler: texto claro sobre fundo escuro, nunca cinza sobre cinza.

### Cor de erro

`#F87171`. Não é cor de marca: é usada só em mensagens de erro, na borda de um campo com problema e no botão que confirma uma exclusão.

### Cores das etapas do funil

Versões luminosas, legíveis no escuro. Usadas só nas etiquetas e nos indicadores de etapa.

| Etapa | Cor |
| --- | --- |
| Novo | `#8B99AD` |
| Em contato | `#F5A524` |
| Proposta | `#A78BFA` |
| Cliente | `#34D399` |

## Tipografia

- Fonte "Manrope" (Google Fonts) em tudo.
- NÚMEROS, contadores e etiquetas técnicas (datas, quantidades, papéis, etapas) em "JetBrains Mono" (Google Fonts). É o toque tech.
- Títulos em peso forte, textos em peso normal.
- Tamanhos generosos e hierarquia clara.

## Formas e espaço

- Cantos arredondados: `10px`.
- Bordas visíveis em vez de sombras.
- Bastante respiro entre os elementos.

## Proibido

- Gradientes
- Efeito de vidro / desfoque
- Emojis na interface
- Sombras exageradas
- Animações chamativas

Se parecer template de IA, está errado.

---

# Design v2 · De página pra sistema

O CRM deixa de ser um conjunto de páginas e passa a ser um sistema com estrutura fixa (o "shell").

## Shell da aplicação

- **Cabeçalho** no topo, de ponta a ponta: nome do CRM à esquerda; à direita, quem está logado e o botão Sair.
- **Navegação lateral fixa** à esquerda, abaixo do cabeçalho, com as áreas do sistema:
  - Dashboard
  - Funil
  - Contatos
  - Usuários (visível só pra admin)
  - A lista é feita pra crescer: novas áreas entram como novos itens, sem mudar a estrutura.
- **Área de conteúdo** à direita. Cada área é uma tela cheia, com título e texto de apoio no topo.
- O item ativo da navegação fica destacado com a cor de destaque (texto e marcador em azul elétrico).

## Áreas

| Área | Endereço | O que mostra |
| --- | --- | --- |
| Dashboard | `/` | O painel com os números do funil |
| Funil | `/funil` | A lista de contatos com etapa, follow-up e anotações |
| Contatos | `/contatos` | O cadastro de novo contato |
| Usuários | `/usuarios` | Aprovação de cadastros e quem tem acesso (só admin) |

## Telas estreitas

- A navegação lateral se recolhe. No cabeçalho aparece um botão "Menu" que abre e fecha a lista de áreas, por cima do conteúdo, numa superfície elevada.
- Escolher uma área fecha o menu.

## Telas fora do shell

- Login e cadastro não têm navegação nem cabeçalho: um cartão centralizado na tela, na mesma identidade escura.
