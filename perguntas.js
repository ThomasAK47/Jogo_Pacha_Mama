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
      tema: "inundacoes",
      pergunta: "Texto da pergunta?",
      opcoes: ["Primeira opção", "Segunda opção"],
      correta: "A",
      explicacao: "Por que a resposta certa é a certa, em uma ou duas frases."
    },

   O QUE É CADA CAMPO
   - id .......... um código ÚNICO para a pergunta (não pode repetir).
                   Sugestão: NÍVEL-TEMA-NÚMERO, ex.: "INT-DES-07".
   - nivel ....... "infantil", "intermediario" ou "adulto".
   - tema ........ "inundacoes", "deslizamentos", "estiagem", "vendaval",
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
   Cada ponto tem um desenho e mostra um perigo; só o ponto 5 é seguro.
   - Ponto 1: casa na beira do rio (o lugar mais baixo) ... inundação
   - Ponto 2: casa na encosta íngreme (curvas juntas) ..... deslizamento
   - Ponto 3: linha de alta tensão sobre árvores ......... vendaval e raios
   - Ponto 4: açude quase seco e lavoura .................. estiagem
   - Ponto 5: escola no topo do morro (alto e plano) ...... abrigo

   CUIDADOS QUE EVITAM ERROS
   - Toda pergunta termina com "}," (chave e vírgula).
   - Textos sempre entre aspas retas "assim".
   - Se precisar de aspas DENTRO do texto, use aspas simples: 'assim'.
   - Varie a posição da resposta certa (nem sempre A, nem sempre B).
   - Textos curtos cabem melhor na tela: pergunta com até ~120 letras,
     opções com até ~50 letras, explicação com até ~160 letras.

   A ordem das perguntas no arquivo não importa: o jogo sorteia.

   SOBRE O CONTEÚDO
   Todas as perguntas abaixo foram escritas como exemplo e estão marcadas
   com "// REVISAR". Depois de conferir uma pergunta, pode apagar a marca.
   ========================================================================== */

var PERGUNTAS = [

  /* ====================================================================
     NÍVEL INFANTIL — 2 opções (A ▲, B ●)
     Linguagem simples. Foco no que a criança pode fazer.
     ==================================================================== */

  /* ---------- Infantil · Inundações ---------- */

  { // REVISAR
    id: "INF-ENC-01",
    nivel: "infantil",
    tema: "inundacoes",
    pergunta: "Choveu muito e a rua ficou cheia de água. O que a gente faz?",
    opcoes: ["Brincar na água da rua", "Ficar longe da água e chamar um adulto"],
    correta: "B",
    explicacao: "A água da rua alagada pode esconder buracos e ser suja. O certo é ficar longe e avisar um adulto."
  },

  { // REVISAR
    id: "INF-ENC-02",
    nivel: "infantil",
    tema: "inundacoes",
    pergunta: "Podemos beber a água da inundação?",
    opcoes: ["Sim, é só água da chuva", "Não, ela pode estar suja"],
    correta: "B",
    explicacao: "A água da inundação se mistura com resíduos e esgoto e pode deixar a gente doente. Só bebemos água potável, a água boa para beber."
  },

  { // REVISAR
    id: "INF-ENC-03",
    nivel: "infantil",
    tema: "inundacoes",
    pergunta: "Qual é o número da Defesa Civil, que ajuda as pessoas em emergências?",
    opcoes: ["123", "199"],
    correta: "B",
    explicacao: "199 é o número da Defesa Civil, e a ligação é de graça. Peça para um adulto ligar."
  },

  { // REVISAR
    id: "INF-ENC-04",
    nivel: "infantil",
    tema: "inundacoes",
    pergunta: "Se a água começar a entrar em casa, o que as crianças fazem?",
    opcoes: ["Ficam junto dos adultos e fazem o que eles pedem", "Se escondem embaixo da cama"],
    correta: "A",
    explicacao: "Ficando junto dos adultos, todo mundo sai junto e em segurança."
  },

  { // REVISAR
    id: "INF-ENC-05",
    nivel: "infantil",
    tema: "inundacoes",
    pergunta: "Quando chove muito, onde é melhor brincar?",
    opcoes: ["Dentro de casa", "Perto do arroio"],
    correta: "A",
    explicacao: "Com chuva forte, rios e arroios enchem rápido e a água corre forte. Dentro de casa é mais seguro."
  },

  /* ---------- Infantil · Deslizamentos ---------- */

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
    id: "INF-DES-02",
    nivel: "infantil",
    tema: "deslizamentos",
    pergunta: "O que ajuda a segurar a terra do morro?",
    opcoes: ["As raízes das árvores e plantas", "Os resíduos jogados no morro"],
    correta: "A",
    explicacao: "As raízes seguram a terra como se fossem uma rede. Os resíduos juntam água e deixam a terra mais fraca."
  },

  { // REVISAR
    id: "INF-DES-03",
    nivel: "infantil",
    tema: "deslizamentos",
    pergunta: "O que é um deslizamento?",
    opcoes: ["Quando cai neve do céu", "Quando a terra do morro escorrega para baixo"],
    correta: "B",
    explicacao: "Com muita chuva, a terra do morro fica mole e pesada e pode escorregar. Isso é um deslizamento."
  },

  { // REVISAR
    id: "INF-DES-04",
    nivel: "infantil",
    tema: "deslizamentos",
    pergunta: "Olhem o mapa: qual casa fica no morro bem empinado, onde a terra pode escorregar?",
    opcoes: ["Casa do ponto 1", "Casa do ponto 2"],
    correta: "B",
    explicacao: "A casa do ponto 2 fica num morro bem empinado. Com muita chuva, a terra ali pode escorregar.",
    pontosMapa: ["1", "2"]
  },

  { // REVISAR
    id: "INF-DES-05",
    nivel: "infantil",
    tema: "deslizamentos",
    pergunta: "Depois de uma chuva muito forte, podemos brincar no barranco?",
    opcoes: ["Não, a terra pode estar mole", "Sim, é o melhor dia para escorregar"],
    correta: "A",
    explicacao: "A chuva deixa a terra mole e pesada. É melhor brincar longe dos barrancos."
  },

  /* ---------- Infantil · Estiagem ---------- */

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
    id: "INF-EST-02",
    nivel: "infantil",
    tema: "estiagem",
    pergunta: "O que é estiagem?",
    opcoes: ["Muitos dias sem chuva", "Muitos dias de neve"],
    correta: "A",
    explicacao: "Estiagem é quando passa muito tempo sem chover. Os rios e açudes baixam e pode faltar água."
  },

  { // REVISAR
    id: "INF-EST-03",
    nivel: "infantil",
    tema: "estiagem",
    pergunta: "Como podemos guardar água da chuva para usar depois?",
    opcoes: ["Num balde ou cisterna com tampa", "Deixando escorrer pela rua"],
    correta: "A",
    explicacao: "A água da chuva guardada serve para regar plantas e limpar o chão. A tampa evita o mosquito da dengue!"
  },

  { // REVISAR
    id: "INF-EST-04",
    nivel: "infantil",
    tema: "estiagem",
    pergunta: "Qual banho gasta menos água?",
    opcoes: ["Banho bem demorado", "Banho rápido"],
    correta: "B",
    explicacao: "Banho rápido gasta menos água. Cada minuto a menos ajuda!"
  },

  { // REVISAR
    id: "INF-EST-05",
    nivel: "infantil",
    tema: "estiagem",
    pergunta: "Sobrou água na garrafinha. Para onde ela pode ir?",
    opcoes: ["Para regar uma planta", "Para o ralo, sem uso"],
    correta: "A",
    explicacao: "Dar a água que sobrou para uma planta é um jeito simples de não desperdiçar."
  },

  { // REVISAR
    id: "INF-EST-06",
    nivel: "infantil",
    tema: "estiagem",
    pergunta: "Olhem o mapa: o açude do ponto 4 está quase sem água. Por quê?",
    opcoes: ["Faz muitos dias que não chove", "Choveu demais"],
    correta: "A",
    explicacao: "Quando passa muito tempo sem chover, o açude seca e as plantinhas da lavoura ficam com sede.",
    pontosMapa: ["4"]
  },

  /* ---------- Infantil · Vendaval e Granizo ---------- */

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
    id: "INF-VEN-02",
    nivel: "infantil",
    tema: "vendaval",
    pergunta: "Está ventando muito forte. Onde é melhor ficar?",
    opcoes: ["Embaixo de uma árvore", "Dentro de casa"],
    correta: "B",
    explicacao: "Com vento muito forte, galhos podem cair. Dentro de casa estamos protegidos."
  },

  { // REVISAR
    id: "INF-VEN-03",
    nivel: "infantil",
    tema: "vendaval",
    pergunta: "Depois da tempestade, tem um fio de luz caído no chão. O que fazer?",
    opcoes: ["Ficar longe e avisar um adulto", "Pegar o fio para tirar do caminho"],
    correta: "A",
    explicacao: "Fio caído pode dar choque. Nunca toque! Fique longe e avise um adulto."
  },

  { // REVISAR
    id: "INF-VEN-04",
    nivel: "infantil",
    tema: "vendaval",
    pergunta: "Começou uma tempestade com raios. Onde é seguro ficar?",
    opcoes: ["Na piscina", "Dentro de casa"],
    correta: "B",
    explicacao: "Durante os raios, o lugar seguro é dentro de casa. Piscina, campo aberto e árvores são perigosos."
  },

  { // REVISAR
    id: "INF-VEN-05",
    nivel: "infantil",
    tema: "vendaval",
    pergunta: "O que é granizo?",
    opcoes: ["Pedrinhas de gelo que caem do céu", "Balas doces que caem das nuvens"],
    correta: "A",
    explicacao: "Granizo são pedrinhas de gelo que se formam dentro de nuvens de tempestade. No Rio Grande do Sul, ele é comum."
  },

  { // REVISAR
    id: "INF-VEN-06",
    nivel: "infantil",
    tema: "vendaval",
    pergunta: "Olhem o mapa: começou uma tempestade com raios. Onde é melhor ficar?",
    opcoes: ["Embaixo das árvores do ponto 3", "Dentro da escola do ponto 5"],
    correta: "B",
    explicacao: "Árvores e fios de alta tensão atraem raios, e galhos podem cair com o vento. Dentro de casa ou da escola estamos protegidos.",
    pontosMapa: ["3", "5"]
  },

  /* ---------- Infantil · Mapas e Satélites ---------- */

  { // REVISAR
    id: "INF-MAP-01",
    nivel: "infantil",
    tema: "mapas",
    pergunta: "Olhem o mapa: se o rio encher, qual lugar pode ficar com água dentro?",
    opcoes: ["A casa do ponto 1", "A escola do ponto 5"],
    correta: "A",
    explicacao: "A casa do ponto 1 fica bem pertinho do rio. Quando o rio enche, a água chega primeiro ali.",
    pontosMapa: ["1", "5"]
  },

  { // REVISAR
    id: "INF-MAP-02",
    nivel: "infantil",
    tema: "mapas",
    pergunta: "Olhem o mapa: o rio está enchendo. Para onde a família do ponto 1 deve ir?",
    opcoes: ["Ficar em casa, perto do rio", "Ir para a escola lá no alto"],
    correta: "B",
    explicacao: "A escola do ponto 5 fica lá no alto, longe do rio. É para lá que a família vai quando o rio enche.",
    pontosMapa: ["1", "5"]
  },

  { // REVISAR
    id: "INF-MAP-03",
    nivel: "infantil",
    tema: "mapas",
    pergunta: "O que é um mapa?",
    opcoes: ["Um desenho de um lugar visto de cima", "Uma foto de uma pessoa"],
    correta: "A",
    explicacao: "O mapa mostra um lugar como se a gente estivesse voando lá no alto, igual a um passarinho."
  },

  { // REVISAR
    id: "INF-MAP-04",
    nivel: "infantil",
    tema: "mapas",
    pergunta: "O satélite tira fotos da Terra de onde?",
    opcoes: ["Do fundo do mar", "Lá do espaço, bem alto"],
    correta: "B",
    explicacao: "Os satélites ficam no espaço, girando em volta da Terra. Lá de cima, eles fotografam as nuvens."
  },

  { // REVISAR
    id: "INF-MAP-05",
    nivel: "infantil",
    tema: "mapas",
    pergunta: "Para que servem as fotos das nuvens tiradas pelos satélites?",
    opcoes: ["Para saber se vai chover forte", "Para escolher a cor do céu"],
    correta: "A",
    explicacao: "Vendo as nuvens lá de cima, os cientistas avisam quando vem chuva forte. Assim as pessoas se preparam."
  },

  /* ---------- Infantil · Mochila de Emergência ---------- */

  { // REVISAR
    id: "INF-MOC-01",
    nivel: "infantil",
    tema: "mochila",
    pergunta: "O que é importante levar na mochila de emergência?",
    opcoes: ["Lanterna", "Videogame"],
    correta: "A",
    explicacao: "A lanterna ajuda a enxergar se a luz acabar. O videogame pode ficar em casa!"
  },

  { // REVISAR
    id: "INF-MOC-02",
    nivel: "infantil",
    tema: "mochila",
    pergunta: "Qual destes vai na mochila de emergência?",
    opcoes: ["Bola de futebol", "Garrafa de água"],
    correta: "B",
    explicacao: "Água limpa para beber é uma das coisas mais importantes da mochila."
  },

  { // REVISAR
    id: "INF-MOC-03",
    nivel: "infantil",
    tema: "mochila",
    pergunta: "Quem ajuda a montar a mochila de emergência da família?",
    opcoes: ["Toda a família, junta", "Ninguém, ela aparece pronta"],
    correta: "A",
    explicacao: "Montar a mochila é tarefa de todos! As crianças podem ajudar a lembrar da água e da lanterna."
  },

  { // REVISAR
    id: "INF-MOC-04",
    nivel: "infantil",
    tema: "mochila",
    pergunta: "E o bichinho de estimação? O que levar para ele?",
    opcoes: ["Nada", "Ração, água e a coleira"],
    correta: "B",
    explicacao: "Os animais também fazem parte da família. Eles precisam de ração, água e coleira."
  },

  { // REVISAR
    id: "INF-MOC-05",
    nivel: "infantil",
    tema: "mochila",
    pergunta: "Os documentos da família vão na mochila guardados em quê?",
    opcoes: ["Num saquinho plástico fechado", "Numa folha de jornal"],
    correta: "A",
    explicacao: "O saquinho plástico fechado protege os documentos da água."
  },

  /* ====================================================================
     NÍVEL INTERMEDIÁRIO — 3 opções (A ▲, B ●, C ■)
     ==================================================================== */

  /* ---------- Intermediário · Inundações ---------- */

  { // REVISAR
    id: "INT-ENC-01",
    nivel: "intermediario",
    tema: "inundacoes",
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
    id: "INT-ENC-02",
    nivel: "intermediario",
    tema: "inundacoes",
    pergunta: "Por que não se deve atravessar uma rua alagada a pé?",
    opcoes: [
      "A água pode esconder buracos e ter correnteza",
      "A água é sempre gelada",
      "Molha o tênis"
    ],
    correta: "A",
    explicacao: "Mesmo água baixa, se estiver correndo, pode derrubar uma pessoa. E ela esconde buracos e bueiros abertos."
  },

  { // REVISAR
    id: "INT-ENC-03",
    nivel: "intermediario",
    tema: "inundacoes",
    pergunta: "Qual é o número de telefone da Defesa Civil?",
    opcoes: ["190", "193", "199"],
    correta: "C",
    explicacao: "199 é a Defesa Civil. 193 são os Bombeiros e 190 é a Polícia. As ligações são gratuitas."
  },

  { // REVISAR
    id: "INT-ENC-04",
    nivel: "intermediario",
    tema: "inundacoes",
    pergunta: "Por que a água da inundação pode deixar a gente doente?",
    opcoes: [
      "Porque ela vem do mar",
      "Porque se mistura com esgoto e resíduos",
      "Porque é muito fria"
    ],
    correta: "B",
    explicacao: "A água da inundação carrega esgoto, resíduos e até urina de ratos, que causa a leptospirose. Evite contato com ela."
  },

  { // REVISAR
    id: "INT-ENC-05",
    nivel: "intermediario",
    tema: "inundacoes",
    pergunta: "Antes de a água entrar em casa, os adultos devem desligar o quê?",
    opcoes: ["A chave geral de energia", "O despertador", "A campainha"],
    correta: "A",
    explicacao: "Água e eletricidade juntas dão choque. Desligar a energia geral antes de sair deixa a casa mais segura."
  },

  /* ---------- Intermediário · Deslizamentos ---------- */

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
    id: "INT-DES-02",
    nivel: "intermediario",
    tema: "deslizamentos",
    pergunta: "O que ajuda a prevenir deslizamentos num morro?",
    opcoes: ["Cortar as árvores", "Plantar árvores e plantas", "Jogar resíduos de obra no barranco"],
    correta: "B",
    explicacao: "As raízes seguram o solo, e as plantas fazem a água da chuva escorrer mais devagar."
  },

  { // REVISAR
    id: "INT-DES-03",
    nivel: "intermediario",
    tema: "deslizamentos",
    pergunta: "Olhem o mapa: qual lugar tem mais risco de a terra deslizar?",
    opcoes: ["Ponto 1", "Ponto 2", "Ponto 4"],
    correta: "B",
    explicacao: "A casa do ponto 2 fica na encosta íngreme: as curvas de nível ali estão bem juntinhas. Com muita chuva, a terra pode deslizar.",
    pontosMapa: ["1", "2", "4"]
  },

  { // REVISAR
    id: "INT-DES-04",
    nivel: "intermediario",
    tema: "deslizamentos",
    pergunta: "Numa casa no morro, para onde deve ir a água da chuva do telhado?",
    opcoes: [
      "Para calhas e canos que levam a água embora",
      "Direto para o barranco",
      "Para dentro de casa"
    ],
    correta: "A",
    explicacao: "Água escorrendo sem controle encharca e enfraquece o barranco. Calhas e canos levam a água para o lugar certo."
  },

  { // REVISAR
    id: "INT-DES-05",
    nivel: "intermediario",
    tema: "deslizamentos",
    pergunta: "Numa casa no morro, portas e janelas começaram a emperrar. Isso pode indicar o quê?",
    opcoes: [
      "Que a casa precisa de pintura",
      "Que o terreno pode estar se mexendo",
      "Que está muito calor"
    ],
    correta: "B",
    explicacao: "Quando o terreno se movimenta, a casa entorta e as portas emperram. Avise um adulto e a Defesa Civil (199)."
  },

  /* ---------- Intermediário · Estiagem ---------- */

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
    id: "INT-EST-02",
    nivel: "intermediario",
    tema: "estiagem",
    pergunta: "O que é uma estiagem?",
    opcoes: [
      "Um período longo com pouca ou nenhuma chuva",
      "Uma chuva muito forte",
      "Um vento muito forte"
    ],
    correta: "A",
    explicacao: "Na estiagem, passa muito tempo com pouca chuva. Rios, açudes e poços baixam e pode faltar água."
  },

  { // REVISAR
    id: "INT-EST-03",
    nivel: "intermediario",
    tema: "estiagem",
    pergunta: "Na estiagem, o que acontece com as plantações de soja e milho do Rio Grande do Sul?",
    opcoes: ["Crescem mais rápido", "Secam e produzem menos", "Viram flores"],
    correta: "B",
    explicacao: "Sem chuva, as plantas não crescem direito. Nas estiagens de 2020 a 2022, muitos agricultores gaúchos perderam parte da colheita."
  },

  { // REVISAR
    id: "INT-EST-04",
    nivel: "intermediario",
    tema: "estiagem",
    pergunta: "Qual destas é uma boa forma de reaproveitar água?",
    opcoes: [
      "Usar a água da máquina de lavar para limpar o quintal",
      "Deixar a mangueira ligada",
      "Jogar fora a água da chuva"
    ],
    correta: "A",
    explicacao: "A água que sai da máquina de lavar ainda serve para lavar o quintal ou a calçada, sem gastar água potável."
  },

  { // REVISAR
    id: "INT-EST-05",
    nivel: "intermediario",
    tema: "estiagem",
    pergunta: "Na estiagem, o ar seco e o mato seco aumentam o risco de quê?",
    opcoes: ["Neve", "Granizo", "Incêndios florestais"],
    correta: "C",
    explicacao: "Com tudo seco, o fogo se espalha fácil. Nunca brinque com fogo e não queime resíduos."
  },

  { // REVISAR
    id: "INT-EST-06",
    nivel: "intermediario",
    tema: "estiagem",
    pergunta: "Olhem o mapa: o açude do ponto 4 está quase seco e a lavoura está murcha. Que desastre é esse?",
    opcoes: ["Inundação", "Granizo", "Estiagem"],
    correta: "C",
    explicacao: "Na estiagem passa muito tempo sem chuva. Açudes e rios baixam e as plantações secam.",
    pontosMapa: ["4"]
  },

  /* ---------- Intermediário · Vendaval e Granizo ---------- */

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
    id: "INT-VEN-02",
    nivel: "intermediario",
    tema: "vendaval",
    pergunta: "Durante uma tempestade com raios, o que é mais seguro?",
    opcoes: ["Ficar dentro de casa, longe das janelas", "Empinar pipa", "Nadar no açude"],
    correta: "A",
    explicacao: "Dentro de casa estamos protegidos dos raios. Pipas, água e campos abertos são perigosos durante a tempestade."
  },

  { // REVISAR
    id: "INT-VEN-03",
    nivel: "intermediario",
    tema: "vendaval",
    pergunta: "Você viu um raio e contou 3 segundos até ouvir o trovão. O raio caiu a mais ou menos quanto?",
    opcoes: ["1 quilômetro", "100 quilômetros", "1 metro"],
    correta: "A",
    explicacao: "O som anda cerca de 1 km a cada 3 segundos. Se o trovão chega rápido, a tempestade está perto: fique abrigado!"
  },

  { // REVISAR
    id: "INT-VEN-04",
    nivel: "intermediario",
    tema: "vendaval",
    pergunta: "O que é granizo?",
    opcoes: [
      "Chuva com areia",
      "Pedras de gelo que caem das nuvens de tempestade",
      "Neblina bem fria"
    ],
    correta: "B",
    explicacao: "O granizo se forma dentro de nuvens de tempestade muito altas e frias. O Sul do Brasil é uma das regiões onde mais cai granizo."
  },

  { // REVISAR
    id: "INT-VEN-05",
    nivel: "intermediario",
    tema: "vendaval",
    pergunta: "O que é um ciclone extratropical, comum no Rio Grande do Sul?",
    opcoes: ["Um terremoto", "Um tipo de vulcão", "Um sistema que gira e traz vento forte e chuva"],
    correta: "C",
    explicacao: "Os ciclones extratropicais giram e trazem vento forte e muita chuva ao Sul do Brasil, mais no outono e no inverno."
  },

  { // REVISAR
    id: "INT-VEN-06",
    nivel: "intermediario",
    tema: "vendaval",
    pergunta: "Olhem o mapa: no ponto 3, a linha de alta tensão passa sobre árvores. Por que ali é perigoso num vendaval?",
    opcoes: ["Galhos e fios podem cair", "As árvores fazem sombra", "A torre faz barulho"],
    correta: "A",
    explicacao: "O vento forte pode quebrar galhos e derrubar fios elétricos. Árvores sozinhas também atraem raios.",
    pontosMapa: ["3"]
  },

  /* ---------- Intermediário · Mapas e Satélites ---------- */

  { // REVISAR
    id: "INT-MAP-01",
    nivel: "intermediario",
    tema: "mapas",
    pergunta: "Olhem o mapa: se o rio encher, qual lugar a água alcança primeiro?",
    opcoes: ["Ponto 1", "Ponto 4", "Ponto 5"],
    correta: "A",
    explicacao: "A casa do ponto 1 fica na beira do rio, no lugar mais baixo. A água ocupa primeiro os lugares mais baixos.",
    pontosMapa: ["1", "4", "5"]
  },

  { // REVISAR
    id: "INT-MAP-02",
    nivel: "intermediario",
    tema: "mapas",
    pergunta: "Olhem o mapa: a Defesa Civil avisou que o rio vai subir. Para onde vai a família do ponto 1?",
    opcoes: ["Ponto 2", "Ponto 3", "Ponto 5"],
    correta: "C",
    explicacao: "A escola do ponto 5 fica no alto, em terreno plano e longe do rio. O ponto 2 fica na encosta íngreme e o 3 embaixo da linha de alta tensão.",
    pontosMapa: ["2", "3", "5"]
  },

  { // REVISAR
    id: "INT-MAP-03",
    nivel: "intermediario",
    tema: "mapas",
    pergunta: "Num mapa, o que as curvas de nível mostram?",
    opcoes: ["O caminho do ônibus", "Onde mora cada pessoa", "A altura do terreno"],
    correta: "C",
    explicacao: "Cada curva de nível liga pontos da mesma altura. Curvas juntinhas mostram um morro bem inclinado."
  },

  { // REVISAR
    id: "INT-MAP-04",
    nivel: "intermediario",
    tema: "mapas",
    pergunta: "Para que servem os satélites meteorológicos?",
    opcoes: [
      "Para levar cartas",
      "Para observar as nuvens e ajudar a prever o tempo",
      "Para iluminar a noite"
    ],
    correta: "B",
    explicacao: "Os satélites meteorológicos ficam no espaço e fotografam as nuvens o tempo todo. Assim dá para prever chuvas fortes."
  },

  { // REVISAR
    id: "INT-MAP-05",
    nivel: "intermediario",
    tema: "mapas",
    pergunta: "Num mapa, a cor azul geralmente representa o quê?",
    opcoes: ["Florestas", "Rios, lagos e mar", "Estradas"],
    correta: "B",
    explicacao: "Nos mapas, o azul costuma mostrar a água: rios, lagos e o mar. O verde costuma mostrar a vegetação."
  },

  /* ---------- Intermediário · Mochila de Emergência ---------- */

  { // REVISAR
    id: "INT-MOC-01",
    nivel: "intermediario",
    tema: "mochila",
    pergunta: "Qual item é o mais importante na mochila de emergência?",
    opcoes: ["Revistas", "Enfeites", "Água potável"],
    correta: "C",
    explicacao: "Água potável vem primeiro. A mochila também leva lanterna, remédios, documentos e uma muda de roupa."
  },

  { // REVISAR
    id: "INT-MOC-02",
    nivel: "intermediario",
    tema: "mochila",
    pergunta: "Por que é bom ter um rádio a pilha na mochila de emergência?",
    opcoes: [
      "Para ouvir avisos mesmo sem luz e sem internet",
      "Para ouvir música bem alto",
      "Para enfeitar a mochila"
    ],
    correta: "A",
    explicacao: "Se faltar luz e internet, o rádio a pilha continua trazendo os avisos da Defesa Civil."
  },

  { // REVISAR
    id: "INT-MOC-03",
    nivel: "intermediario",
    tema: "mochila",
    pergunta: "Como guardar os documentos na mochila de emergência?",
    opcoes: ["Soltos no bolso", "Num saco plástico bem fechado", "Dentro de um copo"],
    correta: "B",
    explicacao: "No saco plástico fechado, os documentos ficam protegidos da água e não se perdem."
  },

  { // REVISAR
    id: "INT-MOC-04",
    nivel: "intermediario",
    tema: "mochila",
    pergunta: "O que é o ponto de encontro da família?",
    opcoes: [
      "Um lugar seguro combinado para todos se encontrarem",
      "Uma loja de brinquedos",
      "A casa de um vizinho que viajou"
    ],
    correta: "A",
    explicacao: "Se a família se separar numa emergência, todos sabem para onde ir. Combine o ponto de encontro antes!"
  },

  { // REVISAR
    id: "INT-MOC-05",
    nivel: "intermediario",
    tema: "mochila",
    pergunta: "Por que anotar telefones importantes num papel e guardar na mochila?",
    opcoes: [
      "Porque o papel é bonito",
      "Porque o celular pode ficar sem bateria",
      "Porque é proibido usar celular"
    ],
    correta: "B",
    explicacao: "Sem bateria, não dá para ver os contatos do celular. No papel, os números estão sempre à mão."
  },

  /* ====================================================================
     NÍVEL ADULTO — 4 opções (A ▲, B ●, C ■, D ★)
     ==================================================================== */

  /* ---------- Adulto · Inundações ---------- */

  { // REVISAR
    id: "ADU-ENC-01",
    nivel: "adulto",
    tema: "inundacoes",
    pergunta: "Para receber alertas da Defesa Civil por SMS, o que se envia para o número 40199?",
    opcoes: ["O CEP da sua casa", "O seu CPF", "A palavra AJUDA", "O nome da sua cidade"],
    correta: "A",
    explicacao: "Basta enviar o CEP por SMS para 40199. O serviço é gratuito e avisa sobre riscos na sua região."
  },

  { // REVISAR
    id: "ADU-ENC-02",
    nivel: "adulto",
    tema: "inundacoes",
    pergunta: "Dirigindo, você encontra uma rua alagada. Qual é a atitude correta?",
    opcoes: [
      "Acelerar para passar rápido",
      "Seguir o carro da frente",
      "Não atravessar e procurar outro caminho",
      "Passar devagar se a água parecer rasa"
    ],
    correta: "C",
    explicacao: "Pouca água em movimento já pode arrastar um carro, e a profundidade engana. Na dúvida, não atravesse."
  },

  { // REVISAR
    id: "ADU-ENC-03",
    nivel: "adulto",
    tema: "inundacoes",
    pergunta: "Ao voltar para casa depois de uma inundação, o que fazer antes de religar a energia?",
    opcoes: [
      "Ligar todos os aparelhos para testar",
      "Pedir a um eletricista que verifique a instalação",
      "Religar o disjuntor com as mãos molhadas",
      "Nada, pode religar direto"
    ],
    correta: "B",
    explicacao: "Fios e tomadas molhados podem causar choque e curto-circuito. Só religue depois que um eletricista verificar."
  },

  { // REVISAR
    id: "ADU-ENC-04",
    nivel: "adulto",
    tema: "inundacoes",
    pergunta: "Qual doença, transmitida pela urina de ratos, é comum depois de inundações?",
    opcoes: ["Leptospirose", "Dengue", "Sarampo", "Catapora"],
    correta: "A",
    explicacao: "A leptospirose pega pelo contato com água ou lama contaminadas. Use botas e luvas na limpeza e procure atendimento se tiver febre."
  },

  { // REVISAR
    id: "ADU-ENC-05",
    nivel: "adulto",
    tema: "inundacoes",
    pergunta: "Os rios Jacuí, Taquari, Caí e dos Sinos fazem parte de qual região hidrográfica do RS?",
    opcoes: ["Região do Uruguai", "Região Litorânea", "Região do Guaíba", "Região Amazônica"],
    correta: "C",
    explicacao: "As águas desses rios chegam ao Guaíba. O Vacacaí, aqui da região de Santa Maria, também faz parte dela: ele deságua no Jacuí."
  },

  /* ---------- Adulto · Deslizamentos ---------- */

  { // REVISAR
    id: "ADU-DES-01",
    nivel: "adulto",
    tema: "deslizamentos",
    pergunta: "Qual atitude ajuda a prevenir deslizamentos em encostas?",
    opcoes: [
      "Retirar a vegetação da encosta",
      "Jogar resíduos e restos de obra no morro",
      "Manter a vegetação e cuidar da drenagem",
      "Fazer cortes no barranco para construir"
    ],
    correta: "C",
    explicacao: "As raízes seguram o solo e a água bem drenada não encharca o terreno. Resíduos, cortes e desmatamento aumentam o risco."
  },

  { // REVISAR
    id: "ADU-DES-02",
    nivel: "adulto",
    tema: "deslizamentos",
    pergunta: "Qual destes NÃO é um sinal de alerta de deslizamento?",
    opcoes: [
      "Rachaduras em paredes e no chão",
      "Árvores, postes ou muros inclinados",
      "Água barrenta minando do barranco",
      "Céu azul depois de vários dias secos"
    ],
    correta: "D",
    explicacao: "Rachaduras, inclinações e água barrenta saindo do solo indicam que o terreno se move. Saia do local e ligue 199."
  },

  { // REVISAR
    id: "ADU-DES-03",
    nivel: "adulto",
    tema: "deslizamentos",
    pergunta: "Em encostas, o que costuma aumentar o risco de deslizamento?",
    opcoes: [
      "Cortes e aterros feitos sem orientação técnica",
      "Calhas e canaletas",
      "Muros de contenção bem feitos",
      "Plantas de raízes profundas"
    ],
    correta: "A",
    explicacao: "Cortes e aterros mal feitos deixam o terreno instável. Antes de construir em encosta, procure orientação técnica."
  },

  { // REVISAR
    id: "ADU-DES-04",
    nivel: "adulto",
    tema: "deslizamentos",
    pergunta: "Que tipo de chuva é mais perigoso para deslizamentos?",
    opcoes: [
      "Garoa de poucos minutos",
      "Chuva forte ou prolongada que encharca o solo",
      "Granizo miúdo",
      "Sereno da madrugada"
    ],
    correta: "B",
    explicacao: "O solo encharcado fica pesado e perde firmeza. O risco aumenta depois de vários dias de chuva ou de temporais fortes."
  },

  { // REVISAR
    id: "ADU-DES-05",
    nivel: "adulto",
    tema: "deslizamentos",
    pergunta: "Que órgão federal monitora áreas de risco e envia alertas de desastres naturais no Brasil?",
    opcoes: ["IBGE", "INSS", "CEMADEN", "ANATEL"],
    correta: "C",
    explicacao: "O CEMADEN (Centro Nacional de Monitoramento e Alertas de Desastres Naturais) acompanha chuva e risco e alerta a Defesa Civil."
  },

  /* ---------- Adulto · Estiagem ---------- */

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
    id: "ADU-EST-02",
    nivel: "adulto",
    tema: "estiagem",
    pergunta: "O que é uma cisterna?",
    opcoes: [
      "Um filtro de ar",
      "Um reservatório que armazena água da chuva",
      "Uma bomba de irrigação a diesel",
      "Um tipo de poço de petróleo"
    ],
    correta: "B",
    explicacao: "A água da cisterna serve para limpeza, descarga e irrigação, poupando água tratada. Mantenha tampada contra o mosquito da dengue."
  },

  { // REVISAR
    id: "ADU-EST-03",
    nivel: "adulto",
    tema: "estiagem",
    pergunta: "Qual setor da economia gaúcha costuma ser o mais atingido pelas estiagens?",
    opcoes: ["Turismo de praia", "Indústria de software", "Mineração de ouro", "Agropecuária"],
    correta: "D",
    explicacao: "Lavouras como soja e milho e a criação de gado dependem da chuva. Estiagens recentes causaram grandes perdas no campo gaúcho."
  },

  { // REVISAR
    id: "ADU-EST-04",
    nivel: "adulto",
    tema: "estiagem",
    pergunta: "Qual atitude economiza mais água em casa?",
    opcoes: [
      "Lavar a calçada com mangueira",
      "Consertar vazamentos e torneiras pingando",
      "Descongelar alimentos em água corrente",
      "Deixar a torneira aberta ao lavar a louça"
    ],
    correta: "B",
    explicacao: "Uma torneira pingando pode desperdiçar dezenas de litros por dia. Consertar vazamentos é uma das medidas mais eficazes."
  },

  { // REVISAR
    id: "ADU-EST-05",
    nivel: "adulto",
    tema: "estiagem",
    pergunta: "Durante a estiagem, por que o risco de incêndios aumenta?",
    opcoes: [
      "Porque a vegetação e o ar ficam secos",
      "Porque chove mais",
      "Porque a temperatura cai",
      "Porque os rios enchem"
    ],
    correta: "A",
    explicacao: "Mato seco e baixa umidade fazem o fogo se espalhar rápido. Não queime resíduos nem jogue bitucas de cigarro na beira da estrada."
  },

  { // REVISAR
    id: "ADU-EST-06",
    nivel: "adulto",
    tema: "estiagem",
    pergunta: "Olhem o mapa: o açude do ponto 4 baixou muito. Qual medida ajuda a enfrentar a próxima estiagem?",
    opcoes: ["Lavar o pátio com mangueira", "Desmatar a beira do açude", "Irrigar nas horas mais quentes", "Guardar água da chuva em cisterna"],
    correta: "D",
    explicacao: "A cisterna guarda a água da chuva para os meses secos. Mata na beira do açude protege a água; irrigar no calor perde água.",
    pontosMapa: ["4"]
  },

  /* ---------- Adulto · Vendaval e Granizo ---------- */

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
    id: "ADU-VEN-02",
    nivel: "adulto",
    tema: "vendaval",
    pergunta: "Durante uma tempestade com raios, qual destes lugares é o mais seguro?",
    opcoes: [
      "Dentro de casa ou de um carro fechado",
      "Embaixo de uma árvore isolada",
      "Em campo aberto",
      "Na beira de um lago"
    ],
    correta: "A",
    explicacao: "Casas e carros fechados protegem contra raios. Árvores isoladas, campos abertos e a beira da água são os lugares mais perigosos."
  },

  { // REVISAR
    id: "ADU-VEN-03",
    nivel: "adulto",
    tema: "vendaval",
    pergunta: "Você contou 9 segundos entre o clarão do raio e o trovão. A que distância, mais ou menos, ele caiu?",
    opcoes: ["300 metros", "3 quilômetros", "30 quilômetros", "9 quilômetros"],
    correta: "B",
    explicacao: "O som percorre cerca de 1 km a cada 3 segundos. Nove segundos são uns 3 km: a tempestade está perto. Procure abrigo."
  },

  { // REVISAR
    id: "ADU-VEN-04",
    nivel: "adulto",
    tema: "vendaval",
    pergunta: "Qual sistema, comum no Sul do Brasil, traz ventos fortes e chuva ao se formar perto do litoral?",
    opcoes: ["Monção", "Tufão", "Ciclone extratropical", "Tsunami"],
    correta: "C",
    explicacao: "Ciclones extratropicais são frequentes no Sul do Brasil e trazem vendaval, ressaca no mar e muita chuva. Acompanhe os alertas."
  },

  { // REVISAR
    id: "ADU-VEN-05",
    nivel: "adulto",
    tema: "vendaval",
    pergunta: "Depois de um vendaval, há um fio da rede elétrica caído na calçada. O que fazer?",
    opcoes: [
      "Afastar o fio com um galho seco",
      "Pular por cima com cuidado",
      "Tocar rapidamente para ver se tem energia",
      "Manter distância e avisar a companhia de energia"
    ],
    correta: "D",
    explicacao: "O fio pode estar energizado mesmo parado. Mantenha todos longe e avise a companhia de energia ou a Defesa Civil (199)."
  },

  { // REVISAR
    id: "ADU-VEN-06",
    nivel: "adulto",
    tema: "vendaval",
    pergunta: "Olhem o mapa: uma pessoa está no campo, perto do ponto 3, e começa um temporal com raios. O que fazer?",
    opcoes: ["Abrigar-se embaixo da árvore", "Afastar-se e buscar abrigo fechado", "Encostar na torre de energia", "Deitar no chão molhado"],
    correta: "B",
    explicacao: "Árvores e torres de energia atraem raios, e galhos e fios podem cair com o vento. O mais seguro é uma construção ou carro fechado.",
    pontosMapa: ["3"]
  },

  /* ---------- Adulto · Mapas e Satélites ---------- */

  { // REVISAR
    id: "ADU-MAP-01",
    nivel: "adulto",
    tema: "mapas",
    pergunta: "Olhem o mapa: qual ponto tem mais risco de deslizamento?",
    opcoes: ["Ponto 1", "Ponto 2", "Ponto 3", "Ponto 5"],
    correta: "B",
    explicacao: "A casa do ponto 2 fica na encosta íngreme, onde as curvas de nível estão bem juntas. Com muita chuva, ela tem mais risco de deslizar.",
    pontosMapa: ["1", "2", "3", "5"]
  },

  { // REVISAR
    id: "ADU-MAP-02",
    nivel: "adulto",
    tema: "mapas",
    pergunta: "Olhem o mapa: os pontos 2 e 5 ficam no morro. Por que só o 5 serve de abrigo numa inundação?",
    opcoes: ["O 5 fica mais perto do rio", "Os dois servem igualmente", "O 5 é alto e plano; o 2 fica na encosta", "O 2 fica numa área de estiagem"],
    correta: "C",
    explicacao: "O abrigo precisa estar longe da área que inunda e fora de área de deslizamento. O ponto 5 é o topo plano; o 2 fica na encosta íngreme.",
    pontosMapa: ["2", "5"]
  },

  { // REVISAR
    id: "ADU-MAP-03",
    nivel: "adulto",
    tema: "mapas",
    pergunta: "Olhem o mapa: o que as curvas de nível muito próximas, perto do ponto 2, indicam?",
    opcoes: ["Terreno plano", "Terreno muito inclinado", "Um rio", "Uma estrada"],
    correta: "B",
    explicacao: "Quanto mais juntas as curvas de nível, mais a altura muda em pouco espaço: o terreno é íngreme e tem mais risco de deslizar.",
    pontosMapa: ["2"]
  },

  { // REVISAR
    id: "ADU-MAP-04",
    nivel: "adulto",
    tema: "mapas",
    pergunta: "O que cada curva de nível representa num mapa topográfico?",
    opcoes: ["Limites entre municípios", "Rotas de ônibus", "Pontos com a mesma altitude", "Linhas de energia"],
    correta: "C",
    explicacao: "Cada curva liga pontos de mesma altitude. Lendo as curvas, dá para ver morros, vales e áreas planas."
  },

  { // REVISAR
    id: "ADU-MAP-05",
    nivel: "adulto",
    tema: "mapas",
    pergunta: "Qual instituto brasileiro usa imagens de satélite para monitorar queimadas e desmatamento?",
    opcoes: ["INPE", "IBGE", "INMET", "IBAMA"],
    correta: "A",
    explicacao: "O INPE (Instituto Nacional de Pesquisas Espaciais) acompanha queimadas, desmatamento e o tempo com imagens de satélite."
  },

  /* ---------- Adulto · Mochila de Emergência ---------- */

  { // REVISAR
    id: "ADU-MOC-01",
    nivel: "adulto",
    tema: "mochila",
    pergunta: "Para quanto tempo a mochila de emergência deve ter água e comida, segundo a recomendação mais comum?",
    opcoes: ["Algumas horas", "Cerca de 3 dias (72 horas)", "Um mês", "Não precisa ter comida"],
    correta: "B",
    explicacao: "O mais comum é recomendar itens para cerca de 72 horas: água, comida que não estraga, remédios, documentos e lanterna."
  },

  { // REVISAR
    id: "ADU-MOC-02",
    nivel: "adulto",
    tema: "mochila",
    pergunta: "Qual item é mais útil para pedir ajuda se você ficar preso num local?",
    opcoes: ["Um apito", "Um perfume", "Um livro", "Um guarda-chuva"],
    correta: "A",
    explicacao: "O som do apito vai longe e cansa menos do que gritar. Por isso ele faz parte de muitos kits de emergência."
  },

  { // REVISAR
    id: "ADU-MOC-03",
    nivel: "adulto",
    tema: "mochila",
    pergunta: "Na mochila de emergência, os remédios de uso contínuo devem ser:",
    opcoes: [
      "Deixados em casa para não estragar",
      "Levados para alguns dias, junto com a receita",
      "Trocados por chá",
      "Comprados só depois da emergência"
    ],
    correta: "B",
    explicacao: "Numa emergência, farmácias podem estar fechadas. Leve remédios para alguns dias e a receita para conseguir mais."
  },

  { // REVISAR
    id: "ADU-MOC-04",
    nivel: "adulto",
    tema: "mochila",
    pergunta: "Por que incluir um carregador portátil (power bank) carregado na mochila?",
    opcoes: [
      "Para iluminar a casa toda",
      "Para esquentar comida",
      "Para dar partida no carro",
      "Para manter o celular ligado e receber alertas"
    ],
    correta: "D",
    explicacao: "Sem luz, o celular descarrega. Com o carregador, dá para receber alertas e falar com a família."
  },

  { // REVISAR
    id: "ADU-MOC-05",
    nivel: "adulto",
    tema: "mochila",
    pergunta: "Qual destes alimentos é mais adequado para a mochila de emergência?",
    opcoes: ["Carne crua", "Leite fresco", "Barras de cereal e enlatados", "Sorvete"],
    correta: "C",
    explicacao: "Prefira alimentos que não estragam e não precisam de geladeira nem de fogão. Lembre do abridor de latas!"
  },

];
