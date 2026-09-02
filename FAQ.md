# FAQ — Kairo

Perguntas frequentes sobre como usar o Kairo, o app de gestão de tempo, clientes, tarefas e financeiro para assistência virtual.

## Índice

- [O que é o Kairo?](#o-que-é-o-kairo)
- [Como funciona o vínculo entre Cliente e Projeto?](#como-funciona-o-vínculo-entre-cliente-e-projeto)
- [Como funciona o Timer?](#como-funciona-o-timer)
- [Como funciona o Kanban de Tarefas?](#como-funciona-o-kanban-de-tarefas)
- [Como funcionam os Relatórios?](#como-funcionam-os-relatórios)
- [Como funciona o Financeiro?](#como-funciona-o-financeiro)
- [O que acontece quando eu excluo um cliente ou projeto?](#o-que-acontece-quando-eu-excluo-um-cliente-ou-projeto)
- [Onde meus dados ficam salvos?](#onde-meus-dados-ficam-salvos)
- [Como funciona o tema claro/escuro?](#como-funciona-o-tema-claroescuro)
- [Limitações conhecidas](#limitações-conhecidas)

## O que é o Kairo?

O Kairo é um app pessoal de gestão de tempo, clientes, tarefas e financeiro, criado para unificar num só lugar o que antes ficava espalhado entre Clockify, Notion e planilha do Google. Ele roda inteiramente no navegador, sem servidor — todos os dados ficam salvos localmente no seu próprio computador.

## Como funciona o vínculo entre Cliente e Projeto?

Clientes e Projetos são cadastrados separadamente, cada um na sua própria página. Um Projeto (ex: "Financeiro", "Comercial") não pertence a um único cliente — ele pode ser vinculado a **vários clientes diferentes**, e um cliente pode ter **vários projetos** vinculados a ele.

Esse vínculo é feito dentro do modal de edição do Cliente: ao criar ou editar um cliente, uma lista de checkboxes mostra todos os projetos existentes, e você marca quais deles esse cliente usa. Sempre que for iniciar um cronômetro ou registrar uma tarefa, só os projetos vinculados ao cliente escolhido aparecem como opção.

## Como funciona o Timer?

O Timer tem dois modos, alternados por um botão no topo do formulário:

- **Cronômetro**: escolha cliente, projeto, descrição e (opcionalmente) uma etiqueta, depois clique em "Iniciar". O tempo passa a contar em tela cheia; clique em "Parar" para encerrar e salvar o registro.
- **Manual**: preencha os mesmos campos, mais data, horário de início e horário de fim — o total é calculado automaticamente enquanto você preenche. Útil para lançar um tempo que você esqueceu de cronometrar.

Na lista "Atividades de hoje", cada campo do registro (cliente, projeto, descrição, etiqueta, início, fim) pode ser **editado diretamente**, clicando nele — a duração é recalculada automaticamente se você mudar o horário de início ou fim. Também é possível excluir um registro pelo ícone de lixeira (com confirmação antes de apagar).

## Como funciona o Kanban de Tarefas?

Na página Tarefas, primeiro você escolhe um cliente numa lista — isso leva ao quadro Kanban das tarefas daquele cliente específico, organizado em 5 colunas por status: A fazer, Fazendo, Aguardando, Concluída e Arquivada (cada uma com uma cor própria).

Use o botão "Nova Tarefa" para criar uma, definindo título, prazo, prioridade, status, recorrência e descrição. Clicar num card existente abre o mesmo modal para editar, com opção de excluir. O botão de filtro permite buscar por prioridade e por palavras no título.

## Como funcionam os Relatórios?

A página de Relatórios permite filtrar os registros de tempo por cliente, projeto e um intervalo de datas (usando o calendário de período). Depois de aplicar o filtro, você vê:

- Três números-resumo: total de horas, total cobrável (R$) e quantidade de registros
- Uma lista detalhada (registro por registro, paginada de 20 em 20) ou uma visão resumida (agrupada por cliente + projeto), alternáveis pelo botão "Ver detalhado"/"Ver resumido"

Assim como no Timer, cada campo dos registros na lista detalhada pode ser editado diretamente clicando nele.

## Como funciona o Financeiro?

Escolha um mês no filtro do topo para ver quanto você tem a receber naquele período. O cálculo considera só os registros marcados como cobráveis (hoje, todos os registros são cobráveis por padrão — veja a seção de limitações), e soma de duas formas diferentes dependendo do tipo de cobrança do cliente:

- **Por hora**: duração de cada registro × valor da hora do cliente
- **Fixo mensal**: o valor combinado é somado uma única vez, independente de quantos registros existirem naquele mês

Os clientes aparecem ordenados do maior para o menor valor a receber.

## O que acontece quando eu excluo um cliente ou projeto?

A exclusão de Cliente e Projeto é reversível por padrão ("exclusão suave"): o item some da lista principal, mas fica guardado numa área separada ("Ver clientes excluídos" / "Ver projetos excluídos"), de onde pode ser restaurado a qualquer momento. Só existe uma opção de "Excluir permanentemente" dentro dessa área de excluídos, que aí sim remove o dado de vez — com uma confirmação clara antes.

Ao restaurar um projeto, o Kairo pergunta se você também quer restaurar a vinculação dele com os clientes que tinha antes.

## Onde meus dados ficam salvos?

Todos os dados (clientes, projetos, tarefas, registros de tempo) ficam salvos no `localStorage` do navegador — ou seja, diretamente no seu computador, dentro daquele navegador específico. Isso significa:

- Os dados **não sincronizam** entre navegadores ou dispositivos diferentes
- Limpar os dados de navegação do navegador (cache/cookies) pode apagar tudo
- Não existe backup automático na nuvem

## Como funciona o tema claro/escuro?

O botão na parte de baixo da sidebar alterna entre os dois temas. A escolha é salva e permanece a mesma ao navegar entre as páginas ou fechar e reabrir o navegador.

## Limitações conhecidas

- **Anexos de arquivo** (em Cliente e Tarefa): é possível selecionar arquivos, inclusive arrastando-os para a área designada, mas o conteúdo do arquivo ainda não é salvo de fato — ao salvar o cliente ou tarefa, o arquivo selecionado não persiste
- **Moeda**: os valores são exibidos sempre em Real (R$)
- **Pacote de horas**: ainda não há suporte para definir um limite de horas por cliente nem calcular automaticamente valores excedentes
- **Exportação de relatórios**: ainda não é possível exportar relatórios em PDF ou Excel
- **Cor do projeto no Timer**: o campo de seleção de projeto no formulário do Timer não mostra a cor de cada projeto (limitação do elemento nativo do navegador)
- **Cobrável/não-cobrável**: todo registro de tempo hoje é sempre marcado como cobrável (`billable: true`) — ainda não existe uma opção no formulário do Timer para marcar um registro específico como não-cobrável, mesmo que o cálculo do Financeiro e dos Relatórios já esteja preparado para considerar essa distinção
