/* ==========================================================================
   CONFIG.JS — TEXTOS E VALORES PADRÃO DO JOGO
   ==========================================================================

   Este é o arquivo para mudar TEXTOS e PADRÕES sem mexer no resto do código.
   (As perguntas ficam em outro arquivo: perguntas.js)

   COMO EDITAR COM SEGURANÇA
   - Mude só o que está ENTRE ASPAS "assim" ou os NÚMEROS.
   - Não apague vírgulas, chaves { } nem colchetes [ ].
   - Salve o arquivo com a codificação UTF-8 (para os acentos funcionarem).
   - Depois de salvar, recarregue a página no navegador (tecla F5).

   ========================================================================== */

var CONFIG = {

  /* ------------------------------------------------------------------------
     NÍVEIS
     - "nome": como o nível aparece na tela.
     - "publico": frase curta embaixo do nome, na tela inicial.
     - "opcoes": quantas opções de resposta as perguntas desse nível têm.
       (NÃO mude "opcoes" sem mudar também as perguntas e as plaquinhas.)
     ------------------------------------------------------------------------ */
  niveis: {
    infantil:      { nome: "Infantil",      publico: "Educação Infantil", opcoes: 2 },
    intermediario: { nome: "Intermediário", publico: "Anos iniciais",     opcoes: 3 },
    adulto:        { nome: "Adulto",        publico: "Jovens e adultos",  opcoes: 4 }
  },

  /* ------------------------------------------------------------------------
     TEMAS DA ROLETA
     - "chave": nome curto usado no arquivo perguntas.js (não mude).
     - "nome": como o tema aparece na roleta e na tela.
     - "cor": cor da fatia na roleta. As cores evitam vermelho, azul, verde e
       amarelo puros, para ninguém confundir com as cores das equipes.
     ------------------------------------------------------------------------ */
  temas: [
    { chave: "enchentes",     nome: "Enchentes",             cor: "#13808a" },
    { chave: "deslizamentos", nome: "Deslizamentos",         cor: "#8b5a2b" },
    { chave: "estiagem",      nome: "Estiagem",              cor: "#c25a10" },
    { chave: "vendaval",      nome: "Vendaval e Granizo",    cor: "#56657c" },
    { chave: "mapas",         nome: "Mapas e Satélites",     cor: "#6a3d9a" },
    { chave: "mochila",       nome: "Mochila de Emergência", cor: "#bf3468" }
  ],

  /* ------------------------------------------------------------------------
     EVENTO ESPECIAL (RODADA DE ALERTA)
     - "titulo" e "subtitulo": frases grandes da tela de alerta.
     - "faixa": texto da faixa no topo durante a pergunta de alerta.
     - "regras": a regra especial de cada nível. A professora lê em voz alta
       e aplica no mapa impresso. ESTE É O ÚNICO LUGAR ONDE AS REGRAS FICAM.
     ------------------------------------------------------------------------ */
  evento: {
    titulo: "ALERTA! A ENCHENTE CHEGOU!",
    subtitulo: "Hora de agir com calma!",
    faixa: "RODADA DE ALERTA",
    regras: {
      infantil:      "Quem acertar anda 2 casas. Ninguém perde casa.",
      intermediario: "Quem acertar anda 1 casa. Quem errar volta 1 casa (nunca antes do início).",
      adulto:        "Quem acertar anda 1 casa. Quem errar volta 1 casa (nunca antes do início)."
    },

    // Regras fixas do sorteio do alerta (números de rodada):
    nuncaAntesDaRodada: 3,   // rodadas 1 e 2 nunca têm alerta
    garantidoNaRodada: 6     // se não houve alerta até aqui, esta rodada tem alerta
  },

  /* ------------------------------------------------------------------------
     EQUIPES E MATERIAL PARA IMPRIMIR (plaquinhas.html e mapa.html)
     - "nome": como a equipe aparece nas plaquinhas e na trilha do mapa.
     - "cor": cor da borda das plaquinhas e das casas da trilha.
     - "textoClaro": true se o nome fica melhor em letra branca sobre a cor.
     - "casasNaTrilha": quantas casas cada equipe tem no mapa (sem contar
       o INÍCIO). A última casa é a CHEGADA, no topo do morro.
     ------------------------------------------------------------------------ */
  equipes: [
    { nome: "Vermelha", cor: "#d62828", textoClaro: true  },
    { nome: "Azul",     cor: "#1f5fd1", textoClaro: true  },
    { nome: "Verde",    cor: "#2a9440", textoClaro: true  },
    { nome: "Amarela",  cor: "#f4c20d", textoClaro: false }
  ],
  casasNaTrilha: 10,

  /* ------------------------------------------------------------------------
     VALORES PADRÃO DAS CONFIGURAÇÕES
     A professora pode mudar estes valores na tela "Configurações".
     O que ela escolher fica salvo no navegador. O botão "Restaurar padrões"
     volta para os valores daqui.
     ------------------------------------------------------------------------ */
  padroes: {
    eventoLigado: true,
    eventoModo: "chance",     // "chance" (sorteio a cada rodada) ou "intervalo" (a cada N rodadas)
    eventoChance: 20,         // em %, usado no modo "chance"
    eventoIntervalo: 5,       // usado no modo "intervalo"
    contagemLigada: true,     // contagem "3, 2, 1, LEVANTEM!" antes de revelar
    somLigado: true
  }
};
