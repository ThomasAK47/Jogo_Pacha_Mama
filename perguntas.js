/* ==========================================================================
   PERGUNTAS.JS — BANCO DE PERGUNTAS DO JOGO
   ==========================================================================

   COMO ADICIONAR UMA PERGUNTA
   1. Copie o modelo abaixo (de "{" até "},", inclusive a vírgula).
   2. Cole dentro da lista, junto das outras perguntas.
   3. Troque os textos entre aspas.
   4. Salve o arquivo (codificação UTF-8) e recarregue o jogo (F5).
   5. Se algo estiver errado, a tela inicial do jogo mostra um aviso amarelo
      dizendo qual pergunta tem problema.

   MODELO (copie daqui):

    {
      id: "INF-ENC-99",
      nivel: "infantil",
      tema: "enchentes",
      pergunta: "Texto da pergunta?",
      opcoes: ["Primeira opção", "Segunda opção"],
      correta: "A",
      explicacao: "Por que a resposta certa é a certa, em uma ou duas frases."
    },

   O QUE É CADA CAMPO
   - id .......... um código ÚNICO para a pergunta (não pode repetir).
                   Sugestão: NÍVEL-TEMA-NÚMERO, ex.: "INT-DES-07".
   - nivel ....... "infantil", "intermediario" ou "adulto".
   - tema ........ "enchentes", "deslizamentos", "estiagem", "vendaval",
                   "mapas" ou "mochila".
   - pergunta .... o enunciado que a professora lê em voz alta.
   - opcoes ...... as opções de resposta, entre colchetes [ ], separadas
                   por vírgula. Quantidade obrigatória:
                     infantil = 2 opções (A, B)
                     intermediario = 3 opções (A, B, C)
                     adulto = 4 opções (A, B, C, D)
   - correta ..... a LETRA da opção certa: "A", "B", "C" ou "D".
                   A primeira opção da lista é a A, a segunda é a B, etc.
   - explicacao .. texto curto que aparece depois de revelar a resposta.
   - pontosMapa .. (OPCIONAL) use só quando a pergunta fala do MAPA
                   impresso. A tela mostra "OLHEM O MAPA" e os pontos.
                   Exemplo:  pontosMapa: ["1", "2", "3"],

   PONTOS DO MAPA IMPRESSO (combinação usada nas perguntas)
   - Ponto 1: beira do rio (o lugar mais baixo)
   - Ponto 2: baixada (terreno plano e baixo, perto do rio)
   - Ponto 3: topo do morro (alto e plano)
   - Ponto 4: encosta íngreme (curvas de nível bem juntas)

   CUIDADOS QUE EVITAM ERROS
   - Toda pergunta termina com "}," (chave e vírgula).
   - Textos sempre entre aspas retas "assim".
   - Se precisar de aspas DENTRO do texto, use aspas simples: 'assim'.
   - Varie a posição da resposta certa (nem sempre A, nem sempre B).
   - Textos curtos cabem melhor na tela: pergunta com até ~120 letras,
     opções com até ~50 letras, explicação com até ~160 letras.

   A ordem das perguntas no arquivo não importa: o jogo sorteia.
   ========================================================================== */

var PERGUNTAS = [

  /* ====================================================================
     NÍVEL INFANTIL — 2 opções (A ▲, B ●)
     ==================================================================== */

  { // REVISAR
    id: "INF-ENC-01",
    nivel: "infantil",
    tema: "enchentes",
    pergunta: "Choveu muito e a rua ficou cheia de água. O que a gente faz?",
    opcoes: ["Brincar na água da rua", "Ficar longe da água e chamar um adulto"],
    correta: "B",
    explicacao: "A água da enchente pode esconder buracos e ser suja. O certo é ficar longe e avisar um adulto."
  },

  { // REVISAR
    id: "INF-DES-01",
    nivel: "infantil",
    tema: "deslizamentos",
    pergunta: "Depois de muita chuva, apareceu uma rachadura no barranco. O que a gente faz?",
    opcoes: ["Avisar um adulto", "Subir para ver de perto"],
    correta: "A",
    explicacao: "Rachaduras no barranco podem ser um aviso. Um adulto sabe chamar a Defesa Civil."
  },

  { // REVISAR
    id: "INF-EST-01",
    nivel: "infantil",
    tema: "estiagem",
    pergunta: "Faz muitos dias que não chove. Como podemos cuidar da água?",
    opcoes: ["Deixar a torneira aberta", "Fechar a torneira ao escovar os dentes"],
    correta: "B",
    explicacao: "Quando chove pouco, falta água. Fechar a torneira ajuda a economizar."
  },

  { // REVISAR
    id: "INF-VEN-01",
    nivel: "infantil",
    tema: "vendaval",
    pergunta: "Começou a cair granizo, pedrinhas de gelo do céu! Onde é melhor ficar?",
    opcoes: ["Dentro de casa, longe das janelas", "No pátio, pegando as pedrinhas"],
    correta: "A",
    explicacao: "As pedrinhas de granizo podem machucar. Dentro de casa, longe das janelas, ficamos protegidos."
  },

  { // REVISAR
    id: "INF-MAP-01",
    nivel: "infantil",
    tema: "mapas",
    pergunta: "Olhem o mapa: qual ponto fica mais longe da água do rio?",
    opcoes: ["Ponto 1", "Ponto 3"],
    correta: "B",
    explicacao: "O ponto 1 fica na beira do rio. O ponto 3 fica lá no alto do morro, longe da água.",
    pontosMapa: ["1", "3"]
  },

  { // REVISAR
    id: "INF-MOC-01",
    nivel: "infantil",
    tema: "mochila",
    pergunta: "O que é importante levar na mochila de emergência?",
    opcoes: ["Lanterna", "Videogame"],
    correta: "A",
    explicacao: "A lanterna ajuda a enxergar se a luz acabar. O videogame pode ficar em casa!"
  },

  /* ====================================================================
     NÍVEL INTERMEDIÁRIO — 3 opções (A ▲, B ●, C ■)
     ==================================================================== */

  { // REVISAR
    id: "INT-ENC-01",
    nivel: "intermediario",
    tema: "enchentes",
    pergunta: "A Defesa Civil avisou que o rio vai subir. O que a família deve fazer?",
    opcoes: [
      "Esperar a água entrar em casa para decidir",
      "Ir antes para um lugar alto e seguro",
      "Ir até a beira do rio para ver a água"
    ],
    correta: "B",
    explicacao: "Sair antes da água chegar é o mais seguro. Combine com a família um lugar alto para ir."
  },

  { // REVISAR
    id: "INT-DES-01",
    nivel: "intermediario",
    tema: "deslizamentos",
    pergunta: "Qual destes é um sinal de que o morro pode deslizar?",
    opcoes: [
      "Rachaduras novas no chão e nas paredes",
      "Passarinhos cantando",
      "Grama verde no morro"
    ],
    correta: "A",
    explicacao: "Rachaduras, árvores e postes tortos e água barrenta saindo do morro são sinais de alerta. Avise um adulto."
  },

  { // REVISAR
    id: "INT-EST-01",
    nivel: "intermediario",
    tema: "estiagem",
    pergunta: "Na estiagem, o que podemos fazer para economizar água?",
    opcoes: [
      "Lavar a calçada com mangueira",
      "Deixar a torneira pingando",
      "Tomar banhos mais curtos"
    ],
    correta: "C",
    explicacao: "Banho curto economiza muita água. Na estiagem, cada gota conta para as pessoas, os animais e as plantações."
  },

  { // REVISAR
    id: "INT-VEN-01",
    nivel: "intermediario",
    tema: "vendaval",
    pergunta: "Durante um vendaval, de onde é melhor ficar longe?",
    opcoes: [
      "De um cômodo sem janelas",
      "De árvores e fios elétricos",
      "De um prédio firme"
    ],
    correta: "B",
    explicacao: "O vento forte pode derrubar galhos, árvores e fios. Fique longe deles e procure um lugar fechado."
  },

  { // REVISAR
    id: "INT-MAP-01",
    nivel: "intermediario",
    tema: "mapas",
    pergunta: "Olhem o mapa: se o rio encher, qual ponto a água alcança primeiro?",
    opcoes: ["Ponto 1", "Ponto 2", "Ponto 3"],
    correta: "A",
    explicacao: "O ponto 1 é o mais baixo e fica na beira do rio. A água ocupa primeiro os lugares mais baixos.",
    pontosMapa: ["1", "2", "3"]
  },

  { // REVISAR
    id: "INT-MOC-01",
    nivel: "intermediario",
    tema: "mochila",
    pergunta: "Qual item é o mais importante na mochila de emergência?",
    opcoes: ["Revistas", "Enfeites", "Água potável"],
    correta: "C",
    explicacao: "Água potável vem primeiro. A mochila também leva lanterna, remédios, documentos e uma muda de roupa."
  },

  /* ====================================================================
     NÍVEL ADULTO — 4 opções (A ▲, B ●, C ■, D ★)
     ==================================================================== */

  { // REVISAR
    id: "ADU-ENC-01",
    nivel: "adulto",
    tema: "enchentes",
    pergunta: "Para receber alertas da Defesa Civil por SMS, o que se envia para o número 40199?",
    opcoes: ["O CEP da sua casa", "O seu CPF", "A palavra AJUDA", "O nome da sua cidade"],
    correta: "A",
    explicacao: "Basta enviar o CEP por SMS para 40199. O serviço é gratuito e avisa sobre riscos na sua região."
  },

  { // REVISAR
    id: "ADU-DES-01",
    nivel: "adulto",
    tema: "deslizamentos",
    pergunta: "Qual atitude ajuda a prevenir deslizamentos em encostas?",
    opcoes: [
      "Retirar a vegetação da encosta",
      "Jogar lixo e entulho no morro",
      "Manter a vegetação e cuidar da drenagem",
      "Fazer cortes no barranco para construir"
    ],
    correta: "C",
    explicacao: "As raízes seguram o solo e a água bem drenada não encharca o terreno. Lixo, cortes e desmatamento aumentam o risco."
  },

  { // REVISAR
    id: "ADU-EST-01",
    nivel: "adulto",
    tema: "estiagem",
    pergunta: "Qual fenômeno climático costuma estar ligado às estiagens no Rio Grande do Sul?",
    opcoes: ["La Niña", "El Niño", "Furacão", "Maré alta"],
    correta: "A",
    explicacao: "A La Niña tende a deixar o Sul do Brasil mais seco. O El Niño costuma trazer mais chuva para o RS."
  },

  { // REVISAR
    id: "ADU-VEN-01",
    nivel: "adulto",
    tema: "vendaval",
    pergunta: "Ao receber um alerta de vendaval, o que é recomendado fazer?",
    opcoes: [
      "Abrir as janelas para o vento passar",
      "Subir no telhado para firmar as telhas",
      "Estacionar o carro embaixo de árvores",
      "Recolher objetos soltos e fechar portas e janelas"
    ],
    correta: "D",
    explicacao: "Com vento forte, objetos soltos podem voar. Fechar a casa e ficar longe de árvores e fios protege a família."
  },

  { // REVISAR
    id: "ADU-MAP-01",
    nivel: "adulto",
    tema: "mapas",
    pergunta: "Olhem o mapa: qual ponto tem mais risco de deslizamento?",
    opcoes: ["Ponto 1", "Ponto 2", "Ponto 3", "Ponto 4"],
    correta: "D",
    explicacao: "No ponto 4 as curvas de nível estão bem juntas: a encosta é íngreme. Com muita chuva, ela tem mais risco de deslizar.",
    pontosMapa: ["1", "2", "3", "4"]
  },

  { // REVISAR
    id: "ADU-MOC-01",
    nivel: "adulto",
    tema: "mochila",
    pergunta: "Para quanto tempo a mochila de emergência deve ter água e comida, segundo a recomendação mais comum?",
    opcoes: ["Algumas horas", "Cerca de 3 dias (72 horas)", "Um mês", "Não precisa ter comida"],
    correta: "B",
    explicacao: "O mais comum é recomendar itens para cerca de 72 horas: água, comida que não estraga, remédios, documentos e lanterna."
  },

];
